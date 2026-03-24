import os

path = 'c:/Users/Furkan/Desktop/agent/aura-geo/src/app/dashboard/ClientPage.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    'Shopify mağazanızı yapay zeka ajanlarına hazırlayın.': 'Prepare your Shopify store for Artificial Intelligence agents.',
    '🎧 Destek': '🎧 Support',
    'Pro Aktif': 'Pro Active',
    "Pro'ya Geç 🚀": 'Upgrade to Pro 🚀',
    'Yeni Mağaza Tarama': 'New Store Scan',
    "Sonuçları görmek için bir mağaza URL'si girip analiz başlatın.": 'Enter a store URL and start an analysis to see the results.',
    'AI Ajanları simüle ediliyor... Yüzlerce sayfa analiz ediliyor...': 'Simulating AI Agents... Analyzing hundreds of pages...',
    'Kritik Risk: Mağazanız Yapay Zeka İçin Görünmez!': 'Critical Risk: Your Store is Invisible to AI!',
    'Sistemimiz mağazanızı taradı. Ne yazık ki ChatGPT, Perplexity ve Apple Intelligence gibi motorlar mağazanızı <strong>anlamıyor</strong> ve <strong>tavsiye etmiyor.</strong> Müşterileriniz yapay zekaya "hangi ürünü almalıyım?" diye sorduğunda rakipleriniz listeleniyor.': 'Our system scanned your store. Unfortunately, engines like ChatGPT, Perplexity, and Apple Intelligence do not understand and will not recommend your store. When customers ask AI "which product should I buy?", your competitors are listed instead.',
    'Mevcut AI Uyumluluk Skorunuz:': 'Current AI Compatibility Score:',
    'İyi Haber: Çözümünüz Hazır!': 'Good News: Your Solution is Ready!',
    "Aşağıdaki AI kodlarını (JSON-LD) Shopify sayfanıza ekleyerek saniyeler içinde ChatGPT'nin ilk önerisi olabilirsiniz.": "By adding the AI code (JSON-LD) below to your Shopify store, you can become ChatGPT's top recommendation in seconds.",
    '🎯 Örnek Olarak Taranan Ürünler:': '🎯 Example Scanned Products:',
    '🤖 llms.txt İçeriği': '🤖 llms.txt Content',
    'Bu buton, yapay zekanın ürettiği "AEO JSON-LD" verisini doğrudan Shopify mağazanızın "theme.liquid" dosyasına enjekte eder.': 'This button directly injects the AI-generated "AEO JSON-LD" payload into your Shopify store theme using App Blocks.',
    'Hata: Mağaza bağlantısı doğrulanamadı. Lütfen sayfayı yenileyin.': 'Error: Store connection could not be verified. Please refresh the page.',
    "Shopify Theme API'sine JSON-LD enjeksiyonu başlatılıyor...": "Initiating JSON-LD injection into Shopify Theme API...",
    'Başarılı! ': 'Success! ',
    'Hata: ': 'Error: ',
    'Bağlantı hatası yaşandı.': 'Connection error occurred.',
    'Otomatik Düzelt & Enjekte Et': 'Fix Automatically & Inject',
    'Bilinmeyen bir hata oluştu.': 'An unknown error occurred.'
}

for k, v in replacements.items():
    content = content.replace(k, v)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

path2 = 'c:/Users/Furkan/Desktop/agent/aura-geo/src/app/login/page.tsx'
with open(path2, 'r', encoding='utf-8') as f:
    content2 = f.read()

replacements2 = {
    'Mağaza Girişi': 'Store Login',
    'Shopify aboneliği satın almış veya test eden mağazalar için giriş paneli.': 'Login panel for stores testing or subscribing to the app via Shopify.',
    "Shopify Mağaza URL'niz": 'Your Shopify Store URL',
    'Örn: starducks.myshopify.com': 'e.g. starducks.myshopify.com',
    'Devam Et &rarr;': 'Continue &rarr;',
    'Hesabınız yok mu?': "Don't have an account?",
    'Uygulamayı İncele': 'View App Details'
}

for k, v in replacements2.items():
    content2 = content2.replace(k, v)

with open(path2, 'w', encoding='utf-8') as f:
    f.write(content2)

print("Translation complete.")
