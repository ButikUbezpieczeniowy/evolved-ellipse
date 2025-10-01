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

export default async function generateFAQContent(topic) { 
  // 1. Sprawdzenie, czy klucz istnieje
  if (!process.env.GEMINI_API_KEY) {
    console.warn("Brak klucza GEMINI_API_KEY w środowisku Vercel. Zwracam bezpieczny Mock-up.");
    // FALLBACK 1: Zwracamy statyczne dane, jeśli klucz nie został w ogóle ustawiony.
    return [
      { pytanie: "Co to jest polisa?", odpowiedz: "Dokument potwierdzający zawarcie umowy ubezpieczenia." },
      { pytanie: "Jakie są korzyści z AI?", odpowiedzą: "AI dynamicznie generuje unikalne treści SEO, ale klucz API jest wymagany do pełnej funkcjonalności." },
    ];
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
    // FALLBACK 2: Jeśli klucz zawiódł podczas połączenia (np. błąd 400), zwracamy bezpieczny Mock-up.
    console.error(`Błąd API Gemini: ${errorMessage}. Zwracam bezpieczny Mock-up.`);
    return [
      { pytanie: "Błąd Ładowania FAQ", odpowiedź: "Przepraszamy, tymczasowo nie można połączyć się z AI. Proszę sprawdzić zmienne środowiskowe Vercel (GEMINI_API_KEY)." },
    ];
  }
} 