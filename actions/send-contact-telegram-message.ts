"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase" // Supabase client import qilindi

// Zod schema for form validation
const contactFormSchema = z.object({
  firstName: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak."),
  lastName: z.string().min(2, "Familiya kamida 2 ta belgidan iborat bo'lishi kerak."),
  phone: z.string().regex(/^\+?\d{9,15}$/, "Telefon raqami to'g'ri formatda bo'lishi kerak."),
  email: z.string().email("Email manzili noto'g'ri.").optional().or(z.literal("")),
  company: z.string().optional(),
  message: z.string().min(10, "Xabar kamida 10 ta belgidan iborat bo'lishi kerak."),
})

export async function sendContactTelegramMessage(prevState: any, formData: FormData) {
  const supabase = createServerClient() // Supabase client yaratildi

  const data = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    company: formData.get("company"),
    message: formData.get("message"),
  }

  // Validate form data
  const validatedFields = contactFormSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Ma'lumotlarni to'g'ri kiriting.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { firstName, lastName, phone, email, company, message } = validatedFields.data

  // Ma'lumotlarni Supabase'ga saqlash
  try {
    const { error: dbError } = await supabase.from("contact_messages").insert({
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      email: email || null,
      company: company || null,
      message: message,
    })

    if (dbError) {
      console.error("Supabase'ga xabar saqlashda xato:", dbError)
      // Xato bo'lsa ham Telegramga yuborishga harakat qilish
    }
  } catch (e) {
    console.error("Supabase'ga xabar saqlashda kutilmagan xato:", e)
  }

  // Telegram bot token and chat ID from environment variables
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("Telegram bot token or chat ID is not set in environment variables.")
    return {
      success: false,
      message: "Server konfiguratsiyasi xatosi. Iltimos, keyinroq urinib ko'ring.",
    }
  }

  const text = `
<b>Yangi Aloqa Xabari (Mars Paper Saytidan)</b>

<b>Yuboruvchi:</b>
<b>Ism:</b> ${firstName}
<b>Familiya:</b> ${lastName}
<b>Telefon:</b> ${phone}
<b>Email:</b> ${email || "Kiritilmagan"}
<b>Kompaniya:</b> ${company || "Kiritilmagan"}

<b>Xabar Matni:</b>
${message}
  `

  const telegramApiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`

  try {
    const response = await fetch(telegramApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: "HTML", // HTML formatida yuborish
      }),
    })

    const result = await response.json()

    if (response.ok && result.ok) {
      return {
        success: true,
        message: "Xabaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanamiz.",
      }
    } else {
      console.error("Telegramga xabar yuborishda xato:", result)
      return {
        success: false,
        message: "Xabar yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
      }
    }
  } catch (error) {
    console.error("Telegramga xabar yuborishda tarmoq xatosi:", error)
    return {
      success: false,
      message: "Tarmoq xatosi. Iltimos, internet aloqangizni tekshiring va qayta urinib ko'ring.",
    }
  }
}
