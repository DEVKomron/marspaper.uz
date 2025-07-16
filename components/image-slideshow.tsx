"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ImageSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: "/placeholder.svg?height=400&width=600&text=Jamoaviy+Ish",
      title: "Jamoaviy Ish",
      description: "Mars Paper jamoasi birgalikda sifatli mahsulot yaratadi",
    },
    {
      image: "/placeholder.svg?height=400&width=600&text=Zamonaviy+Texnologiya",
      title: "Zamonaviy Texnologiya",
      description: "Ilg'or uskunalar bilan ishlab chiqarish jarayoni",
    },
    {
      image: "/placeholder.svg?height=400&width=600&text=Sifat+Nazorati",
      title: "Sifat Nazorati",
      description: "Har bir mahsulot ehtiyotkorlik bilan tekshiriladi",
    },
    {
      image: "/placeholder.svg?height=400&width=600&text=Ekologik+Yondashuv",
      title: "Ekologik Yondashuv",
      description: "Tabiatni muhofaza qilish bizning ustuvorligimiz",
    },
    {
      image: "/placeholder.svg?height=400&width=600&text=Professional+Jamoa",
      title: "Professional Jamoa",
      description: "Tajribali mutaxassislar o'z ishini sevib bajaradi",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="relative h-96 overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentSlide ? "translate-x-0" : index < currentSlide ? "-translate-x-full" : "translate-x-full"
            }`}
          >
            <img
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Agar rasm yuklanmasa, placeholder ko'rsatish
                e.currentTarget.src = `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(slide.title)}`
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h3 className="text-xl font-bold mb-2">{slide.title}</h3>
              <p className="text-sm opacity-90">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-white w-6" : "bg-white/50"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
