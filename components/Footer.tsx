import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter, FiMail } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-indigo-deep text-parchment mt-auto animate-fade-in">
      {/* Decorative Border */}
      <div className="h-1 bg-gradient-to-r from-terracotta-deep via-metal-gold to-indigo-deep" />

      {/* Newsletter Section */}
      <div className="bg-indigo-deep py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-cormorant font-semibold mb-3 text-metal-gold">
              Join Our Artisan Community
            </h3>
            <p className="text-parchment/80 mb-6 font-hind">
              Subscribe to receive updates on new arrivals, exclusive offers, and stories from our artisans.
            </p>
            <form className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-indigo-deep/20 border border-metal-gold/30 text-parchment placeholder:text-parchment/60 focus:outline-none focus:border-metal-gold focus:ring-2 focus:ring-metal-gold/20"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="btn-primary bg-metal-gold text-indigo-deep hover:bg-metal-gold/90 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h4 className="text-xl font-cormorant font-semibold mb-4 text-metal-gold">
              SRIJAN
            </h4>
            <p className="text-parchment/80 text-sm mb-4 font-hind">
              From India's roots — handcrafted with love. We celebrate the rich heritage of Indian 
              craftsmanship by connecting artisans directly with conscious consumers.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-parchment/10 hover:bg-metal-gold/30 flex items-center justify-center transition-colors focus-visible-ring"
                aria-label="Facebook"
              >
                <FiFacebook className="w-5 h-5 text-parchment" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-parchment/10 hover:bg-metal-gold/30 flex items-center justify-center transition-colors focus-visible-ring"
                aria-label="Instagram"
              >
                <FiInstagram className="w-5 h-5 text-parchment" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-parchment/10 hover:bg-metal-gold/30 flex items-center justify-center transition-colors focus-visible-ring"
                aria-label="Twitter"
              >
                <FiTwitter className="w-5 h-5 text-parchment" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-lg font-cormorant font-semibold mb-4 text-metal-gold">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="text-parchment/80 hover:text-metal-gold transition-colors font-hind">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/category/handicrafts" className="text-parchment/80 hover:text-metal-gold transition-colors font-hind">
                  Handicrafts
                </Link>
              </li>
              <li>
                <Link href="/category/clothing" className="text-parchment/80 hover:text-metal-gold transition-colors font-hind">
                  Clothing
                </Link>
              </li>
              <li>
                <Link href="/category/jewelry" className="text-parchment/80 hover:text-metal-gold transition-colors font-hind">
                  Jewelry
                </Link>
              </li>
              <li>
                <Link href="/products?tags=new-arrival" className="text-parchment/80 hover:text-metal-gold transition-colors font-hind">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products?tags=bestseller" className="text-parchment/80 hover:text-metal-gold transition-colors font-hind">
                  Bestsellers
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className="text-lg font-cormorant font-semibold mb-4 text-metal-gold">About</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-parchment/80 hover:text-metal-gold transition-colors font-hind">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/artisans" className="text-parchment/80 hover:text-metal-gold transition-colors font-hind">
                  Meet Our Artisans
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-parchment/80 hover:text-metal-gold transition-colors font-hind">
                  Sustainability
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-parchment/80 hover:text-metal-gold transition-colors font-hind">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-parchment/80 hover:text-metal-gold transition-colors font-hind">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-cormorant font-semibold mb-4 text-metal-gold">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shipping" className="text-parchment/80 hover:text-metal-gold transition-colors font-hind">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-parchment/80 hover:text-metal-gold transition-colors font-hind">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-parchment/80 hover:text-metal-gold transition-colors font-hind">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-parchment/80 hover:text-metal-gold transition-colors font-hind">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-parchment/80 hover:text-metal-gold transition-colors font-hind">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-parchment/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-parchment/60">
            <p className="font-hind">
              © {currentYear} SRIJAN. Handcrafted with ❤️ in India. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="font-hind">Payment Methods:</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-parchment/10 rounded text-xs font-hind">Visa</span>
                <span className="px-2 py-1 bg-parchment/10 rounded text-xs font-hind">Mastercard</span>
                <span className="px-2 py-1 bg-parchment/10 rounded text-xs font-hind">UPI</span>
                <span className="px-2 py-1 bg-parchment/10 rounded text-xs font-hind">Paytm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

