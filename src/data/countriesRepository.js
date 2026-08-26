import countriesJson from './countries.json';
import majorCitiesJson from './majorCities.json';

/**
 * countries.json — 250 countries/territories, each with a resolved capital
 * lat/lon + accurate IANA timezone (derived from real geodata at build time,
 * see /scripts/build-data.js), plus flag, calling code and currency.
 *
 * majorCities.json — for ~246 countries, up to 12 of their most populous
 * cities (capital always first), each with its own precise lat/lon + tz,
 * so multi-timezone countries (US, Russia, Australia...) resolve correctly
 * per city instead of using one timezone for the whole country.
 */

const countries = countriesJson;
const majorCities = majorCitiesJson;

export function getAllCountries() {
  return countries;
}

export function getCountryByCode(cca2) {
  return countries.find((c) => c.cca2 === cca2) || null;
}

export function searchCountries(query) {
  const q = query.trim().toLowerCase();
  if (!q) return countries;
  return countries.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.capital.toLowerCase().includes(q) ||
      c.cca2.toLowerCase() === q
  );
}

/** Cities for a country, capital first, sorted by population. Falls back to
 * a single synthetic "capital" entry built from the country record itself
 * if no dedicated city data exists for that territory. */
export function getCitiesForCountry(cca2) {
  const list = majorCities[cca2];
  if (list && list.length) return list;

  const country = getCountryByCode(cca2);
  if (!country) return [];
  return [
    {
      name: country.capital,
      lat: country.lat,
      lon: country.lon,
      population: null,
      capital: true,
      tz: country.timezone,
    },
  ];
}

export function searchCitiesInCountry(cca2, query) {
  const all = getCitiesForCountry(cca2);
  const q = query.trim().toLowerCase();
  if (!q) return all;
  return all.filter((c) => c.name.toLowerCase().includes(q));
}

export default {
  getAllCountries,
  getCountryByCode,
  searchCountries,
  getCitiesForCountry,
  searchCitiesInCountry,
};
