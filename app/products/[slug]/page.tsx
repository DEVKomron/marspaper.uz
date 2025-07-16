"use client"

import { Textarea } from "@/components/ui/textarea"

import { useState } from "react"

import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocale } from "@/context/locale-context"
import { useActionState } from "react"
import { sendProductOrderTelegramMessage } from "@/actions/send-product-order-telegram-message"
import { toast } from "@/hooks/use-toast"
import { useEffect } from "react"
import Image from "next/image"

// Mock product data (real ilovada bu ma'lumotlar ma'lumotlar bazasidan olinadi)
const mockProducts = [
  {
    slug: "daftar-tetrat",
    titleKey: "product_notebook_title",
    descriptionKey: "product_notebook_description",
    pricePerUnit: 1500, // so'm
    unitType: "dona", // dona
    image: "/images/A4bumagajpeg.jpg?height=400&width=600&text=Daftar+va+Tetrat",
  },
  {
    slug: "a4-qogoz",
    titleKey: "product_a4_paper_title",
    descriptionKey: "product_a4_paper_description",
    pricePerUnit: 8000, // so'm
    unitType: "kg", // kilogram
    image: "/images/A4bumagajpeg.jpg?height=400&width=600&text=A4+Qog'oz",
  },
  {
    slug: "print-xizmatlari",
    titleKey: "product_print_service_title",
    descriptionKey: "product_print_service_description",
    pricePerUnit: 500, // so'm (bir varaq uchun)
    unitType: "varaq", // varaq
    image: "/placeholder.svg?height=400&width=600&text=Print+Xizmatlari",
  },
  {
    slug: "laminatsiya",
    titleKey: "product_lamination_title",
    descriptionKey: "product_lamination_description",
    pricePerUnit: 2000, // so'm (bir dona uchun)
    unitType: "dona", // dona
    image: "/placeholder.svg?height=400&width=600&text=Laminatsiya",
  },
  {
    slug: "albom-jurnal",
    titleKey: "product_album_journal_title",
    descriptionKey: "product_album_journal_description",
    pricePerUnit: 12000, // so'm (bir dona uchun)
    unitType: "dona", // dona
    image: "/placeholder.svg?height=400&width=600&text=Albom+va+Jurnal",
  },
  {
    slug: "rangli-qogozlar",
    titleKey: "product_colored_paper_title",
    descriptionKey: "product_colored_paper_description",
    pricePerUnit: 9000, // so'm (bir kg uchun)
    unitType: "kg", // kilogram
    image: "/placeholder.svg?height=400&width=600&text=Rangli+Qog'ozlar",
  },
]

export default function ProductOrderPage({ params }: { params: { slug: string } }) {
  const { t } = useLocale()
  const product = mockProducts.find((p) => p.slug === params.slug)

  if (!product) {
    notFound()
  }

  const [quantity, setQuantity] = useState(1)
  const totalPrice = product.pricePerUnit * quantity

  const [state, formAction] = useActionState(sendProductOrderTelegramMessage, {
    success: false,
    message: "",
    errors: {},
  })

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? t("toast_success_title") : t("toast_error_title"),
        description: state.message,
        variant: state.success ? "default" : "destructive",
      })
    }
  }, [state, t])

  return (
    <section className="py-20 px-4 bg-background min-h-screen flex items-center justify-center">
      <div className="container mx-auto max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center mb-4">{t(product.titleKey)}</CardTitle>
            <p className="text-muted-foreground text-center">{t(product.descriptionKey)}</p>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className="relative h-64 md:h-auto rounded-lg overflow-hidden">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={t(product.titleKey)}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-lg">
                  {t("quantity")} (
                  {product.unitType === "dona"
                    ? t("per_piece")
                    : product.unitType === "kg"
                      ? t("per_kg")
                      : t("per_unit")}
                  )
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                  className="w-full"
                />
              </div>

              <div className="text-2xl font-bold text-foreground">
                {t("total_price")}: {totalPrice.toLocaleString()} {t("sum")}
              </div>

              <form action={formAction} className="space-y-4">
                <input type="hidden" name="productId" value={product.slug} />
                <input type="hidden" name="productTitle" value={t(product.titleKey)} />
                <input type="hidden" name="quantity" value={quantity} />
                <input type="hidden" name="unitType" value={product.unitType} />
                <input type="hidden" name="totalPrice" value={totalPrice} />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("first_name")}</Label>
                    <Input id="firstName" name="firstName" placeholder={t("your_first_name")} required />
                    {state.errors?.firstName && <p className="text-destructive text-xs">{state.errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("last_name")}</Label>
                    <Input id="lastName" name="lastName" placeholder={t("your_last_name")} required />
                    {state.errors?.lastName && <p className="text-destructive text-xs">{state.errors.lastName}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t("phone_number")}</Label>
                  <Input id="phone" name="phone" placeholder="+998 90 123 45 67" required />
                  {state.errors?.phone && <p className="text-destructive text-xs">{state.errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t("email")}</Label>
                  <Input id="email" name="email" type="email" placeholder="email@example.com" />
                  {state.errors?.email && <p className="text-destructive text-xs">{state.errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">{t("company")}</Label>
                  <Input id="company" name="company" placeholder={t("company_name_optional")} />
                  {state.errors?.company && <p className="text-destructive text-xs">{state.errors.company}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">{t("additional_notes")}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t("your_additional_notes")}
                    className="min-h-[80px]"
                  />
                  {state.errors?.message && <p className="text-destructive text-xs">{state.errors.message}</p>}
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg">
                  {t("place_order_button")}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
