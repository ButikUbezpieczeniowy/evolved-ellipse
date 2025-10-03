# Quantum Leap Engine 🚀

**Quantum Leap** to zintegrowany system do błyskawicznego projektowania, tworzenia i wdrażania wysokowydajnych landing page'y, oparty na frameworku Astro.js.

System został zaprojektowany z myślą o maksymalnej automatyzacji i uproszczeniu procesu publikacji, od pomysłu do działającej strony w internecie.

---

## Stos Technologiczny

* **Framework:** [Astro.js](https://astro.build/)
* **Hosting:** [Vercel](https://vercel.com/)
* **Kontrola wersji:** [GitHub](https://github.com/)
* **AI & SEO:** [Google Gemini API](https://ai.google.dev/) do dynamicznego generowania treści (FAQ, Schema JSON).

---

## Struktura Projektu
/
├── public/                 # Statyczne pliki (favicon, robots.txt)
├── src/
│   ├── ai/                 # Logika AI (np. gemini-logic.js)
│   ├── assets/             # Zasoby przetwarzane przez Astro (np. obrazy tła)
│   ├── components/         # Reużywalne komponenty .astro
│   ├── layouts/            # Główne szablony stron (Layout.astro)
│   ├── pages/              # Każdy plik to osobna strona/landing page
│   └── styles/             # Globalne style CSS
├── astro.config.mjs        # Konfiguracja Astro
├── package.json            # Zależności projektu
└── PROJECT_GUIDELINES.md   # Wytyczne, Style Guide i Szablon Briefu
---

## Jak Stworzyć Nowy Landing Page?

Proces tworzenia nowej strony został zredukowany do 3 prostych kroków:

1.  **Przygotuj Brief:** Skopiuj szablon briefu z pliku `PROJECT_GUIDELINES.md` i wypełnij go wszystkimi potrzebnymi informacjami (treść, SEO, cele).

2.  **Stwórz Nowy Plik Strony:** W folderze `src/pages/` stwórz nowy plik, np. `nowa-kampania.astro`.

3.  **Zbuduj Stronę z Komponentów:** Użyj głównego szablonu `<Layout>` i złóż stronę z gotowych "klocków" znajdujących się w folderze `src/components/`, przekazując do nich treści z briefu.

Przykład minimalnej struktury pliku `src/pages/nowa-kampania.astro`:

```astro
---
import Layout from '../layouts/Layout.astro';
import Naglowek from '../components/Naglowek.astro';
import Stopka from '../components/Stopka.astro';
import CTA from '../components/CTA.astro';
---

<Layout title="Tytuł nowej kampanii" description="Opis dla SEO">
  
  <Naglowek />
  
  <main>
    <h1>To jest nowa kampania!</h1>
    <CTA />
  </main>
  
  <Stopka />

</Layout>