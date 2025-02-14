import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import ProductPrice from "@modules/products/components/product-price"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  console.log(product.description);  // Add this line to check if description has data

  return (
    <div id="product-info" className="w-full">
      <div className="flex flex-col gap-y-2 lg:max-w-[1000px] w-full mx-auto">
        <Heading
          level="h2"
          className="mb-6 text-2xl font-semibold tracking-tight"
          data-testid="product-title"
        >
          {product.title}
        </Heading>
        <ProductPrice product={product} />
        <Text
          className="text-base text-ui-fg-subtle w-full mt-2"
          data-testid="product-description"
          style={{ maxWidth: "100%", width: "100%" }}
        >
          {product.description || 'No description available'} {/* Fallback text */}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
