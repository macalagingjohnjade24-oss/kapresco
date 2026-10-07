import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors, pesos, radius } from '../theme';
import { Media, Screen, BackNav, FeedbackMessage, GroupedCard, FloatingActionBar, Button, T } from '../components/ui';
import { images } from '../data/images';
import { useApp } from '../store/AppContext';

export default function Added() {
  const { cart } = useApp();
  const latest = cart[cart.length - 1];
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  const total = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const rest = cart.slice(0, -1);

  return (
    <Screen>
      <BackNav title={latest?.product.name ?? 'Kapresco'} fallback="/menu" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Media source={images.addedHero} ratio={354 / 256} style={styles.hero} />

        <FeedbackMessage
          title="Added to your cart"
          body={latest ? `${latest.quantity} ${latest.size} ${latest.product.name} · ${pesos(latest.unitPrice * latest.quantity)}` : undefined}
        />

        <View style={styles.center}>
          <Text style={T.heading}>Your usual, made just right.</Text>
          <Text style={styles.options}>{latest?.options ?? 'Normal ice · Normal sweetness Dairy milk · No add-ons'}</Text>
        </View>

        {rest.length > 0 ? (
          <GroupedCard pad={12} gap={4}>
            <Text style={T.row}>{`${rest[0].product.name} is already in your cart.`}</Text>
            <Text style={T.secondary}>{`${count} Small drinks · Total ${pesos(total)}`}</Text>
          </GroupedCard>
        ) : null}

        <Button label="Keep exploring" variant="secondary" onPress={() => router.replace('/menu')} />
      </ScrollView>

      <FloatingActionBar>
        <Button label={`View Cart · ${count} ${count === 1 ? 'item' : 'items'} · ${pesos(total)}`} onPress={() => router.replace('/cart')} />
      </FloatingActionBar>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 160, gap: 16 },
  hero: { width: '100%', aspectRatio: 354 / 256, borderRadius: radius.card, backgroundColor: colors.chip },
  center: { alignItems: 'center', gap: 8 },
  options: { ...T.caption, color: colors.stone, textAlign: 'center' },
});
