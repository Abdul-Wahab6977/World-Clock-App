import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, fonts, spacing } from '../theme/theme';

export default function SearchInput({
  value,
  onChangeText,
  placeholder = 'Search',
  autoFocus = false,
  style,
}) {
  return (
    <View style={[styles.wrap, style]}>
      <Ionicons name="search" size={20} color={colors.textMuted} style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        autoFocus={autoFocus}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value?.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={10}>
          <Ionicons name="close-circle" size={20} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textPrimary,
    height: '100%',
  },
});
