import { View, Text, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, pesos, radius } from '../../theme';
import { Page, GroupedCard, IconControl, Button, EmptyState, T } from '../../components/ui';
import { images } from '../../data/images';
import { PRODUCTS } from '../../data/products';
import { useApp } from '../../store/AppContext';

export default function Favorites() {
  const { favorites, toggleFavorite, addToCart } = useApp();
  const saved = PRODUCTS.filter(p => favorites.includes(p.id));

  const quickAdd = (id: string) => {
    const product = PRODUCTS.find(p => p.id === id)!;
    addToCart({ product, size: 'Small', options: 'Normal ice · Normal sweetness Dairy milk · No add-ons', quantity: 1, unitPrice: product.price });
    router.push('/added');
  };

  return (
    <Page title="Favorites" headerRight="bag" bottom={100}>
      {saved.length === 0 ? (
        <EmptyState
          icon="heart-outline"
          title="No favorites yet"
          body="Save your Kapresco favorites for your next chill."
          actionLabel="Explore Menu"
          onAction={() => router.push('/menu')}
        />
      ) : (
        <>
          <Text style={T.bodyInk}>Your next chill, saved.</Text>
          {saved.map(p => (
            <GroupedCard key={p.id} style={styles.card}>
              <View style={styles.row}>
                <Image source={images[p.image]} style={styles.thumb} resizeMode="cover" />
                <View style={styles.info}>
                  <View style={styles.titleRow}>
                    <View style={styles.flex}>
                      <Text style={T.row}>{p.name}</Text>
                    </View>
                    <IconControl name="heart" onPress={() => toggleFavorite(p.id)} color={colors.error} />
                  </View>
                  <Text style={T.priceItem}>{`${pesos(p.price)} · Small`}</Text>
                </View>
              </View>
              <Button label="Quick Add" variant="secondary" onPress={() => quickAdd(p.id)} />
            </GroupedCard>
          ))}
        </>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  card: { gap: 16 },
  row: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  thumb: { width: 92, height: 92, borderRadius: radius.control, backgroundColor: colors.chip },
  info: { flex: 1, gap: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  flex: { flex: 1 },
});
