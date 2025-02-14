import type React from "react"
import { Suspense } from "react"
import type { HttpTypes } from "@medusajs/types"
import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import { Verified, Zap } from "lucide-react"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import ProductActionsWrapper from "./product-actions-wrapper"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import FeatureSection from "../templates/features"
import { BeakerIcon, TruckIcon, ShieldCheckIcon } from "lucide-react"
import ProductDetails from "@modules/products/components/product-detail"
import Image from "next/image"
import ProductDescription from "../components/product-description"
import ShippingTimeDisplay from "./ShippingTimeDisplay"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      {/* Breadcrumb / Collection Link */}
      <div className="mt-4 ml-12">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-medium text-ui-fg-muted hover:text-ui-fg-subtle"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
      </div>

      {/* Product Content */}
      <div className="content-container py-6 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Image and Badges */}
          <div className="relative">
            <div className="relative bg-white rounded-lg">
              <ImageGallery
                images={product?.images?.length ? [product.images[0]] : []}
                product={product}
                className="w-full max-w-[900px] mx-auto object-contain"
              />

              {/* Molecular Info */}
              <div className="my-6 flex flex-col rounded-3xl bg-[#0033660A] px-6 py-5">
                <div className="gap-x-3 gap-y-3">
                  <p className="text-sm text-gray-600 mt-2">
                    Product Care: This apparel is designed for fashion and
                    everyday wear. To maintain its quality, follow proper
                    washing and care instructions. Avoid excessive exposure to
                    heat, chemicals, and rough surfaces. This product is not
                    meant for extreme conditions or heavy-duty usage. Always
                    check the label for specific care guidelines.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Info & Description */}
          <div className="flex flex-col gap-4">
            <ProductInfo product={product} />
            <ProductDescription product={product} />
            <div className="max-w-[450px] relative">
              <ProductActionsWrapper id={product.id} region={region} />
            </div>

            {/* Shipping Information */}
            <div className="flex flex-col gap-y-3 py-4 border-t">
              <div className="flex items-center">
                <Zap />
                <ShippingTimeDisplay />
              </div>
              <div className="flex items-center">
                <Image src="/delivery.png" alt="logo" height={8} width={25} />
                <span className="text-ui-fg-base text-base ml-2">
                  Free FedEx next-day delivery within the US on orders over
                  €200, with a tracking number provided.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Sections */}
      <ProductDetails product={product} />
      {/* <FeatureSection product={product} /> */}

      {/* Related Products */}
      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
