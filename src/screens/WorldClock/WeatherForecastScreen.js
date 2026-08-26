import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from '../../components/ScreenHeader';
import { fetchWeatherBundle, degreesToCompass } from '../../utils/weather';
import { colors, fonts, spacing, radii, shadow } from '../../theme/theme';

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatHourLabel(isoTime) {
  // isoTime like "2026-08-25T09:00"
  const [, timePart] = isoTime.split('T');
  const [hStr, mStr] = timePart.split(':');
  const h = parseInt(hStr, 10);
  const period = h >= 12 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, '0')}:${mStr}:00 ${period}`;
}

export default function WeatherForecastScreen({ navigation, route }) {
  const { cityName, lat, lon } = route.params;
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchWeatherBundle(lat, lon)
      .then((bundle) => {
        if (!mounted) return;
        setState({ loading: false, data: bundle, error: null });
        if (bundle.daily?.length) setSelectedDate(bundle.daily[0].date);
      })
      .catch((e) => {
        if (mounted) setState({ loading: false, data: null, error: e.message });
      });
    return () => {
      mounted = false;
    };
  }, [lat, lon]);

  const hoursForSelectedDate = useMemo(() => {
    if (!state.data || !selectedDate) return [];
    return state.data.hourly.filter((h) => h.time.startsWith(selectedDate));
  }, [state.data, selectedDate]);

  return (
    <View style={styles.flex}>
      <ScreenHeader title="WEATHER FORECAST" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.cityCard}>
          <Text style={styles.cityName}>{cityName.toUpperCase()}</Text>
        </View>

        {state.loading && (
          <View style={styles.centerBlock}>
            <Text style={styles.mutedText}>Loading forecast…</Text>
          </View>
        )}

        {state.error && (
          <View style={styles.centerBlock}>
            <Ionicons name="cloud-offline-outline" size={32} color={colors.textMuted} />
            <Text style={styles.mutedText}>Couldn't load the forecast. Check your connection.</Text>
          </View>
        )}

        {state.data && (
          <>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateRow}
            >
              {state.data.daily.slice(0, 5).map((d) => {
                const dateObj = new Date(`${d.date}T00:00:00`);
                const active = d.date === selectedDate;
                return (
                  <Pressable
                    key={d.date}
                    onPress={() => setSelectedDate(d.date)}
                    style={[styles.dateChip, active && styles.dateChipActive]}
                  >
                    <Text style={[styles.dateDay, active && styles.dateTextActive]}>
                      {dateObj.getDate()}
                    </Text>
                    <Text style={[styles.dateMonth, active && styles.dateTextActive]}>
                      {MONTHS_SHORT[dateObj.getMonth()]}
                    </Text>
                    <Text style={[styles.dateYear, active && styles.dateTextActive]}>
                      {dateObj.getFullYear()}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            <Text style={styles.sectionTitle}>Weather Forecast</Text>
            <View style={styles.hourlyList}>
              {hoursForSelectedDate.map((h) => (
                <HourlyCard key={h.time} hour={h} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function HourlyCard({ hour }) {
  return (
    <View style={styles.hourCard}>
      <Text style={styles.hourTime}>{formatHourLabel(hour.time)}</Text>
      <View style={styles.hourDivider} />

      <View style={styles.hourGrid}>
        <View style={styles.hourCol}>
          <MetricLine icon="thermometer-outline" text={`${hour.temperatureC.toFixed(1)} °C`} />
          <MetricLine emoji={hour.icon} text={hour.description} subtext="clear sky" bold />
        </View>
        <View style={styles.hourCol}>
          <MetricLine icon="thermometer-outline" text={`${hour.temperatureF.toFixed(1)} °F`} />
          <MetricLine icon="speedometer-outline" text={`${Math.round(hour.pressure)} hPa`} />
        </View>
      </View>

      <View style={styles.hourGrid}>
        <View style={styles.hourCol}>
          <MetricLine icon="water-outline" text={`${Math.round(hour.humidity)} %`} />
        </View>
        <View style={styles.hourCol}>
          <MetricLine
            icon="navigate-outline"
            text={`${hour.windSpeedKph.toFixed(2)} Kph ${degreesToCompass(hour.windDirectionDeg)}`}
          />
        </View>
      </View>
    </View>
  );
}

function MetricLine({ icon, emoji, text, subtext, bold }) {
  return (
    <View style={styles.metricLine}>
      {emoji ? (
        <Text style={styles.metricEmoji}>{emoji}</Text>
      ) : (
        <Ionicons name={icon} size={16} color={colors.primary} style={styles.metricIcon} />
      )}
      <View>
        <Text style={[styles.metricText, bold && styles.metricTextBold]}>{text}</Text>
        {subtext ? <Text style={styles.metricSubtext}>{subtext}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  cityCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginTop: -spacing.xl,
    ...shadow.card,
  },
  cityName: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  centerBlock: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  mutedText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 17,
    color: colors.textPrimary,
    marginTop: spacing.xxl,
    marginBottom: spacing.md,
  },
  dateRow: {
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  dateChip: {
    width: 68,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    ...shadow.soft,
  },
  dateChipActive: {
    backgroundColor: colors.primary,
  },
  dateDay: {
    fontFamily: fonts.heading,
    fontSize: 20,
    color: colors.primary,
  },
  dateMonth: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dateYear: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
  },
  dateTextActive: {
    color: colors.white,
  },
  hourlyList: {
    gap: spacing.md,
  },
  hourCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.soft,
  },
  hourTime: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.primary,
    textAlign: 'center',
  },
  hourDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  hourGrid: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  hourCol: {
    flex: 1,
    gap: spacing.sm,
  },
  metricLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metricIcon: {
    width: 18,
  },
  metricEmoji: {
    fontSize: 16,
    width: 18,
  },
  metricText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  metricTextBold: {
    fontFamily: fonts.bodySemiBold,
  },
  metricSubtext: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
  },
});
