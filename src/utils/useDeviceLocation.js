import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { getAllCountries } from '../data/countriesRepository';
import { getUtcOffsetMinutes } from './time';

function getDeviceTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch (e) {
    return 'UTC';
  }
}

/** Best-effort fallback: match the device's IANA zone exactly, then fall back
 * to any country sharing the same current UTC offset, then finally UTC. */
function resolveFallback(deviceTz) {
  const countries = getAllCountries();
  const exact = countries.find((c) => c.timezone === deviceTz);
  if (exact) return { lat: exact.lat, lon: exact.lon, timezone: deviceTz };

  const deviceOffset = getUtcOffsetMinutes(deviceTz);
  const sameOffset = countries.find((c) => getUtcOffsetMinutes(c.timezone) === deviceOffset);
  if (sameOffset) return { lat: sameOffset.lat, lon: sameOffset.lon, timezone: deviceTz };

  return { lat: 51.5074, lon: -0.1278, timezone: deviceTz || 'UTC' };
}

/**
 * Resolves the coordinates behind the "Your Location" card. Tries GPS (with
 * permission) first for accurate weather/sunrise-sunset; if location
 * services are unavailable or denied, falls back to matching the device's
 * IANA time zone against the bundled country data — so the card still works
 * fully offline and without any permission grant.
 */
export function useDeviceLocation() {
  const timezone = getDeviceTimeZone();
  const [state, setState] = useState({
    lat: null,
    lon: null,
    timezone,
    loading: true,
    source: 'pending',
  });

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const pos = await Location.getLastKnownPositionAsync({});
          const fresh = pos || (await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Low,
          }));
          if (mounted && fresh) {
            setState({
              lat: fresh.coords.latitude,
              lon: fresh.coords.longitude,
              timezone,
              loading: false,
              source: 'gps',
            });
            return;
          }
        }
      } catch (e) {
        // permission denied, simulator with no location, etc. — fall through
      }

      if (mounted) {
        const fallback = resolveFallback(timezone);
        setState({ ...fallback, loading: false, source: 'fallback' });
      }
    })();

    return () => {
      mounted = false;
    };
  }, [timezone]);

  return state;
}

export default useDeviceLocation;
