"use client"

import { MapPin } from "lucide-react"
import { useLocale } from "@/context/locale-context"
import Image from "next/image" // Image komponentini import qilish

export default function GoogleMap() {
  const { t } = useLocale()
  const mapUrl =
    "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3000.4247156760653!2d69.1821111!3d41.2343056!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2s!5e0!3m2!1suz!2s!4v1752427331765!5m2!1suz!2s"

  return (
    <section className="py-12 px-4 bg-gray-100">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MapPin className="h-8 w-8 text-primary" />
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">{t("our_location_title")}</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("find_us_on_google_map")}</p>
        </div>
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg border border-border">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen={true}
            style={{ border: 0 }}
            aria-label={t("google_map_aria_label")}
          ></iframe>
          {/* Xarita ustiga joylashuv belgisini qo'shish */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
            <Image
              src="/images/mars-logo-pin.jpeg" // Yangi rasm yo'li
              alt="Mars Paper Location Pin"
              width={60} // Kichikroq qilish uchun o'lchamni sozladim
              height={60} // Kichikroq qilish uchun o'lchamni sozladim
              className="w-15 h-15 rounded-full animate-bounce" // Tailwind klasslari
            />
          </div>
        </div>
      </div>
    </section>
  )
}
