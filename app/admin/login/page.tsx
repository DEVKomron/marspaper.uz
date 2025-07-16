"use client"

import { useActionState, useEffect } from "react"
import { adminLogin } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocale } from "@/context/locale-context"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const { t } = useLocale()
  const router = useRouter()
  const [state, formAction] = useActionState(adminLogin, {
    success: false,
    message: "",
    errors: {},
  })

  useEffect(() => {
    if (state.success) {
      toast({
        title: t("toast_success_title"),
        description: state.message,
        variant: "default",
      })
      router.push("/admin") // Muvaffaqiyatli kirishdan keyin admin paneliga yo'naltirish
    } else if (state.message && !state.errors) {
      toast({
        title: t("toast_error_title"),
        description: state.message,
        variant: "destructive",
      })
    }
  }, [state, t, router])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">{t("admin_login_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="phone">{t("phone_number")}</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+998901234567" required />
              {state.errors?.phone && <p className="text-destructive text-xs">{state.errors.phone}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input id="password" name="password" type="password" placeholder={t("your_password")} required />
              {state.errors?.password && <p className="text-destructive text-xs">{state.errors.password}</p>}
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" size="lg">
              {t("admin_login_button")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
