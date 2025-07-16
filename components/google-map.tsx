"use client"

import { MapPin } from "lucide-react"
import { useLocale } from "@/context/locale-context"

export default function GoogleMap() {
  const { t } = useLocale()

  const latitude = 41.23375263564865
  const longitude = 69.18150185774246

  // Bu iframe Google Maps’ning "search with pin + route" funksiyasini beradi
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12001.697776655307!2d${longitude}!3d${latitude}!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDE0JzAxLjUiTiA2OcKwMTAnNTMuNCJF!5e0!3m2!1sen!2s!4v0000000000000`

  // Bu link tugmachaga bosganda yo‘lni boshlaydi
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`

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

        {/* Google Map */}
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg border border-border mb-6">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Yo‘lni boshlash tugmasi */}
        <div className="text-center">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-primary text-white py-3 px-6 rounded-lg font-semibold shadow-md hover:bg-primary/80 transition"
          >
            {t("Bizga yo‘lni boshlang") || "get directions"}
          </a>
        </div>
      </div>
    </section>
  )
}
