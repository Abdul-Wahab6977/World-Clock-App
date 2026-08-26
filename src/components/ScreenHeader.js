import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { gradients, colors, fonts, spacing } from '../theme/theme';

export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightPress,
  children, // optional content rendered below the title row (e.g. tabs)
}) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient colors={gradients.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <View style={{ paddingTop: insets.top + spacing.sm }}>
        <View style={styles.row}>
          <Pressable onPress={onBack} hitSlop={12} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </Pressable>

          <View style={styles.titleWrap}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
          </View>

          {rightIcon ? (
            <Pressable onPress={onRightPress} hitSlop={12} style={styles.rightBtn}>
              <Ionicons name={rightIcon} size={22} color={colors.white} />
            </Pressable>
          ) : (
            <View style={styles.rightBtn} />
          )}
        </View>
        {children}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    minHeight: 48,
  },
  backBtn: {
    width: 36,
    alignItems: 'flex-start',
  },
  rightBtn: {
    width: 36,
    alignItems: 'flex-end',
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 19,
    color: colors.white,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
});
