// src/ai/gemini-logic.js
// OSTATECZNA WERSJA POPRAWIONA - UŻYWA GOOGLE_API_KEY

import { GoogleGenAI } from '@google/genai';

// 💡 Zmiana: Inicjujemy klienta, przekazując mu zmienną środowiskową, której NAZWA jest w Netlify
// Zamiast polegać na automagii, jawnie podajemy, jaki klucz ma użyć.
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY, // KLUCZOWE: Używamy zmiennej, którą ustawiłeś w Netlify
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

// CZYSTA FUNKCJA LOGIKI AI
export async function generateFAQContent(topic) {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("BŁĄD KRYTYCZNY: Zmienna GOOGLE_API_KEY nie została znaleziona w środowisku kompilacji.");
  }
  
  const prompt = `Jesteś ekspertem SEO i specjalistą w dziedzinie ubezpieczeń. Wygeneruj 5 Często Zadawanych Pytań (FAQ) i odpowiedzi na temat: "${topic}". Użyj formatu JSON zgodnie z dostarczonym schematem.`;

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
    // Jeśli znowu 400, to problem z samym kluczem Google, nie z naszym kodem.
    throw new Error(`Błąd API Gemini: ${errorMessage}. Prawdopodobnie niepoprawny klucz w Netlify.`);
  }
}