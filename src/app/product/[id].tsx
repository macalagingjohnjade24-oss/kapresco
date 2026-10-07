import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { colors, pesos2, radius } from '../../theme';
import { Media, Screen, BackNav, IconControl, GroupedCard, ListRow, FloatingActionBar, Button, EmptyAction, T } from '../../components/ui';
import { images } from '../../data/images';
import { getById } from '../../data/products';
import { useApp } from '../../store/AppContext';

const SIZES = ['Small', 'Medium', 'Large'];

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = getById(String(id));
  const { favorites, toggleFavorite, addToCart } = useApp();
  const [size, setSize] = useState(SIZES[0]);

  if (!product) {
    return (
      <Screen>
        <BackNav fallback="/menu" />
        <View style={styles.missing}>
          <Text style={T.heading}>We couldn’t find that drink.</Text>
          <EmptyAction label="Explore Menu" onPress={() => router.replace('/menu')} />
        </View>
      </Screen>
    );
  }

  const favorite = favorites.includes(product.id);
  const add = () => {
    addToCart({ product, size: size as 'Small', options: 'Normal ice · Normal sweetness Dairy milk · No add-ons', quantity: 1, unitPrice: product.price });
    router.push('/added');
  };

  return (
    <Screen>
      <BackNav title={product.name} fallback="/menu" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View>
          <Media source={images[product.image]} ratio={354 / 216} style={styles.hero} />
          <View style={styles.heroHeart}>
            <IconControl name={favorite ? 'heart' : 'heart-outline'} onPress={() => toggleFavorite(product.id)} color={favorite ? colors.error : colors.coffee} />
          </View>
        </View>

        <View style={styles.priceRow}>
          <Text style={T.priceDeep}>{pesos2(product.price)}</Text>
          <Text style={T.caption}>Small · Base price</Text>
        </View>

        <Text style={T.body}>{product.description} — your go-to pick-me-up for laid-back days.</Text>

        <View style={styles.sizeBlock}>
          <Text style={T.bodyInk}>Choose your size</Text>
          <View style={styles.sizeRow}>
            {SIZES.map(s => (
              <Button
                key={s}
                label={s}
                variant={s === size ? 'primary' : 'secondary'}
                onPress={() => setSize(s)}
                style={styles.sizeBtn}
              />
            ))}
          </View>
          <Text style={T.caption}>Small {pesos2(product.price)} · Medium +₱20 · Large +₱40</Text>
        </View>

        <GroupedCard pad={12} gap={0}>
          <ListRow
            title="Make it your way"
            subtitle="Ice, sweetness, milk & extras"
            icon="options-outline"
            onPress={() => router.push({ pathname: '/customize', params: { id: product.id } })}
          />
        </GroupedCard>
      </ScrollView>

      <FloatingActionBar>
        <View style={styles.actions}>
          <Button label="Add to Cart" onPress={add} style={styles.flex} />
          <Button label="Order Now" variant="secondary" onPress={() => router.push('/customize')} style={styles.flex} />
        </View>
      </FloatingActionBar>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 160, gap: 16 },
  hero: { width: '100%', aspectRatio: 354 / 216, borderRadius: radius.card, backgroundColor: colors.chip },
  heroHeart: { position: 'absolute', top: 12, right: 12 },
  priceRow: { gap: 4 },
  sizeBlock: { gap: 12 },
  sizeRow: { flexDirection: 'row', gap: 8 },
  sizeBtn: { flex: 1, paddingHorizontal: 8 },
  actions: { flexDirection: 'row', gap: 12 },
  flex: { flex: 1 },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },
});
