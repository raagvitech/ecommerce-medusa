import React from 'react';
import { Mail } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
  const productCategories = [
    { name: 'Gents', href: '#' },
    { name: 'Ladies', href: '#' },
    { name: 'Kids', href: '#' },
    { name: 'Gadgets', href: '#' },
  ];

  const supportLinks = [
    { name: 'Contact Us', href: '/contact' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/why-us' }
  ];

  const policyLinks = [
    { name: 'Terms & Conditions', href: '/terms-and-conditions' }
  ];

  return (
    <footer className="bg-[#002B54] text-white">
      <div className="max-w-[1440px] mx-auto px-4 py-12">
        <div className="hidden md:grid md:grid-cols-6 gap-8 mb-16">
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <p className="mb-4">+1 (813)-803-1233</p>
            <div>
              <p>Email:</p>
              <p>help@medusaproducts.com</p>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              {productCategories.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-300 hover:text-white">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-300 hover:text-white">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Policies</h3>
            <ul className="space-y-2">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-gray-300 hover:text-white">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t-2 border-[#335576]">
          <div className="text-xs text-[#CCD5DD]">
            © 2024, Medusa store™. All Rights Reserved.<br />
            1034 E Brandon Blvd Suite 280, Brandon, FL 33511
          </div>
          <div className="flex gap-2 mt-2">
            <img 
              src="/payment_modes.png" 
              alt="Payment Methods" 
              className="h-10"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;