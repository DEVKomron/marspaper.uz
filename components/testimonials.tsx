"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote, Building2, Users2 } from "lucide-react"
import { useLocale } from "@/context/locale-context"
import Image from "next/image"

export default function Testimonials() {
  const { t } = useLocale()

  const testimonials = [
    {
      name: "Aziz Karimov",
      position: t("testimonial_position_director"),
      company: "Tashkent Plaza Hotel",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: t("testimonial_aziz"),
      partnership: t("partnership_2_years"),
      orderVolume: t("order_volume_500_plus_month"),
    },
    {
      name: "Malika Abdullayeva",
      position: t("testimonial_position_purchase_manager"),
      company: "Samarkand Restaurant Chain",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: t("testimonial_malika"),
      partnership: t("partnership_3_years"),
      orderVolume: t("order_volume_200_plus_week"),
    },
    {
      name: "Bobur Tursunov",
      position: t("testimonial_position_office_manager"),
      company: "IT Solutions Group",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: t("testimonial_bobur"),
      partnership: t("partnership_1_5_years"),
      orderVolume: t("order_volume_50_plus_a4_month"),
    },
    {
      name: "Dilshoda Rahimova",
      position: t("testimonial_position_purchase_head"),
      company: "Mega Planet Supermarket",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: t("testimonial_dilshoda"),
      partnership: t("partnership_2_5_years"),
      orderVolume: t("order_volume_1000_plus_week"),
    },
    {
      name: "Jasur Normatov",
      position: t("testimonial_position_chief_engineer"),
      company: "Construction Plus LLC",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: t("testimonial_jasur"),
      partnership: t("partnership_1_year"),
      orderVolume: t("order_volume_by_project"),
    },
    {
      name: "Nigora Yusupova",
      position: t("testimonial_position_director"),
      company: "Kids World Kindergarten",
      image: "/placeholder.svg?height=80&width=80",
      rating: 5,
      text: t("testimonial_nigora"),
      partnership: t("partnership_6_months"),
      orderVolume: t("order_volume_100_plus_month"),
    },
  ]

  return (
    <section id="testimonials" className="py-20 px-4 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Quote className="h-8 w-8 text-primary" />
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">{t("partners_feedback_title")}</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("partners_feedback_description")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 relative">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{testimonial.name}</h3>
                    <p className="text-primary font-medium text-sm">{testimonial.position}</p>
                    <p className="text-muted-foreground text-sm">{testimonial.company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <blockquote className="text-muted-foreground text-sm leading-relaxed mb-4 italic">
                  "{testimonial.text}"
                </blockquote>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users2 className="h-4 w-4 text-primary" />
                    <Badge variant="secondary" className="text-xs">
                      {testimonial.partnership}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-secondary" />
                    <Badge className="bg-secondary/10 text-secondary text-xs">{testimonial.orderVolume}</Badge>
                  </div>
                </div>

                <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/10" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">{t("become_partner_title")}</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">{t("become_partner_description")}</p>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">{t("permanent_partners")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">98%</div>
                <div className="text-sm text-muted-foreground">{t("customer_satisfaction")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-foreground">24/7</div>
                <div className="text-sm text-muted-foreground">{t("support")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
