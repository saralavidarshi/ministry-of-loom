export default function Footer() {
  return (
  
      <footer className="mt-8 border-t">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 text-sm text-gray-600 md:grid-cols-3">
          <div>
            <div className="text-xs font-semibold tracking-widest text-gray-900">
              BE THE FIRST TO KNOW
            </div>
            <div className="mt-3 flex gap-2">
              <input
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
                placeholder="Email address"
              />
              <button className="rounded-md bg-black px-4 py-2 text-xs font-semibold tracking-widest text-white hover:bg-gray-900">
                SUBSCRIBE
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold tracking-widest text-gray-900">
              CUSTOMER SERVICE
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>Contact Us</li>
              <li>Delivery</li>
              <li>Returns and Exchanges</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold tracking-widest text-gray-900">
              DISCOVER
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li>The Company</li>
              <li>Gift Vouchers</li>
              <li>Sale</li>
            </ul>
          </div>
        </div>

        <div className="bg-black py-4 text-center text-xs text-gray-300">
          © {new Date().getFullYear()} Ministry of Loom. All rights reserved.
        </div>
      </footer>
  );
}


