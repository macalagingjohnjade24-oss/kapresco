import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/Ionicons';
import { colors, pesos } from '../theme';
import { Screen, BackNav, GroupedCard, Divider, Button, T } from '../components/ui';
import { useApp } from '../store/AppContext';

type Step = { key: string; title: string; caption: string; done?: boolean };

const PREPARING: Step[] = [
  { key: 'confirmed', title: 'Order Confirmed', caption: '9:41 AM · Payment received', done: true },
  { key: 'preparing', title: 'Preparing', caption: 'Your barista is on it', done: true },
  { key: 'ready', title: 'Ready for Pickup', caption: 'We’ll let you know' },
  { key: 'completed', title: 'Completed', caption: 'Sip. Chill. Repeat.' },
];

const READY: Step[] = [
  { key: 'confirmed', title: 'Order Confirmed', caption: '9:41 AM', done: true },
  { key: 'preparing', title: 'Preparing', caption: 'Freshly brewed with care', done: true },
  { key: 'ready', title: 'Ready for Pickup', caption: '9:53 AM · Ready now', done: true },
  { key: 'completed', title: 'Completed', caption: 'Enjoy your coffee after pickup' },
];

function Timeline({ steps }: { steps: Step[] }) {
  return (
    <View style={styles.timeline}>
      {steps.map((s, i) => {
        const active = i === steps.findIndex(x => !x.done);
        return (
          <View key={s.key} style={styles.step}>
            <View style={styles.stepRail}>
              <View style={[styles.dot, s.done ? styles.dotDone : active ? styles.dotActive : null]}>
                {s.done ? <Icon name="checkmark" size={18} color={colors.white} /> : null}
              </View>
              {i < steps.length - 1 ? <View style={[styles.line, s.done ? styles.lineDone : null]} /> : null}
            </View>
            <View style={styles.stepBody}>
              <Text style={active ? T.row : T.secondary}>{s.title}</Text>
              <Text style={T.caption}>{s.caption}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default function Track() {
  const { lastOrder, orders, when, pickupTime } = useApp();
  const order = lastOrder ?? orders[0];
  const [ready, setReady] = useState(order?.status === 'Ready');
  const total = order?.total ?? 178;
  const steps = ready ? READY : PREPARING;
  const readyIndex = ready ? 2 : 1;
  const orderNo = order?.id ?? '#KP-1042';
  const orderType = order?.type ?? 'Pickup';
  const items = order?.items ?? [];
  const window = when === 'ASAP' ? 'Ready in 10–15 minutes' : `Scheduled for ${pickupTime}`;

  return (
    <Screen>
      <BackNav title="Track Order" fallback="/orders" right={null} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.pill}>{`${orderType.toUpperCase()} · ${orderNo}`}</Text>
          <Text style={styles.heroTitle}>{ready ? 'Your Kapresco is ready!' : 'Brewing your presko.'}</Text>
          <Text style={styles.heroSub}>{ready ? `Head to the counter and show ${orderNo}.` : window}</Text>
        </View>

        <GroupedCard pad={12} gap={0}>
          <Timeline steps={steps} />
        </GroupedCard>

        <GroupedCard pad={12} gap={12}>
          <Text style={T.secondary}>{`Kapresco — Mati · Total ${pesos(total)}`}</Text>
          {items.map((item, i) => (
            <View key={`${item.name}-${i}`} style={styles.itemLine}>
              <View style={styles.flex}>
                <Text style={T.row}>{item.name}</Text>
                <Text style={T.caption}>Small · Normal ice &amp; sweetness</Text>
              </View>
              <Text style={styles.itemPrice}>{pesos(item.price)}</Text>
            </View>
          ))}
          <Divider />
          <Text style={T.caption}>{`${orderNo} · ${orderType} · ${order?.payment ?? 'GCash'} paid · ${pesos(total)}`}</Text>
        </GroupedCard>

        <Button label={ready ? 'Get Directions' : 'Need help? Contact Kapresco'} onPress={() => router.push(ready ? '/visit' : '/contact')} />

        <GroupedCard pad={12} gap={8}>
          <Text style={T.row}>Simulate the next status</Text>
          <Text style={T.caption}>Local demo control — switches between the preparing and ready states.</Text>
          <Button
            label={ready ? 'Show preparing state' : 'Mark ready for pickup'}
            variant="secondary"
            onPress={() => setReady(r => !r)}
          />
        </GroupedCard>

        <View style={styles.dotRow}>
          {steps.map((s, i) => (
            <Icon key={s.key} name={i <= readyIndex ? 'ellipse' : 'ellipse-outline'} size={10} color={colors.caramel} />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 40, gap: 16 },
  hero: { alignItems: 'center', gap: 8 },
  pill: { ...T.caption, color: colors.coffee, letterSpacing: 1 },
  heroTitle: { ...T.largeTitle, color: colors.espresso, textAlign: 'center' },
  heroSub: { ...T.body, color: colors.stone, textAlign: 'center' },
  timeline: { gap: 0 },
  step: { flexDirection: 'row', gap: 12 },
  stepRail: { alignItems: 'center', width: 32 },
  dot: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: colors.borderDark, alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: colors.success, borderColor: colors.success },
  dotActive: { backgroundColor: colors.chip, borderColor: colors.caramel },
  line: { width: 2, flex: 1, minHeight: 32, backgroundColor: colors.border },
  lineDone: { backgroundColor: colors.success },
  stepBody: { flex: 1, gap: 4, paddingBottom: 20 },
  itemLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  dotRow: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  flex: { flex: 1 },
  // Price column: never shrinks, never escapes the card's right padding.
  itemPrice: { ...T.priceItem, flexShrink: 0, minWidth: 48, textAlign: 'right' },
  itemTotal: { ...T.priceBody, flexShrink: 0, minWidth: 64, textAlign: 'right' },
  itemGrand: { ...T.priceTotal, flexShrink: 0, minWidth: 72, textAlign: 'right' },
});
