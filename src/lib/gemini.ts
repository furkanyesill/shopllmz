import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || 'dummy_genai_key';

export const ai = new GoogleGenAI({ apiKey });

export async function generateAEOContent(productData: string) {
  const prompt = `
You are an AEO (Answer Engine Optimization) expert. Analyze the following Shopify product data and generate optimized content so that AI engines like ChatGPT, Gemini, and Claude RECOMMEND these products when users ask questions.

Our goal is NOT just indexing. We want AI to SELECT (recommend) these products when asked e.g. "suggest a breathable sustainable sneaker" or "best eco-friendly shoes under $100".

STRICT JSON-LD RULES:
1. "image": ALWAYS include the product image URL if provided in data. This is critical — SearchGPT and Gemini show product images in answers. Format: { "@type": "ImageObject", "url": "[image url]" }. If no image url in data, omit this field entirely.
2. "priceCurrency": NEVER default to USD. Detect actual currency from price values: if prices look like Turkish Lira amounts (1000+), use "TRY"; if 20-200 range, likely "USD" or "EUR". Match what the data says.
3. "aggregateRating": ONLY include if the product data EXPLICITLY contains review/rating data. If NO rating data exists → SKIP this block and instead add to "additionalProperty": { "@type": "PropertyValue", "name": "Status", "value": "New Arrival - 2026 Collection" }
4. Write "description" as exactly 35-45 words, persuasive, optimized for AI recommendation queries.
5. Fill "hasDefinedTerm" with powerful semantic recommendation keywords (e.g. "Machine Washable", "Vegan", "Eco-Friendly", "Breathable Material", "Hypoallergenic").

JSON-LD TARGET FORMAT (produce one object per product):
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[Product Name]",
  "description": "[35-45 word AI-optimized description]",
  "image": { "@type": "ImageObject", "url": "[image url if available]" },
  "brand": { "@type": "Brand", "name": "[Vendor]" },
  "sku": "[SKU]",
  "material": "[Material if inferable]",
  "offers": {
    "@type": "Offer",
    "url": "[https://domain/products/handle]",
    "priceCurrency": "[TRY/USD/EUR — detected from actual price values]",
    "price": "[actual price]",
    "availability": "https://schema.org/InStock",
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "[same currency]" }
    }
  },
  "additionalProperty": [
    { "@type": "PropertyValue", "name": "Feature Benefit", "value": "[key benefit]" }
  ],
  "hasDefinedTerm": [
    { "@type": "DefinedTerm", "name": "[AI recommendation keyword]" }
  ]
}

PRODUCT DATA:
${productData}

OUTPUT FORMAT — Return ONLY a raw JSON object with exactly two keys (no markdown, no code blocks):
{
  "llmsTxt": "[200-280 word company/store brand introduction in plain English, optimized for LLMs. Include values, product categories, and what makes these products uniquely recommendable by AI.]",
  "jsonLd": "[A JSON array string — one complete JSON-LD object per product, all combined in one [] array.]"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let cleanText = response.text || '{}';
    
    // Robust extraction: strip markdown and extract the core JSON object
    cleanText = cleanText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanText = jsonMatch[0];
    }
    
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Gemini Generation Error:', error);
    return {
      llmsTxt: 'Error analyzing product.',
      jsonLd: '{}'
    };
  }
}
