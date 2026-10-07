import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { pesos } from '../theme';
import { Screen, BackNav, SegmentedControl, GroupedCard, Toggle, QtyStepper, FloatingActionBar, Button, T } from '../components/ui';
import { getById } from '../data/products';
import { useApp } from '../store/AppContext';

const ICE = ['Less', 'Normal', 'Extra'];
const SWEETNESS = ['Less', 'Normal', 'Extra'];
const MILK = ['Dairy', 'Oat +₱20', 'Soy +₱15'];
const ADDONS: { id: string; label: string; price: number }[] = [
  { id: 'espresso', label: 'Espresso shot', price: 25 },
  { id: 'caramel', label: 'Caramel drizzle', price: 15 },
];

export default function Customize() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = getById(String(id)) ?? getById('chill-latte')!;
  const { addToCart } = useApp();

  const [ice, setIce] = useState('Normal');
  const [sweetness, setSweetness] = useState('Normal');
  const [milk, setMilk] = useState('Dairy');
  const [addons, setAddons] = useState<string[]>([]);
  const [qty, setQty] = useState(1);

  const extras = useMemo(() => addons.reduce((s, a) => s + (ADDONS.find(x => x.id === a)?.price ?? 0), 0), [addons]);
  const total = (product.price + extras) * qty;
  const options = `${ice} ice · ${sweetness} sweetness ${milk.replace(/\s\+\S+$/, '')} milk · ${addons.length === 0 ? 'No add-ons' : addons.map(a => ADDONS.find(x => x.id === a)!.label).join(', ')}`;

  const toggle = (addon: string) => setAddons(a => (a.includes(addon) ? a.filter(x => x !== addon) : [...a, addon]));

  const add = (then: 'cart' | 'checkout') => {
    addToCart({ product, size: 'Small', options, quantity: qty, unitPrice: product.price + extras });
    router.push(then === 'cart' ? '/added' : '/checkout');
  };

  return (
    <Screen>
      <BackNav title="Make it your way" fallback="/menu" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={T.bodyInk}>{`${product.name} · Small · ${pesos(product.price)} base`}</Text>

        <View style={styles.block}>
          <Text style={T.bodyInk}>Ice</Text>
          <SegmentedControl options={ICE} value={ice} onChange={setIce} />
        </View>

        <View style={styles.block}>
          <Text style={T.bodyInk}>Sweetness</Text>
          <SegmentedControl options={SWEETNESS} value={sweetness} onChange={setSweetness} />
        </View>

        <View style={styles.block}>
          <Text style={T.bodyInk}>Milk</Text>
          <View style={styles.chipRow}>
            {MILK.map(m => (
              <Button key={m} label={m} variant={m === milk ? 'primary' : 'secondary'} onPress={() => setMilk(m)} style={styles.chip} />
            ))}
          </View>
        </View>

        <GroupedCard gap={12}>
          <Text style={T.bodyInk}>Add-ons · optional</Text>
          {ADDONS.map(a => (
            <View key={a.id} style={styles.addonRow}>
              <View style={styles.flex}>
                <Text style={T.row}>{a.label}</Text>
                <Text style={T.caption}>{`+${pesos(a.price)}`}</Text>
              </View>
              <Toggle value={addons.includes(a.id)} onChange={() => toggle(a.id)} />
            </View>
          ))}
        </GroupedCard>

        <View style={styles.qtyRow}>
          <Text style={T.bodyInk}>Quantity</Text>
          <QtyStepper value={qty} onChange={d => setQty(q => Math.max(1, q + d))} />
        </View>

        <GroupedCard pad={12} gap={4}>
          <Text style={T.row}>{`${milk.replace(/\s\+\S+$/, '')} milk · ${addons.length === 0 ? 'No add-ons' : 'Add-ons selected'}.`}</Text>
          <Text style={T.secondary}>{`Your total is ${pesos(total)}.`}</Text>
        </GroupedCard>
      </ScrollView>

      <FloatingActionBar>
        <View style={styles.actions}>
          <Button label={`Add to Cart · ${pesos(total)}`} onPress={() => add('cart')} style={styles.flex} />
          <Button label="Order Now" variant="secondary" onPress={() => add('checkout')} style={styles.flex} />
        </View>
      </FloatingActionBar>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 160, gap: 16 },
  block: { gap: 12 },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: { flex: 1, paddingHorizontal: 8 },
  addonRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actions: { flexDirection: 'row', gap: 12 },
  flex: { flex: 1 },
});
