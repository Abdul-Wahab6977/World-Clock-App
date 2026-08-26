import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '../context/AppContext';
import { colors, radii, fonts, spacing } from '../theme/theme';

/**
 * Mock ad slot. Real ad-network SDKs (AdMob, etc.) need native modules and
 * store configuration this environment can't provide — this placeholder
 * demonstrates the ad slot and correctly disappears once "Remove Ads" is
 * purchased, which is the behaviour that actually matters for the flow.
 */
export default function AdBanner() {
  const { adsRemoved } = useAppData();
  if (adsRemoved) return null;

  return (
    <View style={styles.wrap}>
      <Ionicons name="megaphone-outline" size={16} color={colors.textMuted} />
      <Text style={styles.text}>Advertisement — go Premium to remove</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
  },
  text: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
});
