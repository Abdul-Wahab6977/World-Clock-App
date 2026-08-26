import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, fonts, spacing, shadow } from '../theme/theme';

/** A white rounded card. `heading` is an optional small muted label at the
 * top (e.g. "Atmospheric Conditions"); `lines` renders "Label: value" pairs
 * stacked below it, matching the reference weather-details cards. */
export function DetailCard({ heading, lines, children, style }) {
  return (
    <View style={[styles.card, style]}>
      {heading ? <Text style={styles.heading}>{heading}</Text> : null}
      {lines
        ? lines.map((line, i) => (
            <Text key={i} style={[styles.line, i > 0 && styles.lineSpacing]}>
              <Text style={styles.lineLabel}>{line.label}: </Text>
              <Text style={styles.lineValue}>{line.value}</Text>
            </Text>
          ))
        : null}
      {children}
    </View>
  );
}

/** A row with a label on the left and a value right-aligned — used for the
 * Geographic Information card (Country Code / Postal Code / Phone Code). */
export function InfoRow({ label, value, last = false }) {
  return (
    <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export function SectionLabel({ children, style }) {
  return <Text style={[styles.sectionLabel, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.soft,
  },
  heading: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  line: {
    fontSize: 15,
  },
  lineSpacing: {
    marginTop: spacing.xs,
  },
  lineLabel: {
    fontFamily: fonts.body,
    color: colors.textSecondary,
  },
  lineValue: {
    fontFamily: fonts.bodySemiBold,
    color: colors.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
    color: colors.textPrimary,
  },
  sectionLabel: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
});

export default { DetailCard, InfoRow, SectionLabel };
