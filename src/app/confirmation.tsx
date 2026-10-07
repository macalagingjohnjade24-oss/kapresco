import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/Ionicons';
import { colors, pesos } from '../theme';
import { Screen, BrandHeader, GroupedCard, Divider, FloatingActionBar, Button, T } from '../components/ui';
import { useApp } from '../store/AppContext';

export default function Confirmation() {
  const { lastOrder, orders, when, pickupTime } = useApp();
  const order = lastOrder ?? orders[0];
  const total = order?.total ?? 178;
  const whenLabel = when === 'ASAP' ? 'ASAP' : `Scheduled · ${pickupTime}`;
  const items = order?.items ?? [];

  return (
    <Screen>
      <BrandHeader right={null} title="Order Confirmed!" />
      <View style={styles.content}>
        <View style={styles.success}>
          <View style={styles.circle}>
            <Icon name="checkmark" size={48} color={colors.white} />
          </View>
          <Text style={T.body}>Your Kapresco is being prepared.</Text>
          <Text style={styles.sub}>
            {when === 'ASAP'
              ? 'A fresh brew is on the way. Ready in 10–15 minutes.'
              : `Scheduled for ${pickupTime}. We’ll brew closer to your time.`}
          </Text>
        </View>

        <GroupedCard pad={12} gap={12}>
          <View style={styles.line}>
            <Text style={styles.orderId}>{order?.id ?? '#KP-1042'}</Text>
            <Text style={T.secondary}>{`${order?.type ?? 'Pickup'} · ${whenLabel}`}</Text>
          </View>
          <Text style={T.caption}>{`Kapresco — Mati · Paid with ${order?.payment ?? 'GCash'}`}</Text>
          <Divider />
          {items.map((item, i) => (
            <View key={`${item.name}-${i}`} style={styles.line}>
              <View style={styles.flex}>
                <Text style={T.row}>{item.name}</Text>
                <Text style={T.caption}>Small · Normal ice &amp; sweetness</Text>
              </View>
              <Text style={styles.itemPrice}>{pesos(item.price)}</Text>
            </View>
          ))}
          <Divider />
          <View style={styles.line}>
            <Text style={T.headingMd}>Total paid</Text>
            <Text style={styles.itemTotal}>{pesos(total)}</Text>
          </View>
        </GroupedCard>

        <Button label="Back to Home" variant="secondary" onPress={() => router.replace('/home')} />
      </View>

      <FloatingActionBar>
        <Button label="Track Order" onPress={() => router.replace('/track')} />
      </FloatingActionBar>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 160, gap: 24 },
  success: { alignItems: 'center', gap: 12 },
  circle: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  sub: { ...T.caption, color: colors.stone, textAlign: 'center' },
  line: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  orderId: { ...T.headingMd, color: colors.coffee },
  flex: { flex: 1 },
  // Price column: never shrinks, never escapes the card's right padding.
  itemPrice: { ...T.priceItem, flexShrink: 0, minWidth: 48, textAlign: 'right' },
  itemTotal: { ...T.priceBody, flexShrink: 0, minWidth: 64, textAlign: 'right' },
  itemGrand: { ...T.priceTotal, flexShrink: 0, minWidth: 72, textAlign: 'right' },
});
