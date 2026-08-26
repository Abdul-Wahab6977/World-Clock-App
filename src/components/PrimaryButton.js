import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { colors, radii, fonts, spacing } from '../theme/theme';

export default function PrimaryButton({
  title,
  onPress,
  variant = 'solid', // 'solid' | 'outline' | 'ghost'
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon = null,
}) {
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      onPress={disabled || loading ? undefined : onPress}
      style={({ pressed }) => [
        styles.base,
        isOutline && styles.outline,
        isGhost && styles.ghost,
        !isOutline && !isGhost && styles.solid,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && !loading && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline || isGhost ? colors.primary : colors.white} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text
            style={[
              styles.text,
              (isOutline || isGhost) && styles.textOutline,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 54,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  solid: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  ghost: {
    backgroundColor: colors.primarySoft,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  text: {
    color: colors.white,
    fontFamily: fonts.subheading,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  textOutline: {
    color: colors.primary,
  },
});
