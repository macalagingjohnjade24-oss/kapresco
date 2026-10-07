import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { pesos } from '../theme';
import { Screen, BackNav, SegmentedControl, GroupedCard, Divider, ListRow, FloatingActionBar, PaymentMethodSheet, Button, T } from '../components/ui';
import { useApp } from '../store/AppContext';

const ORDER_TYPES = ['Pickup', 'Dine-in'];
const WHENS: { label: string; value: 'ASAP' | 'Later' }[] = [
  { label: 'ASAP', value: 'ASAP' },
  { label: 'Schedule for later', value: 'Later' },
];

export default function Checkout() {
  const { cart, orderType, setOrderType, when, setWhen, payment, setPayment, pickupTime } = useApp();
  const [payOpen, setPayOpen] = useState(false);
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  const total = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  return (
    <Screen>
      <BackNav title="Checkout" fallback="/cart" right={null} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={T.bodyInk}>Order Type</Text>
        <SegmentedControl
          options={ORDER_TYPES}
          value={orderType}
          onChange={v => setOrderType(v === 'Dine-in' ? 'Dine-in' : 'Pickup')}
        />

        <GroupedCard pad={12} gap={4}>
          <Text style={T.row}>Kapresco — Mati</Text>
          <Text style={T.caption}>Madang, Central, City of Mati</Text>
        </GroupedCard>

        <View style={styles.block}>
          <Text style={T.bodyInk}>When would you like it?</Text>
          <View style={styles.chipRow}>
            {WHENS.map(w => (
              <Button
                key={w.value}
                label={w.label}
                variant={w.value === when ? 'primary' : 'secondary'}
                onPress={() => setWhen(w.value)}
                style={styles.chip}
              />
            ))}
          </View>
          <Text style={T.caption}>{when === 'ASAP' ? 'Ready in about 10–15 minutes.' : `Pickup at ${pickupTime}.`}</Text>
        </View>

        <GroupedCard pad={0} gap={0}>
          <ListRow
            title="Payment"
            subtitle="Cash & Card also available"
            value={payment}
            icon="wallet-outline"
            onPress={() => setPayOpen(true)}
          />
        </GroupedCard>

        <GroupedCard pad={12} gap={12}>
          {cart.map(item => (
            <View key={item.uid} style={styles.line}>
              <View style={styles.flex}>
                <Text style={T.row}>{`${item.quantity} × ${item.product.name}`}</Text>
                <Text style={T.caption}>{`${item.size} · Normal ice & sweetness`}</Text>
              </View>
              <Text style={styles.itemPrice}>{pesos(item.unitPrice * item.quantity)}</Text>
            </View>
          ))}
          <Divider />
          <View style={styles.line}>
            <Text style={T.secondary}>{`Subtotal · ${count} ${count === 1 ? 'item' : 'items'}`}</Text>
            <Text style={styles.itemTotal}>{pesos(total)}</Text>
          </View>
          <View style={styles.line}>
            <Text style={T.headingMd}>Total</Text>
            <Text style={styles.itemGrand}>{pesos(total)}</Text>
          </View>
        </GroupedCard>
      </ScrollView>

      <FloatingActionBar>
        <Button label={`Place Order · ${pesos(total)}`} onPress={() => router.push(when === 'Later' ? '/scheduled' : '/payment')} />
      </FloatingActionBar>

      <PaymentMethodSheet
        visible={payOpen}
        total={total}
        payment={payment}
        onSelect={setPayment}
        onClose={() => setPayOpen(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 160, gap: 16 },
  block: { gap: 12 },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: { flex: 1, paddingHorizontal: 8 },
  line: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  flex: { flex: 1 },
  // Price column: never shrinks, never escapes the card's right padding.
  itemPrice: { ...T.priceItem, flexShrink: 0, minWidth: 48, textAlign: 'right' },
  itemTotal: { ...T.priceBody, flexShrink: 0, minWidth: 64, textAlign: 'right' },
  itemGrand: { ...T.priceTotal, flexShrink: 0, minWidth: 72, textAlign: 'right' },
});
