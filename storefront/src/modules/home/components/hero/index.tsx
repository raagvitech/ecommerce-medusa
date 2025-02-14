"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import BannerOne from "../../../../../public/5309774.jpg";
import BannerTwo from "../../../../../public/7173417.jpg";
import BannerThree from "../../../../../public/8125396.jpg";
import BannerFour from "../../../../../public/image-spring-discount-sale-season-sale.jpg";

const images = [BannerOne, BannerTwo, BannerThree, BannerFour];

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Image Carousel */}
      <div className="relative w-full h-[600px] overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image 
              src={images[activeIndex]} 
              alt={`Banner ${activeIndex + 1}`} 
              layout="fill" 
              objectFit="cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Text Below Carousel */}
      <div className="w-full max-w-3xl text-center mt-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Our E-commerce Platform</h1>
        <p className="text-lg text-gray-600 mt-2">Discover amazing products and experiences</p>
        <div className="pt-4">
          <a
            className="font-bold bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
            href="/store"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
