// Przewodnik — logika aplikacji (jednostronicowa, dane z window.__TRIP__)

const $app = document.getElementById("app");
const $tabbar = document.getElementById("tabbar");

const TRIP = window.__TRIP__ || { cities: [], routes: [], packing: [], generalTips: [], summaryAttractions: [], summaryRestaurants: [] };
const PHRASES = window.__PHRASES__ || { groups: [], pronunciation: [], emergency: [] };

const LS = {
  checks: "hiszpania.checks",
  zoom: "hiszpania.zoom",
  fx: "hiszpania.fx",
  fuel: "hiszpania.fuel",
  weather: "hiszpania.weather",
  current: "hiszpania.current",
  news: "hiszpania.news",
};

const ZOOM_MIN = -3;
const ZOOM_MAX = 8;

let state = {
  tab: "home",
  zoom: clamp(readZoom(), ZOOM_MIN, ZOOM_MAX),
  view: null,
};

// ---------- pinezki Google Maps (polecane miejsca) ----------
const _P = (lat, lng, label) => ({ lat, lng, label });
const PLACES = {
  "malaga": _P(36.7213, -4.4213, "Málaga"),
  "tolox": _P(36.6583, -4.9043, "Tolox"),
  "estepona": _P(36.4280, -5.1463, "Estepona"),
  "malaga|alcazaba": _P(36.7205, -4.4161, "Alcazaba, Málaga"),
  "malaga|zamek gibralfaro": _P(36.7235, -4.4115, "Castillo de Gibralfaro"),
  "malaga|muzeum picassa": _P(36.7214, -4.4190, "Museo Picasso Málaga"),
  "malaga|plaza la malagueta": _P(36.7170, -4.4040, "Playa La Malagueta"),
  "malaga|centrum historyczne calle larios": _P(36.7199, -4.4217, "Calle Larios, Málaga"),
  "tolox|balneario de tolox": _P(36.6660, -4.9090, "Balneario de Tolox"),
  "tolox|spacer po miasteczku": _P(36.6583, -4.9043, "Tolox — centrum"),
  "tolox|sierra de las nieves": _P(36.6890, -4.9600, "Parque Nacional Sierra de las Nieves"),
  "tolox|sierra de las nieves trekking": _P(36.6890, -4.9600, "Parque Nacional Sierra de las Nieves"),
  "tolox|ronda": _P(36.7462, -5.1650, "Ronda"),
  "tolox|ronda opcjonalnie": _P(36.7462, -5.1650, "Ronda"),
  "estepona|stare miasto kwiaty": _P(36.4290, -5.1450, "Casco Antiguo, Estepona"),
  "estepona|orchidarium": _P(36.4277, -5.1442, "Orquidario de Estepona"),
  "estepona|mural route": _P(36.4270, -5.1455, "Ruta de Murales, Estepona"),
  "estepona|plaza playa de la rada": _P(36.4155, -5.1560, "Playa de la Rada, Estepona"),
  "estepona|marbella": _P(36.5100, -4.8850, "Marbella"),
  "estepona|marbella opcjonalnie": _P(36.5100, -4.8850, "Marbella"),
  "malaga|el pimpi": _P(36.7208, -4.4195, "El Pimpi, Málaga"),
  "malaga|mercado central de atarazanas": _P(36.7180, -4.4230, "Mercado de Atarazanas, Málaga"),
  "malaga|mercado atarazanas": _P(36.7180, -4.4230, "Mercado de Atarazanas, Málaga"),
  "malaga|restaurante jose carlos garcia": _P(36.7167, -4.4134, "Restaurante José Carlos García"),
  "malaga|la cosmopolita": _P(36.7190, -4.4210, "La Cosmopolita, Málaga"),
  "malaga|cafe con libros": _P(36.7220, -4.4210, "Café con Libros, Málaga"),
  "tolox|bar restaurante el mirador": _P(36.6570, -4.9030, "Bar Restaurante El Mirador, Tolox"),
  "tolox|restaurante balneario": _P(36.6660, -4.9090, "Restaurante Balneario de Tolox"),
  "tolox|bar la plaza": _P(36.6590, -4.9040, "Bar La Plaza, Tolox"),
  "estepona|el gastronomo": _P(36.4290, -5.1450, "El Gastrónomo, Estepona"),
  "estepona|la escollera": _P(36.4180, -5.1530, "La Escollera, Estepona"),
  "estepona|chiringuito la rada": _P(36.4160, -5.1550, "Chiringuito La Rada, Estepona"),
  "estepona|restaurante meson el rosario": _P(36.4280, -5.1455, "Mesón El Rosario, Estepona"),
};

const PIN_ALIASES = {
  malaga: [
    ["centrum historyczn", "malaga|centrum historyczne calle larios"],
    ["calle larios", "malaga|centrum historyczne calle larios"],
    ["mercado atarazanas", "malaga|mercado central de atarazanas"],
    ["la malagueta", "malaga|plaza la malagueta"],
    ["alcazaba", "malaga|alcazaba"],
    ["gibralfaro", "malaga|zamek gibralfaro"],
    ["picasso", "malaga|muzeum picassa"],
    ["lotnisku", "malaga"],
  ],
  tolox: [
    ["castle tower", "tolox|spacer po miasteczku"],
    ["centrum miasteczka", "tolox|spacer po miasteczku"],
    ["kawa na plaza", "tolox|spacer po miasteczku"],
    ["ronda", "tolox|ronda"],
    ["balneario", "tolox|balneario de tolox"],
    ["sierra", "tolox|sierra de las nieves"],
  ],
  estepona: [
    ["tadawn", "estepona"],
    ["starym mieście", "estepona|stare miasto kwiaty"],
    ["calle real", "estepona|stare miasto kwiaty"],
    ["paseo marítimo", "estepona"],
    ["promenadą", "estepona"],
    ["marbelli", "estepona|marbella"],
    ["orchidarium", "estepona|orchidarium"],
    ["playa de la rada", "estepona|plaza playa de la rada"],
  ],
};

const CITIES_COORDS = {
  malaga: { lat: 36.7213, lng: -4.4213 },
  tolox: { lat: 36.6583, lng: -4.9043 },
  estepona: { lat: 36.4280, lng: -5.1463 },
};

const WMO = {
  0: ["☀️", "Słonecznie"],
  1: ["🌤️", "Przeważnie słonecznie"],
  2: ["⛅", "Częściowo pochmurno"],
  3: ["☁️", "Pochmurno"],
  45: ["🌫️", "Mgła"],
  48: ["🌫️", "Mgła"],
  51: ["🌦️", "Mżawka"],
  53: ["🌦️", "Mżawka"],
  55: ["🌦️", "Mżawka"],
  61: ["🌧️", "Lekki deszcz"],
  63: ["🌧️", "Deszcz"],
  65: ["🌧️", "Mocny deszcz"],
  66: ["🌧️", "Deszcz ze śniegiem"],
  67: ["🌧️", "Deszcz ze śniegiem"],
  71: ["🌨️", "Śnieg"],
  73: ["🌨️", "Śnieg"],
  75: ["🌨️", "Śnieg"],
  77: ["🌨️", "Śnieg"],
  80: ["🌧️", "Przelotny deszcz"],
  81: ["🌧️", "Przelotny deszcz"],
  82: ["🌧️", "Ulewa"],
  85: ["🌨️", "Przelotny śnieg"],
  86: ["🌨️", "Przelotny śnieg"],
  95: ["⛈️", "Burza"],
  96: ["⛈️", "Burza z gradem"],
  99: ["⛈️", "Burza z gradem"],
};

const STORM_CODES = new Set([95, 96, 99]);
const RAIN_CODES = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82]);
const HEAT_T = 34;

let WX_BY_DATE = {};
let FX = null;
let FUEL = null;
let CURRENT = null;
let NEWS = null;
let activeDay = todayStr();

// ---------- pomocnicze ----------
function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function escapeHtml(s) {
  return String(s == null ? "" : s)
    .replace(/&/g, "&" + "amp;")
    .replace(/</g, "&" + "lt;")
    .replace(/>/g, "&" + "gt;")
    .replace(/"/g, "&" + "quot;")
    .replace(/'/g, "&#39;");
}

function slug(name) {
  return String(name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function mapsUrl(label, lat, lng) {
  return "https://maps.google.com/?q=" + encodeURIComponent(label + " @") + lat + "," + lng;
}

function placeByKey(cityId, name) {
  return PLACES[cityId + "|" + slug(name)];
}

function pinAnchorByKey(placeKey, extraClass) {
  const p = PLACES[placeKey];
  if (!p) return "";
  const href = mapsUrl(p.label, p.lat, p.lng);
  return (
    '<a class="pin-btn ' + (extraClass || "") + '" href="' + escapeHtml(href) + '" target="_blank" rel="noopener" ' +
    'aria-label="Zobacz na mapie: ' + escapeHtml(p.label) + '" title="Zobacz na mapie">📍</a>'
  );
}

function pinAnchor(cityId, name, extraClass) {
  return pinAnchorByKey(cityId + "|" + slug(name), extraClass);
}

function itemPin(cityId, label) {
  const l = slug(label);
  const aliases = PIN_ALIASES[cityId] || [];
  for (let i = 0; i < aliases.length; i++) {
    if (l.includes(aliases[i][0])) return pinAnchorByKey(aliases[i][1], "pin-btn--inline");
  }
  return "";
}

function readZoom() {
  const v = parseInt(localStorage.getItem(LS.zoom) || "2", 10);
  return Number.isFinite(v) ? v : 2;
}

function getChecks() {
  try {
    const raw = localStorage.getItem(LS.checks);
    const obj = raw ? JSON.parse(raw) : {};
    return obj && typeof obj === "object" ? obj : {};
  } catch {
    return {};
  }
}

function saveChecks(map) {
  localStorage.setItem(LS.checks, JSON.stringify(map));
}

function isDone(map, key) {
  return !!map[key];
}

function toggleCheck(key) {
  const map = getChecks();
  if (map[key]) delete map[key];
  else map[key] = true;
  saveChecks(map);
  render(true);
}

// ---------- zoom (A-/A+) ----------
function applyZoom() {
  document.documentElement.style.setProperty("--fs-base", (state.zoom * 0.125 + 1) + "rem");
  localStorage.setItem(LS.zoom, String(state.zoom));
}

function updateZoomButtons() {
  const minus = document.getElementById("zoomOut");
  const plus = document.getElementById("zoomIn");
  if (minus) minus.disabled = state.zoom <= ZOOM_MIN;
  if (plus) plus.disabled = state.zoom >= ZOOM_MAX;
}

function zoomBy(delta) {
  state.zoom = clamp(state.zoom + delta, ZOOM_MIN, ZOOM_MAX);
  applyZoom();
  updateZoomButtons();
}

// ---------- daty / cache ----------
function todayStr() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

function timeStr() {
  const d = new Date();
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
}

function loadJSON(key) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : null;
  } catch {
    return null;
  }
}

function saveJSON(key, v) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}

// ---------- kurs EUR/PLN ----------
async function refreshFX() {
  try {
    const r = await fetch("https://api.frankfurter.dev/v1/latest?base=EUR&symbols=PLN");
    const j = await r.json();
    if (j && j.rates && j.rates.PLN) {
      FX = { rate: j.rates.PLN, date: todayStr(), at: timeStr() };
      saveJSON(LS.fx, FX);
    }
  } catch {
    /* offline */
  }
}

function loadFX() {
  const c = loadJSON(LS.fx);
  if (c && c.date === todayStr() && c.rate) {
    FX = c;
    return false;
  }
  return true;
}

// ---------- cena paliwa ----------
async function refreshFuel() {
  try {
    const r = await fetch("https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroProvincia/29");
    const j = await r.json();
    const list = (j && j.ListaEESSPrecio) || [];
    let sum = 0;
    let n = 0;
    for (let i = 0; i < list.length; i++) {
      const raw = String(list[i]["Precio Gasolina 95 E5"] || "").replace(",", ".");
      const p = parseFloat(raw);
      if (Number.isFinite(p) && p > 0) {
        sum += p;
        n++;
      }
    }
    if (n > 0) {
      FUEL = { avg: +(sum / n).toFixed(3), date: todayStr(), at: timeStr() };
      saveJSON(LS.fuel, FUEL);
    }
  } catch {
    /* offline */
  }
}

function loadFuel() {
  const c = loadJSON(LS.fuel);
  if (c && c.date === todayStr() && c.avg) {
    FUEL = c;
    return false;
  }
  return true;
}

// ---------- pogoda ----------
async function refreshWeather() {
  const byDate = {};
  await Promise.all(
    TRIP.cities.map(async (c) => {
      const co = CITIES_COORDS[c.id];
      if (!co) return;
      try {
        const url =
          "https://api.open-meteo.com/v1/forecast?latitude=" + co.lat + "&longitude=" + co.lng +
          "&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FMadrid&forecast_days=16";
        const r = await fetch(url);
        const j = await r.json();
        if (j && j.daily && j.daily.time) {
          j.daily.time.forEach((t, i) => {
            const code = j.daily.weather_code[i];
            const w = WMO[code] || ["🌡️", "Zmienna"];
            byDate[t] = {
              code,
              icon: w[0],
              label: w[1],
              tmax: Math.round(j.daily.temperature_2m_max[i]),
              tmin: Math.round(j.daily.temperature_2m_min[i]),
            };
          });
        }
      } catch {
        /* offline */
      }
    })
  );
  WX_BY_DATE = byDate;
  saveJSON(LS.weather, { date: todayStr(), byDate });
}

function loadWeather() {
  const c = loadJSON(LS.weather);
  if (c && c.date === todayStr() && c.byDate) {
    WX_BY_DATE = c.byDate;
    return false;
  }
  return true;
}

async function refreshCurrent() {
  try {
    const co = CITIES_COORDS.malaga;
    const r = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=" + co.lat + "&longitude=" + co.lng +
      "&current_weather=true"
    );
    const j = await r.json();
    if (j && j.current_weather) {
      const c = j.current_weather;
      const w = WMO[c.weathercode] || ["🌡️", "Zmienna"];
      CURRENT = { temp: Math.round(c.temperature_2m), code: c.weathercode, icon: w[0], label: w[1] };
      saveJSON(LS.current, { date: todayStr(), value: CURRENT });
    }
  } catch {
    /* offline */
  }
}

function loadCurrent() {
  const c = loadJSON(LS.current);
  if (c && c.date === todayStr() && c.value) {
    CURRENT = c.value;
    return false;
  }
  return true;
}

// ---------- news (Wikimedia OnThisDay, es) ----------
async function refreshNews() {
  try {
    const d = new Date();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const r = await fetch(
      "https://api.wikimedia.org/feed/v1/wikipedia/es/onthisday/events/" + mm + "/" + dd,
      { headers: { "User-Agent": "PrzewodnikAndaluzja/1.0 (osobisty; kontakt test@example.com)" } }
    );
    const j = await r.json();
    const evs = (j && j.events) || [];
    if (!evs.length) return;
    const ES = /españa|español|madrid|barcelona|andalu|sevill|córdoba|granada|málaga|malaga|cádiz|huelva|jaén|española/i;
    const pick = evs.find((e) => ES.test(e.text)) || evs[0];
    if (pick && pick.text) {
      NEWS = { text: pick.text };
      saveJSON(LS.news, { date: todayStr(), text: pick.text });
    }
  } catch {
    /* offline */
  }
}

function loadNews() {
  const c = loadJSON(LS.news);
  if (c && c.date === todayStr() && c.text) {
    NEWS = { text: c.text };
    return false;
  }
  return true;
}

function wxSeverity(w) {
  if (!w) return "";
  if (STORM_CODES.has(w.code)) return "storm";
  if (w.tmax >= HEAT_T) return "hot";
  if (RAIN_CODES.has(w.code)) return "rain";
  return "";
}

function tripDays() {
  const days = [];
  TRIP.cities.forEach((c) => c.days.forEach((d) => days.push({ city: c, day: d })));
  days.sort((a, b) => a.day.num - b.day.num);
  return days;
}

function weatherChip(dateStr) {
  const w = dateStr ? WX_BY_DATE[dateStr] : null;
  if (!w) return "";
  const sev = wxSeverity(w);
  const cls = sev ? " wx-chip--" + sev : "";
  const badge =
    sev === "storm" ? '<b class="wx-badge">⛈</b>'
      : sev === "rain" ? '<b class="wx-badge">☔</b>'
        : sev === "hot" ? '<b class="wx-badge">🔥</b>'
          : "";
  return (
    '<span class="wx-chip' + cls + '" title="' + escapeHtml(w.label) + '">' +
    w.icon +
    "<span>" + w.tmax + "°</span><span class=\"wx-chip__min\">" + w.tmin + "°</span>" +
    badge +
    "</span>"
  );
}

// alerty pogodowe na najbliższe dni (zwięźle)
function weatherAlerts() {
  const seen = {};
  const out = [];
  tripDays().forEach(({ day }) => {
    const w = WX_BY_DATE[day.date];
    if (!w) return;
    const sev = wxSeverity(w);
    if (!sev || seen[sev]) return;
    seen[sev] = true;
    const label = day.dateLabel;
    if (sev === "storm") out.push("⛈ burza · " + label);
    else if (sev === "rain") out.push("☔ deszcz · " + label);
    else if (sev === "hot") out.push("🔥 upał · " + label);
  });
  return out;
}

// ---------- helpers renderujące ----------
function sectionHead(kicker, title, lead) {
  return (
    `<div class="section__head">` +
    (kicker ? `<p class="section__kicker">${escapeHtml(kicker)}</p>` : "") +
    `<h2 class="section__title">${escapeHtml(title)}</h2>` +
    (lead ? `<p class="section__lead">${escapeHtml(lead)}</p>` : "") +
    `</div>`
  );
}

function subhead(text, hint) {
  return (
    `<div class="subhead"><span>${text}</span>` +
    (hint ? `<span class="subhead__hint">${escapeHtml(hint)}</span>` : "") +
    `</div>`
  );
}

function chip(text, cls) {
  if (!text) return "";
  return `<span class="chip ${cls || ""}">${escapeHtml(text)}</span>`;
}

// ---------- pasek live (kurs/paliwo/pogoda/alert/news) ----------
function renderLiveStrip() {
  let stats = "";
  stats +=
    `<div class="live-cell"><span class="live-cell__k">Teraz Málaga</span>` +
    `<span class="live-cell__v">${CURRENT ? CURRENT.icon + " " + CURRENT.temp + "°" : "…"}</span></div>`;
  stats +=
    `<div class="live-cell"><span class="live-cell__k">EUR/PLN</span>` +
    `<span class="live-cell__v">${FX ? FX.rate.toFixed(3) : "…"} zł</span></div>`;
  stats +=
    `<div class="live-cell"><span class="live-cell__k">Benzyna 95</span>` +
    `<span class="live-cell__v">${FUEL ? FUEL.avg.toFixed(3) : "…"} €/l</span></div>`;

  let alerts = "";
  const al = weatherAlerts();
  if (al.length) {
    alerts =
      `<div class="live-alerts">` +
      al.map((a) => `<span class="alert-badge">${escapeHtml(a)}</span>`).join("") +
      `</div>`;
  }

  let news = "";
  if (NEWS && NEWS.text) {
    news = `<div class="news-line">📰 ${escapeHtml(NEWS.text)}</div>`;
  }

  const note =
    `<div class="live-note"><span class="live-dot" aria-hidden="true"></span>` +
    `<span class="mono-note">na żywo · odświeżane codziennie</span></div>`;

  return `<div class="live-card panel"><div class="live-stats">${stats}</div>${alerts}${news}${note}</div>`;
}

// ---------- ekrany ----------
function renderHome() {
  const days = tripDays();

  const hero =
    `<section class="hero">` +
    `<span class="hero__badge">🇪🇸 Hiszpania · wrzesień 2026</span>` +
    `<h1>Przewodnik po <span class="accent">Andaluzji</span></h1>` +
    `<p class="hero__sub">Malaga → Tolox → Estepona · 9 dni · 2 osoby</p>` +
    `</section>`;

  const liveWrap =
    `<div class="content" style="padding-top:0.9rem">${renderLiveStrip()}</div>`;

  const cityList =
    `<section class="section">` +
    sectionHead("Bazy noclegowe", "Miasta", "Trzy bazy, trasa samochodem.") +
    `<div class="content">` +
    TRIP.cities
      .map(
        (c) =>
          `<button class="btn btn--block" data-action="city" data-id="${escapeHtml(c.id)}">` +
          `<span>📍 ${escapeHtml(c.name)} <span class="btn__meta">· ${escapeHtml(c.dates)}</span></span>` +
          `<span class="btn__arrow">›</span>` +
          `</button>`
      )
      .join("") +
    `</div></section>`;

  const dayList =
    `<section class="section">` +
    sectionHead("Dzień po dniu", "Plan podróży", "Wybierz dzień, aby zobaczyć szczegóły i pogodę.") +
    `<div class="day-list">` +
    days
      .map(
        ({ city, day }) =>
          `<button class="day-card" data-action="day" data-city="${escapeHtml(city.id)}" data-num="${day.num}">` +
          `<span class="day-card__num"><b>${day.num}</b><span>DZIEŃ</span></span>` +
          `<span class="day-card__body">` +
          `<span class="day-card__title">${escapeHtml(day.title)}</span>` +
          `<span class="day-card__sub">${escapeHtml(day.dateLabel)}${day.weekday ? " · " + escapeHtml(day.weekday) : ""}</span>` +
          `<span class="day-card__meta-row">${chip(city.name, "chip--signal")}${weatherChip(day.date)}</span>` +
          `</span>` +
          `<span class="btn__arrow">›</span>` +
          `</button>`
      )
      .join("") +
    `</div></section>`;

  return `<div>${hero}${liveWrap}${cityList}${dayList}<div class="safe-bottom"></div></div>`;
}

function renderDays() {
  const days = tripDays();
  let html = `<div>`;
  html += sectionHead("Plan podróży", "Wszystkie dni", "Dziewięć dni w Andaluzji — z prognozą.");
  html += `<div class="day-list">`;

  let lastCity = "";
  days.forEach(({ city, day }) => {
    if (city.id !== lastCity) {
      lastCity = city.id;
      html += `<div class="check-group__title">📍 ${escapeHtml(city.name)} · ${escapeHtml(city.dates)}</div>`;
    }
    html +=
      `<button class="day-card" data-action="day" data-city="${escapeHtml(city.id)}" data-num="${day.num}">` +
      `<span class="day-card__num"><b>${day.num}</b><span>DZIEŃ</span></span>` +
      `<span class="day-card__body">` +
      `<span class="day-card__title">${escapeHtml(day.title)}</span>` +
      `<span class="day-card__sub">${escapeHtml(day.theme || day.dateLabel)}</span>` +
      `<span class="day-card__meta-row">${weatherChip(day.date)}</span>` +
      `</span>` +
      `<span class="btn__arrow">›</span>` +
      `</button>`;
  });

  html += `</div><div class="safe-bottom"></div></div>`;
  return html;
}

function progressCard(title, items) {
  const checks = getChecks();
  const done = items.filter((it) => isDone(checks, it.key)).length;
  const total = items.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  return (
    `<div class="progress-card panel">` +
    `<div class="progress-card__head"><span class="progress-card__title">${escapeHtml(title)}</span>` +
    `<span class="progress-card__count">${done}/${total}</span></div>` +
    `<div class="bar" role="progressbar" aria-valuenow="${done}" aria-valuemin="0" aria-valuemax="${total}">` +
    `<div class="bar__fill" style="width:${pct}%"></div></div>` +
    `</div>`
  );
}

function checklistItem(key, label, meta, done) {
  return (
    `<button class="check-item${done ? " is-done" : ""}" data-action="toggle" data-key="${escapeHtml(key)}">` +
    `<span class="check-item__box">${done ? "✓" : ""}</span>` +
    `<span class="check-item__label">${escapeHtml(label)}${meta ? `<div class="check-item__meta">${escapeHtml(meta)}</div>` : ""}</span>` +
    `</button>`
  );
}

function renderChecklists() {
  const checks = getChecks();

  const attractionItems = TRIP.summaryAttractions.map((a) => ({ key: a.key, label: a.name, meta: a.city }));
  const restaurantItems = [];
  const seenRes = new Set();
  TRIP.summaryRestaurants.forEach((r) => {
    if (seenRes.has(r.key)) return;
    seenRes.add(r.key);
    restaurantItems.push({ key: r.key, label: r.name, meta: r.city });
  });
  const packItems = TRIP.packFlat.map((p) => ({ key: p.key, label: p.label, meta: "" }));

  const allCheck = [...attractionItems, ...restaurantItems, ...packItems];
  const allDone = allCheck.filter((i) => isDone(checks, i.key)).length;

  let html = `<div>`;
  html += sectionHead("Listy do odhaczania", "Checklisty", "Zaznacz co zrobiłaś — zapisuje się automatycznie.");
  html += progressCard("Cały wyjazd", allCheck);

  html += `<div class="check-group panel">`;
  html += `<div class="check-group__title">🏛️ Atrakcje (${attractionItems.filter((i) => isDone(checks, i.key)).length}/${attractionItems.length})</div>`;
  attractionItems.forEach((it) => {
    const pin = pinAnchor(slug(it.meta), it.label, "pin-btn--inline");
    html += '<div class="check-row">' + checklistItem(it.key, it.label, it.meta, isDone(checks, it.key)) + pin + "</div>";
  });
  html += `</div>`;

  html += `<div class="check-group panel">`;
  html += `<div class="check-group__title">🍽️ Restauracje (${restaurantItems.filter((i) => isDone(checks, i.key)).length}/${restaurantItems.length})</div>`;
  restaurantItems.forEach((it) => {
    const pin = pinAnchor(slug(it.meta), it.label, "pin-btn--inline");
    html += '<div class="check-row">' + checklistItem(it.key, it.label, it.meta, isDone(checks, it.key)) + pin + "</div>";
  });
  html += `</div>`;

  html += `<div class="check-group panel">`;
  html += `<div class="check-group__title">🧳 Rzeczy do zabrania (${packItems.filter((i) => isDone(checks, i.key)).length}/${packItems.length})</div>`;
  packItems.forEach((it) => {
    html += `<button class="pack-item${isDone(checks, it.key) ? " is-done" : ""}" data-action="toggle" data-key="${escapeHtml(it.key)}">` +
      `<span class="pack-item__box">${isDone(checks, it.key) ? "✓" : ""}</span>` +
      `<span class="pack-item__label">${escapeHtml(it.label)}</span>` +
      `</button>`;
  });
  html += `</div>`;

  html += `<div class="safe-bottom"></div></div>`;
  return html;
}

function renderPhrases() {
  let html = `<div>`;
  html += sectionHead("Rozmówki", "Hiszpański w pigułce", "Przydatne zwroty z wymową oraz numery alarmowe.");
  html += `<div class="content">`;

  html += subhead("📞 Numery obowiązujące w Hiszpanii", "dotknij, aby zadzwonić");
  html += `<div class="emergency-list panel">`;
  PHRASES.emergency.forEach((e) => {
    html +=
      `<a class="emergency-item" href="tel:${escapeHtml(e.tel)}">` +
      `<span class="emergency-item__main">` +
      `<span class="emergency-item__title">${escapeHtml(e.title)}</span>` +
      (e.desc ? `<span class="emergency-item__desc">${escapeHtml(e.desc)}</span>` : "") +
      `</span>` +
      `<span class="emergency-item__value">📞 ${escapeHtml(e.value)}</span>` +
      `</a>`;
  });
  html += `</div>`;

  PHRASES.groups.forEach((g) => {
    html += subhead(g.title, "· " + (g.hint || ""));
    html += `<div class="phrase-list panel">`;
    g.items.forEach((it) => {
      html +=
        `<div class="phrase-row">` +
        `<span class="phrase-row__pl">${escapeHtml(it.pl)}</span>` +
        `<span class="phrase-row__es">${escapeHtml(it.es)}</span>` +
        `<span class="phrase-row__say">${escapeHtml(it.say)}</span>` +
        `</div>`;
    });
    html += `</div>`;
  });

  html += subhead("🔤 Wymowa w skrócie", "");
  html += `<div class="info-table panel">`;
  (PHRASES.pronunciation || []).forEach((r) => {
    html += `<div class="info-row"><div class="info-row__k">${escapeHtml(r.rule)}</div><div class="info-row__v">${escapeHtml(r.example)}</div></div>`;
  });
  html += `</div>`;

  html += `</div><div class="safe-bottom"></div></div>`;
  return html;
}

function renderInfo() {
  const general = TRIP.general || {};
  const generalRows = Object.keys(general)
    .map((k) => `<div class="info-row"><div class="info-row__k">${escapeHtml(k)}</div><div class="info-row__v">${escapeHtml(general[k])}</div></div>`)
    .join("");

  const routeCards = (TRIP.routes || [])
    .map(
      (r) =>
        `<div class="route-card panel">` +
        `<div class="route-card__top"><span>🚗 ${escapeHtml(r.from)} → ${escapeHtml(r.to)}</span>` +
        `<span class="chip chip--signal">${escapeHtml(r.time + (r.distance ? " · " + r.distance : ""))}</span></div>` +
        (r.notes ? `<div class="route-card__note">${escapeHtml(r.notes)}</div>` : "") +
        `</div>`
    )
    .join("");

  const tipsList =
    `<div class="tip">` +
    `<div class="tip__title">💡 Wskazówki</div>` +
    `<ul>` +
    (TRIP.generalTips || []).map((t) => `<li>${escapeHtml(t)}</li>`).join("") +
    `</ul></div>`;

  const packingGroups = (TRIP.packing || [])
    .map(
      (g) =>
        `<div class="pack-group panel">` +
        `<div class="pack-group__title">${escapeHtml(g.label)} (${g.items.length})</div>` +
        g.items.map((it) => `<div class="pack-item"><span class="pack-item__box"></span><span class="pack-item__label">${escapeHtml(it.label)}</span></div>`).join("") +
        `</div>`
    )
    .join("");

  return (
    `<div>` +
    sectionHead("Informacje", "W pigułce", "Dane wyjazdu, trasy, kurs i wskazówki.") +
    `<div class="content">` +
    `<div class="info-table panel">${generalRows}</div>` +
    `<div class="section__head" style="padding-left:0"><h2 class="section__title" style="font-size:var(--fs-xl)">Na żywo</h2></div>` +
    renderLiveStrip() +
    `<div class="section__head" style="padding-left:0"><h2 class="section__title" style="font-size:var(--fs-xl)">Trasy samochodowe</h2></div>` +
    routeCards +
    `<div class="section__head" style="padding-left:0"><h2 class="section__title" style="font-size:var(--fs-xl)">Rzeczy do zabrania</h2></div>` +
    packingGroups +
    tipsList +
    `</div><div class="safe-bottom"></div></div>`
  );
}

function renderCity(city) {
  const dayButtons = city.days
    .map(
      (d) =>
        `<button class="day-card" data-action="day" data-city="${escapeHtml(city.id)}" data-num="${d.num}">` +
        `<span class="day-card__num"><b>${d.num}</b><span>DZIEŃ</span></span>` +
        `<span class="day-card__body">` +
        `<span class="day-card__title">${escapeHtml(d.title)}</span>` +
        `<span class="day-card__sub">${escapeHtml(d.theme || d.dateLabel)}</span>` +
        `<span class="day-card__meta-row">${weatherChip(d.date)}</span>` +
        `</span>` +
        `<span class="btn__arrow">›</span>` +
        `</button>`
    )
    .join("");

  const cityMap = (() => {
    const p = PLACES[city.id];
    if (!p) return "";
    const href = mapsUrl(p.label, p.lat, p.lng);
    return `<a class="map-link" href="${escapeHtml(href)}" target="_blank" rel="noopener">📍 Zobacz na mapie</a>`;
  })();

  return (
    `<div>` +
    `<div class="detail__header"><button class="back-btn" data-action="back">‹ Wróć</button></div>` +
    `<h1 class="detail__title">📍 ${escapeHtml(city.name)}</h1>` +
    `<div class="detail__meta">${chip(city.dates, "chip--signal")}${chip(city.tagline, "")}${city.accommodation ? chip("🏨 " + city.accommodation, "chip--terra") : ""}</div>` +
    (cityMap ? `<div class="detail__body" style="padding-bottom:0">${cityMap}</div>` : "") +
    `<div class="detail__body">` +
    `<div class="day-list panel">` +
    `<div class="check-group__title">Dni w tym mieście</div>` +
    dayButtons +
    `</div>` +
    `</div><div class="safe-bottom"></div></div>`
  );
}

function restaurantRow(r, done, cityId) {
  const pin = pinAnchor(cityId, r.name, "pin-btn--inline");
  return (
    `<div class="check-row${done ? " check-row--done" : ""}">` +
    `<button class="check-item${done ? " is-done" : ""}" data-action="toggle" data-key="${escapeHtml(r.key)}">` +
    `<span class="check-item__box">${done ? "✓" : ""}</span>` +
    `<span class="check-item__label">${escapeHtml(r.name)}` +
    `<div class="check-item__meta">${escapeHtml([r.type, r.price, r.reservation].filter(Boolean).join(" · "))}</div></span>` +
    `</button>` +
    pin +
    `</div>`
  );
}

function attractionCard(a, done, cityId) {
  const pin = pinAnchor(cityId, a.name, "pin-btn--inline");
  const toggleKey = "attr|" + cityId + "|" + a.name.trim();
  return (
    `<div class="attraction-card panel">` +
    `<div class="attraction-card__head">` +
    `<button class="attraction-card__title" data-action="toggle" data-key="${escapeHtml(toggleKey)}">` +
    `<span>${done ? "✅" : "⬜"}</span><span>${escapeHtml(a.name)}</span>` +
    `</button>` +
    pin +
    `</div>` +
    (a.desc ? `<div class="attraction-card__desc">${escapeHtml(a.desc)}</div>` : "") +
    (a.extras && a.extras.length ? `<div class="attraction-card__extra">${a.extras.map(escapeHtml).join("<br>")}</div>` : "") +
    `</div>`
  );
}

function renderDay(city, day) {
  const checks = getChecks();

  const itemList = day.items
    .map((it) => '<div class="check-row">' + checklistItem(it.key, it.label, "", isDone(checks, it.key)) + itemPin(city.id, it.label) + "</div>")
    .join("");

  const attractionCards = day.attractions
    .map((a) => attractionCard(a, isDone(checks, "attr|" + city.id + "|" + a.name.trim()), city.id))
    .join("");

  const restaurantRows = day.restaurants
    .map((r) => restaurantRow(r, isDone(checks, r.key), city.id))
    .join("");

  const tipsBlock = day.tips && day.tips.length
    ? `<div class="tip"><div class="tip__title">💡 Wskazówki</div><ul>${day.tips.map((t) => `<li>${escapeHtml(t)}</li>`).join("")}</ul></div>`
    : "";

  const driveBlock = day.drive
    ? `<div class="route-card panel"><div class="route-card__top"><span>🚗 ${escapeHtml(day.drive.from)} → ${escapeHtml(day.drive.to)}</span><span class="chip chip--signal">${escapeHtml(day.drive.time + (day.drive.distance ? " · " + day.drive.distance : ""))}</span></div></div>`
    : "";

  const prev = day.num > 1;
  const next = day.num < 9;

  return (
    `<div>` +
    `<div class="detail__header">` +
    `<button class="back-btn" data-action="back">‹ Wróć</button>` +
    `<div style="flex:1"></div>` +
    (prev ? `<button class="back-btn" data-action="goto-day" data-num="${day.num - 1}">‹</button>` : "") +
    (next ? `<button class="back-btn" data-action="goto-day" data-num="${day.num + 1}">›</button>` : "") +
    `</div>` +
    `<div class="detail__title">Dzień ${day.num} — ${escapeHtml(day.title)}</div>` +
    `<div class="detail__meta">` +
    chip(city.name, "chip--signal") +
    chip(day.dateLabel, "") +
    (day.weekday ? chip(day.weekday, "") : "") +
    (weatherChip(day.date) ? weatherChip(day.date) : "") +
    `</div>` +
    (day.theme ? `<div class="detail__body" style="padding-bottom:0"><div class="tip"><div class="tip__title">Temat dnia</div><p>${escapeHtml(day.theme)}</p></div></div>` : "") +
    `<div class="detail__body">` +
    driveBlock +
    (day.items.length ? `<div class="section__head" style="padding-left:0"><h2 class="section__title" style="font-size:var(--fs-xl)">Plan dnia</h2></div><div class="info-table panel">${itemList}</div>` : "") +
    (day.attractions.length ? `<div class="section__head" style="padding-left:0"><h2 class="section__title" style="font-size:var(--fs-xl)">Atrakcje</h2></div>${attractionCards}` : "") +
    (day.restaurants.length ? `<div class="section__head" style="padding-left:0"><h2 class="section__title" style="font-size:var(--fs-xl)">Restauracje</h2></div><div class="info-table panel">${restaurantRows}</div>` : "") +
    tipsBlock +
    `</div><div class="safe-bottom"></div></div>`
  );
}

function render(keepScroll) {
  const prevScroll = window.scrollY;
  let html = "";
  if (state.view) {
    if (state.view.kind === "city") {
      const city = TRIP.cities.find((c) => c.id === state.view.id);
      html = city ? renderCity(city) : renderHome();
    } else if (state.view.kind === "day") {
      const city = TRIP.cities.find((c) => c.id === state.view.cityId);
      const day = city && city.days.find((d) => d.num === state.view.num);
      html = city && day ? renderDay(city, day) : renderDays();
    }
  } else {
    html =
      state.tab === "home"
        ? renderHome()
        : state.tab === "days"
          ? renderDays()
          : state.tab === "checklists"
            ? renderChecklists()
            : state.tab === "phrases"
              ? renderPhrases()
              : renderInfo();
  }

  $app.innerHTML = html;
  if (keepScroll) window.scrollTo(0, prevScroll);
  else window.scrollTo(0, 0);
  updateTabbar();
  updateZoomButtons();
}

function updateTabbar() {
  const tabs = $tabbar.querySelectorAll(".tab");
  tabs.forEach((t) => {
    const active = !state.view && t.dataset.tab === state.tab;
    t.classList.toggle("is-active", !!active);
  });
}

function findDay(num) {
  for (const c of TRIP.cities) {
    for (const d of c.days) {
      if (d.num === num) return { city: c, day: d };
    }
  }
  return null;
}

// ---------- zdarzenia ----------
function handleClick(e) {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;

  if (action === "tab") {
    state.view = null;
    state.tab = el.dataset.tab;
    render();
    return;
  }
  if (action === "city") {
    state.view = { kind: "city", id: el.dataset.id };
    render();
    return;
  }
  if (action === "day") {
    state.view = { kind: "day", cityId: el.dataset.city, num: parseInt(el.dataset.num, 10) };
    render();
    return;
  }
  if (action === "goto-day") {
    const found = findDay(parseInt(el.dataset.num, 10));
    if (found) {
      state.view = { kind: "day", cityId: found.city.id, num: found.day.num };
      render();
    }
    return;
  }
  if (action === "back") {
    state.view = null;
    render();
    return;
  }
  if (action === "toggle") {
    toggleCheck(el.dataset.key);
    return;
  }
}

// ---------- start ----------
document.getElementById("zoomIn").addEventListener("click", () => zoomBy(1));
document.getElementById("zoomOut").addEventListener("click", () => zoomBy(-1));

$tabbar.addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (tab) {
    state.view = null;
    state.tab = tab.dataset.tab;
    render();
  }
});

$app.addEventListener("click", handleClick);

function loadLive() {
  const needFx = loadFX();
  const needFuel = loadFuel();
  const needWx = loadWeather();
  const needCurrent = loadCurrent();
  const needNews = loadNews();

  return Promise.all([
    needFx ? refreshFX() : Promise.resolve(),
    needFuel ? refreshFuel() : Promise.resolve(),
    needWx ? refreshWeather() : Promise.resolve(),
    needCurrent ? refreshCurrent() : Promise.resolve(),
    needNews ? refreshNews() : Promise.resolve(),
  ]).then(() => render(true));
}

function init() {
  applyZoom();
  render();
  const splash = document.getElementById("splash");
  if (splash) splash.remove();

  loadLive();

  setInterval(() => {
    const today = todayStr();
    if (today !== activeDay) {
      activeDay = today;
      loadLive();
    }
  }, 60 * 1000);
}

init();