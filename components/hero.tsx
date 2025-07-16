"use client"

import { Button } from "@/components/ui/button"
import { Phone, MapPin, ArrowRight } from "lucide-react"
import { useLocale } from "@/context/locale-context"


export default function Hero() {
  const { t } = useLocale()
  const latitude = 41.23375263564865
const longitude = 69.18150185774246

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/marslogo.jpg?height=800&width=1200&text=Mars+Paper+Print+Center')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Brand */}
          <div className="space-y-4">
            <h1 className="text-6xl lg:text-8xl font-bold tracking-tight">
              <span className="block text-white" style={{ fontFamily: "serif" }}>
                Mars Paper
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-200 font-light tracking-wide">{t("hero_subtitle")}</p>
          </div>

          {/* Description */}
          <div className="max-w-2xl mx-auto">
            <p className="text-lg lg:text-xl text-gray-300 leading-relaxed">{t("hero_description")}</p>
          </div>

          {/* Keywords */}
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">{t("keyword_print")}</span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">{t("keyword_notebook")}</span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">{t("keyword_tetrat")}</span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">{t("keyword_lamination")}</span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">{t("keyword_a4_paper")}</span>
            <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">{t("keyword_album")}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">


<Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg">
  <a href="tel:+998900340604">
    <Phone className="mr-2 h-5 w-5" />
    +998 90 034 06 04
  </a>
</Button>



<Button
  asChild
  variant="outline"
  size="lg"
  className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-4 text-lg bg-transparent"
>
  <a
    href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <MapPin className="mr-2 h-5 w-5" />
    {t("tashkent_chilonzor")}
  </a>
</Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-secondary">2022</div>
              <div className="text-sm text-gray-300 mt-1">{t("founded")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-secondary">500+</div>
              <div className="text-sm text-gray-300 mt-1">{t("product_types")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-secondary">50+</div>
              <div className="text-sm text-gray-300 mt-1">{t("partners")}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-secondary">24/7</div>
              <div className="text-sm text-gray-300 mt-1">{t("print_service")}</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowRight className="h-6 w-6 text-white rotate-90" />
        </div>
      </div>
    </section>
  )
}
