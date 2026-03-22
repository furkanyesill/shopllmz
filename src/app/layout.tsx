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
        {children}
      </body>
    </html>
  );
}
