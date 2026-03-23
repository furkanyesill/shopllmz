"use client";

import { useSearchParams } from "next/navigation";
import { getDictionary, Locale } from "@/dictionaries";
import { useEffect, useState, Suspense } from "react";

function ProPageContent() {
  const searchParams = useSearchParams();
  const shop = searchParams.get("shop");
  const [lang, setLang] = useState<Locale>("en");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cookies = document.cookie.split("; ");
    const langCookie = cookies.find((row) => row.startsWith("lang="));
    if (langCookie) {
      setLang(langCookie.split("=")[1] as Locale);
    }
  }, []);

  const t = getDictionary(lang);

  const handleCheckout = async () => {
    if (!shop) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/billing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shop }),
      });
      const data = await res.json();
      
      if (data.confirmationUrl) {
        // App Bridge v4 iframe bypass explicitly targeting the top window
        window.open(data.confirmationUrl, "_top");
      } else {
        alert(data.error || "Ödeme bağlantısı oluşturulamadı.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Bağlantı hatası oluştu.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-xl border border-blue-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            {t.proPage.title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t.proPage.subtitle}
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="text-center pb-4 text-5xl font-black text-blue-600">
              {t.proPage.price}<span className="text-2xl text-gray-500 font-medium">{t.proPage.perMonth}</span>
            </div>
            <ul className="text-sm text-gray-700 space-y-3 pb-8">
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {t.proPage.feature1}</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {t.proPage.feature2}</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {t.proPage.feature3}</li>
              <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {t.proPage.feature4}</li>
            </ul>
          </div>

          <div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md"
            >
              {!shop ? "Mağazanı Bağla ve Pro'ya Geç" : loading ? "Yönlendiriliyor..." : t.proPage.btnText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProPage() {
  return (
    <Suspense fallback={<div className="min-h-screen items-center justify-center flex">Yükleniyor...</div>}>
      <ProPageContent />
    </Suspense>
  )
}
