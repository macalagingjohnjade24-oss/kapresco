import { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography, radius, metrics } from '../theme';
import { Media, Button } from '../components/ui';
import { images } from '../data/images';

type Slide = { key: string; title: string; body: string; image: keyof typeof images };

const SLIDES: Slide[] = [
  { key: 'chill', title: 'Your everyday chill spot.', body: 'Fresh coffee, cozy moments, and that preskong feeling wherever you go.', image: 'onboardChill' },
  { key: 'brew', title: 'Find your perfect brew.', body: 'Explore coffee, refreshing drinks, pastries, and Kapresco favorites.', image: 'onboardBrewHero' },
  { key: 'order', title: 'Order. Chill. Repeat.', body: 'Order your favorite drinks ahead and enjoy Kapresco your way.', image: 'onboardOrder' },
];

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  // One slide is exactly one screen wide, so paging, scroll offsets and the
  // pager viewport can never disagree on a different device width.
  const { width: slideWidth } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const last = SLIDES.length - 1;
  const pager = useRef<ScrollView>(null);

  /** Keeps the active index in sync with wherever the pager actually is. */
  const syncIndex = (offsetX: number) => {
    const i = Math.min(last, Math.max(0, Math.round(offsetX / slideWidth)));
    setIndex(prev => (prev === i ? prev : i));
  };

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => syncIndex(e.nativeEvent.contentOffset.x);

  /** Scrolls the pager to a slide offset. Same call the swipe gesture uses. */
  const goTo = (target: number) => {
    const next = Math.min(last, Math.max(0, target));
    pager.current?.scrollTo({ x: next * slideWidth, animated: true });
    setIndex(next);
  };

  const next = () => (index === last ? router.replace('/auth') : goTo(index + 1));

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={[styles.topBar, styles.gutter]}>
        <Image source={images.onboardLogo} style={styles.miniLogo} resizeMode="contain" />
        <Text style={styles.skip} onPress={() => router.replace('/auth')} accessibilityRole="button" accessibilityLabel="Skip">
          Skip
        </Text>
      </View>

      <ScrollView
        ref={pager}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        onScrollEndDrag={onScrollEnd}
        style={styles.pager}
        contentContainerStyle={styles.pagerContent}
      >
        {SLIDES.map(s => (
          <View key={s.key} style={[styles.slide, { width: slideWidth }]}>
            <Media source={images[s.image]} ratio={354 / 300} style={styles.hero} />
            <View style={styles.copy}>
              <Text style={styles.title}>{s.title}</Text>
              <Text style={styles.body}>{s.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.dots, styles.gutter]}>
        {SLIDES.map((s, i) => (
          <View key={s.key} style={[styles.dot, i === index ? styles.dotActive : null]} />
        ))}
      </View>

      <View style={styles.gutter}>
        <Button label={index === last ? 'Get Started' : 'Continue'} onPress={next} />
      </View>

      <Text style={[styles.footer, styles.gutter]}>Sip. Chill. Repeat.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  /** Page gutter from the Figma "Welcome content" frame (padding 16/24/0/24). */
  gutter: { paddingHorizontal: metrics.inset },
  pager: { flex: 1 },
  pagerContent: { alignItems: 'stretch' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 44 },
  miniLogo: { width: 40, height: 40 },
  skip: { ...typography.secondaryBold, color: colors.coffee, paddingVertical: 8 },
  /** Full-bleed page: the gutter lives inside the slide so nothing can bleed past it. */
  slide: { paddingHorizontal: metrics.inset, paddingTop: 16, gap: 28 },
  hero: { width: '100%', aspectRatio: 354 / 300, borderRadius: radius.card, backgroundColor: colors.chip },
  copy: { gap: 12 },
  title: { ...typography.largeTitle, color: colors.espresso },
  body: { ...typography.body, color: colors.stone },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.borderDark },
  dotActive: { width: 24, backgroundColor: colors.coffee },
  footer: { ...typography.secondary, color: colors.stone, textAlign: 'center', marginTop: 16 },
});