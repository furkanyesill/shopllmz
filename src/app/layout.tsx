import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ShopLLMZ | SEO & AEO Suite",
  description: "Yapay zeka arama motorları (ChatGPT, Perplexity) için mağazanızı optimize edin.",
};

import { cookies } from "next/headers";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "en";

  return (
    <html lang={lang} className="dark">
      <head>
        {/* MANUAL STEP: Add PostHog or Google Analytics Script here */}
        {/* Example: <script src="..." data-domain="shopllmz.com"></script> */}
      </head>
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 antialiased min-h-screen flex flex-col relative`}>
        <LanguageSwitcher />
        <div className="flex-1">{children}</div>
        {/* Global Site Footer */}
        <footer className="border-t border-zinc-800 bg-zinc-950 py-6 px-6 mt-8">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
            <div className="flex items-center gap-4">
              <a href="/privacy" className="hover:text-zinc-300 transition-colors">
                Privacy Policy
              </a>
              <span>·</span>
              <a
                href="mailto:softwareyesil@gmail.com"
                className="hover:text-zinc-300 transition-colors"
              >
                Support: softwareyesil@gmail.com
              </a>
            </div>
            <div className="text-zinc-600">
              © {new Date().getFullYear()} ShopLLMZ · Created by{" "}
              <a
                href="https://shopllmz.com"
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                YesilSoftware
              </a>
            </div>
          </div>
        </footer>
      </body>

    </html>
  );
}
