import React from 'react';
import LegalDocScreen from '../../components/LegalDocScreen';

const SECTIONS = [
  {
    heading: '1. Acceptance of Terms',
    body:
      'By creating an account or using World Clock, you agree to these Terms of Service. If you do ' +
      'not agree, please discontinue use of the app.',
  },
  {
    heading: '2. Using the App',
    body:
      'World Clock provides time zone, city and weather information for reference purposes. Weather ' +
      'and sunrise/sunset figures are estimates from third-party data and may differ from official sources.',
  },
  {
    heading: '3. Accounts',
    body:
      'You are responsible for keeping your account credentials secure. You may sign out or stop using ' +
      'the app at any time.',
  },
  {
    heading: '4. Subscriptions',
    body:
      'Premium removes ads and unlocks VIP support. Trials convert to a paid subscription unless ' +
      'cancelled beforehand, and subscriptions renew automatically until cancelled.',
  },
  {
    heading: '5. Limitation of Liability',
    body:
      'World Clock is provided "as is" without warranties of any kind. We are not liable for decisions ' +
      'made based on time, weather or location data shown in the app.',
  },
  {
    heading: '6. Changes to These Terms',
    body: 'We may update these terms occasionally. Continued use of the app after changes means you accept them.',
  },
];

export default function TermsOfServiceScreen({ navigation }) {
  return (
    <LegalDocScreen
      title="Terms of Service"
      updatedAt="August 1, 2026"
      sections={SECTIONS}
      onBack={() => navigation.goBack()}
    />
  );
}
