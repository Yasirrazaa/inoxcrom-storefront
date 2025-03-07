"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, ChevronRight, Filter, X, Loader2 } from "lucide-react"
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
  const [isLoading, setIsLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const itemsPerPage = 12
  const loadMoreRef = useRef(null)

  // Process products (filter, sort, paginate)
  const processedData = useMemo(() => {
    // Filter products
    const filtered = products.filter(product => {
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

    // Sort products
    const sorted = [...filtered].sort((a, b) => {
      if (!a.title || !b.title) return 1;
      switch (sortBy) {
        case "name-asc": return a.title.localeCompare(b.title);
        case "name-desc": return b.title.localeCompare(a.title);
        case "price-asc":
          return (a.variants?.[0]?.prices?.[0]?.amount ?? 0) - (b.variants?.[0]?.prices?.[0]?.amount ?? 0);
        case "price-desc":
          return (b.variants?.[0]?.prices?.[0]?.amount ?? 0) - (a.variants?.[0]?.prices?.[0]?.amount ?? 0);
        default: return 0;
      }
    });

    const total = sorted.length;
    const pages = Math.ceil(total / itemsPerPage);
    const lastIndex = isMobile ? currentPage * itemsPerPage : currentPage * itemsPerPage;
    const firstIndex = isMobile ? 0 : (currentPage - 1) * itemsPerPage;
    const current = isMobile
      ? sorted.slice(0, lastIndex)
      : sorted.slice(firstIndex, lastIndex);

    return {
      processedProducts: sorted,
      totalPages: pages,
      currentProducts: current,
      showing: {
        from: total === 0 ? 0 : (isMobile ? 1 : firstIndex + 1),
        to: Math.min(lastIndex, total),
        total: total,
      }
    };
  }, [products, searchQuery, sortBy, currentPage, itemsPerPage, isMobile]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Infinite scroll for mobile
  useEffect(() => {
    if (!isMobile) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading && currentPage < processedData.totalPages) {
          setIsLoading(true)
          setTimeout(() => {
            setCurrentPage((prev) => prev + 1)
            setIsLoading(false)
          }, 500)
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current)
    }

    return () => observer.disconnect()
  }, [isMobile, isLoading, currentPage, processedData.totalPages])

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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 3

    if (processedData.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= processedData.totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      if (currentPage <= 2) {
        pageNumbers.push(1, 2, 3)
      } else if (currentPage >= processedData.totalPages - 1) {
        pageNumbers.push(processedData.totalPages - 2, processedData.totalPages - 1, processedData.totalPages)
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
            className="md:hidden flex items-center gap-2 text-gray-700 font-medium mb-4 bg-white rounded-lg px-4 py-2.5 shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            {isFilterOpen ? (
              <>
                <X size={20} />
                <span>Close Filters</span>
              </>
            ) : (
              <>
                <Filter size={20} />
                <span>Show Filters</span>
              </>
            )}
          </button>

          {/* Sidebar */}
          <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block w-full md:w-1/4 transition-all duration-300`}>
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-4 border border-gray-200">
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
                  <div className="relative">
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0093D0] focus:border-[#0093D0] shadow-sm text-base transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-semibold">
                    {searchParams.get('filter') ? searchParams.get('filter')!.replace(/-/g, ' ') : "All Products"}
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
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="relative w-full sm:w-auto">
                  <select
                    className="w-full sm:w-auto appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-[#0093D0] focus:border-[#0093D0] shadow-sm text-base cursor-pointer hover:bg-gray-50 transition-colors"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="relevance">Sort by: Relevance</option>
                    <option value="name-asc">Sort by: Name, A to Z</option>
                    <option value="name-desc">Sort by: Name, Z to A</option>
                    <option value="price-asc">Sort by: Price, Low to High</option>
                    <option value="price-desc">Sort by: Price, High to Low</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <ChevronDown size={20} />
                  </div>
                </div>
                <div className="text-sm text-gray-600 bg-white px-4 py-2.5 rounded-lg border border-gray-200 shadow-sm w-full sm:w-auto text-center sm:text-left">
                  Showing {processedData.showing.from}-{processedData.showing.to} of {processedData.showing.total} products
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {processedData.currentProducts.map((product) => (
                <ProductCard 
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            {/* Infinite Scroll Loading or Pagination */}
            {isMobile ? (
              <div ref={loadMoreRef} className="mt-8 flex justify-center">
                {isLoading && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading more products...</span>
                  </div>
                )}
              </div>
            ) : (
              processedData.totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <nav className="hidden md:flex gap-2 items-center">
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
      
                    {currentPage < processedData.totalPages && (
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-4 py-2 rounded-md bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 transition-colors shadow-sm"
                      >
                        Next
                      </button>
                    )}
                  </nav>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
