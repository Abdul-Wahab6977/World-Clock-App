import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing, radii } from '../theme/theme';

export default function SettingsItem({ icon, title, subtitle, onPress, showChevron = false, disabled = false }) {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => [styles.row, pressed && !disabled && styles.pressed, disabled && styles.disabled]}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.textCol}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {showChevron && <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
  },
  disabled: {
    opacity: 0.5,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.sm,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.subheading,
    fontSize: 16,
    color: colors.primary,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 18,
  },
});
