/* ==========================================================================
   DANE SERII „Znajdź słówko!”
   --------------------------------------------------------------------------
   To jedyny plik, który trzeba edytować, żeby:
   - zmienić link do Amazona  -> pole `amazon`
   - podmienić okładkę        -> pole `cover` (plik w assets/img/covers/)
   - dodać nowy tom           -> skopiuj obiekt w ZS_BOOKS i zmień wartości
   - zapowiedzieć przyszły tom -> dodaj obiekt w ZS_UPCOMING
   Gdy przyszły tom trafi do sprzedaży, przenieś go z ZS_UPCOMING do ZS_BOOKS.
   ========================================================================== */

window.ZS_BOOKS = [
  {
    id: 'poziom-latwy',
    level: 'Poziom najłatwiejszy',
    step: 1,
    age: '5–6 lat',
    title: 'Znajdź słówko!',
    tagline: 'Pierwsza wykreślanka, która nie zniechęca',
    description:
      'Duże litery, znajome słowa i tyle satysfakcji, ile potrzeba, żeby dziecko samo poprosiło o kolejną stronę. Oswajanie literek, zanim zacznie się prawdziwa nauka czytania.',
    features: ['100 wykreślanek', 'Duże litery', 'Tematy bliskie dzieciom', 'Rozwiązania na końcu'],
    puzzles: 100,
    pages: 128,
    isbn: '978-83-981441-2-4',
    color: '#7cc383',
    ink: '#1f3b2a',
    cover: 'assets/img/covers/poziom-latwy.webp',
    samples: 'assets/img/samples/poziom-latwy/',
    amazon: 'https://amzn.eu/d/0coMqTkj',
  },
  {
    id: 'poziom-latwy-6-7',
    level: 'Poziom łatwy',
    step: 2,
    age: '6–7 lat',
    title: 'Znajdź słówko!',
    tagline: 'Pierwsze wykreślanki rozwiązywane samodzielnie',
    description:
      'Słowa ukryte są tak, jak czytamy: od lewej do prawej i z góry na dół. Tylko jeden wyraz na planszy biegnie po skosie — szukanie staje się treningiem czytania, a nie źródłem frustracji.',
    features: ['100 plansz po 7 słów', 'Duża czcionka', 'Zerówka i klasa 1', 'Rozwiązania na końcu'],
    puzzles: 100,
    pages: 128,
    isbn: '978-83-981441-0-0',
    color: '#f5c842',
    ink: '#4a3606',
    cover: 'assets/img/covers/poziom-latwy-6-7.webp',
    samples: 'assets/img/samples/poziom-latwy-6-7/',
    amazon: 'https://amzn.eu/d/07BBUa1X',
  },
  {
    id: 'poziom-sredni-7-9',
    level: 'Poziom średni',
    step: 3,
    age: '7–9 lat',
    title: 'Znajdź słówko!',
    tagline: 'Dla dziecka, które czyta już płynnie',
    description:
      'Dłuższe i trudniejsze słowa, większe plansze i więcej liter do przeszukania. Im dłużej trwa szukanie, tym większa radość, gdy słówko w końcu się znajdzie.',
    features: ['100 wykreślanek', 'Dłuższe słowa', 'Koncentracja i spostrzegawczość', 'Rozwiązania na końcu'],
    puzzles: 100,
    pages: 128,
    isbn: '978-83-981441-1-7',
    color: '#4fd6b0',
    ink: '#0f3d32',
    cover: 'assets/img/covers/poziom-sredni-7-9.webp',
    samples: 'assets/img/samples/poziom-sredni-7-9/',
    amazon: 'https://amzn.eu/d/0dJNgtH1',
  },
  {
    id: 'poziom-trudny-10',
    level: 'Poziom trudny',
    step: 4,
    age: '10+',
    title: 'Znajdź słówko!',
    tagline: 'Prawdziwe wyzwanie dla wprawnych czytelników',
    description:
      'Długie słowa, gęsta plansza i satysfakcja, która przychodzi dopiero po chwili skupienia. Dla dzieci, które lubią mierzyć się z trudniejszym zadaniem.',
    features: ['100 wykreślanek', 'Długie, wymagające słowa', 'Trening cierpliwości', 'Rozwiązania na końcu'],
    puzzles: 100,
    pages: 128,
    isbn: '978-83-981441-3-1',
    color: '#ee5b3b',
    ink: '#4a1608',
    cover: 'assets/img/covers/poziom-trudny-10.webp',
    samples: 'assets/img/samples/poziom-trudny-10/',
    amazon: 'https://amzn.eu/d/07eXC8JG',
  },
  {
    id: 'poziom-ekspert-13',
    level: 'Poziom ekspert',
    step: 5,
    age: '13+',
    title: 'Znajdź słówko!',
    tagline: 'Wykreślanka, która stawia prawdziwy opór',
    description:
      'Najtrudniejszy poziom w serii — gęste plansze, długie słowa i zadania, przy których trzeba się naprawdę skupić. Dla nastolatków i dorosłych miłośników łamigłówek.',
    features: ['100 wykreślanek', 'Najwyższy poziom serii', 'Gęste plansze', 'Rozwiązania na końcu'],
    puzzles: 100,
    pages: 128,
    isbn: '978-83-981441-4-8',
    color: '#2b2e9e',
    ink: '#ffffff',
    cover: 'assets/img/covers/poziom-ekspert-13.webp',
    samples: 'assets/img/samples/poziom-ekspert-13/',
    amazon: 'https://amzn.eu/d/07es8Itl',
  },
  {
    id: 'swieta',
    level: 'Wydanie specjalne',
    step: 0,
    age: '6–9 lat',
    title: 'Znajdź słówko! Święta',
    tagline: '40 świątecznych wykreślanek z ciekawostkami',
    description:
      'Kolędy, wigilijne potrawy, Mikołaj i renifery. Co czwarta plansza ma kształt serca, gwiazdy albo kuli, a między zagadkami czekają strony z ciekawostkami o zimie i Bożym Narodzeniu.',
    features: ['40 wykreślanek', 'Plansze w kształtach', 'Ciekawostki świąteczne', 'Pomysł na prezent'],
    puzzles: 40,
    pages: 64,
    isbn: '978-83-983901-1-8',
    color: '#c8262f',
    ink: '#ffffff',
    cover: 'assets/img/covers/swieta.webp',
    samples: 'assets/img/samples/swieta/',
    amazon: 'https://www.amazon.pl/dp/8398390115',
  },
];

/* Przyszłe tomy. `cover: null` pokazuje elegancką okładkę zastępczą.
   Gdy okładka będzie gotowa, wpisz ścieżkę, np. 'assets/img/covers/ortografia.webp'. */
window.ZS_UPCOMING = [
  {
    title: 'Znajdź słówko! Ortografia',
    age: '7–9 lat · klasy 1–3',
    description: '80 wykreślanek, które utrwalają pisownię ó/u, rz/ż i ch/h — najpierw z pełnymi wyrazami, potem z lukami do uzupełnienia.',
    letters: 'Ó·RZ·CH',
    color: '#7c5cff',
    cover: null,
    status: 'W przygotowaniu',
  },
  {
    title: 'Znajdź słówko! Ortografia 2',
    age: '8–10 lat · klasy 2–4',
    description: 'Ciąg dalszy ortograficznej przygody: ą/ę oraz trudniejsze wyrazy z ó/u, rz/ż i ch/h. Z dyplomem na koniec.',
    letters: 'Ą·Ę',
    color: '#ff8a3d',
    cover: null,
    status: 'W przygotowaniu',
  },
  {
    title: 'Kolejny tom',
    age: 'Wkrótce',
    description: 'Seria wciąż rośnie. Na tym miejscu pojawi się następna książka — zajrzyj tu ponownie.',
    letters: '?',
    color: '#1e2a5a',
    cover: null,
    status: 'Zapowiedź',
  },
];
