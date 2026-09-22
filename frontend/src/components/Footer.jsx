import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">

      <div className="max-w-7xl mx-auto px-6 py-12">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Logo / About */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Cart<span className="text-blue-500">Verse</span>
            </h2>

            <p className="text-gray-400 leading-7">
              Shop the latest products at the best prices.
              We provide quality products with fast delivery
              and secure payment.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Shop
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-white cursor-pointer">
                Electronics
              </li>

              <li className="hover:text-white cursor-pointer">
                Fashion
              </li>

              <li className="hover:text-white cursor-pointer">
                Footwear
              </li>

              <li className="hover:text-white cursor-pointer">
                Beauty
              </li>

              <li className="hover:text-white cursor-pointer">
                Jewellery
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Information
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-white cursor-pointer">
                About Us
              </li>

              <li className="hover:text-white cursor-pointer">
                Contact Us
              </li>

              <li className="hover:text-white cursor-pointer">
                Privacy Policy
              </li>

              <li className="hover:text-white cursor-pointer">
                Terms & Conditions
              </li>

              <li className="hover:text-white cursor-pointer">
                Return Policy
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Contact Us
            </h3>

            <div className="space-y-3 text-gray-400">
              <p>📍 India</p>
              <p>📞 +91 0000000000</p>
              <p>✉️ Demomail@cartverse.com</p>
            </div>

            <div className="mt-5">
              <h4 className="font-medium mb-3">
                Follow Us
              </h4>

              <div className="flex gap-4 text-gray-400">
                <span className="cursor-pointer hover:text-white">
                  Facebook
                </span>

                <span className="cursor-pointer hover:text-white">
                  Instagram
                </span>

                <span className="cursor-pointer hover:text-white">
                  YouTube
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">

        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3">

          <p className="text-sm text-gray-500">
            © 2026 CartVerse. All rights reserved.
          </p>

          <p className="text-sm text-gray-500">
            Made with ❤️ for better shopping
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;
