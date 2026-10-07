import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, pesos } from '../../theme';
import { Page, SegmentedControl, GroupedCard, Divider, Button, EmptyState, T } from '../../components/ui';
import { useApp, Order } from '../../store/AppContext';

const STATUS: Record<Order['status'], { label: string; color: string; bg: string }> = {
  Preparing: { label: 'Preparing', color: colors.success, bg: colors.successBg },
  Ready: { label: 'Ready for Pickup', color: colors.success, bg: colors.successBg },
  Completed: { label: 'Completed', color: colors.stone, bg: colors.chip },
};

function OrderCard({ order, active }: { order: Order; active: boolean }) {
  const status = STATUS[order.status];
  return (
    <GroupedCard style={styles.card} gap={12}>
      <View style={styles.cardHead}>
        <Text style={styles.orderId}>{order.id}</Text>
        <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>
      <Text style={T.caption}>{order.dateLabel}</Text>

      {order.items.map((item, i) => (
        <View key={`${item.name}-${i}`} style={styles.itemRow}>
          <Text style={styles.itemName}>{`${item.name} · ${item.size}`}</Text>
          <Text style={styles.itemPrice}>{pesos(item.price)}</Text>
        </View>
      ))}

      <Divider />
      <View style={styles.itemRow}>
        <Text style={styles.itemLabel}>{`${order.items.length} items`}</Text>
        <Text style={styles.itemTotal}>{pesos(order.total)}</Text>
      </View>

      <Button
        label={active ? 'Track Order' : 'Order Again'}
        variant={active ? 'primary' : 'secondary'}
        onPress={() => (active ? router.push('/track') : router.push('/menu'))}
      />
    </GroupedCard>
  );
}

export default function Orders() {
  const [tab, setTab] = useState('Active');
  const { orders } = useApp();

  const active = orders.filter(o => o.status !== 'Completed');
  const past = orders.filter(o => o.status === 'Completed');

  return (
    <Page title="Orders" headerRight="bag" bottom={100}>
      <SegmentedControl options={['Active', 'Past']} value={tab} onChange={setTab} />

      {tab === 'Active' ? (
        active.length === 0 ? (
          <EmptyState icon="receipt-outline" title="No orders yet" body="Your first presko moment is waiting. Find a brew you’ll love." actionLabel="Order Now" onAction={() => router.push('/menu')} />
        ) : (
          <>
            {active.map(o => (
              <OrderCard key={o.id} order={o} active />
            ))}
            <GroupedCard style={styles.promo}>
              <Text style={T.headingMd}>A little chill is on its way.</Text>
              <Text style={T.body}>We’ll send you a notification when your order is ready for pickup.</Text>
            </GroupedCard>
          </>
        )
      ) : past.length === 0 ? (
        <EmptyState icon="time-outline" title="No orders yet" body="Your first presko moment is waiting. Find a brew you’ll love." actionLabel="Order Now" onAction={() => router.push('/menu')} />
      ) : (
        past.map(o => <OrderCard key={o.id} order={o} active={false} />)
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderId: { ...T.headingMd, color: colors.coffee },
  statusPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
  statusText: { fontSize: 13, lineHeight: 17 },
  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  // Description takes the remaining width and wraps; the price never shrinks or
  // escapes the card's 16pt padding.
  itemName: { ...T.row, flex: 1, minWidth: 0 },
  itemLabel: { ...T.secondary, flex: 1, minWidth: 0 },
  itemPrice: { ...T.priceItem, flexShrink: 0, minWidth: 48, textAlign: 'right' },
  itemTotal: { ...T.priceTotal, flexShrink: 0, minWidth: 72, textAlign: 'right' },
  promo: { gap: 8 },
});
