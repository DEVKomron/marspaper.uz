"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useLocale } from "@/context/locale-context"
import Link from "next/link"

export default function Products() {
  const { t } = useLocale()

  const products = [
    {
      title: t("product_notebook_title"),
      description: t("product_notebook_description"),
      features: [t("notebook_feature_1"), t("notebook_feature_2"), t("notebook_feature_3"), t("notebook_feature_4")],
      icon: "📓",
      keywords: t("product_notebook_keywords"),
      slug: "daftar-tetrat",
    },
    {
      title: t("product_a4_paper_title"),
      description: t("product_a4_paper_description"),
      features: [t("a4_feature_1"), t("a4_feature_4")],
      icon: "📄",
      keywords: t("product_a4_paper_keywords"),
      slug: "a4-qogoz",
    },
    {
      title: t("product_print_service_title"),
      description: t("product_print_service_description"),
      features: [t("print_feature_1"), t("print_feature_2"), t("print_feature_3"), t("print_feature_4")],
      icon: "🖨️",
      keywords: t("product_print_service_keywords"),
      slug: "print-xizmatlari",
    },
    {
      title: t("product_lamination_title"),
      description: t("product_lamination_description"),
      features: [
        t("lamination_feature_1"),
        t("lamination_feature_2"),
        t("lamination_feature_3"),
        t("lamination_feature_4"),
      ],
      icon: "🛡️",
      keywords: t("product_lamination_keywords"),
      slug: "laminatsiya",
    },
    {
      title: t("product_album_journal_title"),
      description: t("product_album_journal_description"),
      features: [t("album_feature_1"), t("album_feature_2"), t("album_feature_3"), t("album_feature_4")],
      icon: "📔",
      keywords: t("product_album_journal_keywords"),
      slug: "albom-jurnal",
    },
    {
      title: t("product_colored_paper_title"),
      description: t("product_colored_paper_description"),
      features: [
        t("colored_paper_feature_1"),
        t("colored_paper_feature_2"),
        t("colored_paper_feature_3"),
        t("colored_paper_feature_4"),
      ],
      icon: "🌈",
      keywords: t("product_colored_paper_keywords"),
      slug: "rangli-qogozlar",
    },
  ]

  return (
    <section id="products" className="py-20 px-4 bg-accent/5">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">{t("products_services_title")}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("products_services_description")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="text-center">
                <div className="text-4xl mb-4">{product.icon}</div>
                <CardTitle className="text-xl">{product.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>

                <div className="flex flex-wrap gap-2">
                  {product.features.map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="text-xs text-muted-foreground italic">{product.keywords}</div>

                <Link href={`/products/${product.slug}`} passHref>
                  {/* <Button className="w-full bg-primary hover:bg-primary/90">{t("order_button")}</Button> */}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-background rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">{t("special_orders_title")}</h3>
          <p className="text-muted-foreground mb-6 max-w-3xl mx-auto">{t("special_orders_description")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://t.me/komron_m1rzo" target="_blank" rel="noopener noreferrer">
  <Button size="lg" className="bg-primary hover:bg-primary/90">
    {t("special_order_button")}
  </Button>
</a>

            <a href="https://t.me/Marspaper" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                {t("view_prices_button")}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
