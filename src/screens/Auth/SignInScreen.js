import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AuthHeader from '../../components/AuthHeader';
import FormField from '../../components/FormField';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { colors, fonts, spacing } from '../../theme/theme';

export default function SignInScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = 'Email is required.';
    if (!password) next.password = 'Password is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSignIn = async () => {
    setFormError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await signIn({ email, password });
      // Navigation swaps to the main app automatically once isSignedIn flips.
    } catch (e) {
      setFormError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset password',
      email.trim()
        ? `If an account exists for ${email.trim()}, reset instructions would be emailed. (Demo build — no email server is connected.)`
        : 'Enter your email above first, then tap "Forgot password?" again.'
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <AuthHeader title="Welcome back" subtitle="Sign in to keep your saved cities in sync" />

        <View style={styles.form}>
          {formError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{formError}</Text>
            </View>
          ) : null}

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
            placeholder="Enter your password"
            secureTextEntry
            autoCapitalize="none"
            error={errors.password}
          />

          <Pressable onPress={handleForgotPassword} style={styles.forgotWrap} hitSlop={8}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          <PrimaryButton title="Sign In" onPress={handleSignIn} loading={loading} style={styles.submitBtn} />

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Don't have an account? </Text>
            <Pressable onPress={() => navigation.navigate('SignUp')} hitSlop={8}>
              <Text style={styles.switchLink}>Create one</Text>
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
  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xl,
    marginTop: -spacing.sm,
  },
  forgotText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.primary,
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
