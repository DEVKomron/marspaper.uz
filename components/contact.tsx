"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { useActionState } from "react"
import { sendContactTelegramMessage } from "@/actions/send-contact-telegram-message" // Yangi action import qilindi
import { toast } from "@/hooks/use-toast"
import { useEffect } from "react"
import { useLocale } from "@/context/locale-context"

export default function Contact() {
  const { t } = useLocale()
  const [state, formAction] = useActionState(sendContactTelegramMessage, {
    // Yangi action ishlatildi
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
    <section id="contact" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">{t("contact_us_title")}</h2>
          <p className="text-xl text-muted-foreground">{t("contact_us_description")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Phone className="h-6 w-6 text-primary" />
                  {t("phone_number_title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">+998 90 359 39 00</p>
                <p className="text-muted-foreground mt-2">{t("phone_number_hours")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-primary" />
                  {t("email_address_title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xl font-semibold">marspaper.uz@gmail.com</p>
                <p className="text-muted-foreground mt-2">{t("email_response_time")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  {t("our_address_title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">{t("address_country")}</p>
                <p>{t("address_city_district")}</p>
                <p>{t("address_street")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary" />
                  {t("working_hours_title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t("monday_friday")}:</span>
                    <span className="font-semibold">9:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("saturday")}:</span>
                    <span className="font-semibold">9:00 - 15:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("sunday")}:</span>
                    <span className="text-destructive">{t("day_off")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("send_message_title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form action={formAction}>
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
                  <Label htmlFor="message">{t("message")}</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder={t("your_message")}
                    className="min-h-[120px]"
                    required
                  />
                  {state.errors?.message && <p className="text-destructive text-xs">{state.errors.message}</p>}
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg">
                  {t("send_message_button")}
                </Button>

                <p className="text-sm text-muted-foreground text-center">{t("message_sent_info")}</p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
