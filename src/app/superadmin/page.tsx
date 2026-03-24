/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { loginSuperadmin } from './actions';

export const dynamic = 'force-dynamic';

export default async function SuperAdminPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  const cookieStore = await cookies();
  const isAuth = cookieStore.get('superadmin_auth')?.value === 'true';

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Superadmin</h1>
            <p className="text-zinc-500 text-sm">Password required to login.</p>
          </div>
          {searchParams.error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
              Invalid password.
            </div>
          )}
          <form action={loginSuperadmin} className="space-y-4">
            <div>
              <input 
                type="password" 
                name="password" 
                placeholder="Enter password" 
                className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <button type="submit" className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3 rounded-xl transition-colors">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  // Fetch Leads (Free Scanners)
  const leads = await (prisma as any).lead.findMany({
    orderBy: { createdAt: 'desc' }
  });

  // Fetch Installed Sessions (Pro/App Accounts)
  const sessions = await prisma.session.findMany();

  // Deduplicate sessions by shop name
  const uniqueProShops = Array.from(new Set(sessions.map((s: any) => s.shop)));

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 border-b border-zinc-800 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">ShopLLMZ Hub (Super Admin)</h1>
            <p className="text-zinc-400 text-sm">Sales, Lead Generation & Automation CRM Panel</p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg text-sm font-medium">
              Total Leads: {leads.length}
            </div>
            <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm font-medium">
              Active Pro Installs: {uniqueProShops.length}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEADS SECTION (FREE SCANNERS) */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[700px]">
            <div className="p-6 border-b border-zinc-800 bg-zinc-900">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-blue-400">👀</span> Potential Customers (Free Scans)
              </h2>
              <p className="text-xs text-zinc-500 mt-1">Stores that ran "AEO Score Test" from the home page. Pitch them Pro via email!</p>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4 shadow-inner">
              {leads.length === 0 ? (
                <p className="text-zinc-500 text-center py-10">No scans performed yet.</p>
              ) : (
                leads.map((lead: any) => (
                  <div key={lead.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl hover:border-blue-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-zinc-200">{lead.shop}</h3>
                        <p className="text-xs text-zinc-500">Scan Count: {lead.scans}</p>
                      </div>
                      <span className="text-xs text-zinc-500 bg-zinc-900 px-2 py-1 rounded">
                        {new Date(lead.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <a 
                        href={`https://${lead.shop}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Visit Store
                      </a>
                      <a 
                        href={`mailto:hello@${lead.shop}`}
                        className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Send Email (Sales)
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* PRO INSTALLS SECTION */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col h-[700px]">
            <div className="p-6 border-b border-zinc-800 bg-zinc-900">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-emerald-400">💰</span> Active Installs (Pro)
              </h2>
              <p className="text-xs text-zinc-500 mt-1">Stores that installed and authorized the app via Shopify App Store.</p>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4 shadow-inner">
              {uniqueProShops.length === 0 ? (
                <p className="text-zinc-500 text-center py-10">No active installs yet.</p>
              ) : (
                uniqueProShops.map((shop: any, idx: number) => (
                  <div key={idx} className="bg-zinc-950 border border-emerald-500/20 p-4 rounded-xl hover:border-emerald-500/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                          ✓
                        </div>
                        <h3 className="font-semibold text-emerald-100">{shop as string}</h3>
                      </div>
                      <a 
                        href={`https://${shop as string}/admin/apps`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Manage in Shopify Admin
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
