/* eslint-disable */
"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const [lang, setLang] = useState("en");
  const router = useRouter();

  useEffect(() => {
    // Read from cookie
    const cookies = document.cookie.split("; ");
    const langCookie = cookies.find((row) => row.startsWith("lang="));
    if (langCookie) {
      setTimeout(() => setLang(langCookie.split("=")[1]), 0);
    } else {
      // Default to EN, option for TR
      setLang("en");
    }
  }, []);

  const changeLang = (newLang: "en" | "tr") => {
    document.cookie = `lang=${newLang}; path=/; max-age=31536000`; // 1 year
    setLang(newLang);
    router.refresh(); // Soft refresh state
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-zinc-900/80 backdrop-blur-md rounded-full px-3 py-1.5 border border-zinc-800 shadow-xl">
      <button 
        onClick={() => changeLang("en")}
        className={`text-sm font-medium transition-colors px-2 py-1 rounded-full ${lang === "en" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}
      >
        EN
      </button>
      <div className="w-px h-4 bg-zinc-700"></div>
      <button 
        onClick={() => changeLang("tr")}
        className={`text-sm font-medium transition-colors px-2 py-1 rounded-full ${lang === "tr" ? "bg-zinc-700 text-white" : "text-zinc-400 hover:text-white"}`}
      >
        TR
      </button>
    </div>
  );
}
