import { FlaskConical as Flask, Verified, Truck } from "lucide-react";
import type { HttpTypes } from "@medusajs/types";
import Image from "next/image";

interface FeatureSectionProps {
  product: HttpTypes.StoreProduct;
}

const GradientClipPath: React.FC<{ position: "top-left" | "bottom-right" }> = ({ position }) => {
  return (
    <div
      className={`absolute ${
        position === "top-left" ? "top-0 left-0" : "bottom-0 right-0"
      } aspect-[1155/678] w-[40rem] sm:w-[50rem] bg-gradient-to-tr from-[#00BFFF] to-[#1E90FF] opacity-40 z-0`}
      style={{
        clipPath:
          "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"
      }}
    ></div>
  );
};

export default function FeatureSection({ product }: FeatureSectionProps) {
  return (
    <div className="w-full min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Clip Paths (Behind Everything) */}
      <GradientClipPath position="top-left" />
      <GradientClipPath position="bottom-right" />

      {/* Full-Screen Blur Layer (Above Clip Paths) */}
      <div className="absolute inset-0 w-full h-full backdrop-blur-xl bg-white/40 z-5"></div>

      {/* Content Section (Above Everything) */}
      <div className="max-w-7xl mx-auto space-y-8 relative z-10 py-16 px-6">
        {/* Heading Section */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
            Why Power Peptides is the best place to buy {product.title}
          </h2>
          <p className="max-w-4xl mx-auto text-gray-600 text-xl">
            Power Peptides™ is more than just a trusted U.S. supplier of research peptides. We are a catalyst for
            scientific advancement, dedicated to providing the highest quality peptides that empower our clients to push
            the boundaries.
          </p>
        </div>

        {/* Features Grid - Increased Width */}
        <div className="grid md:grid-cols-3 gap-8 px-6">
          {/* Feature 1 */}
          <div className="w-full bg-white rounded-lg shadow-lg p-8 relative">
            <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-5">
              <Flask className="w-7 h-7 text-gray-900" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Unparalleled Quality</h3>
            <p className="text-gray-600 text-lg">
              Our proprietary processes and meticulous sourcing of premium materials ensure that every peptide we offer
              meets the most stringent standards.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="w-full bg-white rounded-lg shadow-lg p-8 relative">
            <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-5">
              <Verified className="w-7 h-7 text-gray-900" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Independently Verified</h3>
            <p className="text-gray-600 text-lg">
              Every product undergoes extensive testing, both in-house and through independent, third-party
              laboratories.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="w-full bg-white rounded-lg shadow-lg p-8 relative">
            <div className="bg-blue-50 w-14 h-14 rounded-xl flex items-center justify-center mb-5">
              <Image src="/delivery.png" alt="picture" width={30} height={30}/> 
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Fast Shipping & Support</h3>
            <p className="text-gray-600 text-lg">
              We provide fast and reliable shipping, using the best couriers and high-quality packaging materials to
              ensure that your peptides arrive promptly and in optimal condition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
