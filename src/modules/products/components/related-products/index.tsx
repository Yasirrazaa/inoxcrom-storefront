import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"

export type RelatedProductsProps = {
  products: HttpTypes.StoreProduct[]
  countryCode: string
}

export default async function RelatedProducts({
  products,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region || products.length === 0) {
    return null
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-16">
      <div className="flex flex-col items-center text-center mb-12">
        <span className="text-sm uppercase tracking-wide text-gray-600 mb-3">
          Similar Products
        </span>
        <h3 className="text-3xl font-medium text-gray-900 mb-6">
          You May Also Like
        </h3>
        <div className="w-20 h-1 bg-blue-500 rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div 
            key={product.id}
            className="group relative bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200"
          >
            <div className="w-full overflow-hidden rounded-t-lg">
              <Product region={region} product={product} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
