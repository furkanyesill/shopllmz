export default function ProPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-xl border border-blue-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            ShopLLMZ Pro&apos;ya Geçin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            AEO Şampiyonu olmak için tüm özellikleri açın.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="text-center pb-4 text-5xl font-black text-blue-600">
              $49<span className="text-2xl text-gray-500 font-medium">/ay</span>
            </div>
            <ul className="text-sm text-gray-700 space-y-3 pb-8">
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Sınırsız Yapay Zeka Taraması</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> Otomatik JSON-LD Enjeksiyonu</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> llms.txt Mağaza Uyumluluğu</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> 7 Gün Ücretsiz Deneme</li>
            </ul>
          </div>

          <div>
            <form action="/api/billing" method="GET">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md"
              >
                Planı Başlat (Shopify ile)
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
