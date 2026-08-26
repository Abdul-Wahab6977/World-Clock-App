import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, fonts, spacing, shadow } from '../theme/theme';

function CityListItem({ city, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.left}>
        <Text style={styles.name} numberOfLines={1}>{city.name.toUpperCase()}</Text>
        {city.capital ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>CAPITAL</Text>
          </View>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textPrimary} />
    </Pressable>
  );
}

export default React.memo(CityListItem);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingVertical: spacing.lg,
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
    gap: spacing.sm,
  },
  name: {
    fontFamily: fonts.subheading,
    fontSize: 15,
    color: colors.textPrimary,
  },
  badge: {
    backgroundColor: colors.primarySoft,
    borderRadius: radii.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  badgeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 0.5,
  },
});
