// src/ai/gemini-logic.js
// Finalny moduł logiki AI, kompatybilny z Astro/ESM

import { GoogleGenAI } from '@google/genai';

// 💡 Klient Gemini Jawnie używa zmiennej środowiskowej GEMINI_API_KEY
// Klucz musi być ustawiony w Netlify i być aktywny w projekcie Remik AI (GCP).
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY, 
});

// Definicja Schematu JSON 
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

// Domyślny eksport funkcji, który rozwiązał problemy z importem/eksportem
export default async function generateFAQContent(topic) { 
  if (!process.env.GEMINI_API_KEY) {
    // To się nie powinno zdarzyć na Netlify, ale zabezpieczamy się
    throw new Error("Brak klucza GEMINI_API_KEY w środowisku kompilacji.");
  }
  
  const prompt = `Jesteś ekspertem SEO i specjalistą w dziedzinie ubezpieczeń. Wygeneruj 5 Często Zadawanych Pytań (FAQ) i odpowiedzi na temat: "${topic}". Treść musi być unikalna i merytoryczna. Użyj formatu JSON zgodnie z dostarczonym schematem.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: FAQ_SCHEMA,
      },
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    // Wyświetlamy błąd dla celów diagnostycznych na stronie
    throw new Error(`Błąd API Gemini: ${errorMessage}. Prawdopodobnie niepoprawny klucz w Netlify (400 INVALID_ARGUMENT).`);
  }
}