import { useEffect, useState } from 'react';

/**
 * All time-zone math in this app leans on the platform's built-in Intl API
 * (available on Hermes/RN out of the box) instead of a heavy moment-timezone
 * style dependency. Every helper below takes an IANA zone name, e.g. "Asia/Karachi".
 */

const WEEKDAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Returns { hour, minute, second, weekday, day, month, year } for a zone, as numbers. */
export function getZonedParts(timeZone, date = new Date()) {
  try {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const parts = dtf.formatToParts(date);
    const map = {};
    parts.forEach((p) => { map[p.type] = p.value; });

    const weekdayIndex = WEEKDAYS.findIndex((w) => w.startsWith(map.weekday));
    const monthIndex = MONTHS.findIndex((m) => m.startsWith(map.month));

    return {
      hour: parseInt(map.hour, 10) % 24,
      minute: parseInt(map.minute, 10),
      second: parseInt(map.second, 10),
      weekday: weekdayIndex >= 0 ? WEEKDAYS[weekdayIndex] : map.weekday,
      day: parseInt(map.day, 10),
      month: monthIndex >= 0 ? MONTHS[monthIndex] : map.month,
      year: parseInt(map.year, 10),
    };
  } catch (e) {
    const now = date;
    return {
      hour: now.getHours(),
      minute: now.getMinutes(),
      second: now.getSeconds(),
      weekday: WEEKDAYS[now.getDay()],
      day: now.getDate(),
      month: MONTHS[now.getMonth()],
      year: now.getFullYear(),
    };
  }
}

function pad2(n) {
  return n < 10 ? `0${n}` : `${n}`;
}

/** "12:57" 24-hour clock string for a zone. */
export function formatClock(timeZone, date = new Date()) {
  const { hour, minute } = getZonedParts(timeZone, date);
  return `${pad2(hour)}:${pad2(minute)}`;
}

/** "12:57:05" 24-hour clock string with seconds. */
export function formatClockWithSeconds(timeZone, date = new Date()) {
  const { hour, minute, second } = getZonedParts(timeZone, date);
  return `${pad2(hour)}:${pad2(minute)}:${pad2(second)}`;
}

/** "Tuesday, 25 August" for a zone. */
export function formatLongDate(timeZone, date = new Date()) {
  const { weekday, day, month } = getZonedParts(timeZone, date);
  return `${weekday}, ${day} ${month}`;
}

/** Minutes offset from UTC for a given IANA zone, positive east of UTC. */
export function getUtcOffsetMinutes(timeZone, date = new Date()) {
  try {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset',
    });
    const parts = dtf.formatToParts(date);
    const offsetPart = parts.find((p) => p.type === 'timeZoneName');
    if (offsetPart) {
      const match = offsetPart.value.match(/GMT([+-]\d{1,2})(?::?(\d{2}))?/);
      if (match) {
        const h = parseInt(match[1], 10);
        const m = match[2] ? parseInt(match[2], 10) : 0;
        return h < 0 ? h * 60 - m : h * 60 + m;
      }
      if (offsetPart.value === 'GMT') return 0;
    }
  } catch (e) {
    // fall through to the manual method below
  }

  // Fallback: diff the wall-clock time in the zone vs. UTC.
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const zonedDate = new Date(date.toLocaleString('en-US', { timeZone }));
  return Math.round((zonedDate.getTime() - utcDate.getTime()) / 60000);
}

/** "GMT+05:00" formatted offset string for a zone. */
export function getGmtOffsetString(timeZone, date = new Date()) {
  const minutes = getUtcOffsetMinutes(timeZone, date);
  const sign = minutes < 0 ? '-' : '+';
  const abs = Math.abs(minutes);
  const hh = pad2(Math.floor(abs / 60));
  const mm = pad2(abs % 60);
  return `GMT${sign}${hh}:${mm}`;
}

/** "UTC+5" compact offset string for a zone. */
export function getUtcOffsetShort(timeZone, date = new Date()) {
  const minutes = getUtcOffsetMinutes(timeZone, date);
  const sign = minutes < 0 ? '-' : '+';
  const abs = Math.abs(minutes);
  const hours = abs / 60;
  const label = Number.isInteger(hours) ? `${hours}` : hours.toFixed(1);
  return `UTC${sign}${label}`;
}

/** Approximate sunrise/sunset for a lat/lon + date, in the given IANA zone. */
export function getSunTimes(lat, lon, timeZone, date = new Date()) {
  // Standard NOAA-style approximate solar calculation.
  const rad = Math.PI / 180;
  const dayOfYear = Math.floor(
    (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) -
      Date.UTC(date.getUTCFullYear(), 0, 0)) / 86400000
  );

  const zenith = 90.833;
  const lngHour = lon / 15;

  function calc(isSunrise) {
    const t = dayOfYear + ((isSunrise ? 6 : 18) - lngHour) / 24;
    const M = 0.9856 * t - 3.289;
    let L = M + 1.916 * Math.sin(M * rad) + 0.020 * Math.sin(2 * M * rad) + 282.634;
    L = ((L % 360) + 360) % 360;
    let RA = Math.atan(0.91764 * Math.tan(L * rad)) / rad;
    RA = ((RA % 360) + 360) % 360;
    const Lquadrant = Math.floor(L / 90) * 90;
    const RAquadrant = Math.floor(RA / 90) * 90;
    RA = RA + (Lquadrant - RAquadrant);
    RA /= 15;

    const sinDec = 0.39782 * Math.sin(L * rad);
    const cosDec = Math.cos(Math.asin(sinDec));
    const cosH =
      (Math.cos(zenith * rad) - sinDec * Math.sin(lat * rad)) /
      (cosDec * Math.cos(lat * rad));

    if (cosH > 1 || cosH < -1) return null; // sun never rises/sets that day

    let H = isSunrise ? 360 - Math.acos(cosH) / rad : Math.acos(cosH) / rad;
    H /= 15;

    const T = H + RA - 0.06571 * t - 6.622;
    let UT = T - lngHour;
    UT = ((UT % 24) + 24) % 24;
    return UT;
  }

  function utToLocal(ut) {
    if (ut === null) return '—';
    const totalMinutes = Math.round(ut * 60);
    const utcDate = new Date(Date.UTC(
      date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
      0, totalMinutes
    ));
    const { hour, minute } = getZonedParts(timeZone, utcDate);
    const period = hour >= 12 ? 'PM' : 'AM';
    const h12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${pad2(h12)}:${pad2(minute)} ${period}`;
  }

  return {
    sunrise: utToLocal(calc(true)),
    sunset: utToLocal(calc(false)),
  };
}

/** React hook that re-renders every `intervalMs` so clocks tick live. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export default {
  getZonedParts,
  formatClock,
  formatClockWithSeconds,
  formatLongDate,
  getUtcOffsetMinutes,
  getGmtOffsetString,
  getUtcOffsetShort,
  getSunTimes,
  useNow,
};
