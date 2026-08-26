import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AuthHeader from '../../components/AuthHeader';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { colors, fonts, spacing } from '../../theme/theme';

export default function SignUpScreen({ navigation }) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = 'Please enter your name.';
    if (!email.trim()) next.email = 'Email is required.';
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Password is required.';
    else if (password.length < 6) next.password = 'Use at least 6 characters.';
    if (confirmPassword !== password) next.confirmPassword = 'Passwords do not match.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSignUp = async () => {
    setFormError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp({ name, email, password });
      // Navigation swaps to the main app automatically once isSignedIn flips.
    } catch (e) {
      setFormError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <AuthHeader title="Create your account" subtitle="Save cities, sync settings, go ad-free" />

        <View style={styles.form}>
          {formError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{formError}</Text>
            </View>
          ) : null}

          <FormField
            label="Full name"
            icon="person-outline"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            error={errors.name}
          />
          <FormField
            label="Email"
            icon="mail-outline"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
          />
          <FormField
            label="Password"
            icon="lock-closed-outline"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 6 characters"
            secureTextEntry
            autoCapitalize="none"
            error={errors.password}
          />
          <FormField
            label="Confirm password"
            icon="lock-closed-outline"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Re-enter your password"
            secureTextEntry
            autoCapitalize="none"
            error={errors.confirmPassword}
          />

          <Text style={styles.terms}>
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </Text>

          <PrimaryButton title="Create Account" onPress={handleSignUp} loading={loading} style={styles.submitBtn} />

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate('SignIn')} hitSlop={8}>
              <Text style={styles.switchLink}>Sign in</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1 },
  form: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  errorBanner: {
    backgroundColor: '#FFE9EC',
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  errorBannerText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.danger,
  },
  terms: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 17,
    marginBottom: spacing.xl,
    marginTop: -spacing.sm,
  },
  submitBtn: {
    marginTop: spacing.sm,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xxl,
  },
  switchText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  switchLink: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    color: colors.primary,
  },
});
