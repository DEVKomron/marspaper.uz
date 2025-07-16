"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

const loginSchema = z.object({
  phone: z.string().regex(/^\+?\d{9,15}$/, "Telefon raqami to'g'ri formatda bo'lishi kerak."),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak."),
})

export async function adminLogin(prevState: any, formData: FormData) {
  const data = {
    phone: formData.get("phone"),
    password: formData.get("password"),
  }

  const validatedFields = loginSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Ma'lumotlarni to'g'ri kiriting.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { phone, password } = validatedFields.data

  // Muhit o'zgaruvchilaridan admin ma'lumotlarini olish
  const ADMIN_PHONE = process.env.ADMIN_PHONE
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

  if (!ADMIN_PHONE || !ADMIN_PASSWORD) {
    console.error("ADMIN_PHONE yoki ADMIN_PASSWORD muhit o'zgaruvchilari o'rnatilmagan.")
    return {
      success: false,
      message: "Server konfiguratsiyasi xatosi. Iltimos, keyinroq urinib ko'ring.",
    }
  }

  if (phone === ADMIN_PHONE && password === ADMIN_PASSWORD) {
    // Muvaffaqiyatli kirish, sessiya cookie'sini o'rnatish
    cookies().set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Faqat HTTPS da ishlaydi
      maxAge: 60 * 60 * 24 * 7, // 1 hafta
      path: "/",
    })
    return { success: true, message: "Muvaffaqiyatli kirdingiz!" }
  } else {
    return { success: false, message: "Noto'g'ri telefon raqami yoki parol." }
  }
}

export async function adminLogout() {
  cookies().delete("admin_session")
  redirect("/admin/login")
}
