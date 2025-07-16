"use server"

import { createServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const productSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2, "Slug kamida 2 ta belgidan iborat bo'lishi kerak."),
  title_key: z.string().min(2, "Nomi kamida 2 ta belgidan iborat bo'lishi kerak."),
  description_key: z.string().min(2, "Tavsif kamida 2 ta belgidan iborat bo'lishi kerak."),
  price_per_unit: z.coerce.number().min(0, "Narx manfiy bo'lishi mumkin emas."),
  unit_type: z.string().min(1, "Birlik turi tanlanishi kerak."),
  image_url: z.string().url("Rasm URL manzili noto'g'ri.").optional().or(z.literal("")),
  features: z.string().optional(), // Comma-separated string
  icon: z.string().optional(),
  keywords: z.string().optional(),
})

export async function addProduct(prevState: any, formData: FormData) {
  const supabase = createServerClient()

  const featuresArray = formData.get("features")
    ? (formData.get("features") as string).split(",").map((s) => s.trim())
    : []

  const data = {
    slug: formData.get("slug"),
    title_key: formData.get("title_key"),
    description_key: formData.get("description_key"),
    price_per_unit: formData.get("price_per_unit"),
    unit_type: formData.get("unit_type"),
    image_url: formData.get("image_url"),
    features: featuresArray,
    icon: formData.get("icon"),
    keywords: formData.get("keywords"),
  }

  const validatedFields = productSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Ma'lumotlarni to'g'ri kiriting.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { slug, title_key, description_key, price_per_unit, unit_type, image_url, features, icon, keywords } =
    validatedFields.data

  try {
    const { data: newProduct, error } = await supabase
      .from("products")
      .insert({
        slug,
        title_key,
        description_key,
        price_per_unit,
        unit_type,
        image_url,
        features,
        icon,
        keywords,
      })
      .select()

    if (error) {
      console.error("Mahsulot qo'shishda xato:", error)
      return { success: false, message: "Mahsulot qo'shishda xatolik yuz berdi." }
    }

    revalidatePath("/admin")
    revalidatePath("/products") // Revalidate product pages
    revalidatePath("/")
    return { success: true, message: "Mahsulot muvaffaqiyatli qo'shildi!" }
  } catch (error) {
    console.error("Mahsulot qo'shishda kutilmagan xato:", error)
    return { success: false, message: "Kutilmagan xatolik yuz berdi." }
  }
}

export async function updateProduct(prevState: any, formData: FormData) {
  const supabase = createServerClient()

  const featuresArray = formData.get("features")
    ? (formData.get("features") as string).split(",").map((s) => s.trim())
    : []

  const data = {
    id: formData.get("id"),
    slug: formData.get("slug"),
    title_key: formData.get("title_key"),
    description_key: formData.get("description_key"),
    price_per_unit: formData.get("price_per_unit"),
    unit_type: formData.get("unit_type"),
    image_url: formData.get("image_url"),
    features: featuresArray,
    icon: formData.get("icon"),
    keywords: formData.get("keywords"),
  }

  const validatedFields = productSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Ma'lumotlarni to'g'ri kiriting.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { id, slug, title_key, description_key, price_per_unit, unit_type, image_url, features, icon, keywords } =
    validatedFields.data

  if (!id) {
    return { success: false, message: "Tahrirlash uchun ID topilmadi." }
  }

  try {
    const { data: updatedProduct, error } = await supabase
      .from("products")
      .update({
        slug,
        title_key,
        description_key,
        price_per_unit,
        unit_type,
        image_url,
        features,
        icon,
        keywords,
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Mahsulotni yangilashda xato:", error)
      return { success: false, message: "Mahsulotni yangilashda xatolik yuz berdi." }
    }

    revalidatePath("/admin")
    revalidatePath("/products")
    revalidatePath("/")
    return { success: true, message: "Mahsulot muvaffaqiyatli yangilandi!" }
  } catch (error) {
    console.error("Mahsulotni yangilashda kutilmagan xato:", error)
    return { success: false, message: "Kutilmagan xatolik yuz berdi." }
  }
}

export async function deleteProduct(id: string) {
  const supabase = createServerClient()

  try {
    const { error } = await supabase.from("products").delete().eq("id", id)

    if (error) {
      console.error("Mahsulotni o'chirishda xato:", error)
      return { success: false, message: "Mahsulotni o'chirishda xatolik yuz berdi." }
    }

    revalidatePath("/admin")
    revalidatePath("/products")
    revalidatePath("/")
    return { success: true, message: "Mahsulot muvaffaqiyatli o'chirildi!" }
  } catch (error) {
    console.error("Mahsulotni o'chirishda kutilmagan xato:", error)
    return { success: false, message: "Kutilmagan xatolik yuz berdi." }
  }
}

export async function uploadProductImage(prevState: any, formData: FormData) {
  const supabase = createServerClient()
  const file = formData.get("file") as File

  if (!file || file.size === 0) {
    return { success: false, message: "Rasm fayli tanlanmagan." }
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
  const filePath = `product-images/${fileName}` // Supabase Storage'dagi yo'l

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
