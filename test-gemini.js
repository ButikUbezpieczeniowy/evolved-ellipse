// test-gemini.js
// OSTATECZNA WERSJA TESTU LOKALNEGO - Czysty Kod

import generateFAQContent from './src/ai/gemini-logic.js'; 

// 💡 ZASTĄP [TWÓJ_KLUCZ_API] DOKŁADNĄ WARTOŚCIĄ TWOJEGO KLUCZA AIZA...
process.env.GEMINI_API_KEY = 'AIzaSyAtYXyWlt7-wRwn3w4FanT3X6WlxEHwfsU'; // KLUCZ Z TWOJEGO ZDJĘCIA DLA PRZYKŁADU

async function runTest() {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'AIzaSyAtYXyWlt7-wRwn3w4FanT3X6WlxEHwfsU') {
        console.log("❌ Błąd konfiguracji: Uzupełnij klucz API w pliku testowym.");
        return;
    }
    
    console.log("-----------------------------------------");
    console.log("🚀 Rozpoczynam lokalny test Gemini API...");
    console.log("-----------------------------------------");

    try {
        const topic = "Ubezpieczenie Turystyczne w Polsce";
        const faqData = await generateFAQContent(topic);

        if (faqData && faqData.length > 0) {
            console.log("✅ SUKCES! Klucz API jest PRAWIDŁOWY i działa!");
            console.log(`Wygenerowano ${faqData.length} pozycji dla tematu: ${topic}`);
        } else {
            console.log("⚠️ Klucz jest poprawny, ale AI zwróciła puste dane.");
        }
    } catch (e) {
        console.error("❌ BŁĄD TESTU KLUCZA API ❌");
        console.error(`Błąd: ${e.message}`);
    }
}

runTest();