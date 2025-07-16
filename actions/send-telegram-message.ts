"use server"

import { z } from "zod"

const contactFormSchema = z.object({
  firstName: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak."),
  phone: z.string().regex(/^\+?\d{9,15}$/, "Telefon raqami to'g'ri formatda bo'lishi kerak."),
  message: z.string().optional(),
})

export async function sendTelegramMessage(prevState: any, formData: FormData) {
  const data = {
    firstName: formData.get("firstName"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  }

  const validatedFields = contactFormSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Ma'lumotlarni to'g'ri kiriting.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { firstName, phone, message } = validatedFields.data

  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("Telegram konfiguratsiyasi yo'q.")
    return {
      success: false,
      message: "Server xatosi. Iltimos, keyinroq urinib ko'ring.",
    }
  }

  const text = `
<b>Yangi Murojaat</b>

<b>Ism:</b> ${firstName}
<b>Telefon:</b> ${phone}
<b>Habar:</b> ${message || "Yuborilmagan"}
  `

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
      }),
    })

    const result = await response.json()

    if (response.ok && result.ok) {
      return {
        success: true,
        message: "Xabaringiz yuborildi! Tez orada siz bilan bog'lanamiz.",
      }
    } else {
      console.error("Telegram xatosi:", result)
      return {
        success: false,
        message: "Xabar yuborishda xatolik yuz berdi.",
      }
    }
  } catch (error) {
    console.error("Tarmoq xatosi:", error)
    return {
      success: false,
      message: "Tarmoq xatosi. Iltimos, internet aloqangizni tekshiring.",
    }
  }
}
