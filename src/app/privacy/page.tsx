import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ShopLLMZ",
  description: "ShopLLMZ Privacy Policy — how we collect, use and protect your data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans px-6 py-16 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-white">Privacy Policy</h1>
      <p className="text-zinc-400 text-sm mb-10">Last updated: March 22, 2026</p>

      <section className="space-y-8 text-zinc-300 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">1. Introduction</h2>
          <p>
            ShopLLMZ (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is operated by YesilSoftware. This Privacy Policy
            explains how we collect, use, disclose and safeguard your information when you use our
            Shopify application and website at <strong>shopllmz.com</strong>. Please read this policy
            carefully. If you disagree with its terms, please discontinue use of the service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">2. Information We Collect</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Shop Domain:</strong> When you scan a store URL, we record the domain to track usage and prevent abuse.</li>
            <li><strong>Public Product Data:</strong> We read publicly available product information (title, description, vendor, price, images) via the store&apos;s <code className="bg-zinc-800 px-1 rounded text-sm">products.json</code> endpoint. We do not access private or customer data.</li>
            <li><strong>Shopify OAuth Token:</strong> If you install our app via Shopify, we store an encrypted access token to interact with your store on your behalf.</li>
            <li><strong>Usage Logs:</strong> Standard server logs (timestamps, IP addresses) are retained for up to 30 days for security purposes.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>To generate AI-optimized JSON-LD schemas and llms.txt files for your products.</li>
            <li>To calculate your store&apos;s AI visibility score.</li>
            <li>To improve and maintain the service.</li>
            <li>To send transactional emails (billing receipts, service notifications) — no marketing without consent.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">4. Data Sharing</h2>
          <p>
            We do <strong>not</strong> sell, rent, or trade your personal information to third parties.
            We share data only with:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li><strong>Google Gemini API</strong> — product text is sent to generate AI content. No personal data is shared.</li>
            <li><strong>Vercel</strong> — our hosting provider. Governed by Vercel&apos;s privacy policy.</li>
            <li><strong>Neon / Supabase</strong> — our database provider for storing shop sessions.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">5. Data Retention</h2>
          <p>
            We retain your shop domain and scan records for as long as you use the service.
            If you uninstall the Shopify app, we delete all associated data within 48 hours in
            compliance with Shopify&apos;s GDPR webhook requirements.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">6. Your Rights (GDPR / KVKK)</h2>
          <p>
            If you are located in the European Union or Turkey, you have the right to:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction or deletion of your data.</li>
            <li>Object to or restrict processing of your data.</li>
            <li>Lodge a complaint with a supervisory authority.</li>
          </ul>
          <p className="mt-2">
            To exercise these rights, email us at{" "}
            <a href="mailto:softwareyesil@gmail.com" className="text-emerald-400 hover:underline">
              softwareyesil@gmail.com
            </a>.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">7. Cookies</h2>
          <p>
            We use only essential session cookies required for authentication. We do not use
            advertising or tracking cookies.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">8. Security</h2>
          <p>
            We implement industry-standard security measures including HTTPS encryption,
            environment-variable-based secret management, and database access controls.
            No method of transmission over the Internet is 100% secure, and we cannot guarantee
            absolute security.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant
            changes by updating the &quot;Last updated&quot; date at the top of this page.
            Continued use of the service after changes constitutes acceptance of the new policy.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">10. Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <div className="mt-2 bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-sm">
            <p><strong>YesilSoftware</strong></p>
            <p>Email: <a href="mailto:softwareyesil@gmail.com" className="text-emerald-400 hover:underline">softwareyesil@gmail.com</a></p>
            <p>Website: <a href="https://shopllmz.com" className="text-emerald-400 hover:underline">shopllmz.com</a></p>
          </div>
        </div>
      </section>
    </main>
  );
}
