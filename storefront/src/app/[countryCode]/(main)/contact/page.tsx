import React from "react";
import { Check } from "lucide-react"

const Contact = () => {
    return (
        <div className="content-container mb-24 px-3">
            <h1 className="mb-6 mt-8 text-4xl font-medium capitalize tracking-tight">Contact</h1>

            <h2 className="my-4 text-2xl font-medium leading-[2rem] tracking-tight">Get Answers Now</h2>
            <p className="mb-4 text-gray-600 text-base">
                Looking for a quick response to your inquiry? Save time by exploring our helpful resources:
            </p>
            <ul className="text-[#008080]">
            <div className="flex flex-row">
            <Check/>&nbsp;&nbsp;<a href="/FAQ">Frequently Asked Questions</a>
            </div>
            <br/>
            <div className="flex flex-row">
            <Check/>&nbsp;&nbsp;<a href="/shipping-and-returns">Shipping & Returns</a>
            </div>
            <br/>
            <div className="flex flex-row">
            <Check/>&nbsp;&nbsp;<a href="/terms-and-conditions">Terms and Conditions</a>
            </div>
            </ul>

            <h2 className="my-4 text-2xl font-medium leading-[2rem] tracking-tight">Contact Us</h2>
            <p className="mb-4 text-gray-600 text-base">
                To get in touch with us directly, simply email <a href="mailto:help@powerpeptides.com" className="text-[#008080]">help@powerpeptides.com</a> or reach out at +1 (813) 803-1233.
            </p>
            <p className="text-gray-600 text-base">
                We prioritize prompt, helpful responses to ensure your experience with Power Peptides™ is seamless and satisfactory. In most cases, we respond within 4 hours, but please allow up to 24 hours for us to process your request thoroughly.
            </p>
        </div>
    );
};

export default Contact;