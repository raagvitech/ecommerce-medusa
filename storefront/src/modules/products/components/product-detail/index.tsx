"use client"
import React from 'react';
import { Check } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '../../../components/ui/dialog';

const ProductDetails = ({ product }) => {
  const data = product?.metadata?.table ? 
    (typeof product.metadata.table === 'string' ? 
      JSON.parse(product.metadata.table) : 
      product.metadata.table
    ) : {};

  const hasContent = {
    characteristics: data?.characteristics?.length > 0,
    workingMechanism: !!data?.workingMechanism,
    benefits: data?.benefits?.length > 0,
    sideEffects: data?.sideEffects?.length > 0,
    summary: !!data?.summary,
    certificates: data?.certificates?.length > 0,
    references: data?.references?.length > 0
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Sections in the desired order
  const sections = [
    { id: 'characteristics', label: 'Characteristics', visible: hasContent.characteristics },
    { id: 'mechanism', label: `How does ${product.title} work?`, visible: hasContent.workingMechanism },
    { id: 'benefits', label: 'Benefits', visible: hasContent.benefits },
    { id: 'side-effects', label: 'Side Effects', visible: hasContent.sideEffects },
    { id: 'summary', label: 'Summary', visible: hasContent.summary },
    { id: 'coa', label: 'Certificate of Analysis (COA)', visible: hasContent.certificates },
    { id: 'references', label: 'References', visible: hasContent.references }
  ].filter(section => section.visible);

  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  return (
    <div className="content-container my-16">
      {/* Desktop Navigation */}
      {sections.length > 0 && (
  <nav className="hidden lg:block border-b mb-8">
    <ul className="flex gap-16 text-md text-gray-900">
      {sections.map(({ id, label }) => (
        <li key={id}>
          <button
            onClick={() => scrollToSection(id)}
            className="py-2 relative group"
          >
            <span className="text-gray-900 group-hover:text-gray-900 transition-colors">
              {label}
            </span>
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#008080] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </button>
        </li>
      ))}
    </ul>
  </nav>
)}

      {/* Characteristics */}
      {hasContent.characteristics && (
  <section id="characteristics" className="mb-16">
    <div className="flex flex-col lg:flex-row lg:justify-between">
      <div className="w-full lg:w-1/6 mb-6 lg:mb-0">
        <h2 className="text-2xl leading-[1.15] font-semibold">Characteristics</h2>
      </div>
      <div className="w-full lg:w-8/12">
        <div className="overflow-hidden">
          {data.characteristics.map((char: { 
            label: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; 
            value: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; 
          }, index: number) => (
            <div key={index} className={`flex ${index % 2 === 1 ? 'bg-[#F4F4F5] rounded-lg' : 'bg-white'}`}>
              <div className="w-1/3 py-3 px-4">
                <div className="text-md leading-[1.2] text-gray-700">{char.label}</div>
              </div>
              <div className="w-2/3 py-3 px-4">
                <div className="text-md leading-[1.2] text-gray-700">{char.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)}

      {/* Working Mechanism */}
      {hasContent.workingMechanism && (
  <section id="mechanism" className="mb-16">
    <div className="flex flex-col lg:flex-row lg:justify-between">
      <div className="w-full lg:w-1/6 mb-6 lg:mb-0">
        <h2 className="text-2xl leading-[1.15] font-semibold">How does {product.title} work?</h2>
      </div>
      <div className="w-full lg:w-8/12">
        <p className="text-md leading-[1.5] text-gray-600">
          {data.workingMechanism}
        </p>
      </div>
    </div>
  </section>
)}

      {/* Benefits */}
      {hasContent.benefits && (
  <section id="benefits" className="mb-16">
    <div className="flex flex-col lg:flex-row lg:justify-between">
      <div className="w-full lg:w-1/6 mb-6 lg:mb-0">
        <h2 className="text-2xl leading-[1.15] font-semibold">Benefits</h2>
      </div>
      <div className="w-full lg:w-8/12">
        <ul className="space-y-6">
          {data.benefits.map((benefit: { 
            description: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; 
          }, index: React.Key | null | undefined) => (
            <li key={index} className="flex gap-3">
              <Check className="w-4 h-4 text-[#008080] flex-shrink-0 mt-2" />
              <span className="text-md leading-[1.2] text-gray-700">
                {benefit.description}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
)}

      {/* Side Effects */}
      {hasContent.sideEffects && (
  <section id="side-effects" className="mb-16">
    <div className="flex flex-col lg:flex-row lg:justify-between">
      <div className="w-full lg:w-1/6 mb-6 lg:mb-0">
        <h2 className="text-2xl leading-[1.15] font-semibold">Side Effects</h2>
      </div>
      <div className="w-full lg:w-8/12">
        <ul className="space-y-6">
          {data.sideEffects.map((effect: { 
            description: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; 
          }, index: React.Key | null | undefined) => (
            <li key={index} className="flex gap-3">
              <Check className="w-4 h-4 text-[#008080] flex-shrink-0 mt-2" />
              <span className="text-md leading-[1.2] text-gray-700">
                {effect.description}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
)}
      {/* Summary */}
      {hasContent.summary && (
  <section id="summary" className="mb-16">
    <div className="flex flex-col lg:flex-row lg:justify-between">
      <div className="w-full lg:w-1/6 mb-6 lg:mb-0">
        <h2 className="text-2xl leading-[1.15] font-semibold">Summary</h2>
      </div>
      <div className="w-full lg:w-8/12">
        <p className="text-md leading-[1.6] text-gray-700">{data.summary}</p>
      </div>
    </div>
  </section>
)}

      {/* Certificate of Analysis */}
      {hasContent.certificates && (
  <section id="coa" className="mb-16">
    <div className="flex flex-col lg:flex-row lg:justify-between">
      <div className="w-full lg:w-1/6 mb-6 lg:mb-0">
        <h2 className="text-2xl leading-[1.15] font-semibold">Certificate of Analysis (COA)</h2>
      </div>
      <div className="w-full lg:w-8/12">
        <div className="grid grid-cols-1 gap-6">
          {data.certificates.map((cert: { 
            url: string | undefined; 
            title: string | undefined; 
            uploadDate: string | number | Date; 
          }, index: React.Key | null | undefined) => (
            <Dialog key={index}>
              <DialogTrigger>
                <div className="cursor-pointer hover:opacity-90 transition-colors flex justify-start">
                  <img
                    src={cert.url}
                    alt={cert.title}
                    className="w-full h-64 object-contain rounded-lg object-left"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-2xl w-full p-6">
                <div className="w-full bg-white flex items-center justify-center">
                  <img
                    src={cert.url}
                    alt={cert.title}
                    className="w-full object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </div>
    </div>
  </section>
)}

      {/* References */}
      {hasContent.references && (
  <section id="references" className="mb-16">
    <div className="flex flex-col lg:flex-row lg:justify-between">
      <div className="w-full lg:w-1/6 mb-6 lg:mb-0">
        <h2 className="text-2xl leading-[1.15] font-semibold">References</h2>
      </div>
      <div className="w-full lg:w-8/12">
        <div className="space-y-6">
          {data.references.map((ref: { 
            link: string | undefined; 
            text: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; 
          }, index: React.Key | null | undefined) => (
            <div key={index} className="flex gap-3">
              <Check className="w-4 h-4 text-[#008080] flex-shrink-0 mt-2" />
              <div>
                <a
                  href={ref.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-md leading-[1.5] text-[#008080] hover:text-[#236b76]"
                >
                  {ref.text}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
)}
    </div>
  );
};

export default ProductDetails;