"use client"
import React, { useState, useMemo, useEffect } from "react";
import ImageGallery from "@modules/products/components/image-gallery";
import ProductActions from "@modules/products/components/product-actions";
import { notFound } from "next/navigation";
import { HttpTypes } from "@medusajs/types";
import { Image } from "@modules/products/types";
import ProductOptions from "@modules/products/components/product-options";
import { useParams } from "next/navigation";

type ProductTemplateProps = {
  product: HttpTypes.AdminProduct;
  region: HttpTypes.StoreRegion;
  countryCode: string;
}
const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {

  if (!product || !product.id) {
    return notFound();
  }

  // State for variant selection
  // Initialize selected options with first available option values
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initialOptions: Record<string, string> = {};
    product.options?.forEach(option => {
      if (option.values && option.values.length > 0) {
        initialOptions[option.id] = option.values[0].value;
      }
    });
    return initialOptions;
  });

  // Initialize selected variant based on initial options
  const [selectedVariant, setSelectedVariant] = useState<HttpTypes.AdminProductVariant | undefined>(() => {
    if (!product.variants?.length) return undefined;
    return product.variants[0];
  });

  // Find matching variant when options change
  useEffect(() => {
    if (!product.variants?.length) return;
    
    const variant = product.variants.find(variant => 
      variant.options?.every(option => 
        selectedOptions[option.option_id || ''] === option.value
      )
    );
    
    if (variant) {
      setSelectedVariant(variant);
    } else {
      // If no exact match found, don't select any variant
      setSelectedVariant(undefined);
    }
  }, [selectedOptions, product.variants]);

  // Update selected options and find matching variant
  const handleOptionChange = (optionId: string, value: string) => {
    const newOptions = {
      ...selectedOptions,
      [optionId]: value
    };
    setSelectedOptions(newOptions);
  };

  // Check if an option value is available based on current selections
  const isOptionValueAvailable = (optionId: string, value: string) => {
    // Create a new options object with the potential selection
    const potentialOptions = {
      ...selectedOptions,
      [optionId]: value
    };
    
    // Check if any variant exists with these options
    return product.variants?.some(variant => 
      variant.options?.every(option => 
        option.option_id !== optionId ? 
          potentialOptions[option.option_id || ''] === option.value : 
          true
      )
    ) || false;
  };

  // Handle variant selection from ProductActions
  const handleVariantChange = (variant: HttpTypes.AdminProductVariant) => {
    setSelectedVariant(variant);
    // Update selected options to match the variant
    const newOptions: Record<string, string> = {};
    variant.options?.forEach(option => {
      if (option.option_id && option.value) {
        newOptions[option.option_id] = option.value;
      }
    });
    setSelectedOptions(newOptions);
  };

  // Get variant-filtered or all product images for the gallery
  const galleryImages = useMemo(() => {
    if (!product.images && !product.thumbnail) return [];

    const productImages: Image[] = (product.images || []).map(img => ({
      url: img.url,
      id: img.id,
      alt: `Product image ${img.id || ''}`
    }));

    const thumbnailImage: Image | null = product.thumbnail ? {
      url: product.thumbnail,
      alt: 'Product thumbnail',
      id: 'thumbnail'
    } : null;

    const allImages = [
      ...productImages,
      ...(thumbnailImage ? [thumbnailImage] : [])
    ];

    return allImages;
  }, [product.thumbnail, product.images]);

  // Format the price display
  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return "Price not available";
    
    // Format as AUD with 2 decimal places
    return `AUD $${(price).toFixed(2)}`;
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-8" data-testid="product-container">
        {/* Left Column - Image Gallery */}
        <div className="md:w-1/2">
          <ImageGallery images={galleryImages} />
        </div>

        {/* Right Column - Product Info & Actions */}
        <div className="md:w-1/2">
          {/* Product Title and Subtitle */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            {product.subtitle && (
              <p className="text-gray-600">{product.subtitle}</p>
            )}
          </div>

          {/* Current Price Display */}
          <div className="mb-6">
            {selectedVariant && selectedVariant.prices && selectedVariant.prices.length > 0 ? (
              <div className="text-xl font-semibold text-[#0093D0]">
                {formatPrice(
                  selectedVariant.prices.find(p => p.currency_code === "aud")?.amount
                )}
              </div>
            ) : (
              <div className="text-xl font-semibold text-gray-400">
                Select options to see price
              </div>
            )}
          </div>

          {/* Options Selection */}
          <div className="mb-8">
            <ProductOptions 
              product={product}
              selectedOptions={selectedOptions}
              onOptionChange={handleOptionChange}
              isOptionValueAvailable={isOptionValueAvailable}
            />
          </div>

          {/* Add to Cart Action */}
          <div className="mb-8">
            <ProductActions
              product={product}
              region={region}
              selectedVariant={selectedVariant}
              onVariantChange={handleVariantChange}
              countryCode={countryCode}
            />
          </div>

          {/* Product Description */}
          {product.description && (
            <div className="mb-8 border-t pt-8">
              <h3 className="text-lg font-medium mb-4">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          {/* Additional Product Details */}
          {(product.material || product.weight || product.origin_country || product.hs_code ||
            product.width || product.height || product.length) && (
            <div className="border-t pt-8">
              <h3 className="text-lg font-medium mb-4">Product Specifications</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.material && (
                  <p className="text-sm"><span className="font-medium">Material:</span> {product.material}</p>
                )}
                {product.weight && (
                  <p className="text-sm"><span className="font-medium">Weight:</span> {product.weight}g</p>
                )}
                {(product.width || product.height || product.length) && (
                  <p className="text-sm">
                    <span className="font-medium">Dimensions:</span> {product.width || '-'}x{product.height || '-'}x{product.length || '-'} mm
                  </p>
                )}
                {product.origin_country && (
                  <p className="text-sm"><span className="font-medium">Origin:</span> {product.origin_country}</p>
                )}
                {product.hs_code && (
                  <p className="text-sm"><span className="font-medium">HS Code:</span> {product.hs_code}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductTemplate;

