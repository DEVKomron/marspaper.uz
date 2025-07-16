"use server"

import { createServerClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const teamMemberSchema = z.object({
  id: z.string().optional(), // Optional for adding new members
  name: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak."),
  position: z.string().min(2, "Lavozim kamida 2 ta belgidan iborat bo'lishi kerak."),
  experience: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().url("Rasm URL manzili noto'g'ri.").optional().or(z.literal("")),
  achievements: z.string().optional(), // Comma-separated string
})

export async function addTeamMember(prevState: any, formData: FormData) {
  const supabase = createServerClient()

  const achievementsArray = formData.get("achievements")
    ? (formData.get("achievements") as string).split(",").map((s) => s.trim())
    : []

  const data = {
    name: formData.get("name"),
    position: formData.get("position"),
    experience: formData.get("experience"),
    description: formData.get("description"),
    image_url: formData.get("image_url"),
    achievements: achievementsArray,
  }

  const validatedFields = teamMemberSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Ma'lumotlarni to'g'ri kiriting.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, position, experience, description, image_url, achievements } = validatedFields.data

  try {
    const { data: newMember, error } = await supabase
      .from("team_members")
      .insert({
        name,
        position,
        experience,
        description,
        image_url,
        achievements,
      })
      .select()

    if (error) {
      console.error("Jamoa a'zosini qo'shishda xato:", error)
      return { success: false, message: "Jamoa a'zosini qo'shishda xatolik yuz berdi." }
    }

    revalidatePath("/admin")
    revalidatePath("/") // Revalidate main page to show changes
    return { success: true, message: "Jamoa a'zosi muvaffaqiyatli qo'shildi!" }
  } catch (error) {
    console.error("Jamoa a'zosini qo'shishda kutilmagan xato:", error)
    return { success: false, message: "Kutilmagan xatolik yuz berdi." }
  }
}

export async function updateTeamMember(prevState: any, formData: FormData) {
  const supabase = createServerClient()

  const achievementsArray = formData.get("achievements")
    ? (formData.get("achievements") as string).split(",").map((s) => s.trim())
    : []

  const data = {
    id: formData.get("id"),
    name: formData.get("name"),
    position: formData.get("position"),
    experience: formData.get("experience"),
    description: formData.get("description"),
    image_url: formData.get("image_url"),
    achievements: achievementsArray,
  }

  const validatedFields = teamMemberSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Ma'lumotlarni to'g'ri kiriting.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { id, name, position, experience, description, image_url, achievements } = validatedFields.data

  if (!id) {
    return { success: false, message: "Tahrirlash uchun ID topilmadi." }
  }

  try {
    const { data: updatedMember, error } = await supabase
      .from("team_members")
      .update({
        name,
        position,
        experience,
        description,
        image_url,
        achievements,
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Jamoa a'zosini yangilashda xato:", error)
      return { success: false, message: "Jamoa a'zosini yangilashda xatolik yuz berdi." }
    }

    revalidatePath("/admin")
    revalidatePath("/") // Revalidate main page to show changes
    return { success: true, message: "Jamoa a'zosi muvaffaqiyatli yangilandi!" }
  } catch (error) {
    console.error("Jamoa a'zosini yangilashda kutilmagan xato:", error)
    return { success: false, message: "Kutilmagan xatolik yuz berdi." }
  }
}

export async function deleteTeamMember(id: string) {
  const supabase = createServerClient()

  try {
    const { error } = await supabase.from("team_members").delete().eq("id", id)

    if (error) {
      console.error("Jamoa a'zosini o'chirishda xato:", error)
      return { success: false, message: "Jamoa a'zosini o'chirishda xatolik yuz berdi." }
    }

    revalidatePath("/admin")
    revalidatePath("/") // Revalidate main page to show changes
    return { success: true, message: "Jamoa a'zosi muvaffaqiyatli o'chirildi!" }
  } catch (error) {
    console.error("Jamoa a'zosini o'chirishda kutilmagan xato:", error)
    return { success: false, message: "Kutilmagan xatolik yuz berdi." }
  }
}

export async function uploadTeamImage(prevState: any, formData: FormData) {
  const supabase = createServerClient()
  const file = formData.get("file") as File

  if (!file || file.size === 0) {
    return { success: false, message: "Rasm fayli tanlanmagan." }
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
  const filePath = `team-images/${fileName}` // Supabase Storage'dagi yo'l

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
