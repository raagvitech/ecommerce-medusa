import React from "react";

type ProductDescriptionProps = {
  product: any;
};

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product }) => {
  // Parse richDescription if it's a string
  let richDescription = product.metadata?.richDescription;
  try {
    if (typeof richDescription === "string") {
      richDescription = JSON.parse(richDescription);
    }
  } catch (error) {
    console.error("Error parsing richDescription:", error);
  }

  if (!richDescription?.content) {
    return <p className="text-red-500">⚠ No product description available.</p>;
  }

  return (
    <div className="rounded-lg bg-[#F5F6F8] p-2 lg:p-4">
      <div
        className="text-[#52525B] text-sm space-y-2  [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:m-0 [&>li]:leading-6 lg:text-base"
        dangerouslySetInnerHTML={{ __html: richDescription.content }}
      />
    </div>
  );
};

export default ProductDescription;
