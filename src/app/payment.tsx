import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { colors, pesos } from '../theme';
import { Screen, BackNav, GroupedCard, Divider, FloatingActionBar, PaymentMethodSheet, Button, T } from '../components/ui';
import { useApp } from '../store/AppContext';

export default function Payment() {
  const { cart, payment, setPayment, placeOrder, orderType, setOrderType, when, pickupTime } = useApp();
  const [sheet, setSheet] = useState(false);
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  const total = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  const confirm = () => {
    placeOrder();
    router.replace('/confirmation');
  };

  return (
    <Screen>
      <BackNav title="Checkout" fallback="/checkout" right={null} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.chipRow}>
          {(['Pickup', 'Dine-in'] as const).map(t => (
            <Button
              key={t}
              label={t}
              variant={t === orderType ? 'primary' : 'secondary'}
              onPress={() => setOrderType(t)}
              style={styles.chip}
            />
          ))}
        </View>

        <GroupedCard pad={12} gap={4}>
          <Text style={T.row}>Kapresco — Mati</Text>
          <Text style={T.caption}>{when === 'ASAP' ? 'ASAP · 10–15 minutes' : `Pickup · ${pickupTime}`}</Text>
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

        <Button label={`Payment method · ${payment}`} variant="secondary" onPress={() => setSheet(true)} />

        <View style={styles.note}>
          <Text style={T.row}>{`${payment} selected`}</Text>
          <Text style={T.secondary}>You’ll confirm payment after placing your order.</Text>
        </View>
      </ScrollView>

      <FloatingActionBar>
        <Button label={`Confirm ${payment} · ${pesos(total)}`} onPress={confirm} />
      </FloatingActionBar>

      <PaymentMethodSheet
        visible={sheet}
        total={total}
        payment={payment}
        onSelect={setPayment}
        onClose={() => setSheet(false)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 160, gap: 16 },
  chipRow: { flexDirection: 'row', gap: 8 },
  chip: { flex: 1, paddingHorizontal: 8 },
  line: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  note: { backgroundColor: colors.chip, borderRadius: 16, padding: 16, gap: 4 },
  flex: { flex: 1 },
  // Price column: never shrinks, never escapes the card's right padding.
  itemPrice: { ...T.priceItem, flexShrink: 0, minWidth: 48, textAlign: 'right' },
  itemTotal: { ...T.priceBody, flexShrink: 0, minWidth: 64, textAlign: 'right' },
  itemGrand: { ...T.priceTotal, flexShrink: 0, minWidth: 72, textAlign: 'right' },
});