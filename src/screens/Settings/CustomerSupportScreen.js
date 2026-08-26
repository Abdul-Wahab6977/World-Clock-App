import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { gradients, colors, fonts, spacing } from '../../theme/theme';

const SUPPORT_EMAIL = 'support@worldclockapp.com';
const MIN_LENGTH = 20;

export default function CustomerSupportScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const isValid = message.trim().length >= MIN_LENGTH;

  const handleSend = async () => {
    if (!isValid) {
      Alert.alert('A bit more detail please', `Please describe the issue in at least ${MIN_LENGTH} characters.`);
      return;
    }

    const subject = encodeURIComponent('World Clock — Support Request');
    const bodyLines = [message.trim(), '', `— sent from World Clock${user ? ` by ${user.email}` : ''}`];
    const body = encodeURIComponent(bodyLines.join('\n'));
    const mailUrl = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

    try {
      const canOpen = await Linking.canOpenURL(mailUrl);
      if (canOpen) {
        await Linking.openURL(mailUrl);
      }
      setSent(true);
      setTimeout(() => navigation.goBack(), 900);
    } catch (e) {
      Alert.alert(
        'No email app found',
        `You can reach us directly at ${SUPPORT_EMAIL}.`
      );
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={gradients.header} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={[styles.headerRow, { paddingTop: insets.top + spacing.sm }]}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </Pressable>
          <Text style={styles.headerTitle}>Customer Support</Text>
          <Pressable onPress={handleSend} hitSlop={12} disabled={!isValid}>
            <Ionicons name="send" size={22} color={isValid ? colors.white : 'rgba(255,255,255,0.4)'} />
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Describe the issue (at least 20 characters)"
          placeholderTextColor={colors.textMuted}
          multiline
          autoFocus
          textAlignVertical="top"
          style={styles.input}
        />
        <View style={styles.footer}>
          <Text style={[styles.counter, isValid && styles.counterValid]}>
            {message.trim().length} / {MIN_LENGTH}+ characters
          </Text>
          {sent && <Text style={styles.sentText}>Message ready to send ✓</Text>}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    fontFamily: fonts.heading,
    fontSize: 19,
    color: colors.white,
  },
  body: {
    flex: 1,
    padding: spacing.xl,
  },
  input: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  footer: {
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  counter: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  counterValid: {
    color: colors.success,
  },
  sentText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.success,
    marginTop: spacing.xs,
  },
});
