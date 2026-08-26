import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, fonts, spacing, shadow } from '../theme/theme';
import { formatClock } from '../utils/time';

function CountryListItem({ country, now, onPress }) {
  const time = formatClock(country.timezone, now);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.left}>
        <Text style={styles.flag}>{country.flag}</Text>
        <View style={styles.textCol}>
          <Text style={styles.name} numberOfLines={1}>{country.name.toUpperCase()}</Text>
          <Text style={styles.sub} numberOfLines={1}>
            {country.capital}
            {'  '}({country.timezone.split('/').pop().replace(/_/g, ' ')})
          </Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.time}>{time}</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.textPrimary} />
      </View>
    </Pressable>
  );
}

export default React.memo(CountryListItem);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.soft,
  },
  pressed: {
    opacity: 0.7,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  flag: {
    fontSize: 26,
    marginRight: spacing.md,
  },
  textCol: {
    flex: 1,
  },
  name: {
    fontFamily: fonts.subheading,
    fontSize: 15,
    color: colors.textPrimary,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  time: {
    fontFamily: fonts.displayMedium,
    fontSize: 15,
    color: colors.primary,
    marginRight: spacing.xs,
  },
});
