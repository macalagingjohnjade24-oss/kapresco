import { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/Ionicons';
import { colors, typography, radius, metrics, pesos } from '../../theme';
import { Media, Screen, BrandHeader, CategoryScroller, ProductCard, Button, T } from '../../components/ui';
import { images } from '../../data/images';
import { PRODUCTS } from '../../data/products';
import { useApp } from '../../store/AppContext';

const VALUES: { icon: React.ComponentProps<typeof Icon>['name']; title: string; body: string }[] = [
  { icon: 'cafe', title: 'Local Flavor', body: 'Homegrown taste with a modern twist.' },
  { icon: 'leaf', title: 'Presko Vibes', body: 'Relaxing space, friendly faces.' },
  { icon: 'wallet', title: 'Sulit Prices', body: 'Affordable drinks, premium quality.' },
  { icon: 'timer', title: 'Fast & Fresh', body: 'Quick service, always fresh brews.' },
];

const CRAVING = ['Coffee', 'Cold Drinks', 'Blended', 'Tea', 'Pastries', 'Sandwiches'];

export default function Home() {
  const [craving, setCraving] = useState(CRAVING[0]);
  const { favorites, toggleFavorite, addToCart } = useApp();
  const bestsellers = PRODUCTS.slice(0, 4);

  const quickAdd = (id: string) => {
    const product = PRODUCTS.find(p => p.id === id)!;
    addToCart({
      product,
      size: 'Small',
      options: 'Normal ice · Normal sweetness Dairy milk · No add-ons',
      quantity: 1,
      unitPrice: product.price,
    });
    router.push('/added');
  };

  return (
    <Screen>
      <BrandHeader
        right="notifications-outline"
        onRight={() => router.push('/notifications')}
        title="Good morning, Jade!"
        titleSize="small"
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.greeting}>
          <Image source={images.userAvatar} style={styles.avatar} resizeMode="cover" />
          <Text style={styles.greetingText}>A little presko for your day.</Text>
          <TouchableOpacity
            style={styles.bellPill}
            onPress={() => router.push('/notifications')}
            accessibilityRole="button"
            accessibilityLabel="Notifications"
          >
            <Icon name="notifications-outline" size={22} color={colors.coffee} />
          </TouchableOpacity>
        </View>

        <Text style={styles.heading}>What are you craving?</Text>
        <CategoryScroller
          categories={CRAVING}
          value={craving}
          onChange={c => {
            setCraving(c);
            router.push('/menu');
          }}
        />

        <Media source={images.homeHero} ratio={354 / 206} style={styles.hero} />

        <View style={styles.invite}>
          <Text style={styles.inviteTitle}>{'Start Your Day the\nKapresco Way'}</Text>
          <Text style={styles.inviteBody}>Fresh brews, chill vibes, and comfort in every cup.</Text>
          <Button label="Order Now" onPress={() => router.push('/menu')} />
        </View>

        <Text style={styles.coffeeTitle}>Paborito sa Kapresco</Text>
        <Text style={styles.sub}>Refreshing coffee with a relaxing experience.</Text>
        <Text style={styles.kicker}>{`YOUR FOUR HOUSE FAVORITES · ALL ${pesos(89)}`}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {bestsellers.map(p => (
            <View key={p.id} style={styles.cardWrap}>
              <ProductCard
                product={p}
                favorite={favorites.includes(p.id)}
                onPress={() => router.push(`/product/${p.id}`)}
                onToggleFav={() => toggleFavorite(p.id)}
                onAdd={() => quickAdd(p.id)}
              />
            </View>
          ))}
        </ScrollView>

        <Text style={styles.coffeeTitle}>Why choose Kapresco?</Text>
        <Text style={styles.body}>More than coffee — it’s a preskong experience.</Text>
        <View style={styles.values}>
          {VALUES.map(v => (
            <View key={v.title} style={styles.valueCard}>
              <Icon name={v.icon} size={28} color={colors.coffee} />
              <View style={styles.valueText}>
                <Text style={T.row}>{v.title}</Text>
                <Text style={T.secondary}>{v.body}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.heading}>Kapresco Moments</Text>
        <TouchableOpacity
          onPress={() => router.push('/moments')}
          accessibilityRole="button"
          accessibilityLabel="Kapresco Moments"
        >
          <Media source={images.homeWhyMoments} ratio={354 / 144} style={styles.moments} />
        </TouchableOpacity>

        <Text style={styles.coffeeTitle}>Your everyday chill spot</Text>
        <Media source={images.homeChillPhoto} ratio={354 / 216} style={styles.chillPhoto} />
        <Text style={styles.chillTitle}>Come for the coffee, stay for the vibes.</Text>
        <Text style={styles.body}>
          Solo chill, study grind, or catching up with friends — there’s a seat for you.
        </Text>
        <View style={styles.storeCard}>
          <Text style={T.row}>Kapresco — Mati</Text>
          <Text style={T.secondary}>Madang, Central, City of Mati, Davao Oriental</Text>
          <Text style={styles.hours}>{'Mon–Sat: 8:00 AM – 9:00 PM\nSun: 10:00 AM – 7:00 PM'}</Text>
        </View>
        <Button label="Get Directions" onPress={() => router.push('/visit')} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: metrics.inset, paddingTop: 0, paddingBottom: 140, gap: metrics.gap },
  greeting: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.chip },
  greetingText: { ...typography.body, color: colors.stone, flex: 1 },
  bellPill: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: { ...typography.heading, color: colors.espresso },
  hero: { width: '100%', aspectRatio: 354 / 206, borderRadius: radius.card, backgroundColor: colors.chip },
  invite: { gap: 8 },
  inviteTitle: { ...typography.title, color: colors.espresso, lineHeight: 36 },
  inviteBody: { ...typography.secondary, color: colors.stone },
  coffeeTitle: { ...typography.title, color: colors.espresso },
  sub: { ...typography.secondary, color: colors.stone, marginTop: -8 },
  kicker: { ...typography.caption, color: colors.stone, letterSpacing: 0.5 },
  hScroll: { gap: 16, paddingRight: 4 },
  cardWrap: { width: 169 },
  body: { ...typography.body, color: colors.stone },
  values: { gap: 12 },
  valueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.paper,
    borderRadius: radius.card,
    padding: 16,
  },
  valueText: { flex: 1, gap: 4 },
  moments: { width: '100%', aspectRatio: 354 / 144, borderRadius: radius.card, backgroundColor: colors.chip },
  chillPhoto: { width: '100%', aspectRatio: 354 / 216, borderRadius: radius.card, backgroundColor: colors.chip },
  chillTitle: { ...typography.title, color: colors.espresso },
  storeCard: { backgroundColor: colors.paper, borderRadius: radius.card, padding: 16, gap: 12 },
  hours: { ...typography.caption, color: colors.stone },
});
