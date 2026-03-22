/* eslint-disable react/no-unescaped-entities */
export default function TermsPage() {
  return (
    <main className="flex-1 max-w-4xl mx-auto w-full p-6 pt-32 text-zinc-300">
      <h1 className="text-4xl font-bold text-white mb-6">Kullanım Şartları</h1>
      <p className="mb-4 text-zinc-400">Son Güncelleme: 21 Mart 2026</p>
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">1. Kabul Edilme</h2>
          <p>ShopLLMZ ("Hizmet") uygulamasını kullanarak bu kullanım şartlarını kabul etmiş sayılırsınız. Hizmetimizi kullanan tüm birey ve tüzel kişiler bu metne tabidir.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">2. Hizmetin Sağlanması ve Sorumluluk Reddi</h2>
          <p>ShopLLMZ, Shopify AI görünürlüğünü artırmak için teknik öneriler sunan bir yazılımdır. Araç tarafından üretilen "llms.txt" ve "JSON-LD" şablonlarının arama motorlarında (ChatGPT, Perplexity vb.) kesin sonuç vereceğine dair garanti verilmez. Sitenizde yapacağınız tema değişikliklerinden ShopLLMZ sorumlu tutulamaz.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-white mb-3">3. Fiyatlandırma ve İadeler</h2>
          <p>Kullanıcılar "Pro" aboneliğe istedikleri zaman iptal edebilirler. Dijital bir ürün/hizmet olunduğu için geriye dönük para iadesi yapılmamaktadır.</p>
        </section>
      </div>
    </main>
  );
}
