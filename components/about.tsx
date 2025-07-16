"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Printer, Scissors, Truck } from "lucide-react"
import { useLocale } from "@/context/locale-context"

export default function About() {
  const { t } = useLocale()

  return (
    <section id="about" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">{t("about_us_title")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("about_us_description_short")}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">{t("our_activity_title")}</h3>
            <p className="text-gray-600 leading-relaxed">{t("our_activity_description_1")}</p>
            <p className="text-muted-foreground leading-relaxed">{t("our_activity_description_2")}</p>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
            <h4 className="text-xl font-bold text-foreground mb-6">{t("our_services_title")}</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">{t("service_paper_products_title")}</div>
                  <div className="text-sm text-muted-foreground">{t("service_paper_products_description")}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Printer className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">{t("service_print_title")}</div>
                  <div className="text-sm text-muted-foreground">{t("service_print_description")}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Scissors className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">{t("service_lamination_title")}</div>
                  <div className="text-sm text-muted-foreground">{t("service_lamination_description")}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">{t("service_delivery_title")}</div>
                  <div className="text-sm text-muted-foreground">{t("service_delivery_description")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">{t("our_advantages_title")}</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Printer className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">{t("advantage_equipment_title")}</h4>
                <p className="text-sm text-muted-foreground">{t("advantage_equipment_description")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  📚
                </div>
                <h4 className="font-semibold mb-2">{t("advantage_assortment_title")}</h4>
                <p className="text-sm text-muted-foreground">{t("advantage_assortment_description")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  ⚡
                </div>
                <h4 className="font-semibold mb-2">{t("advantage_fast_service_title")}</h4>
                <p className="text-sm text-muted-foreground">{t("advantage_fast_service_description")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
