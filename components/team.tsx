"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Award, Briefcase } from "lucide-react"
import { useLocale } from "@/context/locale-context"
import Image from "next/image"
import { useEffect, useState } from "react"
import { createBrowserClient } from "@/lib/supabase"

interface TeamMember {
  id: string
  name: string
  position: string
  experience: string
  description: string
  image_url: string
  achievements: string[]
}

export default function Team() {
  const { t } = useLocale()
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true)
      setError(null)
      try {
        const supabase = createBrowserClient()
        const { data, error } = await supabase.from("team_members").select("*").order("created_at", { ascending: true })

        if (error) {
          throw error
        }
        setTeamMembers(data as TeamMember[])
      } catch (err: any) {
        console.error("Jamoa a'zolarini yuklashda xato:", err.message)
        setError("Jamoa a'zolarini yuklashda xatolik yuz berdi.")
        // Fallback to hardcoded data if there's an error
        setTeamMembers([
          {
            id: "1",
            name: "Akmal Karimov",
            position: t("position_director"),
            experience: t("experience_15_years"),
            description: t("director_description"),
            image_url: "/images/team-default.jpeg",
            achievements: [t("achievement_iso"), t("achievement_export"), t("achievement_innovation")],
          },
          {
            id: "2",
            name: "Dilnoza Abdullayeva",
            position: t("position_production_manager"),
            experience: t("experience_8_years"),
            description: t("production_manager_description"),
            image_url: "/images/team-default.jpeg",
            achievements: [
              t("achievement_quality_control"),
              t("achievement_tech_innovation"),
              t("achievement_team_leadership"),
            ],
          },
          {
            id: "3",
            name: "Bobur Toshmatov",
            position: t("position_sales_manager"),
            experience: t("experience_6_years"),
            description: t("sales_manager_description"),
            image_url: "/images/team-default.jpeg",
            achievements: [
              t("achievement_customer_relations"),
              t("achievement_market_analysis"),
              t("achievement_sales_growth"),
            ],
          },
          {
            id: "4",
            name: "Madina Yusupova",
            position: t("position_quality_specialist"),
            experience: t("experience_10_years"),
            description: t("quality_specialist_description"),
            image_url: "/images/team-default.jpeg",
            achievements: [
              t("achievement_lab_experience"),
              t("achievement_standards"),
              t("achievement_quality_certificate"),
            ],
          },
          {
            id: "5",
            name: "Jasur Rahimov",
            position: t("position_logistics_manager"),
            experience: t("experience_7_years"),
            description: t("logistics_manager_description"),
            image_url: "/images/team-default.jpeg",
            achievements: [
              t("achievement_logistics_opt"),
              t("achievement_delivery_system"),
              t("achievement_warehouse_mgmt"),
            ],
          },
          {
            id: "6",
            name: "Sevara Normatova",
            position: t("position_marketing_manager"),
            experience: t("experience_5_years"),
            description: t("marketing_manager_description"),
            image_url: "/images/team-default.jpeg",
            achievements: [
              t("achievement_brand_dev"),
              t("achievement_digital_marketing"),
              t("achievement_customer_attraction"),
            ],
          },
        ])
      } finally {
        setLoading(false)
      }
    }
    fetchTeamMembers()
  }, [t])

  if (loading) {
    return (
      <section id="team" className="py-20 px-4 bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-xl text-muted-foreground">{t("loading_data")}</p>
        </div>
      </section>
    )
  }

  if (error && teamMembers.length === 0) {
    return (
      <section id="team" className="py-20 px-4 bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-xl text-destructive">{error}</p>
          <p className="text-muted-foreground mt-2">Hardcoded ma'lumotlar ko'rsatilmoqda.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="team" className="py-20 px-4 bg-gradient-to-br from-secondary/5 to-primary/5">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">{t("our_team_title")}</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t("our_team_description")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card
              key={member.id}
              className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <CardContent className="p-6 text-center">
                <div className="relative mb-6">
                  <Image
                    src={member.image_url || "/images/team-default.jpeg"}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary/20"
                  />
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">{member.experience}</Badge>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">{member.name}</h3>
                <p className="text-primary font-semibold mb-4">{member.position}</p>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{member.description}</p>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground flex items-center justify-center gap-2">
                    <Award className="h-4 w-4 text-primary" />
                    {t("achievements_title")}
                  </h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.achievements?.map((achievement, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 bg-background rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Briefcase className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-bold text-foreground">{t("join_us_title")}</h3>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">{t("join_us_description")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge className="bg-secondary/10 text-secondary px-4 py-2">{t("job_production_specialists")}</Badge>
            <Badge className="bg-primary/10 text-primary px-4 py-2">{t("job_sales_managers")}</Badge>
            <Badge className="bg-accent/10 text-accent-foreground px-4 py-2">{t("job_logistics_specialists")}</Badge>
          </div>
        </div>
      </div>
    </section>
  )
}
