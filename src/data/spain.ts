export interface FactCard {
  label: string;
  value: string;
}

export const QUICK_FACTS: FactCard[] = [
  { label: "Waluta", value: "Euro (EUR)" },
  { label: "Strefa czasowa", value: "CEST — ta sama co w Polsce" },
  { label: "Alarmowy", value: "112" },
  { label: "Napięcie", value: "230 V, wtyczka typu F/C" },
  { label: "Napiwek", value: "5–10%, nieobowiązkowy" },
  { label: "Woda z kranu", value: "Zdatna do picia w miastach" },
];

export interface Topic {
  id: string;
  title: string;
  body: string;
  points: string[];
}

export const CULTURE_TOPICS: Topic[] = [
  {
    id: "rytm-dnia",
    title: "Rytm dnia",
    body: "Andaluzja żyje w innym zegarze. Wszystko przesuwa się o 2–3 godziny względem Polski.",
    points: [
      "Śniadanie 8:00–10:00: tostada z oliwą i pomidorem, café con leche",
      "Lunch 14:00–16:00 — główny posiłek dnia, menú del día 12–15 €",
      "Sjesta 15:00–17:30: małe sklepy zamknięte",
      "Kolacja 21:00–23:00, bary żyją do późna",
    ],
  },
  {
    id: "tapas",
    title: "Tapas i jedzenie",
    body: "Tapa to mała porcja podawana do napoju; w Maladze zwykle płatna, ale tania.",
    points: [
      "Racja (ración) = duży talerz do dzielenia, media ración = pół",
      "Espeto — sardynki grillowane na kiju nad ogniskiem, znak firmowy Costa del Sol",
      "Gazpacho i salmorejo — zimne zupy pomidorowe, ratunek w upał",
      "Wino: Ronda (czerwone), Málaga Dulce (słodkie), tinto de verano zamiast sangrii",
    ],
  },
  {
    id: "tradycje",
    title: "Tradycje i święta",
    body: "Sierpień to szczyt sezonu ferii — każde miasteczko ma własne święto patrona.",
    points: [
      "Feria de Málaga (sierpień): dzienna feria w centrum, nocna w Cortijo de Torres",
      "Verbenas — nocne potańcówki w pueblos, trwają do świtu",
      "Verdiales — góralska muzyka spod Malagi, unikalna w skali kraju",
      "Flamenco: cante, baile, guitarra — w Andaluzji to kultura, nie atrakcja",
    ],
  },
  {
    id: "savoir",
    title: "Savoir-vivire",
    body: "Kilka drobiazgów, które od razu ustawiają dobrą relację.",
    points: [
      "Wchodząc do baru czy sklepu mów 'Hola' — cisza jest odbierana chłodno",
      "Dwa całusy w powietrzu przy powitaniu wśród znajomych",
      "Głośna rozmowa to norma, nie kłótnia",
      "Nie spiesz kelnera — rachunek trzeba poprosić samemu",
    ],
  },
  {
    id: "praktyka",
    title: "Praktycznie",
    body: "Rzeczy, które ratują dzień na Costa del Sol.",
    points: [
      "Upał 35°C+: zwiedzanie przed 12:00 i po 18:00",
      "Wiele pueblos ma strefy ZTL — parkuj przed wjazdem do centrum",
      "Płatność kartą wszędzie, ale w górach miej 20–30 € gotówką",
      "Filtr 50, kapelusz, elektrolity — słońce jest ostre nawet przy bryzie",
    ],
  },
];
