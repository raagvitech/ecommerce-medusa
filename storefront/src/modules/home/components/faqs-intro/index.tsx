"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import LocalizedClientLink from "@modules/common/components/localized-client-link";

const faqs = [
  {
    question: "What sets Power Peptides apart from other peptide suppliers?",
    answer: "At Power Peptides, we prioritize uncompromising quality, innovative approaches, and customer-centric solutions. Our proprietary process ensures over 99% purity and consistency. We collaborate with globally recognized manufacturers to offer premium quality at affordable prices."
  },
  {
    question: "How can I be assured of the superior quality of your products?",
    answer: "We meticulously craft our peptides to meet the most stringent requirements. Every peptide undergoes extensive in-house evaluation and third-party laboratory analysis using advanced techniques such as NMR, FTIR, Polarimetry, HPLC, and LC-MS analysis. Certificates for each peptide's testing results are available on our website."
  },
  {
    question: "Does Power Peptides ship internationally?",
    answer: "Yes, we accept orders from around the globe and strive to ensure successful delivery. However, when using a mail forwarding service, we cannot guarantee delivery to the forwarded address, as it is beyond our control."
  }
];

const FAQIntroduction = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-screen-2xl mx-auto px-6 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Column - Introduction */}
        <div className="lg:w-1/2 space-y-8 pl-8">
          <div className="space-y-6">
            <h1 className="text-3xl font-semibold text-gray-900">
              Frequently Asked Questions (FAQs)
            </h1>
            <p className="text-lg text-gray-600">
              Please visit our FAQ page before reaching out to our customer support. Our team regularly updates this resource to provide you with the most up-to-date and comprehensive information, saving you valuable time.
            </p>
          </div>

          <button className="w-full py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 text-center">
          <LocalizedClientLink href="/faq">
            Explore Our FAQs
          </LocalizedClientLink>
          </button>
        </div>

        {/* Right Column - FAQ List */}
        <div className="lg:w-1/2">
          <div className="space-y-0">
            {faqs.map((faq, index) => (
              <div key={index}>
                <button
                  className={`w-full flex items-start py-6 text-left ${index !== 0 ? 'border-t border-gray-200' : ''}`}
                  onClick={() => toggleFAQ(index)}
                >
                  <motion.div
                    animate={{ rotate: openIndex === index ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="mr-4 mt-1"
                  >
                    <Plus className="w-5 h-5 text-gray-400" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="text-lg text-gray-900">{faq.question}</h3>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="mt-4 text-gray-600">{faq.answer}</p>
                      </motion.div>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQIntroduction;