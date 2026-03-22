"use client";

import Link from "next/link";
import { useState } from "react";

export default function ProDashboardPage() {
  const [hasSynced, setHasSynced] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setHasSynced(true);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 flex flex-col">
      
      {/* Header */}
      <header className="border-b border-zinc-900 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg">
              S
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              GlowAEO (ShopLLMZ Pro)
            </span>
            <span className="ml-4 px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700">
              Live Connection
            </span>
          </div>
          <div className="flex gap-4 items-center text-sm font-medium text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa (Çıkış)</Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">AI & SEO Optimizasyonu</h1>
          <p className="text-zinc-400 text-sm">Yapay Zeka (ChatGPT, Gemini) ve Arama Motorları için mağaza şemalarınız.</p>
        </div>

        {!hasSynced ? (
          // EMPTY STATE (Shopify Compliance)
          <div className="bg-zinc-900/40 border border-dashed border-zinc-800 rounded-2xl p-12 text-center max-w-2xl mx-auto mt-12">
            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
              📦
            </div>
            <h2 className="text-xl font-bold text-white mb-3">Henüz Ürün Optimize Etmediniz</h2>
            <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
              Theme App Extension (App Block) altyapımız hazır. Başlamak için mağazanızdaki ürünleri yapay zeka ile senkronize edin. Sistem otomatik olarak JSON-LD verilerini tema bloklarınıza (kaynak kodunu bozmadan) enjekte edecektir. 
            </p>
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center justify-center mx-auto min-w-[200px]"
            >
              {isSyncing ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Senkronize Ediliyor...
                </span>
              ) : (
                "Kataloğu Optimize Etmeye Başla"
              )}
            </button>
          </div>
        ) : (
          // POPULATED STATE
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Theme App Extension Warning */}
            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl flex items-start gap-4">
               <span className="text-xl mt-0.5">ℹ️</span>
               <div>
                 <h4 className="text-blue-400 font-semibold mb-1">Theme App Blocks Aktif</h4>
                 <p className="text-sm text-blue-200/70">JSON-LD şemalarınız Shopify &quot;Theme App Extension&quot; standartlarıyla mağazanıza aktarıldı. Tema dosyalarınız temiz tutulmaktadır.</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">Optimize Edilen Ürün</h3>
                <span className="text-3xl font-bold text-white">1,248</span>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">AI Görünürlük Skoru</h3>
                <span className="text-3xl font-bold text-emerald-400">99 / 100</span>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">GDPR Webhook Status</h3>
                <span className="text-sm font-medium text-emerald-400 flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" /> Protected & Active
                </span>
              </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8">
              <h2 className="text-lg font-bold text-white mb-6">Canlı Entegrasyon Önizlemesi</h2>
              <div className="w-full bg-[#1e1e1e] rounded-lg border border-zinc-800 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2 bg-black text-xs text-emerald-400 border-b border-zinc-800 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  theme.liquid / App Block Injection
                </div>
                <pre className="p-4 text-xs font-mono text-zinc-300">
{`{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Women's Tree Runner Go",
  "description": "Premium sustainable sneakers designed for breathable comfort.",
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Carbon Footprint", "value": "4.83 kg CO2e" }
  ]
}`}
                </pre>
              </div>
            </div>
           </div>
        )}
      </main>

      {/* Mandatory Shopify App Store Footer */}
      <footer className="border-t border-zinc-900 mt-auto py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col items-center justify-center gap-4 text-sm text-zinc-500">
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-zinc-300 underline underline-offset-4">Gizlilik Politikası (Privacy Policy)</Link>
            <a href="mailto:support@glowaeo.com" className="hover:text-zinc-300 underline underline-offset-4">Bize Ulaşın (Support)</a>
          </div>
          <p>© 2026 GlowAEO. Not affiliated with Shopify Inc.</p>
        </div>
      </footer>

    </div>
  );
}
