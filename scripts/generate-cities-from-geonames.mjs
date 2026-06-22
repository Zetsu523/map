import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { countriesInfo } from "../src/data/countries-info.js";

const sourceFile = process.argv[2] ?? ".tmp/cities1000/cities1000.txt";
const outputDir = process.argv[3] ?? "public/data/cities";

if (!fs.existsSync(sourceFile)) {
  console.error(
    `Source file not found: ${sourceFile}\n` +
      "Download https://download.geonames.org/export/dump/cities1000.zip, " +
      "extract it, then pass the extracted cities1000.txt path as the first argument."
  );
  process.exit(1);
}

function getIso2Code(info) {
  return info?.aliases?.find((alias) => /^[A-Z]{2}$/.test(alias)) ?? null;
}

function getImportance(population, featureCode) {
  if (featureCode === "PPLC" || population >= 10000000) {
    return 5;
  }

  if (population >= 1000000) {
    return 4;
  }

  if (population >= 250000) {
    return 3;
  }

  if (population >= 50000) {
    return 2;
  }

  return 1;
}

const countryNamesByIso2 = new Map(
  Object.values(countriesInfo)
    .map((info) => [getIso2Code(info), info.name])
    .filter(([iso2]) => Boolean(iso2))
);

const cityGroups = new Map();

const input = fs.createReadStream(sourceFile, { encoding: "utf8" });
const lines = readline.createInterface({
  input,
  crlfDelay: Infinity
});

for await (const line of lines) {
  if (!line.trim()) {
    continue;
  }

  const columns = line.split("\t");
  const id = Number(columns[0]);
  const name = columns[1];
  const lat = Number(columns[4]);
  const lng = Number(columns[5]);
  const featureClass = columns[6];
  const featureCode = columns[7];
  const countryCode = columns[8];
  const population = Number(columns[14]);

  if (
    featureClass !== "P" ||
    !countryCode ||
    !name ||
    !Number.isFinite(id) ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng) ||
    !Number.isFinite(population) ||
    population < 1000
  ) {
    continue;
  }

  if (!cityGroups.has(countryCode)) {
    cityGroups.set(countryCode, {
      countryCode,
      country: countryNamesByIso2.get(countryCode) ?? countryCode,
      cities: []
    });
  }

  cityGroups.get(countryCode).cities.push([
    id,
    name,
    Number(lat.toFixed(4)),
    Number(lng.toFixed(4)),
    population,
    getImportance(population, featureCode)
  ]);
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

const index = [];

for (const [countryCode, group] of [...cityGroups.entries()].sort(([a], [b]) => a.localeCompare(b))) {
  group.cities.sort((firstCity, secondCity) => secondCity[4] - firstCity[4]);
  index.push({
    countryCode,
    country: group.country,
    count: group.cities.length
  });

  fs.writeFileSync(
    path.join(outputDir, `${countryCode}.json`),
    JSON.stringify(group),
    "utf8"
  );
}

fs.writeFileSync(
  path.join(outputDir, "index.json"),
  JSON.stringify({
    source: "GeoNames cities1000",
    minPopulation: 1000,
    countries: index
  }),
  "utf8"
);

const totalCities = index.reduce((total, country) => total + country.count, 0);
console.log(`Generated ${totalCities} cities in ${index.length} country files.`);
