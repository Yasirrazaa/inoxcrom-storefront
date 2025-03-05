"use client"
import { HttpTypes } from "@medusajs/types";
import { Heading, Text } from "@medusajs/ui";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

type ProductInfoProps = {
  product: HttpTypes.StoreProduct | HttpTypes.AdminProduct;
  selectedVariant?: HttpTypes.StoreProductVariant | HttpTypes.AdminProductVariant;
  onVariantSelect?: (variant: any) => void;
};

const ProductInfo = ({ product, selectedVariant, onVariantSelect }: ProductInfoProps) => {
  // Function to check if a variant matches a specific option value
  const getVariantForOptionValue = (optionId: string, value: string) => {
    return product.variants?.find(variant =>
      variant.options?.some(opt => 
        opt.option_id === optionId && opt.value === value
      )
    );
  };

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

      {/* Product Subtitle */}
      {product.subtitle && (
        <Text className="text-lg text-gray-500">
          {product.subtitle}
        </Text>
      )}
      
      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
            >
              {tag.value}
            </span>
          ))}
        </div>
      )}

      {/* Variant Options */}
      {product.options?.map((option) => (
        <div key={option.id} className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            {option.title}
          </label>
          <div className="grid grid-cols-auto gap-2">
            {option.values?.map((value) => {
              const variant = getVariantForOptionValue(option.id, value.value);
              const isSelected = selectedVariant?.options?.some(
                opt => opt.value === value.value
              );

              return (
                <button
                  key={value.id}
                  className={`
                    py-3 px-4 border rounded-lg
                    ${isSelected
                      ? 'border-[#0093D0] bg-blue-50 text-[#0093D0] shadow-sm ring-2 ring-[#0093D0]/20'
                      : variant
                        ? 'border-gray-200 hover:border-[#0093D0] hover:bg-blue-50/50 text-gray-900'
                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    }
                    transition-all duration-150 font-medium relative
                    ${option.title.toLowerCase() === 'color'
                      ? 'min-w-[100px] flex items-center justify-center gap-2'
                      : ''
                    }
                  `}
                  title={!variant ? 'This variant is not available' : ''}
                  onClick={() => variant && onVariantSelect?.(variant)}
                  disabled={!variant}
                >
                  {option.title.toLowerCase() === 'color' ? (
                    <>
                      <span
                        className={`
                          w-4 h-4 rounded-full border
                          ${value.value.toLowerCase() === 'copper' ? 'bg-amber-600' : ''}
                          ${value.value.toLowerCase() === 'titanium' ? 'bg-slate-400' : ''}
                          ${isSelected ? 'border-[#0093D0]' : 'border-gray-300'}
                        `}
                      />
                      {value.value}
                    </>
                  ) : (
                    value.value
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductInfo;
