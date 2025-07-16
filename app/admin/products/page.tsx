"use client"

import { useLocale } from "@/context/locale-context"
import { useEffect, useState } from "react"
import { getAdminData } from "@/actions/get-admin-data"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useActionState } from "react"
import { addProductItem, updateProductItem, deleteProductItem } from "@/actions/product-management"
import { toast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react"

interface ProductItem {
  id: string
  title_key: string
  description_key: string
  features: string[]
  icon: string
  keywords: string[]
  slug: string
  price_per_unit: number
  unit_type: string
}

export default function AdminProductsPage() {
  const { t } = useLocale()
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<ProductItem | null>(null)

  const [addState, addAction] = useActionState(addProductItem, { success: false, message: "", errors: {} })
  const [updateState, updateAction] = useActionState(updateProductItem, { success: false, message: "", errors: {} })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      const result = await getAdminData()
      if (result.success) {
        setProducts(result.products)
      } else {
        setError(result.message)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (addState.message) {
      toast({
        title: addState.success ? t("toast_success_title") : t("toast_error_title"),
        description: addState.message,
        variant: addState.success ? "default" : "destructive",
      })
      if (addState.success) {
        setIsAddEditDialogOpen(false)
        getAdminData().then((result) => {
          if (result.success) setProducts(result.products)
        })
      }
    }
  }, [addState, t])

  useEffect(() => {
    if (updateState.message) {
      toast({
        title: updateState.success ? t("toast_success_title") : t("toast_error_title"),
        description: updateState.message,
        variant: updateState.success ? "default" : "destructive",
      })
      if (updateState.success) {
        setIsAddEditDialogOpen(false)
        getAdminData().then((result) => {
          if (result.success) setProducts(result.products)
        })
      }
    }
  }, [updateState, t])

  const handleEdit = (product: ProductItem) => {
    setCurrentProduct(product)
    setIsAddEditDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    const result = await deleteProductItem(id)
    if (result.success) {
      toast({
        title: t("toast_success_title"),
        description: result.message,
        variant: "default",
      })
      getAdminData().then((result) => {
        if (result.success) setProducts(result.products)
      })
    } else {
      toast({
        title: t("toast_error_title"),
        description: result.message,
        variant: "destructive",
      })
    }
  }

  const handleDialogClose = () => {
    setIsAddEditDialogOpen(false)
    setCurrentProduct(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">{t("manage_products_title")}</h1>
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">{t("manage_products_title")}</h1>
          <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleDialogClose()} className="bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 h-5 w-5" /> {t("add_new_item")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{currentProduct ? t("edit_item") : t("add_new_item")}</DialogTitle>
                <DialogDescription>
                  {currentProduct ? t("edit_product_description") : t("add_product_description")}
                </DialogDescription>
              </DialogHeader>
              <form action={currentProduct ? updateAction : addAction} className="grid gap-4 py-4">
                {currentProduct && <input type="hidden" name="id" value={currentProduct.id} />}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title_key" className="text-right">
                    {t("product_item_title")}
                  </Label>
                  <Input
                    id="title_key"
                    name="title_key"
                    defaultValue={currentProduct?.title_key || ""}
                    className="col-span-3"
                    required
                  />
                  {(addState.errors?.title_key || updateState.errors?.title_key) && (
                    <p className="col-span-4 text-destructive text-xs text-right">
                      {addState.errors?.title_key || updateState.errors?.title_key}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description_key" className="text-right">
                    {t("product_item_description")}
                  </Label>
                  <Textarea
                    id="description_key"
                    name="description_key"
                    defaultValue={currentProduct?.description_key || ""}
                    className="col-span-3 min-h-[100px]"
                    required
                  />
                  {(addState.errors?.description_key || updateState.errors?.description_key) && (
                    <p className="col-span-4 text-destructive text-xs text-right">
                      {addState.errors?.description_key || updateState.errors?.description_key}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="features" className="text-right">
                    {t("product_item_features")}
                  </Label>
                  <Input
                    id="features"
                    name="features"
                    defaultValue={currentProduct?.features.join(", ") || ""}
                    className="col-span-3"
                    placeholder="Feature 1, Feature 2"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="icon" className="text-right">
                    {t("product_item_icon")}
                  </Label>
                  <Input
                    id="icon"
                    name="icon"
                    defaultValue={currentProduct?.icon || ""}
                    className="col-span-3"
                    placeholder="📦"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="keywords" className="text-right">
                    {t("product_item_keywords")}
                  </Label>
                  <Input
                    id="keywords"
                    name="keywords"
                    defaultValue={currentProduct?.keywords.join(", ") || ""}
                    className="col-span-3"
                    placeholder="keyword1, keyword2"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="slug" className="text-right">
                    {t("product_item_slug")}
                  </Label>
                  <Input
                    id="slug"
                    name="slug"
                    defaultValue={currentProduct?.slug || ""}
                    className="col-span-3"
                    required
                  />
                  {(addState.errors?.slug || updateState.errors?.slug) && (
                    <p className="col-span-4 text-destructive text-xs text-right">
                      {addState.errors?.slug || updateState.errors?.slug}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price_per_unit" className="text-right">
                    {t("price_per_unit")}
                  </Label>
                  <Input
                    id="price_per_unit"
                    name="price_per_unit"
                    type="number"
                    step="0.01"
                    defaultValue={currentProduct?.price_per_unit || ""}
                    className="col-span-3"
                    required
                  />
                  {(addState.errors?.price_per_unit || updateState.errors?.price_per_unit) && (
                    <p className="col-span-4 text-destructive text-xs text-right">
                      {addState.errors?.price_per_unit || updateState.errors?.price_per_unit}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="unit_type" className="text-right">
                    {t("unit_type")}
                  </Label>
                  <Input
                    id="unit_type"
                    name="unit_type"
                    defaultValue={currentProduct?.unit_type || ""}
                    className="col-span-3"
                    placeholder="pc., kg, unit"
                    required
                  />
                  {(addState.errors?.unit_type || updateState.errors?.unit_type) && (
                    <p className="col-span-4 text-destructive text-xs text-right">
                      {addState.errors?.unit_type || updateState.errors?.unit_type}
                    </p>
                  )}
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleDialogClose}>
                    {t("cancel")}
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    {t("save_changes")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("product_item_title")}</TableHead>
                <TableHead>{t("product_item_icon")}</TableHead>
                <TableHead>{t("price_per_unit")}</TableHead>
                <TableHead>{t("unit_type")}</TableHead>
                <TableHead>{t("product_item_slug")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    {t("no_items_found")}
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{t(product.title_key)}</TableCell>
                    <TableCell>{product.icon}</TableCell>
                    <TableCell>{product.price_per_unit}</TableCell>
                    <TableCell>{t(product.unit_type)}</TableCell>
                    <TableCell>{product.slug}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">{t("edit_item")}</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">{t("delete_item")}</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t("confirm_delete")}</AlertDialogTitle>
                            <AlertDialogDescription>{t("delete_confirmation_message")}</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("delete_cancel")}</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(product.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              {t("delete_confirm")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm text-red-600 mt-4">**{t("no_database_warning")}**</p>
      </div>
    </div>
  )
}
