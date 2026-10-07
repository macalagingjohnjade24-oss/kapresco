import { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../theme';
import { images } from '../data/images';

export default function Splash() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const t = setTimeout(() => router.replace('/onboarding'), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.center}>
        <Image source={images.logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.wordmark}>KAPRESCO</Text>
        <Text style={styles.tagline}>Sip. Chill. Repeat.</Text>
        <Text style={styles.sub}>Starts Your Day the Presko Way</Text>
      </View>
      <Image source={images.splashVisual} style={styles.visual} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 24 },
  logo: { width: 104, height: 104 },
  wordmark: { ...typography.headingMd, color: colors.coffee, letterSpacing: 4, marginTop: 8 },
  tagline: { ...typography.title, color: colors.espresso },
  sub: { ...typography.secondary, color: colors.stone },
  visual: { width: '100%', height: 220, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: colors.chip },
});
