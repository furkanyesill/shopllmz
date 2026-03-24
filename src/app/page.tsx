import Link from 'next/link';
import { cookies } from "next/headers";
import { getDictionary, Locale } from "@/dictionaries";

export default async function Home() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value as Locale) || "en";
  const t = getDictionary(lang);

  return (
    <main className="flex-1 flex flex-col items-center pt-8 p-6 text-center relative min-h-screen overflow-x-hidden">
      {/* Top Nav */}
      <div className="absolute top-6 right-6 z-50">
        <Link href="/login" className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-800 text-zinc-300 text-sm font-medium rounded-xl transition-all shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Mağaza Girişi (Login)
        </Link>
      </div>

      {/* Background glow effects */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[300px] sm:h-[400px] bg-blue-600/15 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none" />
      
      <div className="z-10 max-w-4xl mx-auto flex flex-col items-center gap-6 sm:gap-8 pt-24 sm:pt-40 pb-16 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          {t.home.badge}
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
          {t.home.heroTitle} <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-emerald-400">
            {t.home.heroHighlight}
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl">
          {t.home.heroDesc}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
          <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] text-center">
            {t.common.freeTestBtn}
          </Link>
          <a href="#features" className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-medium transition-all text-center">
            {t.common.howItWorks}
          </a>
        </div>
      </div>
      
      {/* Features Grid */}
      <div id="features" className="z-10 mt-32 max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left px-6">
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm hover:border-blue-500/30 transition-colors">
          <div className="h-12 w-12 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 text-xl">
            🤖
          </div>
          <h3 className="text-xl font-bold mb-2">{t.home.feat1Title}</h3>
          <p className="text-zinc-400 text-sm">{t.home.feat1Desc}</p>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm hover:border-emerald-500/30 transition-colors">
          <div className="h-12 w-12 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 text-xl">
            ⚡
          </div>
          <h3 className="text-xl font-bold mb-2">{t.home.feat2Title}</h3>
          <p className="text-zinc-400 text-sm">{t.home.feat2Desc}</p>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm hover:border-purple-500/30 transition-colors">
          <div className="h-12 w-12 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 text-xl">
            🔎
          </div>
          <h3 className="text-xl font-bold mb-2">{t.home.feat3Title}</h3>
          <p className="text-zinc-400 text-sm">{t.home.feat3Desc}</p>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="z-10 mt-32 max-w-4xl mx-auto w-full px-6 text-left">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{t.home.pricingTitle}</h2>
          <p className="text-zinc-400">{t.home.pricingDesc}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800">
            <h3 className="text-2xl font-bold text-white mb-2">{t.home.feat3Title}</h3>
            <div className="text-4xl font-bold text-white mb-6">{t.home.freeTier}</div>
            <ul className="space-y-4 mb-8 text-zinc-400">
              <li className="flex items-center gap-3">✓ {t.home.freeF1}</li>
              <li className="flex items-center gap-3">✓ {t.home.freeF2}</li>
              <li className="flex items-center gap-3">✓ {t.home.freeF3}</li>
            </ul>
            <Link href="/dashboard" className="block w-full text-center py-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium transition-colors">
              {t.common.freeTestBtn}
            </Link>
          </div>
          <div className="p-8 rounded-3xl bg-blue-900/10 border border-blue-500/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">{t.common.popular}</div>
            <h3 className="text-2xl font-bold text-blue-400 mb-2">{t.home.proTier}</h3>
            <div className="text-4xl font-bold text-white mb-6">{t.home.proPrice} <span className="text-lg text-zinc-500 font-normal">{t.home.proPer}</span></div>
            <ul className="space-y-4 mb-8 text-zinc-300">
              <li className="flex items-center gap-3">✓ {t.home.proF1}</li>
              <li className="flex items-center gap-3">✓ {t.home.proF2}</li>
              <li className="flex items-center gap-3">✓ {t.home.proF3}</li>
              <li className="flex items-center gap-3">✓ {t.home.proF4}</li>
            </ul>
            {/* Replaced Paddle Link with /login for Shopify OAuth */}
            <Link href="/login" className="block w-full text-center py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors shadow-lg shadow-blue-500/25">
              {t.common.upgrade}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="z-10 mt-32 border-t border-zinc-800 w-full py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-500 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-blue-500 font-bold text-lg">{t.common.appName}</span>
            <span>© 2026. All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">{t.common.privacy}</Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">{t.common.terms}</Link>
            <a href="mailto:softwareyesil@gmail.com" className="hover:text-zinc-300 transition-colors">{t.common.support} softwareyesil@gmail.com</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
