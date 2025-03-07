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
    <div className="group bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] rounded-lg overflow-hidden p-4 flex flex-col items-center w-full transition-all duration-300 hover:-translate-y-1">
      <Link href={`/au/catalog/${handle}`} className="w-full" aria-label={`View ${title}`}>
        <div className="relative w-full aspect-[3/4] flex justify-center items-center bg-gray-50 rounded-lg overflow-hidden">
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <h3 className="mt-4 text-center text-base text-gray-800 font-medium line-clamp-2 group-hover:text-[#0093D0] transition-colors duration-200">{title}</h3>
        <p className="mt-2 text-center text-base font-semibold text-[#0093D0] group-hover:text-[#007bb3] transition-colors duration-200">
          {price ? `AUD $${price.toFixed(2)}` : "Price not available"}
        </p>
      </Link>
    </div>
  )
}
