import type { Metadata } from "next"
import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import About from "@/components/about"
import Products from "@/components/products"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import Team from "@/components/team"
import Testimonials from "@/components/testimonials"
import Gallery from "@/components/gallery"
import TeamSlideshow from "@/components/team-slideshow"
import GoogleMap from "@/components/google-map"

export const metadata: Metadata = {
  title: "Mars Paper - Print Center | Daftar, Тетрат, A4 Qog'oz | Toshkent",
  description:
    "Mars Paper - Toshkentda print xizmatlari, daftar, тетрат, A4 qog'oz, laminatsiya. Qog'oz mahsulotlari va professional print center.",
  keywords:
    "print center, daftar, тетрат, A4 qog'oz, laminatsiya, albom, rangli qog'oz, Mars Paper, Toshkent, печать, notebook",
  openGraph: {
    title: "Mars Paper - Print Center va Qog'oz Mahsulotlari",
    description:
      "Professional print xizmatlari, daftar, тетрат, A4 qog'oz, laminatsiya. Toshkent bo'ylab yetkazib berish.",
    type: "website",
    locale: "uz_UZ",
  },
  alternates: {
    canonical: "https://marspaper.uz",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <Hero />
        <About />
        <Products />
        <Team />
        <TeamSlideshow />
        <Testimonials />
        <Gallery />
        <Contact />
        <GoogleMap /> {/* Yandex xaritasi footer tepasida */}
      </main>
      <Footer />
    </>
  )
}
