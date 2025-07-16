import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LocaleProvider } from "@/context/locale-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mars Paper - Print Center | Daftar, Тетрат, A4 Qog'oz | Toshkent",
  description:
    "Mars Paper - Toshkentda print xizmatlari, daftar, тетрат, A4 qog'oz, laminatsiya. Qog'oz mahsulotlari va professional print center.",
  keywords:
    "print center, daftar, тетрат, A4 qog'oz, laminatsiya, albom, rangli qog'oz, Mars Paper, Toshkent, печать, notebook",
  authors: [{ name: "Mars Paper" }],
  creator: "Mars Paper",
  publisher: "Mars Paper",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://marspaper.uz"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Mars Paper - Print Center va Qog'oz Mahsulotlari",
    description:
      "Professional print xizmatlari, daftar, тетрат, A4 qog'oz, laminatsiya. Toshkent bo'ylab yetkazib berish.",
    url: "https://marspaper.uz",
    siteName: "Mars Paper",
    locale: "uz_UZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mars Paper - Print Center",
    description: "Toshkentda print xizmatlari va qog'oz mahsulotlari",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head>
        <link rel="canonical" href="https://marspaper.uz" />
        <meta name="geo.region" content="UZ-TK" />
        <meta name="geo.placename" content="Toshkent" />
        <meta name="geo.position" content="41.2995;69.2401" />
        <meta name="ICBM" content="41.2995, 69.2401" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Mars Paper",
              description: "Print center va qog'oz mahsulotlari ishlab chiqaruvchi",
              url: "https://marspaper.uz",
              logo: "https://marspaper.uz/logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+998903593900",
                contactType: "customer service",
                availableLanguage: ["uz", "ru", "en"],
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "Chorbog' ko'chasi, 6-uy",
                addressLocality: "Toshkent",
                addressRegion: "Chilonzor tumani",
                addressCountry: "UZ",
              },
              sameAs: ["https://t.me/marspaper", "https://instagram.com/marspaper"],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Mars Paper Mahsulotlari",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Product",
                      name: "Daftar va Тетрат",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Print Xizmatlari",
                    },
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <LocaleProvider>{children}</LocaleProvider>
        <Toaster />
      </body>
    </html>
  )
}
