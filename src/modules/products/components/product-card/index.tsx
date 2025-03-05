import Link from "next/link"

type ProductCardProps = {
  id: string
  title: string
  thumbnail: string
  price: number
  colors?: string[]
}

export default function ProductCard({ id, title, thumbnail, price, colors }: ProductCardProps) {
  return (
    <div className="group bg-white shadow-md rounded-lg overflow-hidden p-4 flex flex-col items-center w-full transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/products/${id}`} className="w-full">
        <div className="w-full aspect-square flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={thumbnail || "/placeholder.svg"}
            alt={title}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <h3 className="mt-3 text-center text-sm text-gray-700 font-medium line-clamp-2">{title}</h3>
        <p className="mt-2 text-center text-sm font-semibold text-[#0093D0]">€{price.toFixed(2)}</p>
        {colors && (
          <div className="mt-2 flex justify-center gap-2">
            {colors.map((color) => (
              <div
                key={color}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </Link>
    </div>
  )
}
