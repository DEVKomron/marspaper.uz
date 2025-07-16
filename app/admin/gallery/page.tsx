"use client"

import type React from "react"

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
import { addGalleryItem, updateGalleryItem, deleteGalleryItem, uploadGalleryImage } from "@/actions/gallery-management"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"
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
import * as LucideIcons from "lucide-react" // Lucide ikonalarini import qilish

interface GalleryItem {
  id: string
  title_key: string
  description_key: string
  category: string
  image_url: string
  icon_name: string
}

// Lucide ikonalarini dinamik render qilish uchun helper
const getLucideIcon = (iconName: string) => {
  const IconComponent = (LucideIcons as any)[iconName]
  return IconComponent ? <IconComponent className="h-5 w-5" /> : null
}

export default function AdminGalleryPage() {
  const { t } = useLocale()
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false)
  const [currentGalleryItem, setCurrentGalleryItem] = useState<GalleryItem | null>(null)
  const [imageUploadUrl, setImageUploadUrl] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const [addState, addAction] = useActionState(addGalleryItem, { success: false, message: "", errors: {} })
  const [updateState, updateAction] = useActionState(updateGalleryItem, { success: false, message: "", errors: {} })
  const [uploadImageState, uploadImageAction] = useActionState(uploadGalleryImage, {
    success: false,
    message: "",
    url: "",
  })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      const result = await getAdminData()
      if (result.success) {
        setGalleryItems(result.galleryItems)
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
          if (result.success) setGalleryItems(result.galleryItems)
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
          if (result.success) setGalleryItems(result.galleryItems)
        })
      }
    }
  }, [updateState, t])

  useEffect(() => {
    if (uploadImageState.message) {
      toast({
        title: uploadImageState.success ? t("toast_success_title") : t("toast_error_title"),
        description: uploadImageState.message,
        variant: uploadImageState.success ? "default" : "destructive",
      })
      if (uploadImageState.success && uploadImageState.url) {
        setImageUploadUrl(uploadImageState.url)
      }
      setIsUploadingImage(false)
    }
  }, [uploadImageState, t])

  const handleEdit = (item: GalleryItem) => {
    setCurrentGalleryItem(item)
    setImageUploadUrl(item.image_url)
    setIsAddEditDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    const result = await deleteGalleryItem(id)
    if (result.success) {
      toast({
        title: t("toast_success_title"),
        description: result.message,
        variant: "default",
      })
      getAdminData().then((result) => {
        if (result.success) setGalleryItems(result.galleryItems)
      })
    } else {
      toast({
        title: t("toast_error_title"),
        description: result.message,
        variant: "destructive",
      })
    }
  }

  const handleImageFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploadingImage(true)
      const formData = new FormData()
      formData.append("file", file)
      await uploadImageAction(formData)
    }
  }

  const handleDialogClose = () => {
    setIsAddEditDialogOpen(false)
    setCurrentGalleryItem(null)
    setImageUploadUrl(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">{t("manage_gallery_title")}</h1>
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
          <h1 className="text-4xl font-bold text-foreground">{t("manage_gallery_title")}</h1>
          <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleDialogClose()} className="bg-primary hover:bg-primary/90">
                <PlusCircle className="mr-2 h-5 w-5" /> {t("add_new_item")}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{currentGalleryItem ? t("edit_item") : t("add_new_item")}</DialogTitle>
                <DialogDescription>
                  {currentGalleryItem ? t("edit_gallery_item_description") : t("add_gallery_item_description")}
                </DialogDescription>
              </DialogHeader>
              <form action={currentGalleryItem ? updateAction : addAction} className="grid gap-4 py-4">
                {currentGalleryItem && <input type="hidden" name="id" value={currentGalleryItem.id} />}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title_key" className="text-right">
                    {t("gallery_item_title")}
                  </Label>
                  <Input
                    id="title_key"
                    name="title_key"
                    defaultValue={currentGalleryItem?.title_key || ""}
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
                    {t("gallery_item_description")}
                  </Label>
                  <Textarea
                    id="description_key"
                    name="description_key"
                    defaultValue={currentGalleryItem?.description_key || ""}
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
                  <Label htmlFor="category" className="text-right">
                    {t("gallery_item_category")}
                  </Label>
                  <Input
                    id="category"
                    name="category"
                    defaultValue={currentGalleryItem?.category || ""}
                    className="col-span-3"
                    required
                  />
                  {(addState.errors?.category || updateState.errors?.category) && (
                    <p className="col-span-4 text-destructive text-xs text-right">
                      {addState.errors?.category || updateState.errors?.category}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image_file" className="text-right">
                    {t("upload_image")}
                  </Label>
                  <div className="col-span-3 flex items-center gap-2">
                    <Input
                      id="image_file"
                      name="image_file"
                      type="file"
                      onChange={handleImageFileChange}
                      className="col-span-3"
                      disabled={isUploadingImage}
                    />
                    {isUploadingImage && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image_url" className="text-right">
                    {t("gallery_item_image")}
                  </Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={imageUploadUrl || currentGalleryItem?.image_url || ""}
                    onChange={(e) => setImageUploadUrl(e.target.value)}
                    className="col-span-3"
                    placeholder="https://example.com/image.jpg"
                  />
                  {(addState.errors?.image_url || updateState.errors?.image_url) && (
                    <p className="col-span-4 text-destructive text-xs text-right">
                      {addState.errors?.image_url || updateState.errors?.image_url}
                    </p>
                  )}
                </div>
                {imageUploadUrl && (
                  <div className="col-span-4 flex justify-center">
                    <Image
                      src={imageUploadUrl || "/placeholder.svg"}
                      alt="Preview"
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="icon_name" className="text-right">
                    {t("gallery_item_icon")}
                  </Label>
                  <Input
                    id="icon_name"
                    name="icon_name"
                    defaultValue={currentGalleryItem?.icon_name || ""}
                    className="col-span-3"
                    placeholder="Camera, Factory, Truck, etc."
                  />
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
                <TableHead>{t("gallery_item_title")}</TableHead>
                <TableHead>{t("gallery_item_category")}</TableHead>
                <TableHead>{t("gallery_item_image")}</TableHead>
                <TableHead>{t("gallery_item_icon")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {galleryItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    {t("no_items_found")}
                  </TableCell>
                </TableRow>
              ) : (
                galleryItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{t(item.title_key)}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>
                      {item.image_url ? (
                        <Image
                          src={item.image_url || "/placeholder.svg"}
                          alt={t(item.title_key)}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-muted-foreground">No Image</span>
                      )}
                    </TableCell>
                    <TableCell>{getLucideIcon(item.icon_name)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
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
                              onClick={() => handleDelete(item.id)}
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
