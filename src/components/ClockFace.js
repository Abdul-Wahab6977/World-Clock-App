import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Line } from 'react-native-svg';
import { colors } from '../theme/theme';
import { getZonedParts, useNow } from '../utils/time';

export default function ClockFace({ timeZone, size = 150 }) {
  const now = useNow(1000);
  const { hour, minute, second } = getZonedParts(timeZone, now);

  const center = size / 2;
  const hourAngle = ((hour % 12) + minute / 60) * 30; // 360/12
  const minuteAngle = (minute + second / 60) * 6; // 360/60
  const secondAngle = second * 6;

  const hourLen = size * 0.24;
  const minuteLen = size * 0.34;
  const secondLen = size * 0.38;

  function handPoint(angleDeg, length) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: center + length * Math.cos(rad),
      y: center + length * Math.sin(rad),
    };
  }

  const hourPt = handPoint(hourAngle, hourLen);
  const minutePt = handPoint(minuteAngle, minuteLen);
  const secondPt = handPoint(secondAngle, secondLen);

  const ticks = Array.from({ length: 12 }, (_, i) => {
    const angle = i * 30;
    const rad = ((angle - 90) * Math.PI) / 180;
    const outer = size * 0.46;
    const inner = i % 3 === 0 ? size * 0.38 : size * 0.42;
    return {
      x1: center + outer * Math.cos(rad),
      y1: center + outer * Math.sin(rad),
      x2: center + inner * Math.cos(rad),
      y2: center + inner * Math.sin(rad),
    };
  });

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={size * 0.47}
          fill={colors.primarySoft}
          stroke={colors.primaryLight}
          strokeWidth={1}
        />
        {ticks.map((t, i) => (
          <Line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke={colors.primaryLight}
            strokeWidth={i % 3 === 0 ? 2.5 : 1.5}
            strokeLinecap="round"
          />
        ))}
        <Line
          x1={center}
          y1={center}
          x2={hourPt.x}
          y2={hourPt.y}
          stroke={colors.textPrimary}
          strokeWidth={4}
          strokeLinecap="round"
        />
        <Line
          x1={center}
          y1={center}
          x2={minutePt.x}
          y2={minutePt.y}
          stroke={colors.primary}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <Line
          x1={center}
          y1={center}
          x2={secondPt.x}
          y2={secondPt.y}
          stroke={colors.gold}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
        <Circle cx={center} cy={center} r={4.5} fill={colors.primary} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
