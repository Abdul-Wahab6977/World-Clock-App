import React from 'react';
import { View, Text, Pressable, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

import DigitalClock from '../../components/DigitalClock';
import TimeZoneCard from '../../components/TimeZoneCard';
import AdBanner from '../../components/AdBanner';
import { useAppData } from '../../context/AppContext';
import { useDeviceLocation } from '../../utils/useDeviceLocation';
import { formatLongDate, getGmtOffsetString, getSunTimes, useNow } from '../../utils/time';
import { gradients, colors, fonts, spacing, radii, shadow } from '../../theme/theme';

export default function WorldClockScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const now = useNow(1000);
  const location = useDeviceLocation();
  const { savedZones, removeSavedZone, adsRemoved } = useAppData();

  const sun = location.lat != null
    ? getSunTimes(location.lat, location.lon, location.timezone, now)
    : { sunrise: '—', sunset: '—' };

  return (
    <View style={styles.flex}>
      <StatusBar style="light" />
      <LinearGradient colors={gradients.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={[styles.headerRow, { paddingTop: insets.top + spacing.sm }]}>
          <Text style={styles.headerTitle}>WORLD CLOCK</Text>
          <View style={styles.headerIcons}>
            {!adsRemoved && (
              <Pressable
                onPress={() => navigation.navigate('PremiumPaywall')}
                hitSlop={10}
                style={styles.headerIconBtn}
                accessibilityLabel="Remove ads"
              >
                <Ionicons name="ban-outline" size={20} color={colors.white} />
              </Pressable>
            )}
            <Pressable
              onPress={() => navigation.navigate('Settings')}
              hitSlop={10}
              style={styles.headerIconBtn}
              accessibilityLabel="Settings"
            >
              <Ionicons name="settings-outline" size={22} color={colors.white} />
            </Pressable>
          </View>
        </View>
      </LinearGradient>

      <FlatList
        data={savedZones}
        keyExtractor={(z) => z.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <TimeZoneCard zone={item} onRemove={removeSavedZone} />}
        ListHeaderComponent={
          <View>
            <View style={styles.localCard}>
              <View style={styles.localTopRow}>
                <DigitalClock timeZone={location.timezone} size={44} />
                <Text style={styles.gmt}>{getGmtOffsetString(location.timezone, now)}</Text>
              </View>
              <View style={styles.localBottomRow}>
                <View>
                  <Text style={styles.localLabel}>Your Location</Text>
                  <Text style={styles.localDate}>{formatLongDate(location.timezone, now)}</Text>
                </View>
                <View style={styles.sunRow}>
                  <View style={styles.sunItem}>
                    <Text style={styles.sunIcon}>☀️</Text>
                    <Text style={styles.sunTime}>{sun.sunrise}</Text>
                  </View>
                  <View style={styles.sunItem}>
                    <Text style={styles.sunIcon}>🌇</Text>
                    <Text style={styles.sunTime}>{sun.sunset}</Text>
                  </View>
                </View>
              </View>
            </View>

            {!adsRemoved && <AdBanner />}

            <Text style={styles.sectionTitle}>Other Time Zones</Text>

            {savedZones.length === 0 && (
              <View style={styles.emptyWrap}>
                <Ionicons name="globe-outline" size={40} color={colors.textMuted} />
                <Text style={styles.emptyText}>
                  No time zones added yet.{'\n'}Tap + to add a city.
                </Text>
              </View>
            )}
          </View>
        }
      />

      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          navigation.navigate('AllCountries');
        }}
        style={[styles.fab, { bottom: insets.bottom + spacing.xl }]}
        accessibilityLabel="Add a city"
      >
        <Ionicons name="add" size={30} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: 22,
    color: colors.white,
    letterSpacing: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  headerIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl * 2,
  },
  localCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    marginTop: -spacing.xxl,
    ...shadow.card,
  },
  localTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gmt: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.primary,
  },
  localBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  localLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
    color: colors.textSecondary,
  },
  localDate: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  sunRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  sunItem: {
    alignItems: 'center',
  },
  sunIcon: {
    fontSize: 18,
  },
  sunTime: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: fonts.heading,
    fontSize: 19,
    color: colors.textPrimary,
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    gap: spacing.md,
  },
  emptyText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.fab,
  },
});
