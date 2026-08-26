import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { gradients, colors, fonts, spacing } from '../theme/theme';

export default function AuthHeader({ title, subtitle }) {
  return (
    <LinearGradient colors={gradients.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.wrap}>
      <View style={styles.iconRing}>
        <Ionicons name="earth" size={30} color={colors.white} />
      </View>
      <Text style={styles.brand}>WORLD CLOCK</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingTop: spacing.xxxl + 24,
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
  },
  iconRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  brand: {
    fontFamily: fonts.subheading,
    fontSize: 13,
    letterSpacing: 3,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: colors.white,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
