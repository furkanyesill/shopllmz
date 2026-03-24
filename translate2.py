import os

path1 = 'c:/Users/Furkan/Desktop/agent/aura-geo/src/app/page.tsx'
with open(path1, 'r', encoding='utf-8') as f:
    c1 = f.read()

c1 = c1.replace('Mağaza Girişi (Login)', 'Store Login')

with open(path1, 'w', encoding='utf-8') as f:
    f.write(c1)

path2 = 'c:/Users/Furkan/Desktop/agent/aura-geo/src/app/superadmin/page.tsx'
with open(path2, 'r', encoding='utf-8') as f:
    c2 = f.read()

reps2 = {
    'Giriş yapmak için şifre gereklidir.': 'Password required to login.',
    'Hatalı şifre.': 'Invalid password.',
    'Şifreyi girin': 'Enter password',
    'Giriş Yap': 'Login',
    'Satış, Lead Toplama ve Otomasyon CRM Paneli': 'Sales, Lead Generation & Automation CRM Panel',
    'Toplam Lead: ': 'Total Leads: ',
    'Aktif Pro Kurulum: ': 'Active Pro Installs: ',
    'Potansiyel Müşteriler (Ücretsiz Tarama)': 'Potential Customers (Free Scans)',
    'Ana sayfadan &quot;AEO Skor Testi&quot; yapan mağazalar. Bunları email ile Pro&apos;ya sat!': 'Stores that ran "AEO Score Test" from the home page. Pitch them Pro via email!',
    'Henüz hiç tarama yapılmadı.': 'No scans performed yet.',
    'Tarama Sayısı: ': 'Scan Count: ',
    'Mağazayı Ziyaret Et': 'Visit Store',
    'Mail At (Satış)': 'Send Email (Sales)',
    'Aktif Kurulumlar (Pro)': 'Active Installs (Pro)',
    'Shopify App Store üzerinden uygulamanızı kurup yetki veren mağazalar.': 'Stores that installed and authorized the app via Shopify App Store.',
    'Henüz aktif bir kurulum yok.': 'No active installs yet.',
    'Shopify Admin Yönetimi': 'Manage in Shopify Admin'
}

for k, v in reps2.items():
    c2 = c2.replace(k, v)

with open(path2, 'w', encoding='utf-8') as f:
    f.write(c2)

print("Done")
