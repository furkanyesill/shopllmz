import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || "dummy_genai_key";

export const ai = new GoogleGenAI({ apiKey });

export async function generateAEOContent(productData: string) {
  const prompt = `
    Aşağıdaki Shopify ürün verilerini analiz et ve AI ajanlarının (ChatGPT, Gemini, Claude vb.) bu ürünü kullanıcılara "önermesi" için en optimize edilmiş Conversational JSON-LD Schema nesnesini ve llms.txt özetini üret.
    
    Amacımız sadece arama motorlarında "indekslenmek" değil, yapay zeka motorlarının sorulara cevap verirken (örneğin: "makinede yıkanabilir, sürdürülebilir rahat ayakkabı öner") bu ürünü SEÇMESİNİ (Recommendation) sağlamaktır.

    Bunun için aşağıdaki gelişmiş şema formatını KESİNLİKLE kullan ve ürünün özelliklerine göre içini doldur (Eğer veri eksikse mantıklı olarak türet):

    JSON KURGUSU:
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "[Ürün Adı]",
      "description": "[AI'ın iştahını kabartacak 40 kelimelik ikna edici özet]",
      "brand": { "@type": "Brand", "name": "[Marka]" },
      "sku": "[Varsa SKU, yoksa türet]",
      "material": "[Materyal]",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "1250"
      },
      "offers": {
        "@type": "Offer",
        "url": "[Ürün Linki]",
        "priceCurrency": "USD",
        "price": "98.00",
        "availability": "https://schema.org/InStock",
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "USD" }
        }
      },
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Feature Benefit",
          "value": "[Örn: 4.83 kg CO2e veya Su Geçirmez]"
        }
      ],
      "hasDefinedTerm": [
        { "@type": "DefinedTerm", "name": "[Örn: Machine Washable]" },
        { "@type": "DefinedTerm", "name": "[Örn: Eco-Friendly]" }
      ]
    }

    ÖNEMLİ KURAL 1: hasDefinedTerm ve additionalProperty özelliklerini, AI'nin ürünü kullanıcılara "özelliğine göre" önermesi ("featureDescription") için KESİNLİKLE çok güçlü ve zengin kelimelerle doldur (Örn: "makinede yıkanabilir", "nefes alabilir", "vegan").
    
    ÖNEMLİ KURAL 2 (AKILLI PUANLAMA): Eğer ürüne ait herhangi bir "yorum (review)" veya "puan (rating)" verisi YOKSA, şemadaki 'aggregateRating' bloğunu SAKIN oluşturma (Fake/Sahte puan atama). Bunun yerine yorum eksikliğini avantaja çevirmek için 'additionalProperty' dizisine KESİNLİKLE şunu ekle:
    { "@type": "PropertyValue", "name": "Status", "value": "New Arrival - 2026 Collection" }
    (Böylece LLM motorları ürünü puansız olduğu için elemek yerine "Yeni Çıkan Trend Ürün" olarak etiketleyecektir).

    Veri: ${productData}

    FORMAT REQUIREMENT:
    You MUST return EVERYTHING strictly as a single JSON object with exactly two string keys: "llmsTxt" and "jsonLd".
    {
      "llmsTxt": "[A generic company-wide prompt or product list markdown snippet that is optimized for LLMs. Maximum 300 words.]",
      "jsonLd": "[The ENTIRE Conversational JSON-LD string inside this field. Must be stringified JSON.]"
    }
    DO NOT wrap the response in markdown code blocks like \`\`\`json. Just return the raw JSON braces.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    // Clean up potential markdown blocks from response
    let cleanText = response.text || "{}";
    cleanText = cleanText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return {
      llmsTxt: "Error analyzing product.",
      jsonLd: "{}"
    };
  }
}
