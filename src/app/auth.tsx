import { View, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../theme';
import { Button, SecondaryButton } from '../components/ui';
import { images } from '../data/images';

/**
 * The Figma file has no Login or Create Account screen — the designed flow is
 * Splash → 3 onboarding slides → Home. This entry screen reuses the Welcome /
 * Splash visuals so the required LOGIN and CREATE ACCOUNT steps still exist,
 * and both continue straight into the app with no information required.
 */
export default function Auth() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.brand}>
        <Image source={images.logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.wordmark}>KAPRESCO</Text>
        <Text style={styles.tagline}>Sip. Chill. Repeat.</Text>
      </View>

      <Image source={images.splashVisual} style={styles.hero} resizeMode="cover" />

      <View style={styles.copy}>
        <Text style={styles.title}>Welcome to your everyday chill spot.</Text>
        <Text style={styles.body}>Fresh brews, cozy moments, and that preskong feeling wherever you go.</Text>
      </View>

      <View style={styles.actions}>
        <Button label="LOGIN" onPress={() => router.replace('/home')} />
        <SecondaryButton label="CREATE ACCOUNT" onPress={() => router.replace('/home')} />
      </View>

      <Text style={styles.footnote}>By continuing, you agree to Kapresco’s Terms & Privacy.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream, paddingHorizontal: 24, gap: 16 },
  brand: { alignItems: 'center', gap: 8 },
  logo: { width: 72, height: 72 },
  wordmark: { ...typography.headingMd, color: colors.coffee, letterSpacing: 4 },
  tagline: { ...typography.body, color: colors.espresso },
  hero: { width: '100%', flex: 1, borderRadius: 24, backgroundColor: colors.chip },
  copy: { gap: 8 },
  title: { ...typography.title, color: colors.espresso },
  body: { ...typography.secondary, color: colors.stone },
  actions: { gap: 12 },
  footnote: { ...typography.caption, color: colors.stone, textAlign: 'center' },
});
