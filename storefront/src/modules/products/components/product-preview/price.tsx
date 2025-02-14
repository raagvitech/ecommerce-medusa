import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  if (!price) {
    return null
  }

  return (
    <div className="text-2xl font-bold text-gray-700">
      {price.price_type === "sale" && (
        <Text
          className="line-through text-gray-500 text-base" 
          data-testid="original-price"
        >
          {price.original_price}
        </Text>
      )}
      <Text
        className={clx("text-gray-700 text-lg font-semibold", {
          "text-red-600": price.price_type === "sale", // Highlight discount price
        })}
        data-testid="price"
      >
        {price.calculated_price}
      </Text>
    </div>
  )
}
