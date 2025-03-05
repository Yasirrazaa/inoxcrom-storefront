import { HttpTypes } from "@medusajs/types"

export type Image = {
  url: string
  id?: string
  alt?: string
}

export interface ImageGalleryProps {
  images: Image[]
  variantImages?: Image[]
}

export interface ProductActionsProps {
  product: HttpTypes.AdminProduct
  region: HttpTypes.StoreRegion
  selectedVariant?: HttpTypes.AdminProductVariant
  onVariantChange?: (variant: HttpTypes.AdminProductVariant) => void
}
