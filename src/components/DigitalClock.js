import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme/theme';
import { formatClock, formatClockWithSeconds, useNow } from '../utils/time';

export default function DigitalClock({
  timeZone,
  showSeconds = false,
  size = 44,
  color = colors.textPrimary,
  style,
}) {
  const now = useNow(1000);
  const text = showSeconds ? formatClockWithSeconds(timeZone, now) : formatClock(timeZone, now);

  return (
    <Text style={[styles.text, { fontSize: size, color }, style]} numberOfLines={1}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.display,
    letterSpacing: 1,
  },
});
