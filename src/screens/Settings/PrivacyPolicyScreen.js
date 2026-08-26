import React from 'react';
import LegalDocScreen from '../../components/LegalDocScreen';

const SECTIONS = [
  {
    heading: '1. Information We Collect',
    body:
      'World Clock stores your account name and email address on your device to power sign in. ' +
      'If you grant location permission, your device\'s coarse location is used only to show accurate ' +
      'local time, sunrise/sunset and weather for "Your Location" — it is never sent to our servers.',
  },
  {
    heading: '2. How We Use Weather & City Data',
    body:
      'Time zone and weather lookups for the cities you search or save are sent to our weather data ' +
      'provider (Open-Meteo) using only latitude/longitude — no personal identifiers are attached to ' +
      'these requests.',
  },
  {
    heading: '3. Data Storage',
    body:
      'Your account, saved time zones and preferences are stored locally on your device. Uninstalling ' +
      'the app removes this data. We do not sell or share your personal information with third parties.',
  },
  {
    heading: '4. Your Choices',
    body:
      'You can remove saved time zones at any time from the home screen, revoke location permission in ' +
      'your device settings, and delete your account by signing out and uninstalling the app.',
  },
  {
    heading: '5. Contact Us',
    body: 'Questions about this policy can be sent via Settings → Customer Support.',
  },
];

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <LegalDocScreen
      title="Privacy Policy"
      updatedAt="August 1, 2026"
      sections={SECTIONS}
      onBack={() => navigation.goBack()}
    />
  );
}
