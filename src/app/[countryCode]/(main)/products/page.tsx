
import ProductCard from "../../../../modules/products/components/product-card"
import { listProducts } from "../../../../lib/data/products"
import CategoriesSidebar from "../../../../modules/products/components/categories-sidebar"

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
  const data = await listProducts({});
  console.log('Product page data:', data);
  const { response } = data;

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <CategoriesSidebar categories={categories} />

          {/* Main Content */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">All Products</h1>

            {/* Debug Info */}
            <div className="mb-4 p-4 bg-yellow-100 rounded">
              <h2 className="font-bold mb-2">Debug Information:</h2>
              <div>
                <p>Product Count: {response.products.length}</p>
                <p>First Product: {response.products[0]?.title || 'No products found'}</p>
                <p>Total Count: {response.count}</p>
                {response.products.length > 0 && (
                  <div className="mt-2">
                    <p>First Product Details:</p>
                    <pre className="whitespace-pre-wrap text-xs mt-1">
                      {JSON.stringify(response.products[0], null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {response.products.map((product) => {
                const variant = product.variants?.[0];
                const price = variant ? Number(variant.calculated_price || 0)  : 0;
                
                return (
                  <ProductCard 
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    thumbnail={product.thumbnail || ""}
                    price={price}
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
