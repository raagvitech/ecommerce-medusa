"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "What sets Power Peptides apart from other peptide suppliers?",
    answer:
      "Power Peptides stands at the forefront of peptide research and development through our commitment to exceptional quality and scientific innovation. Our advanced proprietary processes deliver industry-leading purity and consistency. Through strategic partnerships with internationally recognized research chemical manufacturers, we provide premium-grade products while maintaining competitive pricing.",
  },
  {
    question: "How do I know Power Peptides' products are of the highest quality?",
    answer:
      "Our peptides are manufactured under rigorous quality control protocols that exceed industry standards. Each product undergoes comprehensive analytical characterization through both in-house and independent third-party laboratories, utilizing state-of-the-art techniques including NMR, FTIR, Polarimetry, HPLC, and LC-MS analysis. Complete certificates of analysis are readily accessible on our website for each product.",
  },
  {
    question: "What is Power Peptides' shipping policy?",
    answer:
      "We offer various shipping options, including FREE US ground shipping on orders over $200.00 (Grand Total), USPS Priority, FedEx 2 Day, FedEx Overnight, FedEx Overnight with Signature Required, and FedEx Saturday Delivery for orders placed on Fridays before 11am CST. Orders placed and processed before 11am CST Monday through Friday typically ship the same business day.",
  },
  {
    question: "Does Power Peptides ship internationally?",
    answer:
      "Yes, we accept orders from around the globe and strive to ensure successful delivery. Please refer to our Shipping Policy for all terms. When using a mail forwarding service, we cannot guarantee delivery to the forwarded address, as it is beyond our control.",
  },
  {
    question: "What is Power Peptides' return policy?",
    answer:
      "To maintain the integrity of our research-grade products and ensure compliance with quality control standards, we do not accept product returns. In the rare event of shipping damage, missing items, or incorrect product delivery, please submit documentation including photographic evidence to help@powerpeptides.com within 7 days of delivery for prompt resolution. Please see our Terms & Conditions prior to placing an order.",
  },
  {
    question: "How do I track my order from Power Peptides?",
    answer:
      "When you place your order, you'll receive an email with the tracking number once your order has shipped. We recommend registering an account during checkout for easy order tracking, updating account information, and accessing past orders.",
  },
  {
    question: "How do I store my peptides to maintain their quality and effectiveness?",
    answer:
      "Optimal storage conditions are essential for maintaining peptide integrity. Lyophilized (freeze-dried) peptides demonstrate enhanced stability and extended shelf life when stored in a cool, dry environment protected from direct light exposure. For reconstituted peptides, storage at 2-8°C away from light is required to maintain molecular stability.",
  },
  {
    question: "Can I use peptides for human consumption or personal use?",
    answer:
      "No, the peptides supplied by Power Peptides are strictly for research purposes only and are not intended for human consumption, diagnostic, therapeutic, or other personal uses. It is crucial to comply with local laws and regulations regarding the use of research chemicals.",
  },
  {
    question: "What is the purity of Power Peptides' products?",
    answer:
      "Our single molecule product purity standard is ≥98% by HPLC and many of our products test ≥99%. Some products are standardized to a specific purity or have a more nuanced definition involving multiple active components.",
  },
  {
    question: "What form do your peptides arrive in?",
    answer:
      "Our peptide vials are in lyophilized powder form. They are contained in glass crimp-top vials with flip-off caps.",
  },
  {
    question: "What is my product's shelf life?",
    answer:
      "Your product will have an expiry date shown on the label. This date pertains to the form that you have received it in.",
  },
  {
    question: "Do you sell X product?",
    answer:
      "Use our website's search feature in the main navbar menu to determine if we sell a product. Look for the magnifying glass icon. Please email help@powerpeptides.com if you are looking for a product we don't currently stock.",
  },
  {
    question: "What if I have a question that isn't addressed in the FAQs?",
    answer:
      "Our dedicated customer support team is here to help. If you have any questions or concerns not covered in the FAQs, please don't hesitate to contact us at help@powerpeptides.com. We value your feedback and respond to all inquiries promptly, usually within 4 hours.",
  },
];


export default function FAQPage() {
    const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  
    const toggleFAQ = (index: number) => {
      setOpenIndexes(prev => 
        prev.includes(index) 
          ? prev.filter(i => i !== index)
          : [...prev, index]
      );
    };
  
    return (
      <div className="w-full">
        {/* Breadcrumb */}
        <div className="w-full bg-white">
          <div className="max-w-screen-2xl mx-auto px-6 py-4">
            <div className="flex items-center text-sm">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <span className="mx-2 text-gray-400">{">"}</span>
              <span className="text-gray-900">Frequently Asked Questions (FAQs)</span>
            </div>
          </div>
        </div>
  
        {/* Hero Section */}
        <div className="w-full relative isolate bg-gradient-to-r from-blue-50 to-blue-200">
          <div className="max-w-screen-2xl mx-auto px-6 py-16">
            <div className="space-y-0 pl-8">
              <h1 className="text-[60px] font-bold text-gray-900 leading-none">
                Frequently Asked
              </h1>
              <h1 className="text-[60px] font-bold text-gray-900 leading-tight">
                Questions (FAQs)
              </h1>
            </div>
            <div className="space-y-1 mt-4 pl-8">
              <p className="text-lg text-gray-700">
                Need Help or Have a Quick Question? Review our frequently asked questions.
              </p>
              <p className="text-lg text-gray-700">
                This is the fastest way to solve most problems.
              </p>
            </div>
          </div>
        </div>
  
        {/* FAQ Section */}
        <div className="max-w-screen-2xl mx-auto p-6">
          <div className="space-y-4 pl-16 pt-4">
            {faqs.map((faq, index) => (
              <div key={index}>
                <button
                  className={`flex items-center w-full text-left text-lg font-semibold py-6 ${
                    index !== 0 ? 'border-t border-gray-300' : ''
                  }`}
                  onClick={() => toggleFAQ(index)}
                >
                  <motion.div
                    animate={{ rotate: openIndexes.includes(index) ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Plus className="w-6 h-6 text-gray-400" />
                  </motion.div>
                  <span className="ml-4">{faq.question}</span>
                </button>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: openIndexes.includes(index) ? "auto" : 0,
                    opacity: openIndexes.includes(index) ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 text-gray-700">{faq.answer}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }