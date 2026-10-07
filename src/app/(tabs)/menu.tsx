import { useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Page, SearchField, CategoryScroller, ProductGrid, ProductCard, BottomSheet, Button, EmptyAction, CategoryChip, GroupedList, ListRow, IconControl, T } from '../../components/ui';
import { CATEGORIES, productsByCategory } from '../../data/products';
import { useApp } from '../../store/AppContext';

const PRICE_BANDS = ['All prices', 'Under ₱100', '₱100+'];
const QUICK_FILTERS = ['Popular', 'New', 'Favorites'];
const SORTS = ['Recommended', 'Price: Low to High', 'Price: High to Low'];

export default function Menu() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [sheet, setSheet] = useState(false);
  const [sort, setSort] = useState(SORTS[0]);
  const [band, setBand] = useState(PRICE_BANDS[0]);

  const { favorites, toggleFavorite, addToCart } = useApp();

  const list = useMemo(() => {
    const searched = query.trim()
      ? productsByCategory(category).filter(p => p.name.toLowerCase().includes(query.trim().toLowerCase()))
      : productsByCategory(category);
    const priced = band === 'Under ₱100' ? searched.filter(p => p.price < 100) : band === '₱100+' ? searched.filter(p => p.price >= 100) : searched;
    if (sort === 'Price: Low to High') return [...priced].sort((a, b) => a.price - b.price);
    if (sort === 'Price: High to Low') return [...priced].sort((a, b) => b.price - a.price);
    return priced;
  }, [category, query, band, sort]);

  const quickAdd = (id: string) => {
    const product = productsByCategory(category).find(p => p.id === id)!;
    addToCart({ product, size: 'Small', options: 'Normal ice · Normal sweetness Dairy milk · No add-ons', quantity: 1, unitPrice: product.price });
    router.push('/added');
  };

  const reset = () => {
    setSort(SORTS[0]);
    setBand(PRICE_BANDS[0]);
    setCategory(CATEGORIES[0]);
    setQuery('');
  };

  return (
    <Page title="Menu" headerRight="bag" bottom={100}>
      <View style={styles.searchRow}>
        <View style={styles.flex}>
          <SearchField value={query} onChange={setQuery} />
        </View>
        <IconControl name="options-outline" label="Filter and sort" onPress={() => setSheet(true)} />
      </View>

      <CategoryScroller categories={CATEGORIES} value={category} onChange={setCategory} />

      {list.length === 0 ? (
        <View style={styles.empty}>
          <Text style={T.heading}>No drinks found.</Text>
          <Text style={styles.emptyBody}>Try another name or explore something fresh on the menu.</Text>
          <EmptyAction label="Explore Menu" onPress={reset} />
        </View>
      ) : (
        <ProductGrid
          products={list}
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
      )}

      <BottomSheet visible={sheet} onClose={() => setSheet(false)}>
        <Text style={T.heading}>Filter &amp; sort</Text>

        <Text style={T.bodyInk}>Category</Text>
        <View style={styles.chipWrap}>
          {CATEGORIES.map(c => (
            <CategoryChip key={c} label={c} selected={c === category} onPress={() => setCategory(c)} />
          ))}
        </View>

        <Text style={T.bodyInk}>Price</Text>
        <View style={styles.chipWrap}>
          {PRICE_BANDS.map(b => (
            <CategoryChip key={b} label={b} selected={b === band} onPress={() => setBand(b)} />
          ))}
        </View>

        <View style={styles.chipWrap}>
          {QUICK_FILTERS.map(q => (
            <CategoryChip key={q} label={q} selected={q === QUICK_FILTERS[0]} onPress={() => setSheet(false)} />
          ))}
        </View>

        <Text style={T.bodyInk}>Sort by</Text>
        <GroupedList>
          {SORTS.map(s => (
            <ListRow key={s} title={s} selected={s === sort} onPress={() => setSort(s)} />
          ))}
        </GroupedList>

        <View style={styles.sheetActions}>
          <Button label="Reset" variant="secondary" onPress={reset} style={styles.flex} />
          <Button label="Apply filters" onPress={() => setSheet(false)} style={styles.flex} />
        </View>
      </BottomSheet>
    </Page>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  empty: { alignItems: 'center', gap: 12, paddingVertical: 32 },
  emptyBody: { ...T.body, textAlign: 'center' },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sheetActions: { flexDirection: 'row', gap: 12 },
});
