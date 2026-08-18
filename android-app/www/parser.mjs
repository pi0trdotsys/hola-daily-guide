// Parser przewodnika z pliku Markdown (trip.md) do struktury danych.
// Markdown = jedyna "baza danych" aplikacji.

const CITY_TAGLINES = {
  malaga: "Port, Stare Miasto, Picasso",
  tolox: "Białe pueblo w górach",
  estepona: "Plaże i miasto kwiatów",
};

const PACK_LABELS = {
  essentials: "Niezbędne",
  beach: "Na plażę",
  trekking: "W góry / trekking",
};

function slug(name) {
  return String(name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function stripQuotes(s) {
  s = String(s == null ? "" : s).trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  return s.trim();
}

function stripMd(s) {
  return String(s == null ? "" : s)
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/&nbsp;/g, " ");
}

function indentOf(s) {
  let n = 0;
  while (n < s.length && s[n] === " ") n++;
  return n;
}

function findKeyColon(s) {
  let inQ = false;
  let q = "";
  for (let k = 0; k < s.length; k++) {
    const ch = s[k];
    if (ch === '"' || ch === "'") {
      if (!inQ) {
        inQ = true;
        q = ch;
      } else if (q === ch) {
        inQ = false;
      }
      continue;
    }
    if (!inQ && ch === ":") return k;
  }
  return -1;
}

function parseScalar(s) {
  s = String(s).trim();
  if (s === "~" || s === "null" || s === "") return null;
  if (s === "true") return true;
  if (s === "false") return false;
  return stripQuotes(s);
}

function parseInlineArray(s) {
  const inner = s.trim().replace(/^\[/, "").replace(/\]$/, "");
  if (!inner.trim()) return [];
  return inner.split(",").map((x) => parseScalar(x));
}

function parseNode(lines, i, indent) {
  if (i >= lines.length) return [null, i];
  const ind = indentOf(lines[i]);
  if (ind < indent) return [null, i];
  const t = lines[i].trim();
  if (t === "-") return [null, i + 1];
  if (t.startsWith("- ")) return parseSeq(lines, i, ind);
  if (t.includes(":")) return parseMap(lines, i, ind);
  return [null, i];
}

function parseSeq(lines, i, indent) {
  const arr = [];
  while (i < lines.length) {
    const ind = indentOf(lines[i]);
    if (ind < indent) break;
    if (ind !== indent) {
      i++;
      continue;
    }
    const t = lines[i].trim();
    if (!t.startsWith("- ") && t !== "-") break;
    const rest = t === "-" ? "" : t.slice(2).trim();
    i++;
    if (rest === "") {
      const [v, ni] = parseNode(lines, i, indent + 2);
      arr.push(v);
      i = ni;
      continue;
    }
    const c = findKeyColon(rest);
    if (c !== -1) {
      const item = {};
      const key = rest.slice(0, c).trim();
      const val = rest.slice(c + 1).trim();
      if (val === "" || val === "~") {
        const [v, ni] = parseNode(lines, i, indent + 2);
        item[key] = v;
        i = ni;
      } else {
        item[key] = parseScalar(val);
        // kontynuacja kluczy mapy w elemencie sekwencji (wcięcie +2)
        while (i < lines.length && indentOf(lines[i]) === indent + 2) {
          const t2 = lines[i].trim();
          if (t2.startsWith("- ") || t2 === "-") break;
          const c2 = findKeyColon(t2);
          if (c2 === -1) {
            i++;
            continue;
          }
          const k2 = t2.slice(0, c2).trim();
          const v2 = t2.slice(c2 + 1).trim();
          if (v2 === "" || v2 === "~") {
            const [vv, ni] = parseNode(lines, i, indent + 4);
            item[k2] = vv;
            i = ni;
          } else {
            item[k2] = parseScalar(v2);
            i++;
          }
        }
      }
      arr.push(item);
    } else {
      arr.push(parseScalar(rest));
    }
  }
  return [arr, i];
}

function parseMap(lines, i, indent) {
  const obj = {};
  while (i < lines.length) {
    const ind = indentOf(lines[i]);
    if (ind < indent) break;
    if (ind !== indent) {
      i++;
      continue;
    }
    const t = lines[i].trim();
    if (t.startsWith("- ")) break;
    const c = findKeyColon(t);
    if (c === -1) {
      i++;
      continue;
    }
    const key = t.slice(0, c).trim();
    const val = t.slice(c + 1).trim();
    i++;
    if (val === "" || val === "~") {
      const [v, ni] = parseNode(lines, i, indent + 2);
      obj[key] = v;
      i = ni;
    } else if (val.startsWith("[")) {
      obj[key] = parseInlineArray(val);
    } else if (val.startsWith("- ")) {
      const seq = [parseScalar(val.slice(2).trim())];
      while (i < lines.length && indentOf(lines[i]) === indent + 2 && lines[i].trim().startsWith("- ")) {
        seq.push(parseScalar(lines[i].trim().slice(2).trim()));
        i++;
      }
      obj[key] = seq;
    } else {
      obj[key] = parseScalar(val);
    }
  }
  return [obj, i];
}

function parseYaml(lines) {
  const L = lines.map((l) => l.replace(/\t/g, "  ")).filter((l) => l.trim() !== "");
  const [res] = parseNode(L, 0, 0);
  return res || {};
}

export function parseMarkdown(text) {
  const lines = String(text).split(/\r?\n/);
  const data = {
    title: "",
    general: {},
    generalTips: [],
    cities: [],
    routes: [],
    packing: [],
    summaryAttractions: [],
    summaryRestaurants: [],
    packFlat: [],
  };

  let i = 0;
  let currentCity = null;
  let currentDay = null;
  let section = "start"; // start|general|city|routes|packing|generalTips|summary
  let summaryMode = ""; // attr | res
  let dayContext = null; // attractions | restaurants | tips | items
  let expectCityMeta = false;
  let expectDayMeta = false;

  // Front-matter YAML (--- ... ---) pomijamy — dane są w treści.
  if (lines.length && lines[0].trim() === "---") {
    i = 1;
    while (i < lines.length && lines[i].trim() !== "---") i++;
    i++;
  }

  const splitRow = (line) => {
    let cells = line.split("|");
    if (cells.length && cells[0].trim() === "") cells = cells.slice(1);
    if (cells.length && cells[cells.length - 1].trim() === "") cells.pop();
    return cells.map((s) => s.trim());
  };

  const handleTable = (header, rows) => {
    const h = header.map((x) => x.toLowerCase());
    if (section === "general") {
      rows.forEach((r) => {
        if (r[0]) data.general[r[0]] = r[1] || "";
      });
    } else if (section === "summary") {
      if (summaryMode === "attr") {
        rows.forEach((r) => {
          if (r[0] && r[1]) data.summaryAttractions.push({ city: r[0], name: r[1] });
        });
      } else if (summaryMode === "res") {
        rows.forEach((r) => {
          if (r[0] && r[1]) data.summaryRestaurants.push({ city: r[0], name: r[1] });
        });
      }
    } else if (currentDay && (dayContext === "restaurants" || h.includes("nazwa"))) {
      rows.forEach((r) => {
        if (r[0]) {
          currentDay.restaurants.push({
            name: r[0],
            type: r[1] || "",
            price: r[2] || "",
            reservation: r[3] || "",
          });
        }
      });
    }
  };

  const normalizeRoute = (r) => ({
    from: r.from || "",
    to: r.to || "",
    distance: r.distance_km !== undefined && r.distance_km !== null ? stripQuotes(String(r.distance_km)) : "",
    time: r.time_approx ? stripQuotes(String(r.time_approx)) : "",
    notes: r.notes ? stripQuotes(String(r.notes)) : "",
  });

  const normalizeDrive = (d) => ({
    from: d.from || "",
    to: d.to || "",
    distance: d.distance_km !== undefined && d.distance_km !== null ? stripQuotes(String(d.distance_km)) : "",
    time: d.time_approx ? stripQuotes(String(d.time_approx)) : "",
  });

  const normalizePacking = (p) => {
    const groups = [];
    for (const g of Object.keys(p)) {
      groups.push({
        group: g,
        label: PACK_LABELS[g] || g,
        items: (p[g] || []).map((x) => stripQuotes(String(x))),
      });
    }
    return groups;
  };

  const handleYaml = (fence) => {
    const obj = parseYaml(fence);
    if (section === "routes") {
      data.routes = (obj.routes || []).map(normalizeRoute);
      return;
    }
    if (section === "packing") {
      data.packing = normalizePacking(obj.packing || {});
      return;
    }
    if (section === "generalTips") {
      data.generalTips = (obj.general_tips || obj.tips || []).map((x) => stripQuotes(String(x)));
      return;
    }
    if (expectCityMeta && currentCity) {
      if (obj.dates) currentCity.dates = stripQuotes(String(obj.dates));
      if (obj.accommodation) currentCity.accommodation = String(obj.accommodation);
      expectCityMeta = false;
      return;
    }
    if (expectDayMeta && currentDay) {
      if (obj.date) currentDay.date = stripQuotes(String(obj.date));
      if (obj.theme) currentDay.theme = stripQuotes(String(obj.theme));
      if (obj.drive) currentDay.drive = normalizeDrive(obj.drive);
      expectDayMeta = false;
      return;
    }
    if (dayContext === "tips" && currentDay) {
      currentDay.tips = (obj.tips || []).map((x) => stripQuotes(String(x)));
      return;
    }
  };

  while (i < lines.length) {
    const raw = lines[i];
    const t = raw.trim();

    if (t === "" || /^-{3,}$/.test(t)) {
      i++;
      continue;
    }

    // Blok kodu ``` ... ```
    if (t.startsWith("```")) {
      const fence = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        fence.push(lines[i]);
        i++;
      }
      i++; // pomiń zamykające ```
      handleYaml(fence);
      continue;
    }

    if (t.startsWith("#### ")) {
      const htext = t.slice(5).trim();
      if (/restauracje/i.test(htext)) dayContext = "restaurants";
      else if (/atrakcje/i.test(htext)) dayContext = "attractions";
      else if (/opcje trekkingu/i.test(htext)) dayContext = "attractions";
      else if (/wskazówki/i.test(htext)) dayContext = "tips";
      else dayContext = "items";
      i++;
      continue;
    }

    if (t.startsWith("### ")) {
      const htext = t.slice(4).trim();
      const dm = htext.match(/Dzień\s+(\d+)/i);
      if (dm) {
        const num = parseInt(dm[1], 10);
        let rest = htext.replace(/^Dzień\s+\d+\s*[-–—:.]?\s*/i, "");
        let title = rest;
        let dateLabel = "";
        let weekday = "";
        const p = rest.indexOf("(");
        if (p !== -1) {
          title = rest.slice(0, p).trim();
          const inside = rest.slice(p + 1).replace(/\)$/, "").trim();
          const parts = inside.split(",");
          dateLabel = (parts[0] || "").trim();
          weekday = (parts[1] || "").trim();
        } else {
          title = rest.trim();
        }
        title = title.replace(/[-–—:.\s]+$/, "").trim();
        const day = {
          num,
          title,
          dateLabel,
          weekday,
          date: "",
          theme: "",
          drive: null,
          items: [],
          attractions: [],
          restaurants: [],
          tips: [],
        };
        if (currentCity) currentCity.days.push(day);
        currentDay = day;
        dayContext = "items";
        expectDayMeta = true;
        expectCityMeta = false;
      } else if (/Atrakcje do odhaczenia/i.test(htext)) {
        section = "summary";
        summaryMode = "attr";
      } else if (/Restauracje do odhaczenia/i.test(htext)) {
        section = "summary";
        summaryMode = "res";
      }
      i++;
      continue;
    }

    if (t.startsWith("## ")) {
      const htext = t.slice(3).trim();
      if (/Informacje ogólne/i.test(htext)) section = "general";
      else if (/Logistyka|Trasy samochodowe/i.test(htext)) section = "routes";
      else if (/Rzeczy do zabrania/i.test(htext)) section = "packing";
      else if (/Ogólne wskazówki/i.test(htext)) section = "generalTips";
      else if (/Podsumowanie checklist/i.test(htext)) section = "summary";
      else if (/Miasto\s+\d+/i.test(htext)) {
        const m = htext.match(/Miasto\s*\d+\s*[-–—:.]?\s*(.+)$/i);
        const name = m ? m[1].replace(/^[-–—:.\s]+/, "").trim() : htext;
        const id = slug(name);
        const city = {
          id,
          name,
          dates: "",
          accommodation: "",
          tagline: CITY_TAGLINES[id] || "",
          days: [],
        };
        data.cities.push(city);
        currentCity = city;
        currentDay = null;
        dayContext = null;
        section = "city";
        summaryMode = "";
        expectCityMeta = true;
        expectDayMeta = false;
      }
      i++;
      continue;
    }

    if (t.startsWith("# ")) {
      data.title = stripMd(t.slice(1).trim());
      i++;
      continue;
    }

    if (t.startsWith("|")) {
      const header = splitRow(lines[i]);
      let j = i + 1;
      if (j < lines.length && /^[\s|\-:]+$/.test(lines[j])) j++;
      const rows = [];
      while (j < lines.length && lines[j].trim().startsWith("|")) {
        rows.push(splitRow(lines[j]));
        j++;
      }
      handleTable(header, rows);
      i = j;
      continue;
    }

    const bm = /^(\s*)-[ \t]+(.*)$/.exec(raw);
    if (bm) {
      const indent = bm[1].length;
      const before = bm[2];
      const cb = /^\[([ xX])\]\s+(.*)$/.exec(before);
      const done = cb ? /^[xX]$/.test(cb[1]) : false;
      const text = cb ? cb[2].trim() : before.trim();
      if (currentDay && (dayContext === "attractions" || dayContext === "items")) {
        if (indent === 0) {
          if (dayContext === "attractions") {
            const bold = /^\*\*([^*]+)\*\*(.*)$/.exec(text);
            let name;
            let desc = "";
            if (bold) {
              name = bold[1].trim();
              desc = stripMd(bold[2]).trim().replace(/^[-–—:.\s]+/, "");
            } else {
              name = stripMd(text);
            }
            currentDay.attractions.push({ name, desc, extras: [], done: !!done });
          } else {
            currentDay.items.push({ label: stripMd(text), done: !!done, extras: [] });
          }
        } else {
          const extra = stripMd(text).trim();
          if (!extra) {
            i++;
            continue;
          }
          if (/^notatki:/i.test(extra) || /^zdjęcia:/i.test(extra)) {
            i++;
            continue;
          }
          if (dayContext === "attractions" && currentDay.attractions.length) {
            currentDay.attractions[currentDay.attractions.length - 1].extras.push(extra);
          } else if (dayContext === "items" && currentDay.items.length) {
            currentDay.items[currentDay.items.length - 1].extras.push(extra);
          }
        }
      }
      i++;
      continue;
    }

    i++;
  }

  // Wzbogacenie o klucze przechowywania (checkboxy).
  data.summaryAttractions.forEach((a) => {
    a.key = "attr|" + slug(a.city) + "|" + a.name.trim();
  });
  data.summaryRestaurants.forEach((r) => {
    r.key = "res|" + slug(r.city) + "|" + r.name.trim();
  });
  data.packing.forEach((g) => {
    g.items = g.items.map((label, idx) => {
      const key = "pack|" + g.group + "|" + idx;
      data.packFlat.push({ key, label });
      return { label, key };
    });
  });
  data.cities.forEach((c) => {
    c.days.forEach((d) => {
      d.cityId = c.id;
      d.cityName = c.name;
      d.items.forEach((it, idx) => {
        it.key = "day|" + c.id + "|" + d.num + "|item|" + idx;
      });
      d.restaurants.forEach((r) => {
        r.key = "res|" + c.id + "|" + r.name.trim();
      });
    });
  });

  return data;
}