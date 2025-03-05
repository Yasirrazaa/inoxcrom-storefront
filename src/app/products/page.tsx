import ProductCard from "../../modules/products/components/product-card"
import { listProducts } from "../../lib/data/products"
import CategoriesSidebar from "../../modules/products/components/categories-sidebar"

const categories = [
  {
    title: "WRITING TYPE",
    subcategories: ["Fountain pens", "Ballpoint pens", "Mechanical pencils", "Rollerball pens", "Sets"],
  },
  {
    title: "REFILLS",
    subcategories: ["Fountain pen refills", "Ball pen refills", "Pencil refills", "Roller refills"],
  },
  {
    title: "RANGE",
    subcategories: ["Office", "Casual", "Premium"],
  },
  {
    title: "MODELS",
    subcategories: [
      "Ictineo",
      "Arc",
      "Vista",
      "Round",
      "Best",
      "Prime",
      "Canvas",
      "Touch",
      "Inox70",
      "Slim",
      "Soul",
      "Spin",
      "Vera",
      "Wave",
      "Rocker",
    ],
  },
  {
    title: "COLLECTIONS",
    subcategories: [
      "Ictineo",
      "Arcade",
      "Arts",
      "Books",
      "Best is Back",
      "Carbone",
      "Etnia",
      "Fantasy",
      "History",
      "Inox",
      "Maya",
      "Royale",
      "Spices",
      "Vintage",
    ],
  },
]

export default async function CatalogPage() {
  const { response } = await listProducts({})

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <CategoriesSidebar categories={categories} />

          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">All Products</h1>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {response.products.map((product) => {
                const variant = product.variants?.[0];
                const price = variant ? Number(variant.calculated_price || 0) : 0;
                const colors = product.options?.map((o: any) => o.value ?? "") ?? [];
                
                return (
                  <ProductCard 
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    thumbnail={product.thumbnail || ""}
                    price={price}
                    colors={colors}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
