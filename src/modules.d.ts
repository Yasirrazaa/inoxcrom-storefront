declare module "@modules/products/components/image-gallery" {
  import { FC } from 'react'
  import { Image, ImageGalleryProps } from "@modules/products/types"
  
  const ImageGallery: FC<ImageGalleryProps>
  export default ImageGallery
}

declare module "@modules/products/components/product-actions" {
  import { FC } from 'react'
  import { ProductActionsProps } from "@modules/products/types"
  
  const ProductActions: FC<ProductActionsProps>
  export default ProductActions
}
