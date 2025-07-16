"use server"

import { createServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const galleryItemSchema = z.object({
  id: z.string().optional(),
  title_key: z.string().min(2, "Nomi kamida 2 ta belgidan iborat bo'lishi kerak."),
  description_key: z.string().min(2, "Tavsif kamida 2 ta belgidan iborat bo'lishi kerak."),
  category: z.string().min(2, "Kategoriya kamida 2 ta belgidan iborat bo'lishi kerak."),
  image_url: z.string().url("Rasm URL manzili noto'g'ri.").optional().or(z.literal("")),
  icon_name: z.string().optional(), // Lucide icon name
})

export async function addGalleryItem(prevState: any, formData: FormData) {
  const supabase = createServerClient()

  const data = {
    title_key: formData.get("title_key"),
    description_key: formData.get("description_key"),
    category: formData.get("category"),
    image_url: formData.get("image_url"),
    icon_name: formData.get("icon_name"),
  }

  const validatedFields = galleryItemSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Ma'lumotlarni to'g'ri kiriting.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { title_key, description_key, category, image_url, icon_name } = validatedFields.data

  try {
    const { data: newItem, error } = await supabase
      .from("gallery_items")
      .insert({
        title_key,
        description_key,
        category,
        image_url,
        icon_name,
      })
      .select()

    if (error) {
      console.error("Galereya elementini qo'shishda xato:", error)
      return { success: false, message: "Galereya elementini qo'shishda xatolik yuz berdi." }
    }

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, message: "Galereya elementi muvaffaqiyatli qo'shildi!" }
  } catch (error) {
    console.error("Galereya elementini qo'shishda kutilmagan xato:", error)
    return { success: false, message: "Kutilmagan xatolik yuz berdi." }
  }
}

export async function updateGalleryItem(prevState: any, formData: FormData) {
  const supabase = createServerClient()

  const data = {
    id: formData.get("id"),
    title_key: formData.get("title_key"),
    description_key: formData.get("description_key"),
    category: formData.get("category"),
    image_url: formData.get("image_url"),
    icon_name: formData.get("icon_name"),
  }

  const validatedFields = galleryItemSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Ma'lumotlarni to'g'ri kiriting.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { id, title_key, description_key, category, image_url, icon_name } = validatedFields.data

  if (!id) {
    return { success: false, message: "Tahrirlash uchun ID topilmadi." }
  }

  try {
    const { data: updatedItem, error } = await supabase
      .from("gallery_items")
      .update({
        title_key,
        description_key,
        category,
        image_url,
        icon_name,
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Galereya elementini yangilashda xato:", error)
      return { success: false, message: "Galereya elementini yangilashda xatolik yuz berdi." }
    }

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, message: "Galereya elementi muvaffaqiyatli yangilandi!" }
  } catch (error) {
    console.error("Galereya elementini yangilashda kutilmagan xato:", error)
    return { success: false, message: "Kutilmagan xatolik yuz berdi." }
  }
}

export async function deleteGalleryItem(id: string) {
  const supabase = createServerClient()

  try {
    const { error } = await supabase.from("gallery_items").delete().eq("id", id)

    if (error) {
      console.error("Galereya elementini o'chirishda xato:", error)
      return { success: false, message: "Galereya elementini o'chirishda xatolik yuz berdi." }
    }

    revalidatePath("/admin")
    revalidatePath("/")
    return { success: true, message: "Galereya elementi muvaffaqiyatli o'chirildi!" }
  } catch (error) {
    console.error("Galereya elementini o'chirishda kutilmagan xato:", error)
    return { success: false, message: "Kutilmagan xatolik yuz berdi." }
  }
}

export async function uploadGalleryImage(prevState: any, formData: FormData) {
  const supabase = createServerClient()
  const file = formData.get("file") as File

  if (!file || file.size === 0) {
    return { success: false, message: "Rasm fayli tanlanmagan." }
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
  const filePath = `gallery-images/${fileName}` // Supabase Storage'dagi yo'l

  try {
    const { data, error } = await supabase.storage.from("mars-paper-images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Rasm yuklashda xato:", error)
      return { success: false, message: `Rasm yuklashda xatolik yuz berdi: ${error.message}` }
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from("mars-paper-images").getPublicUrl(filePath)

    if (!publicUrlData || !publicUrlData.publicUrl) {
      return { success: false, message: "Rasm URL manzilini olishda xatolik." }
    }

    return { success: true, message: "Rasm muvaffaqiyatli yuklandi!", url: publicUrlData.publicUrl }
  } catch (error: any) {
    console.error("Rasm yuklashda kutilmagan xato:", error)
    return { success: false, message: `Kutilmagan xatolik yuz berdi: ${error.message}` }
  }
}
