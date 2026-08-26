// Central design tokens for World Clock.
// One deliberate palette + one deliberate type pairing, reused everywhere
// so the app reads as a single, considered product instead of a pile of screens.

export const colors = {
  // Brand
  primary: '#5B3FF0',
  primaryDark: '#3F2AB8',
  primaryDeep: '#2E1F8A',
  primaryLight: '#8B76FF',
  primarySoft: '#EDE9FE',

  // Accents
  gold: '#FFC94D',
  goldDeep: '#F5A623',
  danger: '#FF5A6E',
  success: '#3DDC84',
  info: '#4CC9F0',

  // Neutrals
  background: '#F4F5FA',
  surface: '#FFFFFF',
  surfaceMuted: '#F0F1F7',
  border: '#E7E8F2',
  textPrimary: '#181A2A',
  textSecondary: '#6B6E85',
  textMuted: '#9B9DB0',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(19, 15, 56, 0.55)',

  // Weather accent gradient stops (clear-sky sun)
  sunStart: '#FFD86B',
  sunEnd: '#FF9A3D',
};

export const gradients = {
  header: [colors.primary, colors.primaryDark],
  headerDeep: [colors.primaryDark, colors.primaryDeep],
  premium: ['#3F2AB8', '#5B3FF0', '#8B76FF'],
  sun: [colors.sunStart, colors.sunEnd],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

export const fonts = {
  display: 'Orbitron_700Bold', // digital / LCD-flavoured numerals — the app's signature
  displayMedium: 'Orbitron_500Medium',
  heading: 'Inter_700Bold',
  subheading: 'Inter_600SemiBold',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
};

export const shadow = {
  card: {
    shadowColor: '#2E1F8A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  fab: {
    shadowColor: '#2E1F8A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  soft: {
    shadowColor: '#1A1B25',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
};

export default { colors, gradients, spacing, radii, fonts, shadow };
