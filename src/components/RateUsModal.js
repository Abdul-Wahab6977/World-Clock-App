import React, { useState } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, fonts, spacing, shadow } from '../theme/theme';
import PrimaryButton from './PrimaryButton';

export default function RateUsModal({ visible, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);

  const handleClose = () => {
    setRating(0);
    onClose();
  };

  const handleStarPress = (n) => {
    Haptics.selectionAsync().catch(() => {});
    setRating(n);
  };

  const handleSubmit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    onSubmit(rating);
    setRating(0);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <BlurView intensity={40} tint="dark" style={styles.overlay}>
        <View style={styles.card}>
          <Pressable onPress={handleClose} hitSlop={10} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={colors.textPrimary} />
          </Pressable>

          <Text style={styles.title}>Do you like{'\n'}World Clock ?</Text>
          <Text style={styles.subtitle}>
            We are working hard for a better user experience.{'\n'}
            We'd greatly appreciate if you can rate us
          </Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => handleStarPress(n)} hitSlop={6}>
                <Ionicons
                  name={n <= rating ? 'star' : 'star-outline'}
                  size={34}
                  color={n <= rating ? colors.gold : colors.textMuted}
                  style={styles.star}
                />
              </Pressable>
            ))}
          </View>

          <View style={styles.hintRow}>
            <Text style={styles.hintText}>The best we can get</Text>
            <Ionicons name="arrow-up" size={16} color={colors.textSecondary} style={styles.hintArrow} />
          </View>

          <PrimaryButton
            title="Rate"
            onPress={handleSubmit}
            disabled={rating === 0}
            style={styles.rateBtn}
          />
        </View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    ...shadow.card,
  },
  closeBtn: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    zIndex: 2,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 22,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.md,
    lineHeight: 20,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xxl,
    gap: spacing.sm,
  },
  star: {
    marginHorizontal: 2,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
    paddingRight: spacing.md,
    gap: 4,
  },
  hintText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  hintArrow: {
    transform: [{ rotate: '35deg' }],
  },
  rateBtn: {
    marginTop: spacing.xxl,
  },
});
