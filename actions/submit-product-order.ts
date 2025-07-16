"use server"

import { z } from "zod"
import dbConnect from "@/lib/mongodb"
import ProductOrder from "@/models/product-order"

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

export async function submitProductOrder(prevState: any, formData: FormData) {
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

  try {
    await dbConnect()
    await ProductOrder.create({
      productId,
      productTitle,
      quantity,
      unitType,
      totalPrice,
      firstName,
      lastName,
      phone,
      email: email || undefined,
      company: company || undefined,
      message: message || undefined,
    })

    return {
      success: true,
      message: "Buyurtmangiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog'lanamiz.",
    }
  } catch (error) {
    console.error("Ma'lumotlar bazasiga saqlashda xato:", error)
    return {
      success: false,
      message: "Buyurtma yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
    }
  }
}
