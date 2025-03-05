import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct | HttpTypes.AdminProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info" className="flex flex-col gap-y-6">
      {/* Collection Link */}
      {product.collection && (
        <LocalizedClientLink
          href={`/collections/${product.collection.handle || product.collection.id}`}
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <span className="mr-2">←</span>
          {product.collection.title} Collection
        </LocalizedClientLink>
      )}

      {/* Product Title */}
      <div>
        <Heading
          level="h1"
          className="text-4xl font-medium text-gray-900 mb-2"
          data-testid="product-title"
        >
          {product.title}
        </Heading>
        
        {/* Subtitle */}
        {product.subtitle && (
          <Text className="text-lg text-gray-500 mb-4">
            {product.subtitle}
          </Text>
        )}
        
        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {product.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full"
              >
                {tag.value}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Product Description */}
      <div className="prose prose-sm max-w-none">
        <Text
          className="text-base text-gray-600 leading-relaxed"
          data-testid="product-description"
        >
          {product.description}
        </Text>
      </div>

      {/* Product Options */}
      {product.options && product.options.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Available Options</h3>
          <div className="space-y-4">
            {product.options.map((option) => (
              <div key={option.id}>
                <h4 className="text-sm font-medium">{option.title}</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {option.values?.map((value) => (
                    <span key={value.id} className="px-3 py-1 text-sm bg-gray-100 rounded-full">
                      {value.value}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Details from Metadata */}
      {product.metadata && Object.keys(product.metadata).length > 0 && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Product Details
          </h3>
          <dl className="grid grid-cols-1 gap-4">
            {Object.entries(product.metadata).map(([key, value]) => (
              <div key={key} className="flex">
                <dt className="text-sm font-medium text-gray-500 w-1/3">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </dt>
                <dd className="text-sm text-gray-900 w-2/3">
                  {value as string}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {/* Product Specifications */}
      {(product.material || product.weight || product.origin_country || product.hs_code ||
        product.width || product.height || product.length) && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-4">
            Specifications
          </h3>
          <dl className="grid grid-cols-1 gap-4">
            {product.material && (
              <div className="flex">
                <dt className="text-sm font-medium text-gray-500 w-1/3">Material</dt>
                <dd className="text-sm text-gray-900 w-2/3">{product.material}</dd>
              </div>
            )}
            {product.weight && (
              <div className="flex">
                <dt className="text-sm font-medium text-gray-500 w-1/3">Weight</dt>
                <dd className="text-sm text-gray-900 w-2/3">{product.weight}g</dd>
              </div>
            )}
            {(product.width || product.height || product.length) && (
              <div className="flex">
                <dt className="text-sm font-medium text-gray-500 w-1/3">Dimensions</dt>
                <dd className="text-sm text-gray-900 w-2/3">
                  {product.width || '-'}x{product.height || '-'}x{product.length || '-'} mm
                </dd>
              </div>
            )}
            {product.origin_country && (
              <div className="flex">
                <dt className="text-sm font-medium text-gray-500 w-1/3">Origin</dt>
                <dd className="text-sm text-gray-900 w-2/3">{product.origin_country}</dd>
              </div>
            )}
            {product.hs_code && (
              <div className="flex">
                <dt className="text-sm font-medium text-gray-500 w-1/3">HS Code</dt>
                <dd className="text-sm text-gray-900 w-2/3">{product.hs_code}</dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </div>
  )
}

export default ProductInfo
