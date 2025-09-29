// src/ai/gemini-logic.js
// FINALNA WERSJA - Składnia ES Module (import/export)

// 💡 Zmiana: Używamy import zamiast require
import { GoogleGenAI } from '@google/genai';

// Inicjalizacja klienta Gemini
// Klucz API jest nadal pobierany z ENV
const ai = new GoogleGenAI({});

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

// 💡 CZYSTA FUNKCJA LOGIKI AI - eksportowana do użycia w Astro
export async function generateFAQContent(topic) {
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
    throw new Error(`Błąd API Gemini: ${errorMessage}. Sprawdź, czy GEMINI_API_KEY w Netlify działa i jest ważny.`);
  }
}