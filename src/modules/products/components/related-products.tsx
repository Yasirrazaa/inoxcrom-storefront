"use client"

import React from 'react'
import { HttpTypes } from '@medusajs/types'
import { Heading } from '@medusajs/ui'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { convertToLocale } from "@lib/util/money"

type RelatedProductsProps = {
  products: HttpTypes.AdminProduct[]
  currentProductId: string
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products, currentProductId }) => {
  const { countryCode } = useParams()
  
  // Filter out the current product from related products and limit to 4
  const relatedProducts = products
    .filter(product => product.id !== currentProductId)
    .slice(0, 4)
  
  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="mt-16 max-w-[1440px] mx-auto">
      <Heading level="h2" className="text-2xl font-bold mb-8">
        You might also like
      </Heading>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <Link href={`/${countryCode}/catalog/${product.handle}`} key={product.id} className="group">
            <div className="aspect-square overflow-hidden bg-gray-100 mb-2 rounded-md">
              {product.thumbnail ? (
                <img 
                  src={product.thumbnail} 
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>
            
            <h3 className="font-medium text-gray-900 group-hover:text-blue-600">{product.title}</h3>
            
            {product.variants && product.variants[0]?.prices && (
              <p className="mt-1 text-gray-700">
                {convertToLocale({
                  amount: product.variants[0].prices[0].amount,
                  currency_code: product.variants[0].prices[0].currency_code || 'aud'
                })}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RelatedProducts
