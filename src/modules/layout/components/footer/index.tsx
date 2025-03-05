import Link from "next/link"
import { Facebook, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/au/terms-and-conditions" className="text-gray-600 hover:text-gray-900">
                  Terms and conditions
                </Link>
              </li>
              <li>
                <Link href="/au/cookies-policy" className="text-gray-600 hover:text-gray-900">
                  Cookies policy
                </Link>
              </li>
              <li>
                <Link href="/au/privacy-policy" className="text-gray-600 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact us</h3>
            <p className="text-gray-600">PensFromBCN, S.L.</p>
            <p className="text-gray-600">Pallars, 85, 6-4</p>
            <p className="text-gray-600">08018 · BARCELONA (Spain)</p>
            <p className="text-gray-600">+34 932 500 456</p>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 border border-gray-300 rounded"
              />
              <div className="flex items-start gap-2">
                <input type="checkbox" id="footer-privacy" className="mt-1" />
                <label htmlFor="footer-privacy" className="text-sm text-gray-600">
                  I agree to the terms and conditions and the privacy policy
                </label>
              </div>
              <button type="submit" className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-8">
          <a href="https://www.facebook.com/" className="text-gray-400 hover:text-gray-600">
            <Facebook size={24} />
          </a>
          <a href="https://twitter.com/" className="text-gray-400 hover:text-gray-600">
            <Twitter size={24} />
          </a>
          <a href="https://www.instagram.com/" className="text-gray-400 hover:text-gray-600">
            <Instagram size={24} />
          </a>
        </div>

        {/* Copyright and Logos */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">© Inoxcrom® 2021</p>
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logos-ocupacio-transformacio-orZtTLB42fDEyDvp1cpJ0Mzb9x6OFm.png"
            alt="Funding Partners"
            className="h-12 mx-auto"
          />
        </div>
      </div>
    </footer>
  )
}
