"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"
import AddToCartButton from "../AddToCartButtonOne"

interface ProductCardProps {
  name: string
  slug: string
  price: number
  salePrice?: number
  images: { url: string; altText: string }[]
  color: { hexCode: string }
  reviews?: { rating: number }[]
  stock: number
}

export default function ProductCard({
  name,
  price,
  salePrice,
  images,
  color,
  slug,
  reviews = [],
  stock,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const calculateAverageRating = () => {
    if (!reviews?.length) return 0
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
    return Number((sum / reviews.length).toFixed(1))
  }

  return (
    <div
      className="group relative rounded-lg overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden w-100">
        <Link href={`/products/${slug}`}>
          <Image
            src={images[0]?.url || "/placeholder.svg"}
            alt={images[0]?.altText || name}
            fill
            className="object-cover object-center transition-all duration-500 ease-out group-hover:scale-105"
          />
        </Link>
        {salePrice && (
          <span className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-full">
            Sale
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="pt-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-800 transition-colors group-hover:text-black w-48 overflow-hidden whitespace-nowrap truncate">
            <Link href={`/products/${slug}`}>{name}</Link>
          </h3>
          <div
            className="w-4 h-4 rounded-full border border-gray-200"
            style={{ backgroundColor: color.hexCode }}
            aria-label={`Color: ${color.hexCode}`}
          />
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3.5 h-3.5",
                i < Math.floor(calculateAverageRating())
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-200"
              )}
            />
          ))}
          {reviews.length > 0 && (
            <span className="text-xs text-gray-500 ml-1">({reviews.length})</span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium">
            {salePrice ? (
              <span className="flex items-center gap-2">
                <span className="line-through text-gray-400">${price.toFixed(2)}</span>
                <span className="text-red-600">${salePrice.toFixed(2)}</span>
              </span>
            ) : (
              <span className="text-gray-900">${price.toFixed(2)}</span>
            )}
          </p>
        </div>

        {/* Add to Cart Button */}
        <AddToCartButton productSlug={slug} stock={stock} />
      </div>
    </div>
  )
}
