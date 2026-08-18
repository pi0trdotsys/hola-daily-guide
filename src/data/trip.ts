export type Base = "malaga" | "tolox" | "estepona";

export interface Weather {
  /** Prognoza poglądowa (makieta) — docelowo z API pogodowego. */
  tempMax: number;
  tempMin: number;
  condition: string;
  seaTemp?: number;
  uv: number;
}

export interface PlanItem {
  time: string;
  title: string;
  note: string;
}

export interface Happening {
  title: string;
  where: string;
  note: string;
}

export interface TripDay {
  /** ISO date, klucz routingu: /dzien/$date */
  date: string;
  label: string;
  weekday: string;
  base: Base;
  headline: string;
  summary: string;
  plan: PlanItem[];
  happening: Happening[];
  weather: Weather;
  tip: string;
}

export interface BaseInfo {
  id: Base;
  name: string;
  range: string;
  tagline: string;
  coords: string;
}

export const BASES: Record<Base, BaseInfo> = {
  malaga: {
    id: "malaga",
    name: "Málaga",
    range: "20–22.08",
    tagline: "Miasto startowe: port, tapas, Picasso",
    coords: "36.7213 N, 4.4214 W",
  },
  tolox: {
    id: "tolox",
    name: "Tolox",
    range: "22–26.08",
    tagline: "Białe pueblo w Sierra de las Nieves",
    coords: "36.6861 N, 4.9083 W",
  },
  estepona: {
    id: "estepona",
    name: "Estepona",
    range: "26–29.08",
    tagline: "Costa del Sol: plaże i stare miasto w kwiatach",
    coords: "36.4272 N, 5.1450 W",
  },
};

export const TRIP_DAYS: TripDay[] = [
  {
    date: "2026-08-20",
    label: "20 sierpnia",
    weekday: "czwartek",
    base: "malaga",
    headline: "Przylot i pierwszy wieczór",
    summary: "Lądowanie w Maladze, zameldowanie i spacer po centrum przy zachodzie słońca.",
    plan: [
      { time: "14:00", title: "Lotnisko AGP", note: "Pociąg C1 do Málaga Centro-Alameda, 12 min, 2,30 €" },
      { time: "16:00", title: "Zameldowanie", note: "Centrum / Soho — bagaże i sjesta" },
      { time: "19:00", title: "Calle Larios", note: "Główna promenada, aperitiv na Plaza de la Constitución" },
      { time: "21:30", title: "Kolacja tapas", note: "El Pimpi lub Casa Lola — hiszpanie jedzą po 21:00" },
    ],
    happening: [
      { title: "Noc muzeów w centrum", where: "Málaga", note: "Wiele muzeów otwartych do 22:00 w sezonie" },
    ],
    weather: { tempMax: 31, tempMin: 22, condition: "Słonecznie", seaTemp: 24, uv: 9 },
    tip: "Nie planuj nic na 15:00–17:00 — upał i sjesta.",
  },
  {
    date: "2026-08-21",
    label: "21 sierpnia",
    weekday: "piątek",
    base: "malaga",
    headline: "Alcazaba, Picasso, plaża",
    summary: "Pełny dzień w Maladze: twierdza rano, muzeum w upał, wieczorem La Malagueta.",
    plan: [
      { time: "09:00", title: "Alcazaba + Gibralfaro", note: "Bilet łączony ok. 5,50 €, wejście od rana" },
      { time: "12:00", title: "Museo Picasso", note: "Klimatyzacja i 200+ prac" },
      { time: "14:30", title: "Espeto na plaży", note: "Sardynki z ogniska w chiringuito w Pedregalejo" },
      { time: "19:00", title: "Mercado Atarazanas", note: "Witraż, owoce morza, jamón" },
    ],
    happening: [
      { title: "Feria de Málaga (okres sierpniowy)", where: "Centrum i Cortijo de Torres", note: "Flamenco, verdiales i tańce na ulicach — sprawdź dokładne daty edycji" },
    ],
    weather: { tempMax: 32, tempMin: 23, condition: "Bezchmurnie", seaTemp: 24, uv: 10 },
    tip: "Woda w kranie w Maladze jest zdatna do picia — bierz butelkę wielorazową.",
  },
  {
    date: "2026-08-22",
    label: "22 sierpnia",
    weekday: "sobota",
    base: "tolox",
    headline: "Transfer w góry: Málaga → Tolox",
    summary: "Odbiór auta, przejazd przez El Burgo i wjazd do białego pueblo.",
    plan: [
      { time: "10:00", title: "Wypożyczenie auta", note: "Serpentyny — mały samochód sprawdza się lepiej" },
      { time: "11:30", title: "Przejazd A-355 / A-366", note: "Ok. 1 h, przystanek na widok w Alozaina" },
      { time: "13:30", title: "Zameldowanie w Tolox", note: "Wąskie uliczki — parkuj przy wjeździe do wsi" },
      { time: "20:00", title: "Kolacja lokalna", note: "Sopa de tomate, chivo al ajillo" },
    ],
    happening: [
      { title: "Sobotni targ w dolinie", where: "Okoliczne pueblos", note: "Lokalne oliwy, ser i owoce" },
    ],
    weather: { tempMax: 33, tempMin: 19, condition: "Słonecznie, sucho", uv: 9 },
    tip: "Zrób zakupy w Coín lub Alozainie — w Tolox tylko małe sklepy.",
  },
  {
    date: "2026-08-23",
    label: "23 sierpnia",
    weekday: "niedziela",
    base: "tolox",
    headline: "Sierra de las Nieves",
    summary: "Poranny trekking w parku narodowym, popołudnie w cieniu.",
    plan: [
      { time: "07:30", title: "Start szlaku", note: "Trasa do Torrecilla lub krótsza pętla przy Balneario" },
      { time: "12:00", title: "Powrót i basen", note: "Upał w górach uderza po południu" },
      { time: "18:00", title: "Spacer po wsi", note: "Kościół San Miguel, punkt widokowy" },
    ],
    happening: [
      { title: "Msza i niedzielny paseo", where: "Tolox", note: "Wieś budzi się dopiero po 19:00" },
    ],
    weather: { tempMax: 34, tempMin: 18, condition: "Słonecznie", uv: 10 },
    tip: "Min. 2 l wody na osobę na szlak — brak źródeł latem.",
  },
  {
    date: "2026-08-24",
    label: "24 sierpnia",
    weekday: "poniedziałek",
    base: "tolox",
    headline: "Ronda — dzień wypadowy",
    summary: "Puente Nuevo, arena i wąwóz El Tajo.",
    plan: [
      { time: "08:30", title: "Przejazd do Rondy", note: "Ok. 1 h 15 min drogą przez El Burgo" },
      { time: "10:00", title: "Puente Nuevo", note: "Zejście do Mirador para lepszych zdjęć" },
      { time: "12:00", title: "Plaza de Toros", note: "Najstarsza arena w Hiszpanii, audioprzewodnik" },
      { time: "15:00", title: "Powrót / bodegas", note: "Winnice wokół Rondy — degustacja" },
    ],
    happening: [
      { title: "Sezon letnich koncertów", where: "Ronda", note: "Wieczorne występy na starym mieście" },
    ],
    weather: { tempMax: 33, tempMin: 18, condition: "Słonecznie", uv: 9 },
    tip: "Parkuj na obrzeżach Rondy — centrum jest strefą ograniczonego ruchu.",
  },
  {
    date: "2026-08-25",
    label: "25 sierpnia",
    weekday: "wtorek",
    base: "tolox",
    headline: "Woda i wąwozy",
    summary: "Caminito del Rey albo kąpiele w rzece El Chorro.",
    plan: [
      { time: "08:00", title: "Caminito del Rey", note: "Rezerwacja online obowiązkowa, ok. 10 €" },
      { time: "13:00", title: "Lunch w El Chorro", note: "Widok na tamę i jezioro" },
      { time: "17:00", title: "Powrót do Tolox", note: "Wieczór na tarasie" },
    ],
    happening: [
      { title: "Verbena w okolicznych wsiach", where: "Guaro / Alozaina", note: "Letnie potańcówki do świtu" },
    ],
    weather: { tempMax: 35, tempMin: 20, condition: "Gorąco", uv: 10 },
    tip: "Caminito ma limit wejść — bilety schodzą z kilkutygodniowym wyprzedzeniem.",
  },
  {
    date: "2026-08-26",
    label: "26 sierpnia",
    weekday: "środa",
    base: "estepona",
    headline: "Transfer nad morze: Tolox → Estepona",
    summary: "Zjazd na Costa del Sol i pierwszy wieczór w mieście kwiatów.",
    plan: [
      { time: "10:00", title: "Wyjazd z Tolox", note: "Ok. 1 h 15 min przez Marbellę" },
      { time: "13:00", title: "Zameldowanie", note: "Stare miasto lub przy Playa de la Rada" },
      { time: "17:00", title: "Ruta de Murales", note: "Ponad 60 wielkoformatowych murali" },
      { time: "21:00", title: "Plaza de las Flores", note: "Kolacja pod donicami z pelargoniami" },
    ],
    happening: [
      { title: "Letnie noce w porcie", where: "Puerto Deportivo", note: "Muzyka na żywo i stragany" },
    ],
    weather: { tempMax: 30, tempMin: 23, condition: "Słonecznie, bryza", seaTemp: 24, uv: 9 },
    tip: "Calle Terraza i Calle Caridad — najładniejsze kwiatowe uliczki.",
  },
  {
    date: "2026-08-27",
    label: "27 sierpnia",
    weekday: "czwartek",
    base: "estepona",
    headline: "Dzień plażowy",
    summary: "Chiringuito, kąpiele i zachód słońca na Mirador del Carmen.",
    plan: [
      { time: "10:00", title: "Playa del Cristo", note: "Zatoczka bez fal, dobra na dłuższe leżenie" },
      { time: "14:00", title: "Paella przy plaży", note: "Zamawiana na min. 2 osoby" },
      { time: "19:30", title: "Promenada", note: "8 km nadmorskiego deptaka" },
    ],
    happening: [
      { title: "Targ rzemieślniczy", where: "Puerto / promenada", note: "Wieczorne stoiska w sezonie" },
    ],
    weather: { tempMax: 29, tempMin: 22, condition: "Słonecznie", seaTemp: 25, uv: 9 },
    tip: "Leżak + parasol ok. 12–18 € za dzień; publiczne odcinki plaży są za darmo.",
  },
  {
    date: "2026-08-28",
    label: "28 sierpnia",
    weekday: "piątek",
    base: "estepona",
    headline: "Wypad: Gibraltar albo Marbella",
    summary: "Skała z małpami i duty-free lub stare miasto Marbelli i Puerto Banús.",
    plan: [
      { time: "09:00", title: "Wybór kierunku", note: "Gibraltar 45 min (paszport!) / Marbella 30 min" },
      { time: "12:00", title: "Zwiedzanie", note: "Kolejka linowa lub Casco Antiguo" },
      { time: "18:00", title: "Powrót", note: "Ostatnia kolacja nad morzem" },
    ],
    happening: [
      { title: "Piątkowe flamenco", where: "Estepona, tablao", note: "Rezerwacja wskazana" },
    ],
    weather: { tempMax: 30, tempMin: 22, condition: "Pogodnie", seaTemp: 25, uv: 8 },
    tip: "Na Gibraltar zabierz dowód/paszport i licz się z kolejką na granicy.",
  },
  {
    date: "2026-08-29",
    label: "29 sierpnia",
    weekday: "sobota",
    base: "estepona",
    headline: "Wylot",
    summary: "Poranna kawa, zwrot auta na lotnisku w Maladze.",
    plan: [
      { time: "08:00", title: "Śniadanie", note: "Tostada z pomidorem i café con leche" },
      { time: "10:00", title: "Przejazd na AGP", note: "Ok. 1 h autostradą AP-7 (płatna)" },
      { time: "12:00", title: "Zwrot auta i odprawa", note: "Bądź 2 h przed odlotem" },
    ],
    happening: [
      { title: "Sobotni targ w Esteponie", where: "Avenida Juan Carlos I", note: "Rano, jeśli zostaje czas" },
    ],
    weather: { tempMax: 30, tempMin: 22, condition: "Słonecznie", seaTemp: 25, uv: 8 },
    tip: "Tankuj przed lotniskiem — stacje przy terminalu są droższe.",
  },
];

export interface Place {
  name: string;
  base: Base;
  category: "Nocleg" | "Jedzenie" | "Widok" | "Plaża" | "Kultura";
  note: string;
  price: string;
}

export const PLACES: Place[] = [
  { name: "Soho / Centro Histórico", base: "malaga", category: "Nocleg", note: "Wszystko na piechotę, głośno nocą", price: "90–150 €" },
  { name: "El Pimpi", base: "malaga", category: "Jedzenie", note: "Instytucja, beczki z podpisami, rezerwuj", price: "25–40 €" },
  { name: "Mirador de Gibralfaro", base: "malaga", category: "Widok", note: "Panorama portu, najlepiej o zachodzie", price: "0–3,50 €" },
  { name: "Pedregalejo", base: "malaga", category: "Plaża", note: "Rybackie chiringuito i espetos", price: "—" },
  { name: "Casa rural w Tolox", base: "tolox", category: "Nocleg", note: "Dom z tarasem i basenem, cisza", price: "80–120 €" },
  { name: "Balneario de Tolox", base: "tolox", category: "Kultura", note: "Historyczne uzdrowisko z wodami leczniczymi", price: "od 15 €" },
  { name: "Mirador de Tolox", base: "tolox", category: "Widok", note: "Widok na dolinę Río Grande", price: "0 €" },
  { name: "Casco Antiguo Estepona", base: "estepona", category: "Nocleg", note: "Kwiatowe uliczki, 5 min do plaży", price: "100–160 €" },
  { name: "Playa del Cristo", base: "estepona", category: "Plaża", note: "Osłonięta zatoka, spokojna woda", price: "—" },
  { name: "Mercado de Abastos", base: "estepona", category: "Jedzenie", note: "Hala targowa, tapas i owoce morza", price: "15–25 €" },
];
