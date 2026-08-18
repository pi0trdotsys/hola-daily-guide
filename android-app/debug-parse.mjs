import { readFileSync } from "fs";
import { parseMarkdown } from "./www/parser.mjs";

const md = readFileSync("./trip.md", "utf8");
console.error("markdown length:", md.length);
const d = parseMarkdown(md);
console.log("title:", d.title);
console.log("cities:", d.cities.map((c) => c.id + ":" + c.name + "(" + c.dates + ") acc=" + c.accommodation + " days=" + c.days.length).join(" | "));
console.log("routes:", d.routes.length);
console.log("packing groups:", d.packing.map((g) => g.label + "[" + g.items.length + "]").join(", "), "flat:", d.packFlat.length);
console.log("generalTips:", d.generalTips.length);
console.log("summary attr:", d.summaryAttractions.length, "res:", d.summaryRestaurants.length);
console.log("--- general:", JSON.stringify(d.general));
console.log("--- day1:", JSON.stringify(d.cities[0].days[0], null, 1).slice(0, 800));
console.log("--- day2 attractions:", JSON.stringify(d.cities[0].days[1].attractions, null, 1).slice(0, 700));
console.log("--- day5 attractions:", JSON.stringify(d.cities[1].days[2].attractions, null, 1).slice(0, 500));