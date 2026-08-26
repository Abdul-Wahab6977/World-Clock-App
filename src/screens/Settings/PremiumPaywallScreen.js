import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../../components/PrimaryButton';
import { useAppData } from '../../context/AppContext';
import { colors, fonts, spacing, radii } from '../../theme/theme';

const FEATURES = [
  { icon: 'time-outline', label: 'Manage Time Zones', premium: true, basic: true },
  { icon: 'partly-sunny-outline', label: 'Weather Forecast', premium: true, basic: true },
  { icon: 'map-outline', label: 'Country Information', premium: true, basic: true },
  { icon: 'headset-outline', label: 'VIP Customer Support', premium: true, basic: false },
  { icon: 'ban-outline', label: 'Remove Ads', premium: true, basic: false },
];

export default function PremiumPaywallScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { unlockPremium, restorePurchases } = useAppData();
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const handleStartTrial = async () => {
    setLoading(true);
    try {
      // Real IAP requires react-native-iap + App Store Connect / Play
      // Console product configuration, which this environment can't provision.
      // This mock instantly "unlocks" premium and persists it locally so the
      // rest of the app (ad banners, Settings state) reacts exactly as it
      // would after a real purchase.
      await new Promise((resolve) => setTimeout(resolve, 600));
      await unlockPremium();
      Alert.alert('You\'re Pro!', 'Your free trial has started. Ads are now removed.', [
        { text: 'Great', onPress: () => navigation.goBack() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      const restored = await restorePurchases();
      Alert.alert(
        restored ? 'Purchases restored' : 'Nothing to restore',
        restored ? 'Your Premium access has been restored.' : 'We couldn\'t find a previous purchase on this device.'
      );
    } finally {
      setRestoring(false);
    }
  };

  return (
    <View style={styles.flex}>
      <Pressable
        onPress={() => navigation.goBack()}
        hitSlop={12}
        style={[styles.closeBtn, { top: insets.top + spacing.md }]}
      >
        <Ionicons name="close" size={26} color={colors.textPrimary} />
      </Pressable>

      <ScrollView contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xxxl }]}>
        <View style={styles.badge}>
          <Ionicons name="ribbon-outline" size={30} color={colors.primary} />
        </View>
        <Text style={styles.title}>START LIKE A PRO</Text>
        <Text style={styles.subtitle}>Unlock All Features</Text>

        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <View style={styles.labelCol} />
            <Text style={styles.tableHeaderCell}>PREMIUM</Text>
            <Text style={styles.tableHeaderCell}>BASIC</Text>
          </View>

          {FEATURES.map((f) => (
            <View key={f.label} style={styles.tableRow}>
              <View style={styles.labelCol}>
                <Ionicons name={f.icon} size={18} color={colors.primary} style={styles.rowIcon} />
                <Text style={styles.rowLabel}>{f.label}</Text>
              </View>
              <View style={styles.checkCol}>
                <Ionicons name="checkmark" size={20} color={colors.primary} />
              </View>
              <View style={styles.checkCol}>
                {f.basic ? (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                ) : (
                  <Text style={styles.dash}>—</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Text style={styles.price}>Rs 2,550/week after FREE 3-day trial</Text>
        <PrimaryButton title="Start Free Trial" onPress={handleStartTrial} loading={loading} />
        <Text style={styles.disclaimer}>
          Subscription is billed after the trial ends and will auto-renew. Cancel subscription
          anytime before trial ends to avoid charges.
        </Text>
        <Pressable onPress={handleRestore} disabled={restoring} hitSlop={8} style={styles.restoreBtn}>
          <Text style={styles.restoreText}>{restoring ? 'Restoring…' : 'Restore purchases'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.surface },
  closeBtn: {
    position: 'absolute',
    left: spacing.lg,
    zIndex: 3,
  },
  content: {
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.xxl,
  },
  table: {
    width: '100%',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  tableHeaderCell: {
    flex: 1,
    fontFamily: fonts.bodySemiBold,
    fontSize: 11,
    letterSpacing: 0.5,
    color: colors.textMuted,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  labelCol: {
    flex: 2.4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowIcon: {
    width: 20,
  },
  rowLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  checkCol: {
    flex: 1,
    alignItems: 'center',
  },
  dash: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textMuted,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  price: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  disclaimer: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
  restoreBtn: {
    alignSelf: 'center',
    paddingVertical: spacing.xs,
  },
  restoreText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.primary,
  },
});
