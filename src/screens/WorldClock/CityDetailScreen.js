import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import ScreenHeader from '../../components/ScreenHeader';
import ClockFace from '../../components/ClockFace';
import DigitalClock from '../../components/DigitalClock';
import PrimaryButton from '../../components/PrimaryButton';
import { DetailCard, InfoRow, SectionLabel } from '../../components/DetailCard';
import { getCountryByCode } from '../../data/countriesRepository';
import { formatLongDate, getGmtOffsetString, getSunTimes, useNow } from '../../utils/time';
import { fetchWeatherBundle } from '../../utils/weather';
import { useAppData } from '../../context/AppContext';
import { colors, fonts, spacing, radii } from '../../theme/theme';

export default function CityDetailScreen({ navigation, route }) {
  const { cca2, countryName, city } = route.params;
  const country = useMemo(() => getCountryByCode(cca2), [cca2]);
  const timezone = city.tz || (country ? country.timezone : 'UTC');

  const [tab, setTab] = useState('info');
  const now = useNow(1000);
  const sun = getSunTimes(city.lat, city.lon, timezone, now);

  const [weather, setWeather] = useState({ loading: true, data: null, error: null });
  const { addSavedZone, isZoneSaved } = useAppData();

  const zoneId = `${cca2}_${city.name}`.replace(/\s+/g, '-');
  const saved = isZoneSaved(zoneId);

  useEffect(() => {
    let mounted = true;
    fetchWeatherBundle(city.lat, city.lon)
      .then((bundle) => {
        if (mounted) setWeather({ loading: false, data: bundle, error: null });
      })
      .catch((e) => {
        if (mounted) setWeather({ loading: false, data: null, error: e.message });
      });
    return () => {
      mounted = false;
    };
  }, [city.lat, city.lon]);

  const handleAddToList = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    addSavedZone({
      id: zoneId,
      cityName: city.name,
      countryName,
      cca2,
      lat: city.lat,
      lon: city.lon,
      tz: timezone,
    });
    Alert.alert('Added', `${city.name} was added to your Other Time Zones list.`);
  };

  const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${city.lat},${city.lon}&zoom=11&size=640x280&maptype=mapnik&markers=${city.lat},${city.lon},red-pushpin`;

  return (
    <View style={styles.flex}>
      <ScreenHeader
        title={city.name}
        subtitle={countryName}
        onBack={() => navigation.goBack()}
      >
        <View style={styles.tabRow}>
          <Pressable style={styles.tabBtn} onPress={() => setTab('info')}>
            <Text style={[styles.tabText, tab === 'info' && styles.tabTextActive]}>CITY INFO</Text>
            {tab === 'info' && <View style={styles.tabIndicator} />}
          </Pressable>
          <Pressable style={styles.tabBtn} onPress={() => setTab('weather')}>
            <Text style={[styles.tabText, tab === 'weather' && styles.tabTextActive]}>WEATHER</Text>
            {tab === 'weather' && <View style={styles.tabIndicator} />}
          </Pressable>
        </View>
      </ScreenHeader>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === 'info' ? (
          <>
            <View style={styles.clockRow}>
              <ClockFace timeZone={timezone} size={140} />
              <View style={styles.sunBox}>
                <View style={styles.sunItem}>
                  <Text style={styles.sunIcon}>☀️</Text>
                  <Text style={styles.sunLabel}>Sunrise</Text>
                  <Text style={styles.sunValue}>{sun.sunrise}</Text>
                </View>
                <View style={styles.sunDivider} />
                <View style={styles.sunItem}>
                  <Text style={styles.sunIcon}>🌇</Text>
                  <Text style={styles.sunLabel}>Sunset</Text>
                  <Text style={styles.sunValue}>{sun.sunset}</Text>
                </View>
              </View>
            </View>

            <View style={styles.digitalRow}>
              <DigitalClock timeZone={timezone} showSeconds size={32} />
              <Text style={styles.dateText}>{formatLongDate(timezone, now)}</Text>
            </View>

            {country && (
              <DetailCard>
                <View style={styles.currencyRow}>
                  <View style={styles.currencyIconWrap}>
                    <Text style={styles.currencyIcon}>{country.currencySymbol || '¤'}</Text>
                  </View>
                  <View>
                    <Text style={styles.currencyLabel}>Currency</Text>
                    <Text style={styles.currencyValue}>{country.currencyName || 'Not available'}</Text>
                  </View>
                </View>
              </DetailCard>
            )}

            <SectionLabel>Geographic Information</SectionLabel>
            {country && (
              <DetailCard style={styles.noPad}>
                <View style={styles.padded}>
                  <InfoRow label="Country Code" value={country.cca2} />
                  <InfoRow label="Postal Code" value="-" />
                  <InfoRow label="Phone Code" value={country.callingCode || '-'} last />
                </View>
              </DetailCard>
            )}

            <SectionLabel>Location on Map</SectionLabel>
            <View style={styles.mapCard}>
              <Image source={{ uri: mapUrl }} style={styles.mapImage} resizeMode="cover" />
              <Text style={styles.mapAttribution}>© OpenStreetMap contributors</Text>
            </View>

            <PrimaryButton
              title={saved ? 'Added to List ✓' : 'Add Selected List'}
              onPress={handleAddToList}
              disabled={saved}
              style={styles.addBtn}
            />
          </>
        ) : (
          <WeatherTab
            timezone={timezone}
            now={now}
            weather={weather}
            city={city}
            saved={saved}
            onAdd={handleAddToList}
            onSeeForecast={() =>
              navigation.navigate('WeatherForecast', {
                cityName: city.name,
                lat: city.lat,
                lon: city.lon,
              })
            }
          />
        )}
      </ScrollView>
    </View>
  );
}

function WeatherTab({ timezone, now, weather, city, saved, onAdd, onSeeForecast }) {
  if (weather.loading) {
    return (
      <View style={styles.weatherLoading}>
        <Text style={styles.weatherLoadingText}>Fetching live weather…</Text>
      </View>
    );
  }

  if (weather.error || !weather.data?.current) {
    return (
      <View style={styles.weatherLoading}>
        <Ionicons name="cloud-offline-outline" size={36} color={colors.textMuted} />
        <Text style={styles.weatherLoadingText}>
          Couldn't load live weather right now.{'\n'}Check your connection and try again.
        </Text>
      </View>
    );
  }

  const c = weather.data.current;

  return (
    <>
      <Text style={styles.tzLine}>Time Zone: ({getGmtOffsetString(timezone, now)})</Text>

      <View style={styles.weatherHero}>
        <Text style={styles.weatherHeroIcon}>{c.icon}</Text>
        <View>
          <Text style={styles.weatherHeroTemp}>{c.temperatureC.toFixed(1)} °C</Text>
          <Text style={styles.weatherHeroTempF}>/ {c.temperatureF.toFixed(1)} °F</Text>
        </View>
      </View>
      <Text style={styles.weatherDesc}>{c.description}</Text>

      <PrimaryButton title="5-Day Forecast" onPress={onSeeForecast} style={styles.forecastBtn} />

      <SectionLabel>Weather Details</SectionLabel>

      <DetailCard
        heading="Atmospheric Conditions"
        lines={[
          { label: 'Humidity', value: `${Math.round(c.humidity)} %` },
          { label: 'Pressure', value: `${Math.round(c.pressure)} hPa` },
        ]}
      />
      <DetailCard
        heading="Wind Information"
        lines={[
          { label: 'Speed', value: `${c.windSpeedKph.toFixed(2)} km/h` },
          { label: 'In Degree', value: `${Math.round(c.windDirectionDeg)} deg` },
        ]}
      />
      <DetailCard
        heading="Coordinates"
        lines={[
          { label: 'Latitude', value: city.lat.toFixed(4) },
          { label: 'Longitude', value: city.lon.toFixed(4) },
        ]}
      />

      <PrimaryButton
        title={saved ? 'Added to List ✓' : 'Add Selected List'}
        onPress={onAdd}
        disabled={saved}
        style={styles.addBtn}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  tabRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
  tabText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    letterSpacing: 0.5,
    color: 'rgba(255,255,255,0.65)',
  },
  tabTextActive: {
    color: colors.white,
  },
  tabIndicator: {
    marginTop: spacing.sm,
    height: 3,
    width: 56,
    borderRadius: 2,
    backgroundColor: colors.white,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  clockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sunBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  sunItem: {
    alignItems: 'center',
    minWidth: 64,
  },
  sunIcon: {
    fontSize: 18,
  },
  sunLabel: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  sunValue: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.textPrimary,
    marginTop: 2,
  },
  sunDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  digitalRow: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
  },
  dateText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  noPad: { padding: 0 },
  padded: { paddingHorizontal: spacing.lg },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  currencyIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyIcon: {
    fontSize: 20,
    color: colors.goldDeep,
  },
  currencyLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textSecondary,
  },
  currencyValue: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
    marginTop: 2,
  },
  mapCard: {
    borderRadius: radii.md,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  mapImage: {
    width: '100%',
    height: 180,
    backgroundColor: colors.surfaceMuted,
  },
  mapAttribution: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'right',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  addBtn: {
    marginTop: spacing.xl,
  },
  weatherLoading: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  weatherLoadingText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  tzLine: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  weatherHero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  weatherHeroIcon: {
    fontSize: 56,
  },
  weatherHeroTemp: {
    fontFamily: fonts.heading,
    fontSize: 40,
    color: colors.textPrimary,
  },
  weatherHeroTempF: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
  },
  weatherDesc: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  forecastBtn: {
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
});
