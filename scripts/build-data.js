/**
 * Regenerates src/data/countries.json and src/data/majorCities.json.
 *
 * This is a one-off build-time script, not part of the running app. It
 * combines three open datasets so every city carries an *accurate* IANA
 * timezone (important for multi-timezone countries like the US, Russia,
 * Canada or Australia, where a single country-level zone would be wrong
 * for most cities):
 *
 *  - world-countries        → name, flag, capital, currency, calling code
 *  - all-the-cities         → ~135k populated places (GeoNames), used to
 *                              pick each country's most populous cities
 *  - tz-lookup               → resolves lat/lon → IANA timezone offline,
 *                              so every city (not just the capital) gets
 *                              its own correct zone
 *
 * Usage:
 *   npm install --no-save world-countries all-the-cities tz-lookup
 *   node scripts/build-data.js
 */

const fs = require('fs');
const path = require('path');

const cities = require('all-the-cities');
const wc = require('world-countries');
const tzlookup = require('tz-lookup');

const MAX_CITIES_PER_COUNTRY = 12;

function buildMajorCities() {
  const byCountry = {};

  for (const c of cities) {
    if (!c.country) continue;
    if (!byCountry[c.country]) byCountry[c.country] = [];
    byCountry[c.country].push({
      name: c.name,
      lat: Math.round(c.loc.coordinates[1] * 10000) / 10000,
      lon: Math.round(c.loc.coordinates[0] * 10000) / 10000,
      population: c.population,
      capital: c.featureCode === 'PPLC',
    });
  }

  const majorCities = {};
  Object.keys(byCountry).forEach((cc) => {
    let list = byCountry[cc];
    list.sort((a, b) => b.capital - a.capital || b.population - a.population);

    const seen = new Set();
    list = list.filter((c) => {
      if (seen.has(c.name)) return false;
      seen.add(c.name);
      return true;
    });

    list = list.slice(0, MAX_CITIES_PER_COUNTRY);
    list.forEach((c) => {
      try {
        c.tz = tzlookup(c.lat, c.lon);
      } catch (e) {
        c.tz = null;
      }
    });

    majorCities[cc] = list;
  });

  return majorCities;
}

function buildCountries(majorCities) {
  const countries = [];

  for (const c of wc) {
    const cc = c.cca2;
    const capitalName = (c.capital && c.capital[0]) || c.name.common;
    const citiesForCountry = majorCities[cc] || [];
    let capitalCity = citiesForCountry.find((x) => x.capital);
    if (!capitalCity && citiesForCountry.length) capitalCity = citiesForCountry[0];

    let lat;
    let lon;
    let tz;
    if (capitalCity) {
      ({ lat, lon, tz } = capitalCity);
    } else if (c.latlng) {
      [lat, lon] = c.latlng;
      try {
        tz = tzlookup(lat, lon);
      } catch (e) {
        tz = 'UTC';
      }
    } else {
      lat = 0;
      lon = 0;
      tz = 'UTC';
    }

    const currencyCode = c.currencies ? Object.keys(c.currencies)[0] : null;
    const currency = currencyCode ? c.currencies[currencyCode] : null;
    const callingCode =
      c.idd && c.idd.root
        ? c.idd.root + (c.idd.suffixes && c.idd.suffixes.length === 1 ? c.idd.suffixes[0] : '')
        : '';

    countries.push({
      cca2: cc,
      cca3: c.cca3,
      name: c.name.common,
      officialName: c.name.official,
      capital: capitalName,
      region: c.region,
      subregion: c.subregion,
      flag: c.flag,
      lat,
      lon,
      timezone: tz || 'UTC',
      callingCode,
      currencyCode,
      currencyName: currency ? currency.name : null,
      currencySymbol: currency ? currency.symbol : null,
    });
  }

  countries.sort((a, b) => a.name.localeCompare(b.name));
  return countries;
}

function main() {
  const majorCities = buildMajorCities();
  const countries = buildCountries(majorCities);

  const outDir = path.join(__dirname, '..', 'src', 'data');
  fs.writeFileSync(path.join(outDir, 'countries.json'), JSON.stringify(countries));
  fs.writeFileSync(path.join(outDir, 'majorCities.json'), JSON.stringify(majorCities));

  console.log(`Wrote ${countries.length} countries and cities for ${Object.keys(majorCities).length} of them.`);
}

main();
