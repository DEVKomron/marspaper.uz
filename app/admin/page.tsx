"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocale } from "@/context/locale-context"
import { useEffect, useState } from "react"
import { getAdminData } from "@/actions/get-admin-data"
import Link from "next/link"
import { Users, Package, ImageIcon, MessageSquare, ShoppingCart, Loader2 } from "lucide-react"

interface AdminDashboardData {
  teamMemberCount: number
  productCount: number
  galleryItemCount: number
  newMessagesToday: number
  newOrdersToday: number
}

export default function AdminPage() {
  const { t } = useLocale()
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      const result = await getAdminData()
      if (result.success) {
        setData({
          teamMemberCount: result.teamMembers.length,
          productCount: result.products.length,
          galleryItemCount: result.galleryItems.length,
          newMessagesToday: result.contactMessages.filter(
            (msg: any) => new Date(msg.created_at).toDateString() === new Date().toDateString(),
          ).length,
          newOrdersToday: result.productOrders.filter(
            (order: any) => new Date(order.created_at).toDateString() === new Date().toDateString(),
          ).length,
        })
      } else {
        setError(result.message)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">{t("admin_panel_title")}</h1>
          <p className="text-muted-foreground">{t("loading_data")}</p>
          <Loader2 className="h-8 w-8 animate-spin mt-4 text-primary" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-100 flex items-center justify-center">
        <div className="text-center p-8 rounded-lg shadow-md bg-white">
          <h1 className="text-3xl font-bold text-destructive mb-4">{t("error_loading_data")}</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-foreground mb-8">{t("admin_panel_title")}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("team_member_count")}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.teamMemberCount ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("product_count")}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.productCount ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("gallery_item_count")}</CardTitle>
              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.galleryItemCount ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("new_messages_today")}</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.newMessagesToday ?? 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("new_orders_today")}</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.newOrdersToday ?? 0}</div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-4">{t("admin_panel_info")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/admin/team" passHref>
            <Button className="w-full h-24 text-lg bg-secondary text-secondary-foreground hover:bg-secondary/90">
              {t("manage_team_title")}
            </Button>
          </Link>
          <Link href="/admin/products" passHref>
            <Button className="w-full h-24 text-lg bg-secondary text-secondary-foreground hover:bg-secondary/90">
              {t("manage_products_title")}
            </Button>
          </Link>
          <Link href="/admin/gallery" passHref>
            <Button className="w-full h-24 text-lg bg-secondary text-secondary-foreground hover:bg-secondary/90">
              {t("manage_gallery_title")}
            </Button>
          </Link>
        </div>
        <p className="text-sm text-red-600 mt-4">**{t("no_database_warning")}**</p>
      </div>
    </div>
  )
}
