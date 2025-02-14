'use client'
import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import Thumbnail from "../thumbnail"
import { useState } from "react"
import { AddToCartButton } from "./AddToCartButton" // Import the reusable button

export default function ProductStripPreview({ product, region }: ProductPreviewProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { cheapestPrice } = getProductPrice({ product })
  const defaultVariantId = product.variants?.[0]?.id || ""

  const handleAddToCart = async () => {
    if (!defaultVariantId || !region.country_code) return
    setIsAdding(true)
    try {
      await addToCart({
        variantId: defaultVariantId,
        quantity: 1,
        countryCode: region.country_code,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="w-[260px] h-[110px] bg-white rounded-lg border border-gray-200 shadow-md p-3 flex justify-between items-center">
      {/* Image Section */}
      <div className="w-16 h-16 flex items-center">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 px-2">
        <h3 className="text-sm font-semibold text-gray-900 truncate">{product.title}</h3>
        <p className="text-xs text-gray-500">{product.variants?.[0]?.title || ''}</p>
        {/* Price & Add Button in Same Line */}
        <div className="flex justify-between items-center">
          <span className="text-md font-semibold">{cheapestPrice?.calculated_price}</span>
          <AddToCartButton onClick={handleAddToCart} isAdding={isAdding} />
        </div>
      </div>
    </div>
  )
}
