import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors, radius } from '../theme';
import { Media, Screen, BackNav, SearchField, CategoryScroller, ProductCard, ProductGrid, EmptyAction, T } from '../components/ui';
import { images } from '../data/images';
import { CATEGORIES, PRODUCTS } from '../data/products';
import { useApp } from '../store/AppContext';

const RECENT = ['Chill Latte', 'Caramel', 'Croissant'];

export default function Search() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const { favorites, toggleFavorite } = useApp();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PRODUCTS.filter(p => p.name.toLowerCase().includes(q) && (category === CATEGORIES[0] || p.category === category));
  }, [query, category]);

  const empty = query.trim().length > 0;

  const quickAdd = (id: string) => router.push(`/product/${id}`);

  return (
    <Screen>
      <BackNav title="Search" fallback="/menu" right={null} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <SearchField value={query} onChange={setQuery} />

        {empty ? (
          results.length === 0 ? (
            <View style={styles.empty}>
              <Text style={T.heading}>No drinks found.</Text>
              <Text style={styles.emptyBody}>Try another name or explore something fresh on the menu.</Text>
              <EmptyAction label="Explore Menu" onPress={() => router.replace('/menu')} />
            </View>
          ) : (
            <>
              <Text style={T.secondary}>{`${results.length} results for “${query.trim()}”`}</Text>
              <ProductGrid
                products={results}
                renderCard={p => (
                  <ProductCard
                    product={p}
                    favorite={favorites.includes(p.id)}
                    onPress={() => router.push(`/product/${p.id}`)}
                    onToggleFav={() => toggleFavorite(p.id)}
                    onAdd={() => quickAdd(p.id)}
                  />
                )}
              />
            </>
          )
        ) : (
          <>
            <Text style={styles.recentLabel}>RECENT SEARCHES</Text>
            <View style={styles.recentWrap}>
              {RECENT.map(r => (
                <TouchableOpacity key={r} style={styles.recentChip} onPress={() => setQuery(r)} accessibilityRole="button" accessibilityLabel={r}>
                  <Text style={styles.recentText}>{r}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Media source={images.searchHero} ratio={354 / 144} style={styles.discovery} />

            <Text style={T.heading}>Find your next favorite</Text>
            <CategoryScroller categories={CATEGORIES} value={category} onChange={setCategory} />
            <Text style={T.body}>
              Coffee, tea, cold drinks, blended drinks, frappe, pastries, and sandwiches.
            </Text>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 40, gap: 16 },
  recentLabel: { ...T.caption, color: colors.stone, letterSpacing: 1 },
  recentWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  recentChip: { height: 44, paddingHorizontal: 16, borderRadius: radius.pill, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' },
  recentText: { ...T.secondary, color: colors.coffee },
  discovery: { width: '100%', aspectRatio: 354 / 144, borderRadius: radius.card, backgroundColor: colors.chip },
  empty: { alignItems: 'center', gap: 12, paddingVertical: 32 },
  emptyBody: { ...T.body, color: colors.stone, textAlign: 'center' },
});
