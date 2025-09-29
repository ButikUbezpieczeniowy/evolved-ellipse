// src/ai/gemini-logic.js

const { GoogleGenAI } = require('@google/genai');

// Inicjalizacja klienta Gemini
const ai = new GoogleGenAI({});

// 💡 Definicja Schematu JSON 
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
    // Rzucamy błąd, aby Astro go złapał i wyświetlił w FAQSection
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Krytyczny błąd API Gemini: ${errorMessage}. Upewnij się, że GEMINI_API_KEY w Netlify działa i jest ważny.`);
  }
}