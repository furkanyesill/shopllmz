import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans bg-[url('https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png')] bg-cover bg-center">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md" />
      
      <div className="relative z-10 w-full max-w-md bg-zinc-900/80 border border-zinc-800 p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Store Login</h1>
          <p className="text-zinc-400 text-sm">
            Login panel for stores testing or subscribing to the app via Shopify.
          </p>
        </div>

        <form action="/api/auth" method="GET" className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Shopify Mağaza URL&apos;niz</label>
            <div className="relative">
              <input 
                type="text" 
                name="shop" 
                placeholder="magazaniz.myshopify.com" 
                className="w-full bg-zinc-950/50 border border-zinc-700 text-white px-4 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                required
              />
            </div>
            <p className="text-xs text-zinc-500 mt-2">e.g. starducks.myshopify.com</p>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-4 rounded-xl transition-colors shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
            Continue &rarr;
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-sm text-zinc-500">
            Don't have an account?{' '}
            <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
              View App Details
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
