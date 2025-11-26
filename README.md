🖨️ Ofertownik Web-to-Print — MVP

Prosty konfigurator ofertowy dla produktów poligraficznych, pozwalający obliczać ceny, wybrać konfigurację i generować ofertę w PDF. Projekt w pełni działa lokalnie (HTML/CSS/JS), bez backendu.

🚀 Funkcje aplikacji

- Wybór produktu z listy dostępnych pozycji.

- Obsługa nakładu (walidacja ilości).

- Wybór wykończenia (opcjonalne dodatki zależne od produktu).

- Dynamiczne przeliczanie ceny, w tym:

  - cena druku,

  - cena wykończenia,

  - rabat procentowy i kwotowy,

  - cena końcowa po rabacie.

- Generowanie PDF z użyciem jsPDF + autoTable:

  - tabela parametrów,

  - szczegółowe wartości cen,

  - automatyczna stopka z nazwą systemu.

- Zapisywanie i przywracanie danych przez LocalStorage:

  - zapamiętanie wybranego produktu,

  - zapamiętanie nakładu,

  - zapamiętanie rabatu,

  - zapamiętanie wybranego wykończenia.

- Modale z podsumowaniem i przyciskiem generowania PDF.

- Prosty, czytelny interfejs bez bibliotek UI.

📄 Technologie

HTML5

CSS3

JavaScript (ES6+)

jsPDF + autoTable

LocalStorage API

🛠️ Struktura projektu
    style.css
    main.js
    products.js
    calculations.js
    ui.js
index.html
README.md

🧩 Dalszy rozwój (opcjonalnie)

Dodanie wielu wariantów produktów (np. formaty, gramatury).

Podgląd graficzny produktu.

Eksport zamówienia jako JSON do ERP.

Wysyłka oferty mailem.

Tryb ciemny.

Panel admina do edycji listy produktów.

Wprowadzenie frameworka (React/Vue) po MVP.
