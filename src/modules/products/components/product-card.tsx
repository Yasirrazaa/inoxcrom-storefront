import Link from "next/link"
import type { HttpTypes } from "@medusajs/types"
import { generateHandle } from "@lib/util/generate-handle"

type Product = HttpTypes.AdminProduct | HttpTypes.StoreProduct
type ProductVariant = HttpTypes.AdminProductVariant | HttpTypes.StoreProductVariant

type ProductCardProps = {
  product: Product
}

function getProductPrice(product: Product): { amount: number | null } {
  if (!product.variants || product.variants.length === 0) {
    return { amount: null }
  }

  let audPrice: number | null = null

  product.variants.forEach((variant: any) => {
    if ('prices' in variant && variant.prices && Array.isArray(variant.prices)) {
      variant.prices.forEach((price: any) => {
        if (price?.amount && price?.currency_code === 'aud') {
          const amount = price.amount 
          if (audPrice === null || amount < audPrice) {
            audPrice = amount
          }
        }
      })
    }
  })

  return { amount: audPrice }
}

function isAdminProduct(product: Product): product is HttpTypes.AdminProduct {
  return 'status' in product
}

export default function ProductCard({ product }: ProductCardProps) {
  const handle = product.handle || generateHandle(product.title || "")
  const thumbnail = product.thumbnail || ""
  const title = product.title || ""
  const { amount: price } = getProductPrice(product)

  return (
    <div className="group bg-white shadow-md rounded-lg overflow-hidden p-4 flex flex-col items-center w-full">
      <Link href={`/au/catalog/${handle}`} className="w-full" aria-label={`View ${title}`}>
        <div className="w-full aspect-square flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-contain"
          />
        </div>
        <h3 className="mt-3 text-center text-sm text-gray-700 font-medium">{title}</h3>
        <p className="mt-2 text-center text-sm font-semibold text-[#0093D0]">
          {price ? `AUD $${price.toFixed(2)}` : "Price not available"}
        </p>
      </Link>
    </div>
  )
}
