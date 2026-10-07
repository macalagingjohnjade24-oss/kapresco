import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { pesos } from '../theme';
import { Screen, BackNav, SegmentedControl, GroupedCard, GroupedList, ListRow, Divider, FeedbackMessage, FloatingActionBar, BottomSheet, Button, T } from '../components/ui';
import { useApp } from '../store/AppContext';

const TIMES = ['Today · 10:30 AM', 'Today · 3:00 PM', 'Tomorrow · 9:00 AM'];

export default function Scheduled() {
  const { cart, pickupTime, setPickupTime, when, setWhen, payment, placeOrder } = useApp();
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
      <View style={styles.content}>
        <GroupedCard pad={12} gap={4}>
          <Text style={T.row}>Pickup at Kapresco — Mati</Text>
          <Text style={T.caption}>Madang, Central, City of Mati</Text>
        </GroupedCard>

        <SegmentedControl
          options={['ASAP', 'Schedule for later']}
          value={when === 'Later' ? 'Schedule for later' : 'ASAP'}
          onChange={v => setWhen(v === 'ASAP' ? 'ASAP' : 'Later')}
        />

        <GroupedCard pad={0} gap={0}>
          <ListRow title="Pickup time" value={pickupTime} icon="time-outline" onPress={() => setSheet(true)} />
        </GroupedCard>

        <FeedbackMessage
          title="Pickup time selected"
          body={`Today at ${pickupTime.split('·')[1]?.trim() ?? pickupTime}. We’ll brew closer to your time.`}
          icon="calendar-outline"
        />

        <GroupedCard pad={0} gap={0}>
          <ListRow title="Payment" value={payment} icon="wallet-outline" onPress={() => router.push('/payment')} />
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
      </View>

      <FloatingActionBar>
        <Button label={`Place scheduled order · ${pesos(total)}`} onPress={confirm} />
      </FloatingActionBar>

      <BottomSheet visible={sheet} onClose={() => setSheet(false)}>
        <Text style={T.heading}>Choose pickup time</Text>
        <GroupedList>
          {TIMES.map(t => (
            <ListRow key={t} title={t} selected={t === pickupTime} onPress={() => { setPickupTime(t); setSheet(false); }} />
          ))}
        </GroupedList>
        <Button label="Confirm" onPress={() => setSheet(false)} />
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 160, gap: 16 },
  line: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  flex: { flex: 1 },
  // Price column: never shrinks, never escapes the card's right padding.
  itemPrice: { ...T.priceItem, flexShrink: 0, minWidth: 48, textAlign: 'right' },
  itemTotal: { ...T.priceBody, flexShrink: 0, minWidth: 64, textAlign: 'right' },
  itemGrand: { ...T.priceTotal, flexShrink: 0, minWidth: 72, textAlign: 'right' },
});
