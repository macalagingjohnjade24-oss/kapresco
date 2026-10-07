import { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, PanResponder } from 'react-native';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/Ionicons';
import { colors, pesos, radius, typography } from '../theme';
import { Screen, BackNav, GroupedCard, QtyStepper, IconControl, Divider, FloatingActionBar, Button, EmptyAction, FeedbackMessage, T } from '../components/ui';
import { images } from '../data/images';
import { CartItem, useApp } from '../store/AppContext';

/** Width of the revealed Remove panel, from the Figma "Swipe to remove" frame. */
const REMOVE_WIDTH = 100;

/**
 * Swipe-to-remove, matching the Figma "Swipe to remove" frame: the whole item
 * card slides left to reveal a full-height red Remove panel behind it.
 */
function SwipeToRemove({ name, children, onRemove }: { name: string; children: React.ReactNode; onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  const [x, setX] = useState(0);

  const pan = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 && Math.abs(g.dx) > Math.abs(g.dy),
    onPanResponderMove: (_, g) => setX(Math.max(-REMOVE_WIDTH, Math.min(0, g.dx))),
    onPanResponderRelease: (_, g) => {
      setOpen(open ? g.dx < -24 : g.dx < -48);
      setX(0);
    },
    onPanResponderTerminate: () => setX(0),
  });

  return (
    <View style={styles.swipeWrap}>
      <TouchableOpacity
        style={styles.remove}
        onPress={onRemove}
        accessibilityRole="button"
        accessibilityLabel={`Remove ${name}`}
      >
        <Icon name="trash-outline" size={22} color={colors.white} />
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
      <View {...pan.panHandlers} style={[styles.swipeFront, { transform: [{ translateX: open ? -REMOVE_WIDTH : x }] }]}>
        {children}
      </View>
    </View>
  );
}

function CartLine({ item }: { item: CartItem }) {
  const { updateQty, removeItem } = useApp();
  return (
    <SwipeToRemove name={item.product.name} onRemove={() => removeItem(item.uid)}>
      <GroupedCard pad={12} gap={12}>
        <View style={styles.itemTop}>
          <Image source={images[item.product.image]} style={styles.thumb} resizeMode="cover" />
          <View style={styles.flex}>
            <Text style={T.row}>{item.product.name}</Text>
            <Text style={styles.options}>{item.options}</Text>
          </View>
        </View>
        <View style={styles.itemBottom}>
          <QtyStepper value={item.quantity} onChange={d => updateQty(item.uid, d)} />
          <View style={styles.itemEnd}>
            <Text style={styles.itemPrice}>{pesos(item.unitPrice * item.quantity)}</Text>
            <IconControl name="trash-outline" onPress={() => removeItem(item.uid)} />
          </View>
        </View>
      </GroupedCard>
    </SwipeToRemove>
  );
}

export default function Cart() {
  const { cart } = useApp();
  const count = cart.reduce((s, i) => s + i.quantity, 0);
  const total = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  return (
    <Screen>
      <BackNav title="Your Cart" fallback="/menu" right={null} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {cart.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text style={T.heading}>Your cart is taking a break.</Text>
            <Text style={styles.emptyBody}>Add a fresh brew or a little treat to start your next chill.</Text>
            <EmptyAction label="Explore Menu" onPress={() => router.replace('/menu')} />
          </View>
        ) : (
          <>
            <View style={styles.center}>
              <Text style={T.heading}>Two cups. One good day.</Text>
            </View>
            {cart.map(item => (
              <CartLine key={item.uid} item={item} />
            ))}
            <GroupedCard pad={12} gap={8}>
              <View style={styles.totalRow}>
                <Text style={T.secondary}>Subtotal</Text>
                <Text style={styles.itemTotal}>{pesos(total)}</Text>
              </View>
              <Divider />
              <View style={styles.totalRow}>
                <Text style={T.headingMd}>Total</Text>
                <Text style={styles.itemGrand}>{pesos(total)}</Text>
              </View>
            </GroupedCard>
            <Text style={T.caption}>No service fees. Swipe an item to remove it.</Text>
            <FeedbackMessage title="Tip: bring your mood." body="Every drink is brewed fresh when you order." icon="sparkles-outline" />
          </>
        )}
      </ScrollView>

      {cart.length > 0 ? (
        <FloatingActionBar>
          <View style={styles.actions}>
            <View style={styles.flex}>
              <Text style={T.caption}>{`Total · ${count} ${count === 1 ? 'item' : 'items'}`}</Text>
              <Text style={T.priceTotal}>{pesos(total)}</Text>
            </View>
            <Button label="Checkout" onPress={() => router.push('/checkout')} style={styles.checkout} />
          </View>
        </FloatingActionBar>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 160, gap: 16 },
  center: { alignItems: 'center' },
  itemTop: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  thumb: { width: 80, height: 80, borderRadius: radius.control, backgroundColor: colors.chip },
  options: { ...T.caption, color: colors.stone },
  itemBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemEnd: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  swipeWrap: { position: 'relative' },
  remove: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: REMOVE_WIDTH,
    borderRadius: radius.card,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  removeText: { ...typography.secondaryBold, color: colors.white },
  swipeFront: { width: '100%' },
  emptyWrap: { alignItems: 'center', gap: 16, paddingVertical: 48 },
  emptyBody: { ...T.body, color: colors.stone, textAlign: 'center' },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkout: { paddingHorizontal: 32 },
  flex: { flex: 1 },
  // Price column: never shrinks, never escapes the card's right padding.
  itemPrice: { ...T.priceItem, flexShrink: 0, minWidth: 48, textAlign: 'right' },
  itemTotal: { ...T.priceBody, flexShrink: 0, minWidth: 64, textAlign: 'right' },
  itemGrand: { ...T.priceTotal, flexShrink: 0, minWidth: 72, textAlign: 'right' },
});
