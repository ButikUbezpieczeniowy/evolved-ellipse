// src/ai/gemini-logic.js
// OSTATECZNA WERSJA LIVE API z ZABEZPIECZENIEM PRZED KRYTYCZNYM BŁĘDEM (FALLBACK)

import { GoogleGenAI } from '@google/genai';

// Klient Gemini jawnie używa klucza z ENV Vercel
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, 
});

// Definicja Schematu JSON (dla Gemini API)
const FAQ_SCHEMA = {
  type: 'array',
  description: 'Lista 5 pytań i odpowiedzi na temat ubezpieczenia.',
  items: {
    type: 'object',
    properties: {
      pytanie: {
        type: 'string',
        description: 'Często zadawane pytanie dotyczące podanego tematu.',
      },
      odpowiedz: {
        type: 'string',
        description: 'Zwięzła i merytoryczna odpowiedź na pytanie.',
      },
    },
    required: ['pytanie', 'odpowiedz'],
  },
};

// Dane FALLBACK na wypadek problemu z API
const FALLBACK_FAQ = [
    {
        pytanie: "Co to jest polisa?", 
        odpowiedz: "Dokument potwierdzający zawarcie umowy ubezpieczenia, wydawany przez ubezpieczyciela." 
    },
    {
        pytanie: "Jak zgłosić szkodę?", 
        odpowiedz: "Szkodę można szybko zgłosić online za pośrednictwem dedykowanego formularza na stronie ubezpieczyciela." 
    },
];

/**
 * Generuje FAQ w formacie JSON (dla frontendu) oraz JSON-LD (dla SEO).
 * @param {string} topic - Temat, na podstawie którego AI ma generować pytania/odpowiedzi.
 * @returns {object} {faqData: Array, schemaJSON: string}
 */
export default async function generateFAQContent(topic) { 
  // FALLBACK 1: Sprawdzenie, czy klucz istnieje
  if (!process.env.GEMINI_API_KEY) {
    console.warn("Brak klucza GEMINI_API_KEY w środowisku. Używam bezpiecznego Mock-upu (FALLBACK).");
    // Wracamy z pustym schematem, aby uniknąć błędów, ale z danymi dla widoku.
    return { faqData: FALLBACK_FAQ, schemaJSON: '' };
  }
  
  const prompt = `Jesteś ekspertem SEO i specjalistą w dziedzinie ubezpieczeń. Wygeneruj 5 Często Zadawanych Pytań (FAQ) i odpowiedzi na temat: "${topic}". Treść musi być unikalna i merytoryczna. Zwróć wynik **wyłącznie** jako tablicę JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: FAQ_SCHEMA,
      },
    });

    const faqData = JSON.parse(response.text.trim());
    
    // Generowanie Schema JSON (JSON-LD) dla SEO
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqData.map(item => ({
            "@type": "Question",
            "name": item.pytanie,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.odpowiedz
            }
        }))
    };
    
    return {
        faqData,
        schemaJSON: JSON.stringify(schema, null, 2)
    };
    
  } catch (error) {
    console.error("Błąd API Gemini podczas generowania FAQ:", error);
    // FALLBACK 2: Jeśli API zawiodło w trakcie połączenia, zwracamy Mock-up.
    return { faqData: FALLBACK_FAQ, schemaJSON: '' };
  }
}