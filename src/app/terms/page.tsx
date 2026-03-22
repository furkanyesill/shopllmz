import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ShopLLMZ",
  description: "ShopLLMZ Terms of Service — the rules governing your use of our platform.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 font-sans px-6 py-16 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-white">Terms of Service</h1>
      <p className="text-zinc-400 text-sm mb-10">Last updated: March 22, 2026</p>

      <section className="space-y-8 text-zinc-300 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold text-white mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using ShopLLMZ (&quot;Service&quot;), operated by YesilSoftware, you agree to be bound by these Terms of Service. If you do not agree, please do not use the Service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">2. Description of Service</h2>
          <p>
            ShopLLMZ is an AI-powered Answer Engine Optimization (AEO) tool for Shopify merchants. It analyzes publicly available product data and generates JSON-LD schemas and llms.txt files designed to improve the visibility of your products in AI-powered search engines such as ChatGPT, Gemini, and Perplexity.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">3. Eligibility</h2>
          <p>
            You must be at least 18 years of age and have the authority to bind your business to these Terms. By using the Service, you represent that you meet these requirements.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">4. Subscriptions and Billing</h2>
          <p>
            Paid plans are billed through Shopify&apos;s Billing API on a monthly basis. By subscribing, you authorize Shopify to charge your account according to the selected plan. You may cancel at any time through your Shopify admin panel; cancellation takes effect at the end of the current billing period. No partial refunds are issued.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">5. Free Trial</h2>
          <p>
            The free tier provides a limited scan of up to 3 publicly accessible products. No credit card is required. YesilSoftware reserves the right to modify or discontinue the free tier at any time without notice.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">6. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Use the Service for any unlawful purpose.</li>
            <li>Attempt to reverse-engineer, scrape, or exploit the Service&apos;s API beyond intended use.</li>
            <li>Introduce malicious code or interfere with the Service&apos;s infrastructure.</li>
            <li>Resell or sublicense the Service without written permission.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">7. Intellectual Property</h2>
          <p>
            All content, branding, and technology comprising the Service are owned by YesilSoftware. The AI-generated output (JSON-LD schemas, llms.txt content) created for your store is yours to use freely. You grant us a non-exclusive license to process your public product data solely to provide the Service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">8. Disclaimer of Warranties</h2>
          <p>
            The Service is provided &quot;as is&quot; without warranties of any kind. YesilSoftware does not guarantee that the AI-generated content will result in improved search rankings, AI recommendations, or increased revenue. Results may vary based on your store, products, and market conditions.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, YesilSoftware shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Service. Our total liability shall not exceed the amount paid by you in the 30 days preceding the claim.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">10. Termination</h2>
          <p>
            We reserve the right to suspend or terminate your access to the Service at any time for violations of these Terms, without prior notice. Upon termination, your data will be deleted within 48 hours.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">11. Governing Law</h2>
          <p>
            These Terms shall be governed by the laws of the Republic of Turkey. Any disputes shall be resolved in the courts of Istanbul, Turkey.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">12. Changes to Terms</h2>
          <p>
            We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance. We will update the &quot;Last updated&quot; date accordingly.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-2">13. Contact</h2>
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
