// api/chat.js
// Vercel Edge Function do bezpiecznego wywołania OpenAI API
import OpenAI from 'openai';

// Inicjalizacja klienta OpenAI (klucz zostanie automatycznie pobrany ze Secrets Vercel)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Stała konfiguracja kontekstu Czatbota (Persona Ubezpieczeniowa)
const systemPrompt = "Jesteś uprzejmym i profesjonalnym AI Asystentem Ubezpieczeniowym. Twoim zadaniem jest odpowiadanie na pytania dotyczące polis, procedur zgłaszania szkód i podstawowych informacji ubezpieczeniowych, kierując użytkowników do kontaktu z agentem w celu finalizacji transakcji. Odpowiedzi powinny być krótkie, rzeczowe i zawsze w języku polskim.";

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Metoda nieobsługiwana.' }), { status: 405 });
  }

  try {
    const { messageHistory } = await request.json();

    // Pełna historia konwersacji (w tym nowa wiadomość od użytkownika)
    const messages = [
      { role: "system", content: systemPrompt },
      ...messageHistory 
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Model do konwersacji
      messages: messages,
      stream: false,
      max_tokens: 300,
      temperature: 0.7,
    });

    const botResponse = response.choices[0].message.content;

    return new Response(JSON.stringify({ response: botResponse }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Błąd Vercel Function (OpenAI):", error);
    return new Response(JSON.stringify({ error: "Błąd serwera podczas komunikacji z AI. Spróbuj ponownie." }), { status: 500 });
  }
}