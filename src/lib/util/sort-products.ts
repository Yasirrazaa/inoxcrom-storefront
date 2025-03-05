import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Product = HttpTypes.AdminProduct | HttpTypes.StoreProduct
type ProductVariant = HttpTypes.AdminProductVariant | HttpTypes.StoreProductVariant

interface PriceableProduct {
  _minPrice?: number
}

function getVariantPrice(variant: ProductVariant): number {
  if ('calculated_price' in variant && variant.calculated_price) {
    return variant.calculated_price.calculated_amount || 0
  }

  if ('prices' in variant && variant.prices && variant.prices.length > 0) {
    return Math.min(...variant.prices.map(p => p.amount || 0))
  }

  return 0
}

/**
 * Helper function to sort products by price for both store and admin products
 * @param products Array of products to sort
 * @param sortBy Sort option
 * @returns Sorted array of products
 */
export function sortProducts<T extends Product>(
  products: T[],
  sortBy: SortOptions
): T[] {
  const sortedProducts = [...products] as Array<T & PriceableProduct>

  if (["price_asc", "price_desc"].includes(sortBy)) {
    // Precompute the minimum price for each product
    sortedProducts.forEach((product) => {
      if (product.variants && product.variants.length > 0) {
        product._minPrice = Math.min(
          ...product.variants.map(getVariantPrice)
        )
      } else {
        product._minPrice = Infinity
      }
    })

    // Sort products based on the precomputed minimum prices
    sortedProducts.sort((a, b) => {
      const diff = (a._minPrice || 0) - (b._minPrice || 0)
      return sortBy === "price_asc" ? diff : -diff
    })
  }

  if (sortBy === "created_at") {
    sortedProducts.sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
      return dateB - dateA
    })
  }

  return sortedProducts
}
