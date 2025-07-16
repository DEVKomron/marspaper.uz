"use server"

import { z } from "zod"
import dbConnect from "@/lib/mongodb"
import ContactMessage from "@/models/contact-message"

// Zod schema for form validation
const contactFormSchema = z.object({
  firstName: z.string().min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak."),
  lastName: z.string().min(2, "Familiya kamida 2 ta belgidan iborat bo'lishi kerak."),
  phone: z.string().regex(/^\+?\d{9,15}$/, "Telefon raqami to'g'ri formatda bo'lishi kerak."),
  email: z.string().email("Email manzili noto'g'ri.").optional().or(z.literal("")),
  company: z.string().optional(),
  message: z.string().min(10, "Xabar kamida 10 ta belgidan iborat bo'lishi kerak."),
})

export async function submitContactForm(prevState: any, formData: FormData) {
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

  try {
    await dbConnect()
    await ContactMessage.create({
      firstName,
      lastName,
      phone,
      email: email || undefined,
      company: company || undefined,
      message,
    })

    return {
      success: true,
      message: "Xabaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanamiz.",
    }
  } catch (error) {
    console.error("Ma'lumotlar bazasiga saqlashda xato:", error)
    return {
      success: false,
      message: "Xabar yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
    }
  }
}
