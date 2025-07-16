"use server"

import { createServerClient } from "@/lib/supabase"

export async function getAdminData() {
  const supabase = createServerClient()

  try {
    const { data: teamMembers, error: teamError } = await supabase
      .from("team_members")
      .select("*")
      .order("created_at", { ascending: true })
    if (teamError) throw teamError

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true })
    if (productsError) throw productsError

    const { data: galleryItems, error: galleryError } = await supabase
      .from("gallery_items")
      .select("*")
      .order("created_at", { ascending: true })
    if (galleryError) throw galleryError

    const { data: contactMessages, error: messagesError } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
    if (messagesError) throw messagesError

    return {
      success: true,
      message: "Admin ma'lumotlari muvaffaqiyatli yuklandi.",
      teamMembers: teamMembers || [],
      products: products || [],
      galleryItems: galleryItems || [],
      contactMessages: contactMessages || [],
    }
  } catch (error: any) {
    console.error("Admin ma'lumotlarini yuklashda xato:", error.message)
    return {
      success: false,
      message: `Ma'lumotlarni yuklashda xatolik yuz berdi: ${error.message}`,
      teamMembers: [],
      products: [],
      galleryItems: [],
      contactMessages: [],
    }
  }
}
