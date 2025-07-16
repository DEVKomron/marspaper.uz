"use server"

import { z } from "zod"
import { createServerClient } from "@/lib/supabase" // Supabase client import qilindi

const productOrderSchema = z.object({
  productId: z.string(),
  productTitle: z.string(),
  quantity: z.coerce.number().min(1, "Miqdor kamida 1 bo'lishi kerak."),
  unitType: z.string(),
  totalPrice: z.coerce.number().min(0, "Narx manfiy bo'lishi mumkin emas."),
  firstName: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak."),
  lastName: z.string().min(2, "Familiya kamida 2 ta belgidan iborat bo'lishi kerak."),
  phone: z.string().regex(/^\+?\d{9,15}$/, "Telefon raqami to'g'ri formatda bo'lishi kerak."),
  email: z.string().email("Email manzili noto'g'ri.").optional().or(z.literal("")),
  company: z.string().optional(),
  message: z.string().optional(), // Qo'shimcha izohlar
})

export async function sendProductOrderTelegramMessage(prevState: any, formData: FormData) {
  const supabase = createServerClient() // Supabase client yaratildi

  const data = {
    productId: formData.get("productId"),
    productTitle: formData.get("productTitle"),
    quantity: formData.get("quantity"),
    unitType: formData.get("unitType"),
    totalPrice: formData.get("totalPrice"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    company: formData.get("company"),
    message: formData.get("message"),
  }

  const validatedFields = productOrderSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Ma'lumotlarni to'g'ri kiriting.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const {
    productId,
    productTitle,
    quantity,
    unitType,
    totalPrice,
    firstName,
    lastName,
    phone,
    email,
    company,
    message,
  } = validatedFields.data

  // Ma'lumotlarni Supabase'ga saqlash (agar kerak bo'lsa, buyurtmalar jadvali uchun)
  // Hozircha faqat Telegramga yuborish talab qilinganligi sababli, bu qism izohda qoldirildi.
  /*
  try {
    const { error: dbError } = await supabase.from("product_orders").insert({
      product_id: productId,
      product_title: productTitle,
      quantity: quantity,
      unit_type: unitType,
      total_price: totalPrice,
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      email: email || null,
      company: company || null,
      message: message || null,
    });

    if (dbError) {
      console.error("Supabase'ga buyurtma saqlashda xato:", dbError);
    }
  } catch (e) {
    console.error("Supabase'ga buyurtma saqlashda kutilmagan xato:", e);
  }
  */

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
<b>Yangi Mahsulot Buyurtmasi (Mars Paper Saytidan)</b>

<b>Mahsulot ID:</b> ${productId}
<b>Mahsulot Nomi:</b> ${productTitle}
<b>Miqdor:</b> ${quantity} ${unitType}
<b>Umumiy Narx:</b> ${totalPrice.toLocaleString()} so'm

<b>Buyurtmachi:</b>
<b>Ism:</b> ${firstName}
<b>Familiya:</b> ${lastName}
<b>Telefon:</b> ${phone}
<b>Email:</b> ${email || "Kiritilmagan"}
<b>Kompaniya:</b> ${company || "Kiritilmagan"}

<b>Qo'shimcha Izohlar:</b>
${message || "Kiritilmagan"}
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
        message: "Buyurtmangiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanamiz.",
      }
    } else {
      console.error("Telegramga buyurtma yuborishda xato:", result)
      return {
        success: false,
        message: "Buyurtma yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
      }
    }
  } catch (error) {
    console.error("Telegramga buyurtma yuborishda tarmoq xatosi:", error)
    return {
      success: false,
      message: "Tarmoq xatosi. Iltimos, internet aloqangizni tekshiring va qayta urinib ko'ring.",
    }
  }
}
