/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { getDictionary, Locale } from "@/dictionaries";

export default function DashboardPage() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "scanning" | "done">("idle");
  const [results, setResults] = useState<{ llmsTxt: string; jsonLd: string; score: number; scannedProducts?: string[] } | null>(null);
  
  const [lang, setLang] = useState<Locale>("en");
  
  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const langCookie = cookies.find((row) => row.startsWith("lang="));
    if (langCookie) {
      setTimeout(() => setLang(langCookie.split("=")[1] as Locale), 0);
    } else {
      if (navigator.language.startsWith("tr")) {
        setLang("tr");
      }
    }
  }, []);

  const t = getDictionary(lang);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setStatus("scanning");
    
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Bilinmeyen bir hata oluştu.");
      }

      setResults(data);
      setStatus("done");
    } catch (err: any) {
      alert("Hata: " + err.message);
      setStatus("idle");
    }
  };

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full p-6 pt-24 font-sans text-zinc-100">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-white">{t.dashboard.title}</h1>
        <p className="text-zinc-400">Shopify mağazanızı yapay zeka ajanlarına hazırlayın.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-white">Yeni Mağaza Tarama</h2>
            <form onSubmit={handleScan} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">{t.dashboard.urlLabel}</label>
                <input
                  type="url"
                  placeholder={t.dashboard.urlPlaceholder}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                  onInvalid={(e) => (e.target as HTMLInputElement).setCustomValidity(t.dashboard.errorEmpty)}
                  onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                />
              </div>
              <button
                type="submit"
                disabled={status === "scanning"}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center h-12"
              >
                {status === "scanning" ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    {t.dashboard.analyzing}
                  </span>
                ) : (
                  t.dashboard.analyzeBtn
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {status === "idle" && (
            <div className="h-full min-h-[400px] flex items-center justify-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30 p-12 text-center text-zinc-500 transition-all">
              <p>Sonuçları görmek için bir mağaza URL'si girip analiz başlatın.</p>
            </div>
          )}

          {status === "scanning" && (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border border-zinc-800 rounded-2xl bg-zinc-900/30 p-12 text-center text-zinc-400 transition-all">
              <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full bg-blue-400 animate-ping"></div>
                </div>
                <p>AI Ajanları simüle ediliyor... Yüzlerce sayfa analiz ediliyor...</p>
              </div>
            </div>
          )}

          {status === "done" && results && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-red-500/10 border border-red-500/50 text-red-50 p-5 rounded-2xl flex items-start gap-4 shadow-[0_0_30px_rgba(239,68,68,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
                <span className="text-4xl mt-1 animate-pulse">⚠️</span>
                <div className="relative z-10 w-full">
                  <h3 className="font-bold text-red-400 text-xl mb-2 tracking-tight">Kritik Risk: Mağazanız Yapay Zeka İçin Görünmez!</h3>
                  <p className="text-sm text-red-100/80 mb-4 leading-relaxed">
                    Sistemimiz mağazanızı taradı. Ne yazık ki ChatGPT, Perplexity ve Apple Intelligence gibi motorlar mağazanızı <strong>anlamıyor</strong> ve <strong>tavsiye etmiyor.</strong> Müşterileriniz yapay zekaya "hangi ürünü almalıyım?" diye sorduğunda rakipleriniz listeleniyor.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-red-950/40 p-3 rounded-xl border border-red-500/20">
                    <span className="text-sm font-medium text-red-200">Mevcut AI Uyumluluk Skorunuz:</span>
                    <div className="flex items-center gap-3 mt-2 sm:mt-0">
                      <div className="w-32 h-2 bg-red-950 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,1)] transition-all duration-1000" 
                          style={{ width: `${results.score}%` }}
                        />
                      </div>
                      <span className="font-bold text-red-400">{results.score} / 100</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl flex items-start gap-3 mt-6">
                <span className="text-2xl mt-1">✨</span>
                <div className="w-full">
                  <h3 className="font-bold text-emerald-300">İyi Haber: Çözümünüz Hazır!</h3>
                  <p className="text-sm opacity-90 text-emerald-100/70 mb-3">Aşağıdaki AI kodlarını (JSON-LD) Shopify sayfanıza ekleyerek saniyeler içinde ChatGPT'nin ilk önerisi olabilirsiniz.</p>
                  
                  {results.scannedProducts && results.scannedProducts.length > 0 && (
                    <div className="bg-emerald-950/40 border border-emerald-500/20 p-3 rounded-lg">
                      <p className="text-xs text-emerald-200/80 mb-2 font-semibold uppercase tracking-wider">🎯 Örnek Olarak Taranan 3 Ürününüz:</p>
                      <ul className="text-sm text-emerald-300/90 list-disc list-inside space-y-1">
                        {results.scannedProducts.map((title, i) => (
                          <li key={i}>{title}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm shadow-xl hover:border-blue-500/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <span className="text-xl">🤖</span> llms.txt İçeriği
                  </h2>
                  <button onClick={() => navigator.clipboard.writeText(results.llmsTxt)} className="text-sm bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-zinc-300 transition-colors">
                    {t.common.copy}
                  </button>
                </div>
                <p className="text-sm text-zinc-400 mb-4">
                  {t.dashboard.llmsDesc}
                </p>
                <div className="relative group">
                  <pre className="bg-zinc-950 p-4 rounded-xl overflow-x-auto text-sm text-green-400 font-mono border border-zinc-800 max-h-[250px] overflow-y-auto">
                    {results.llmsTxt}
                  </pre>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 backdrop-blur-sm shadow-xl hover:border-emerald-500/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <span className="text-xl">⚡</span> Conversational JSON-LD Schema
                  </h2>
                  <button onClick={() => navigator.clipboard.writeText(results.jsonLd)} className="text-sm bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-zinc-300 transition-colors">
                    {t.common.copy}
                  </button>
                </div>
                <p className="text-sm text-zinc-400 mb-4">
                  {t.dashboard.jsonldDesc}
                </p>
                <div className="relative group">
                  <pre className="bg-zinc-950 p-4 rounded-xl overflow-x-auto text-sm text-purple-400 font-mono border border-zinc-800 max-h-[300px] overflow-y-auto">
                    {results.jsonLd}
                  </pre>
                </div>
              </div>
              
              {/* SELF-HEALING REAL FLOW */}
              <div className="mt-8 p-6 rounded-2xl bg-blue-900/20 border border-blue-500/50 text-center shadow-[0_0_30px_rgba(37,99,235,0.15)]">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  🚀 Autopilot (Self-Healing)
                </h3>
                <p className="text-sm text-zinc-300 mb-6">
                  Bu buton, yapay zekanın ürettiği "AEO JSON-LD" verisini doğrudan Shopify mağazanızın "theme.liquid" dosyasına enjekte eder.
                </p>
                <button 
                  onClick={async () => {
                    alert("Shopify Theme API'sine JSON-LD enjeksiyonu başlatılıyor...");
                    try {
                      const res = await fetch("/api/heal", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ url, jsonLd: results.jsonLd })
                      });
                      const data = await res.json();
                      if(data.success) {
                        alert("Başarılı! " + data.message);
                      } else {
                        alert("Hata: " + data.error);
                      }
                    } catch (err) {
                      alert("Bağlantı hatası yaşandı.");
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30 px-8 py-3 rounded-xl font-medium transition-all w-full md:w-auto text-lg"
                >
                  Otomatik Düzelt & Enjekte Et
                </button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
