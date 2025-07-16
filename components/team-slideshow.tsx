"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/context/locale-context" // useLocale hookini import qilish
import Image from "next/image"

export default function TeamSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const { t } = useLocale() // useLocale hookidan t funksiyasini olish

  const teamImages = [
    {
      image: "/placeholder.svg?height=500&width=800&text=Ishlab+Chiqarish",
      title: t("slideshow_production_process_title"),
      description: t("slideshow_production_process_description"),
      team: t("slideshow_production_department"),
    },
    {
      image: "/placeholder.svg?height=500&width=800&text=Sifat+Nazorati",
      title: t("slideshow_quality_control_title"),
      description: t("slideshow_quality_control_description"),
      team: t("slideshow_quality_control_department"),
    },
    {
      image: "/placeholder.svg?height=500&width=800&text=Jamoaviy+Muhokama",
      title: t("slideshow_team_discussion_title"),
      description: t("slideshow_team_discussion_description"),
      team: t("slideshow_management_team"),
    },
    {
      image: "/placeholder.svg?height=500&width=800&text=Qadoqlash",
      title: t("slideshow_packaging_title"),
      description: t("slideshow_packaging_description"),
      team: t("slideshow_packaging_department"),
    },
    {
      image: "/placeholder.svg?height=500&width=800&text=Yetkazib+Berish",
      title: t("slideshow_delivery_readiness_title"),
      description: t("slideshow_delivery_readiness_description"),
      team: t("slideshow_logistics_department"),
    },
    {
      image: "/placeholder.svg?height=500&width=800&text=Mijozlar+Bilan",
      title: t("slideshow_customer_meeting_title"),
      description: t("slideshow_customer_meeting_description"),
      team: t("slideshow_sales_department"),
    },
  ]

  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % teamImages.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isPlaying, teamImages.length]) // teamImages.length ni qaramliklarga qo'shish

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % teamImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + teamImages.length) % teamImages.length)
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t("team_slideshow_title")}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t("team_slideshow_description")}</p>
        </div>

        <div className="relative">
          <Card className="overflow-hidden shadow-2xl">
            <div className="relative h-96 lg:h-[500px]">
              {teamImages.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                    index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  }`}
                >
                  <Image
                    src={slide.image || "/placeholder.svg"}
                    alt={slide.title}
                    width={800}
                    height={500}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `/placeholder.svg?height=500&width=800&text=${encodeURIComponent(slide.title)}`
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="max-w-2xl">
                      <div className="text-sm font-medium text-primary mb-2">{slide.team}</div>
                      <h3 className="text-2xl lg:text-3xl font-bold mb-3">{slide.title}</h3>
                      <p className="text-lg opacity-90 leading-relaxed">{slide.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            <div className="absolute top-1/2 -translate-y-1/2 left-4">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm h-12 w-12"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </div>

            <div className="absolute top-1/2 -translate-y-1/2 right-4">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm h-12 w-12"
                onClick={nextSlide}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            {/* Play/Pause Button */}
            <div className="absolute top-4 right-4">
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
            </div>

            {/* Progress Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
              {teamImages.map((_, index) => (
                <button
                  key={index}
                  className={`relative h-1 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-white w-12" : "bg-white/50 w-8"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                >
                  {index === currentSlide && isPlaying && (
                    <div className="absolute inset-0 bg-primary rounded-full animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Thumbnail Navigation */}
          <div className="mt-8 grid grid-cols-3 lg:grid-cols-6 gap-4">
            {teamImages.map((slide, index) => (
              <button
                key={index}
                className={`relative rounded-lg overflow-hidden transition-all duration-300 ${
                  index === currentSlide
                    ? "ring-4 ring-primary scale-105"
                    : "hover:scale-105 opacity-70 hover:opacity-100"
                }`}
                onClick={() => setCurrentSlide(index)}
              >
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.title}
                  width={120}
                  height={80}
                  className="w-full h-16 lg:h-20 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `/placeholder.svg?height=80&width=120&text=${encodeURIComponent(slide.title.slice(0, 10))}`
                  }}
                />
                <div className="absolute inset-0 bg-black/20" />
                {index === currentSlide && <div className="absolute inset-0 bg-primary/20" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
