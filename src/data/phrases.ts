export interface Phrase {
  pl: string;
  es: string;
  /** Uproszczona wymowa dla Polaka */
  say: string;
}

export interface PhraseGroup {
  id: string;
  title: string;
  hint: string;
  items: Phrase[];
}

export const PHRASE_GROUPS: PhraseGroup[] = [
  {
    id: "podstawy",
    title: "Podstawy",
    hint: "Minimum, które otwiera każde drzwi",
    items: [
      { pl: "Dzień dobry", es: "Buenos días", say: "buenos dijas" },
      { pl: "Dobry wieczór", es: "Buenas noches", say: "buenas noczes" },
      { pl: "Proszę", es: "Por favor", say: "por fawor" },
      { pl: "Dziękuję", es: "Gracias", say: "grasjas" },
      { pl: "Przepraszam", es: "Perdón", say: "perdon" },
      { pl: "Nie mówię po hiszpańsku", es: "No hablo español", say: "no ablo espaniol" },
      { pl: "Czy mówi pan po angielsku?", es: "¿Habla inglés?", say: "abla ingles" },
    ],
  },
  {
    id: "restauracja",
    title: "Restauracja i bar",
    hint: "Kolacja zaczyna się po 21:00",
    items: [
      { pl: "Stolik dla dwóch osób", es: "Una mesa para dos", say: "una mesa para dos" },
      { pl: "Poproszę kartę", es: "La carta, por favor", say: "la karta por fawor" },
      { pl: "Co pan poleca?", es: "¿Qué me recomienda?", say: "ke me rekomjenda" },
      { pl: "Poproszę rachunek", es: "La cuenta, por favor", say: "la kuenta por fawor" },
      { pl: "Bez mięsa / wegetariańskie", es: "Sin carne / vegetariano", say: "sin karne / wechetarjano" },
      { pl: "Woda niegazowana", es: "Agua sin gas", say: "agua sin gas" },
      { pl: "Piwo małe", es: "Una caña", say: "una kania" },
    ],
  },
  {
    id: "droga",
    title: "W drodze",
    hint: "Auto, parking, kierunki",
    items: [
      { pl: "Gdzie jest parking?", es: "¿Dónde está el parking?", say: "donde esta el parking" },
      { pl: "Do pełna, proszę", es: "Lleno, por favor", say: "jeno por fawor" },
      { pl: "Jak dojechać do...?", es: "¿Cómo se llega a...?", say: "komo se jega a" },
      { pl: "Czy to daleko?", es: "¿Está lejos?", say: "esta lechos" },
      { pl: "Bilet do...", es: "Un billete para...", say: "un bijete para" },
    ],
  },
  {
    id: "nocleg",
    title: "Nocleg",
    hint: "Check-in bez stresu",
    items: [
      { pl: "Mam rezerwację", es: "Tengo una reserva", say: "tengo una reserwa" },
      { pl: "O której jest wymeldowanie?", es: "¿A qué hora es la salida?", say: "a ke ora es la salida" },
      { pl: "Klimatyzacja nie działa", es: "El aire acondicionado no funciona", say: "el ajre akondisjonado no funsjona" },
      { pl: "Czy mogę zostawić bagaż?", es: "¿Puedo dejar la maleta?", say: "puedo dechar la maleta" },
    ],
  },
  {
    id: "awaria",
    title: "Awaryjne",
    hint: "Numer alarmowy: 112",
    items: [
      { pl: "Pomocy!", es: "¡Ayuda!", say: "ajuda" },
      { pl: "Potrzebuję lekarza", es: "Necesito un médico", say: "nesesito un mediko" },
      { pl: "Zgubiłem portfel", es: "He perdido la cartera", say: "e perdido la kartera" },
      { pl: "Gdzie jest apteka?", es: "¿Dónde hay una farmacia?", say: "donde aj una farmasja" },
    ],
  },
];

export const PRONUNCIATION_RULES: { rule: string; example: string }[] = [
  { rule: "ll → j", example: "llave = 'jawe'" },
  { rule: "ñ → ń/ni", example: "España = 'espania'" },
  { rule: "j / g przed e,i → ch", example: "jamón = 'chamon'" },
  { rule: "z / c przed e,i → s (Andaluzja)", example: "cerveza = 'serwesa'" },
  { rule: "h nieme", example: "hola = 'ola'" },
  { rule: "v ≈ b", example: "vino = 'bino'" },
];
