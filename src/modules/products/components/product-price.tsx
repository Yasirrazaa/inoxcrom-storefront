import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"

type PriceType = {
  product: HttpTypes.AdminProduct | HttpTypes.StoreProduct
  variant?: HttpTypes.AdminProductVariant | HttpTypes.StoreProductVariant | undefined
}

const isAdminVariant = (variant: any): variant is HttpTypes.AdminProductVariant => {
  return 'prices' in variant
}

const getVariantPrice = (variant: HttpTypes.AdminProductVariant | HttpTypes.StoreProductVariant): { amount: number; currency_code: string } | null => {
  if (isAdminVariant(variant)) {
    // Find AUD price
    const audPrice = variant.prices?.find(p => p.currency_code === 'aud')
    if (audPrice?.amount) {
      return {
        amount: audPrice.amount,
        currency_code: 'aud'
      }
    }
  } else {
    // Store variant
    const calculatedAmount = variant.calculated_price?.calculated_amount
    const currencyCode = variant.calculated_price?.currency_code
    if (calculatedAmount && currencyCode) {
      return {
        amount: calculatedAmount,
        currency_code: currencyCode
      }
    }
  }

  return null
}

export default function ProductPrice({ product, variant }: PriceType) {
  const price = variant ? getVariantPrice(variant) : null

  const displayPrice = price ? (
    <span className="text-xl font-semibold">
      {convertToLocale({
        amount: price.amount,
        currency_code: price.currency_code
      })}
    </span>
  ) : (
    <span className="text-xl font-semibold text-gray-400">Price not available</span>
  )

  return (
    <div className="flex flex-col text-gray-700">
      {displayPrice}
    </div>
  )
}
