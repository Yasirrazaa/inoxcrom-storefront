"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { Tabs } from "@medusajs/ui"

type ProductTabsProps = {
  product: HttpTypes.AdminProduct | HttpTypes.StoreProduct
  hideDescription?: boolean
}

const ProductTabs = ({ product, hideDescription = false }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>("description")
  
  const hasSpecifications = product.material || 
    product.weight || 
    product.origin_country || 
    product.width || 
    product.height || 
    product.length || 
    product.hs_code
  
  // If there's no description and we're hiding it anyway, skip to specs
  if (hideDescription && !product.description && hasSpecifications) {
    useState(() => {
      setActiveTab("specifications")
    })
  }

  return (
    <div className="mt-16 max-w-[1440px] mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b border-gray-200">
          <div className="flex space-x-6">
            {!hideDescription && (
              <Tabs
                value="description"
                className={`py-2 text-base font-medium border-b-2 ${
                  activeTab === "description" 
                    ? "border-blue-600 text-blue-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Description
              </Tabs>
            )}
            
            {hasSpecifications && (
              <Tabs
                value="specifications"
                className={`py-2 text-base font-medium border-b-2 ${
                  activeTab === "specifications" 
                    ? "border-blue-600 text-blue-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Specifications
              </Tabs>
            )}
            
            <Tabs 
              value="shipping"
              className={`py-2 text-base font-medium border-b-2 ${
                activeTab === "shipping" 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Shipping & Returns
            </Tabs>
          </div>
        </div>
        
        <div className="py-8">
          {!hideDescription && activeTab === "description" && product.description && (
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-line">{product.description}</p>
            </div>
          )}
          
          {activeTab === "specifications" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium mb-4">Product Details</h4>
                <dl className="space-y-3">
                  {product.material && (
                    <div className="grid grid-cols-3">
                      <dt className="text-sm font-medium text-gray-500">Material</dt>
                      <dd className="col-span-2 text-sm text-gray-900">{product.material}</dd>
                    </div>
                  )}
                  
                  {product.weight && (
                    <div className="grid grid-cols-3">
                      <dt className="text-sm font-medium text-gray-500">Weight</dt>
                      <dd className="col-span-2 text-sm text-gray-900">{product.weight}g</dd>
                    </div>
                  )}
                  
                  {(product.width || product.height || product.length) && (
                    <div className="grid grid-cols-3">
                      <dt className="text-sm font-medium text-gray-500">Dimensions</dt>
                      <dd className="col-span-2 text-sm text-gray-900">
                        {product.width || '-'}x{product.height || '-'}x{product.length || '-'} mm
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
              
              <div>
                <h4 className="text-lg font-medium mb-4">Shipping Information</h4>
                <dl className="space-y-3">
                  {product.origin_country && (
                    <div className="grid grid-cols-3">
                      <dt className="text-sm font-medium text-gray-500">Origin</dt>
                      <dd className="col-span-2 text-sm text-gray-900">{product.origin_country}</dd>
                    </div>
                  )}
                  
                  {product.hs_code && (
                    <div className="grid grid-cols-3">
                      <dt className="text-sm font-medium text-gray-500">HS Code</dt>
                      <dd className="col-span-2 text-sm text-gray-900">{product.hs_code}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          )}
          
          {activeTab === "shipping" && (
            <div className="prose prose-sm max-w-none">
              <h4 className="text-lg font-medium mb-4">Shipping Policy</h4>
              <p>Our products are shipped within 1-3 business days after placing your order. We offer standard shipping (5-7 business days) and express shipping options (2-3 business days) during checkout.</p>
              
              <h4 className="text-lg font-medium mb-4 mt-8">Return Policy</h4>
              <p>We accept returns within 30 days of delivery. Items must be unused, undamaged, and in their original packaging. To initiate a return, please contact our customer support team.</p>
              
              <h4 className="text-lg font-medium mb-4 mt-8">Warranty</h4>
              <p>All our pens come with a 2-year manufacturer's warranty against defects in materials and workmanship under normal use.</p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  )
}

export default ProductTabs
