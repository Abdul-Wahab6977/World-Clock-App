import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, fonts, spacing, shadow } from '../theme/theme';
import { formatClock, getUtcOffsetShort, getSunTimes, useNow } from '../utils/time';
import { fetchWeatherBundle } from '../utils/weather';

export default function TimeZoneCard({ zone, onRemove }) {
  const now = useNow(1000);
  const [weather, setWeather] = useState(null);
  const sun = getSunTimes(zone.lat, zone.lon, zone.tz, now);

  useEffect(() => {
    let mounted = true;
    fetchWeatherBundle(zone.lat, zone.lon)
      .then((bundle) => {
        if (mounted && bundle.current) setWeather(bundle.current);
      })
      .catch(() => {
        if (mounted) setWeather(null);
      });
    return () => {
      mounted = false;
    };
  }, [zone.lat, zone.lon]);

  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => onRemove(zone.id)}
        hitSlop={8}
        style={styles.removeBtn}
        accessibilityLabel={`Remove ${zone.cityName}`}
      >
        <Ionicons name="close" size={16} color={colors.white} />
      </Pressable>

      <View style={styles.topRow}>
        <View style={styles.left}>
          <View style={styles.nameRow}>
            <Text style={styles.city} numberOfLines={1}>{zone.cityName}</Text>
            <Text style={styles.offset}>{getUtcOffsetShort(zone.tz, now)}</Text>
          </View>
          <Text style={styles.sub}>Today/{zone.countryName}</Text>

          <View style={styles.sunRow}>
            <View style={styles.sunItem}>
              <Text style={styles.sunIcon}>☀️</Text>
              <Text style={styles.sunText}>{sun.sunrise}</Text>
            </View>
            <View style={styles.sunItem}>
              <Text style={styles.sunIcon}>🌇</Text>
              <Text style={styles.sunText}>{sun.sunset}</Text>
            </View>
          </View>
        </View>

        <View style={styles.right}>
          <Text style={styles.time}>{formatClock(zone.tz, now)}</Text>
          {weather ? (
            <View style={styles.weatherPill}>
              <Text style={styles.weatherIcon}>{weather.icon}</Text>
              <Text style={styles.weatherTemp}>{Math.round(weather.temperatureC)} °C</Text>
            </View>
          ) : (
            <View style={[styles.weatherPill, styles.weatherPillLoading]}>
              <Text style={styles.weatherTempLoading}>· · ·</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    position: 'relative',
    ...shadow.soft,
  },
  removeBtn: {
    position: 'absolute',
    top: -10,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    ...shadow.soft,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
    marginRight: spacing.md,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.xs,
  },
  city: {
    fontFamily: fonts.heading,
    fontSize: 19,
    color: colors.textPrimary,
  },
  offset: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sunRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
    gap: spacing.lg,
  },
  sunItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sunIcon: {
    fontSize: 13,
  },
  sunText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  right: {
    alignItems: 'flex-end',
  },
  time: {
    fontFamily: fonts.display,
    fontSize: 30,
    color: colors.textPrimary,
  },
  weatherPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    marginTop: spacing.sm,
  },
  weatherPillLoading: {
    opacity: 0.6,
  },
  weatherIcon: {
    fontSize: 13,
  },
  weatherTemp: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.primaryDark,
  },
  weatherTempLoading: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.textMuted,
  },
});
