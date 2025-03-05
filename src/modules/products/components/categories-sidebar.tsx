"use client"

import { ChevronRight } from "lucide-react"

type CategoryProps = {
  categories: Array<{
    title: string
    subcategories: string[]
  }>
}

export default function CategoriesSidebar({ categories }: CategoryProps) {
  return (
    <div className="w-full md:w-1/4">
      <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
        {categories.map(({ title, subcategories }) => (
          <div key={title} className="mb-4">
            <button
              className="flex items-center w-full text-left text-lg font-semibold text-gray-800 hover:text-[#0093D0] transition-colors"
              onClick={() => {}}
            >
              <ChevronRight className="w-5 h-5" />
              <span className="ml-2">{title}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
