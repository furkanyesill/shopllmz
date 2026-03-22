/* eslint-disable react/no-unescaped-entities */
export default function PrivacyPage() {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full p-6 pt-32 text-zinc-300">
      <h1 className="text-4xl font-bold text-white mb-6">Gizlilik Politikası</h1>
      <p className="mb-4 text-zinc-400">Son Güncelleme: 21 Mart 2026</p>
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">1. Toplanan Veriler</h2>
          <p>ShopLLMZ, hizmetin doğası gereği yalnızca analiz edilen public Shopify mağaza URL'lerini (Örn: https://magaza.myshopify.com) işler. Uygulama, ziyaretçilerin kişisel verilerini (KVKK bağlamında PII) toplamaz, saklamaz veya satmaz.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">2. Çerezler (Cookies) ve Analitik</h2>
          <p>Uygulama istatistiklerini izlemek amacıyla üçüncü taraf analitik servisleri (örn. PostHog veya Google Analytics) kullanılabilir. Bu servislerin kendi çerez politikaları geçerlidir.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">3. İletişim</h2>
          <p>Sorularınız için bizimle iletişime geçin: <a href="mailto:support@shopllmz.com" className="text-blue-400 hover:text-blue-300">support@shopllmz.com</a></p>
        </section>
      </div>
    </main>
  );
}
