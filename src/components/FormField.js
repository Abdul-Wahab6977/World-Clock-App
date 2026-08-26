import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, fonts, spacing } from '../theme/theme';

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  icon,
  style,
}) {
  const [hidden, setHidden] = useState(secureTextEntry);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrap, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.inputRow, focused && styles.inputRowFocused, error && styles.inputRowError]}>
        {icon ? <Ionicons name={icon} size={18} color={colors.textMuted} style={styles.icon} /> : null}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={hidden}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.input}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setHidden((h) => !h)} hitSlop={10}>
            <Ionicons name={hidden ? 'eye-outline' : 'eye-off-outline'} size={19} color={colors.textMuted} />
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  inputRowFocused: {
    borderColor: colors.primary,
  },
  inputRowError: {
    borderColor: colors.danger,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textPrimary,
  },
  error: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});
