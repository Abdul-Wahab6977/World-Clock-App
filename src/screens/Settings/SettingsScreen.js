import React, { useState } from 'react';
import { View, ScrollView, Text, Share, Linking, Alert, StyleSheet } from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import SettingsItem from '../../components/SettingsItem';
import RateUsModal from '../../components/RateUsModal';
import { useAppData } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { colors, fonts, spacing } from '../../theme/theme';

const APP_STORE_URL = 'https://apps.apple.com/app/id0000000000';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.worldclock.app';
const SHARE_URL = PLAY_STORE_URL;

export default function SettingsScreen({ navigation }) {
  const { adsRemoved } = useAppData();
  const { user, signOut } = useAuth();
  const [rateVisible, setRateVisible] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out World Clock — time, weather and city info for every country. ${SHARE_URL}`,
        url: SHARE_URL, // used on iOS
        title: 'World Clock',
      });
    } catch (e) {
      Alert.alert('Couldn\'t share', 'Something went wrong while opening the share sheet.');
    }
  };

  const handleRateSubmit = async (rating) => {
    setRateVisible(false);
    const storeUrl = PLAY_STORE_URL; // swap by Platform.OS for a real store link
    try {
      const canOpen = await Linking.canOpenURL(storeUrl);
      if (canOpen) await Linking.openURL(storeUrl);
    } catch (e) {
      // ignore — still thank the user below
    }
    Alert.alert('Thanks!', `You rated World Clock ${rating} star${rating === 1 ? '' : 's'}. We appreciate it!`);
  };

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <View style={styles.flex}>
      <ScreenHeader title="Settings" onBack={() => navigation.goBack()} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {user && (
          <View style={styles.accountRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name.trim().charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.accountTextCol}>
              <Text style={styles.accountName}>{user.name}</Text>
              <Text style={styles.accountEmail}>{user.email}</Text>
            </View>
          </View>
        )}

        <SettingsItem
          icon={adsRemoved ? 'checkmark-circle-outline' : 'ban-outline'}
          title="Remove Ads"
          subtitle={adsRemoved ? 'Ads are removed on this device. Thank you!' : 'Remove all ads within the app.'}
          onPress={() => navigation.navigate('PremiumPaywall')}
          showChevron={!adsRemoved}
          disabled={adsRemoved}
        />
        <SettingsItem
          icon="headset-outline"
          title="Customer Support"
          subtitle="Tell us what changes you'd like to see, or bugs you've discovered."
          onPress={() => navigation.navigate('CustomerSupport')}
          showChevron
        />
        <SettingsItem
          icon="thumbs-up-outline"
          title="Rate Us"
          subtitle="Do you like this app? Please support it with 5 stars."
          onPress={() => setRateVisible(true)}
          showChevron
        />
        <SettingsItem
          icon="share-social-outline"
          title="Share"
          subtitle="Do you want to share this app with your friends?"
          onPress={handleShare}
          showChevron
        />
        <SettingsItem
          icon="shield-checkmark-outline"
          title="Privacy Policy"
          subtitle="Read the Privacy Policy."
          onPress={() => navigation.navigate('PrivacyPolicy')}
          showChevron
        />
        <SettingsItem
          icon="document-text-outline"
          title="Terms Of Service"
          subtitle="Read the Terms and Conditions."
          onPress={() => navigation.navigate('TermsOfService')}
          showChevron
        />
        <SettingsItem
          icon="information-circle-outline"
          title="World Clock"
          subtitle="Version: 2.1.0"
        />

        {user && (
          <SettingsItem
            icon="log-out-outline"
            title="Sign Out"
            subtitle={`Signed in as ${user.email}`}
            onPress={handleSignOut}
            showChevron
          />
        )}

        <View style={{ height: spacing.xxxl }} />
      </ScrollView>

      <RateUsModal
        visible={rateVisible}
        onClose={() => setRateVisible(false)}
        onSubmit={handleRateSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: fonts.heading,
    fontSize: 18,
    color: colors.white,
  },
  accountTextCol: { flex: 1 },
  accountName: {
    fontFamily: fonts.subheading,
    fontSize: 16,
    color: colors.textPrimary,
  },
  accountEmail: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
