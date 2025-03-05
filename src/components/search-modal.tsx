"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { Search, X } from "lucide-react"

interface SearchResult {
  id: string
  title: string
  handle: string
  thumbnail: string | null
  description: string | null
  price?: {
    amount: string
    currency_code: string
  }
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useParams()
  const inputRef = useRef<HTMLInputElement>(null)

  const countryCode = params?.countryCode as string || "es"

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEsc)
    }
    return () => document.removeEventListener("keydown", handleEsc)
  }, [isOpen, onClose])

  const handleSearch = async (term: string) => {
    if (term.length < 2) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(term)}&countryCode=${countryCode}`)
      const data = await response.json()
      setResults(data.products || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const debounce = <T extends (...args: any[]) => void>(
    func: T,
    wait: number
  ) => {
    let timeout: NodeJS.Timeout

    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  const debouncedSearch = debounce(handleSearch, 300)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  const handleProductClick = (handle: string) => {
    router.push(`/${countryCode}/catalog/${handle}`)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="absolute top-0 left-0 right-0 bg-white p-4 shadow-lg transform transition-transform duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="search"
              placeholder="Search for products..."
              className="flex-1 text-lg outline-none placeholder-gray-400"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[60vh]">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-2 border-blue-500 rounded-full animate-spin border-t-transparent" />
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.handle)}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left group"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                        {product.title}
                      </h3>
                      {product.price && (
                        <p className="mt-1 text-sm text-gray-500">
                          {product.price.amount} {product.price.currency_code}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : searchTerm.length > 0 && (
              <div className="text-center py-8 text-gray-500">
                No products found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
