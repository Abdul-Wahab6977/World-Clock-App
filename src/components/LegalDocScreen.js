import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ScreenHeader from './ScreenHeader';
import { colors, fonts, spacing } from '../theme/theme';

export default function LegalDocScreen({ title, updatedAt, sections, onBack }) {
  return (
    <View style={styles.flex}>
      <ScreenHeader title={title} onBack={onBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.updated}>Last updated: {updatedAt}</Text>
        {sections.map((s, i) => (
          <View key={i} style={styles.section}>
            <Text style={styles.heading}>{s.heading}</Text>
            <Text style={styles.body}>{s.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  updated: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  heading: {
    fontFamily: fonts.subheading,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 21,
  },
});
