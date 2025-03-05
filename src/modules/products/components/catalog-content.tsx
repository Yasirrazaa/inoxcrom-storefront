"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronRight, Filter, X } from "lucide-react"
import ProductCard from "./product-card"
import { HttpTypes } from "@medusajs/types"

interface AdminCategory {
  id: string
  name: string
  handle: string
}

interface AdminCollection {
  id: string
  title: string
  handle: string
}

type Props = {
  products: HttpTypes.AdminProduct[]
  initialFilter?: string | null
  storeCategories: AdminCategory[]
  storeCollections: AdminCollection[]
}

type CategoryStructure = {
  title: string
  type: 'category' | 'collection'
  subcategories: string[]
}

type FilterInfo = {
  isMain: boolean
  type?: 'category' | 'collection'
  value?: string
  parent?: string
}

// Organize collections into categories
const categoryStructure: CategoryStructure[] = [
  {
    title: "WRITING TYPE",
    type: "category",
    subcategories: ["Fountain pens", "Ballpoint pens", "Mechanical pencils", "Rollerball pens", "Sets"],
  },
  {
    title: "RANGE",
    type: "collection",
    subcategories: ["Office", "Casual", "Premium"],
  },
  {
    title: "MODELS",
    type: "collection",
    subcategories: [
      "Ictineo", "Arc", "Vista", "Round", "Best", "Prime", "Canvas",
      "Touch", "Inox70", "Slim", "Soul", "Spin", "Vera", "Wave", "Rocker"
    ],
  },
  {
    title: "COLLECTIONS",
    type: "collection",
    subcategories: [
      "Ictineo", "Arcade", "Arts", "Books", "Best is Back", "Carbone",
      "Etnia", "Fantasy", "History", "Inox", "Maya", "Royale", "Spices", "Vintage"
    ],
  },
  {
    title: "REFILLS",
    type: "category",
    subcategories: ["Fountain pen refills", "Ball pen refills", "Pencil refills", "Roller refills"],
  },
]

export default function CatalogContent({
  products,
  initialFilter = null,
  storeCategories,
  storeCollections
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("relevance")
  const [currentPage, setCurrentPage] = useState(1)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const itemsPerPage = 12

  const normalize = (str: string) => str?.toLowerCase().trim().replace(/\s+/g, '-') || ""

  // Get category or collection info for filtering
  const getFilterInfo = (value: string | null): FilterInfo => {
    if (!value) return { isMain: false }
    
    // Check if it's a main category
    const mainCategory = categoryStructure.find(cat => cat.title === value)
    if (mainCategory) {
      return {
        isMain: true,
        type: mainCategory.type,
        value: mainCategory.title,
      }
    }

    // Check if it's a subcategory
    const parent = categoryStructure.find(cat => cat.subcategories.includes(value))
    if (parent) {
      return {
        isMain: false,
        type: parent.type,
        value: value,
        parent: parent.title,
      }
    }

    return { isMain: false }
  }

  // Filter products based on search query
  const filteredProducts = products.filter(product => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const title = product.title?.toLowerCase() || "";
    const description = product.description?.toLowerCase() || "";
    const collectionTitle = product.collection?.title?.toLowerCase() || "";
    const categoryNames = product.categories?.map(cat => cat.name.toLowerCase()) || [];
    
    return title.includes(query) ||
      description.includes(query) ||
      collectionTitle.includes(query) ||
      categoryNames.some(name => name.includes(query));
  });

  // Sort products - handle possible undefined values
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    // If either product is missing title or price, sort it to the end
    if (!a.title || !b.title) return 1

    switch (sortBy) {
      case "name-asc":
        return a.title.localeCompare(b.title)
      case "name-desc":
        return b.title.localeCompare(a.title)
      case "price-asc":
        const priceA = a.variants?.[0]?.prices?.[0]?.amount ?? 0
        const priceB = b.variants?.[0]?.prices?.[0]?.amount ?? 0
        return priceA - priceB
      case "price-desc":
        const priceC = a.variants?.[0]?.prices?.[0]?.amount ?? 0
        const priceD = b.variants?.[0]?.prices?.[0]?.amount ?? 0
        return priceD - priceC
      default:
        return 0
    }
  })

  // Calculate pagination based on filtered and sorted products
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const indexOfLastProduct = currentPage * itemsPerPage
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  // Stats for display
  const totalItems = sortedProducts.length
  const showing = {
    from: totalItems === 0 ? 0 : indexOfFirstProduct + 1,
    to: Math.min(indexOfLastProduct, totalItems),
    total: totalItems,
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 3

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      if (currentPage <= 2) {
        pageNumbers.push(1, 2, 3)
      } else if (currentPage >= totalPages - 1) {
        pageNumbers.push(totalPages - 2, totalPages - 1, totalPages)
      } else {
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1)
      }
    }

    return pageNumbers
  }


  const toggleCategory = (title: string) => {
    setOpenCategories((prev) => ({ ...prev, [title]: !prev[title] }));
  }

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center gap-2 text-gray-700 font-medium mb-4"
          >
            {isFilterOpen ? (
              <>
                <X size={20} />
                Close Filters
              </>
            ) : (
              <>
                <Filter size={20} />
                Show Filters
              </>
            )}
          </button>

          {/* Sidebar */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block w-full md:w-1/4`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
              {categoryStructure.map(({ title, subcategories, type }: CategoryStructure) => (
                <div key={title} className="mb-4">
                  <button
                    className="flex items-center w-full text-lg font-semibold text-gray-800"
                    onClick={() => toggleCategory(title)}
                    aria-label={`Toggle ${title} subcategories`}
                  >
                    {openCategories[title] ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    <span className="ml-2 text-gray-800">
                      {title}
                    </span>
                  </button>
                  {openCategories[title] && (
                    <ul className="pl-7 mt-2 space-y-2">
                      {subcategories.map((sub) => (
                        <li key={sub}>
                          <a
                            href={`/au/catalog?filter=${normalize(sub)}`}
                            className="block text-gray-600 hover:text-[#0093D0] transition-colors rounded-md px-2 py-1"
                          >
                            {sub}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8">
              <div className="mb-4 space-y-4">
                {/* Search input */}
                <div className="relative w-full md:w-72">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0093D0] shadow-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold">
                    {searchParams.get('filter') ? searchParams.get('filter').replace(/-/g, ' ') : "All Products"}
                  </h2>
                  {searchParams.get('filter') && (
                    <a
                      href="/au/catalog"
                      className="text-sm text-[#0093D0] hover:text-[#007bb3] transition-colors flex items-center gap-1"
                    >
                      <span>×</span> Clear filter
                    </a>
                  )}
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <select
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0093D0] shadow-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="name-asc">Name, A to Z</option>
                  <option value="name-desc">Name, Z to A</option>
                  <option value="price-asc">Price, low to high</option>
                  <option value="price-desc">Price, high to low</option>
                </select>
                <div className="text-gray-600">
                  Showing {showing.from}-{showing.to} of {showing.total} products
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex gap-2 items-center">
                  {currentPage > 1 && (
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 transition-colors shadow-sm"
                    >
                      Previous
                    </button>
                  )}
                  
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-md ${
                        page === currentPage ? "bg-[#0093D0] text-white" : "bg-white text-gray-700 hover:bg-gray-50"
                      } border border-gray-300 transition-colors shadow-sm`}
                    >
                      {page}
                    </button>
                  ))}

                  {currentPage < totalPages && (
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 transition-colors shadow-sm"
                    >
                      Next
                    </button>
                  )}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
