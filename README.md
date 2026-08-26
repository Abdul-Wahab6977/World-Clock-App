# World Clock — React Native (Expo)

A fully functional world clock app: live time zones for 250 countries, ~2,500
cities with correct per-city timezones, real weather (current + 5-day
forecast), account sign in/up, and a complete Settings module — built to
match the provided mockups.

## Quick start

```bash
npm install
npx expo start
```

Scan the QR code with **Expo Go** (iOS/Android), or press `i` / `a` in the
terminal for a simulator/emulator. No API keys or `.env` file are required —
see "Why nothing needs an API key" below.

Requires Node 18+.

## What's implemented

- **Auth** — Sign In / Sign Up with validation, SHA-256 hashed passwords,
  and a persisted session, entirely on-device (`src/context/AuthContext.js`).
  No backend is required to try the app; swap the body of `signIn`/`signUp`
  for real API calls whenever you add one — the calling contract won't change.
- **World Clock home** — live local clock, GMT offset, sunrise/sunset, and a
  saved "Other Time Zones" list you build from the country/city browser.
- **All Countries** — all 250 countries/territories with live local time and
  instant search-as-you-type.
- **All Cities** — up to 12 major cities per country (capital first, ranked
  by population), also searchable.
- **City detail** — an animated analog clock, digital clock, sunrise/sunset,
  currency, calling code, an OpenStreetMap static map, and a live **Weather**
  tab (current conditions + a 5-day hourly forecast screen).
- **Settings** — Remove Ads (mock IAP paywall), Customer Support (opens the
  device's email client with a prefilled message), Rate Us (interactive star
  modal), Share (native share sheet), Privacy Policy, Terms of Service, and
  app version info.

## Why nothing needs an API key

- **Time zones** are computed with the JavaScript `Intl` API — no network
  call, no dependency.
- **Weather** comes from [Open-Meteo](https://open-meteo.com), a free
  weather API that doesn't require a key.
- **Maps** use OpenStreetMap's static map renderer (`staticmap.openstreetmap.de`)
  — good for a lightweight preview; swap in `react-native-maps` + a Google
  Maps/Mapbox key if you want interactive maps in production.
- **Country/city/timezone data** is pre-built into `src/data/*.json` from
  open datasets (see `scripts/build-data.js`) — the app itself never needs
  to fetch it.

## Project structure

```
App.js                      Entry point: fonts, providers, navigation
src/
  theme/theme.js             Colors, spacing, type scale — single source of truth
  context/
    AuthContext.js           Sign up / sign in / sign out (AsyncStorage-backed)
    AppContext.js             Saved timezones + mock Premium/ads flag
  data/
    countries.json            250 countries: capital, flag, currency, tz, lat/lon
    majorCities.json          Up to 12 cities per country, each with its own tz
    countriesRepository.js    Search/lookup helpers over the JSON above
  utils/
    time.js                   Intl-based timezone formatting + sunrise/sunset
    weather.js                Open-Meteo client + weather-code → icon mapping
    useDeviceLocation.js      GPS (if granted) with an offline timezone fallback
  components/                 Reusable UI: buttons, cards, modals, clocks…
  screens/
    Auth/                     SignInScreen, SignUpScreen
    WorldClock/                Home, AllCountries, AllCities, CityDetail, Forecast
    Settings/                  Settings, CustomerSupport, PremiumPaywall, legal docs
  navigation/RootNavigator.js  Swaps Auth stack ⇄ Main stack on sign-in state
scripts/build-data.js         Regenerates src/data/*.json from open datasets
```

## Honest limitations (things that need real infrastructure, not this repo)

- **Accounts are local to the device.** There's no backend, so an account
  created on one phone won't be visible on another. The auth module is
  written so swapping in a real API is a small, contained change.
- **"Remove Ads" is a mock purchase.** Real in-app purchases need
  `react-native-iap` (or Expo's future IAP module) plus store-side product
  configuration in App Store Connect / Play Console, which can't be
  provisioned from this environment. The mock flips the same `isPremium`
  flag a real purchase would, so the rest of the app (ad banners, Settings
  state) already behaves correctly once you wire up a real store SDK.
- **No ad network is integrated** for the same reason — `AdBanner` is a
  placeholder that disappears once Premium is unlocked, which is the part
  of the behavior that actually matters for the flow.
- **The static map is a preview image**, not an interactive map — see above.

## Design notes

Palette and layout follow the provided mockups (indigo/purple brand color,
card-based lists, LCD-style digital clocks). Typography pairs **Inter** for
UI text with **Orbitron** for the digital clock displays — a deliberate,
single signature element used consistently everywhere a time is shown.
