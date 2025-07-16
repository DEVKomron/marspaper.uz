"use client"

import { Button } from "@/components/ui/button"

import { useState } from "react"
import { Phone, Menu, X, ChevronDown } from "lucide-react"
import Image from "next/image"
import { useLocale } from "@/context/locale-context"

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { locale, setLocale, t } = useLocale()

  const menuItems = [
    { name: t("home"), href: "#home" },
    { name: t("about"), href: "#about" },
    { name: t("products"), href: "#products" },
    { name: t("team"), href: "#team" },
    { name: t("partners"), href: "#testimonials" },
    { name: t("gallery"), href: "#gallery" },
    { name: t("contact"), href: "#contact" },
  ]

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale)
    setIsMenuOpen(false) // Close menu on language change
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/90 backdrop-blur-md text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/images/marspaper-logo.jpeg"
              alt="Mars Paper Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-bold">Mars Paper</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm hover:text-secondary transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Language & Contact */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <Button
                variant="ghost"
                className="text-sm flex items-center gap-1 hover:bg-primary-foreground/10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span>{locale.toUpperCase()}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-24 bg-primary rounded-md shadow-lg py-1 z-20">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-primary-foreground/10"
                    onClick={() => handleLocaleChange("uz")}
                  >
                    O'zbek
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-primary-foreground/10"
                    onClick={() => handleLocaleChange("ru")}
                  >
                    Русский
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-primary-foreground/10"
                    onClick={() => handleLocaleChange("en")}
                  >
                    English
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4" />
              <span>+998 90 034 06 04</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-primary-foreground/20">
            <div className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm hover:text-secondary transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="pt-4 border-t border-primary-foreground/20">
                <div className="flex items-center gap-2 text-sm mb-2">
                  <Phone className="h-4 w-4" />
                  <span>+998 90 359 39 00</span>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-primary-foreground/10"
                    onClick={() => handleLocaleChange("uz")}
                  >
                    O'zbek
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-primary-foreground/10"
                    onClick={() => handleLocaleChange("ru")}
                  >
                    Русский
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-primary-foreground/10"
                    onClick={() => handleLocaleChange("en")}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
