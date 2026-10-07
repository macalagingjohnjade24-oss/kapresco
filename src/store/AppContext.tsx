import { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { Product, getById } from '../data/products';

export type Size = 'Small' | 'Medium' | 'Large';

export type CartItem = {
  uid: string;
  product: Product;
  size: Size;
  options: string;
  quantity: number;
  unitPrice: number;
};

export type OrderItem = {
  productId: string;
  name: string;
  size: string;
  price: number;
};

export type Order = {
  id: string;
  status: 'Preparing' | 'Ready' | 'Completed';
  dateLabel: string;
  type: 'Pickup' | 'Dine-in';
  items: OrderItem[];
  total: number;
  payment: string;
};

export type Notification = {
  id: number;
  icon: 'coffee' | 'receipt' | 'sparkles' | 'ticket';
  title: string;
  body: string;
  time: string;
  read: boolean;
};

type AppState = {
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
  notifications: Notification[];
  lastOrder: Order | null;
  pickupTime: string;
  orderType: 'Pickup' | 'Dine-in';
  when: 'ASAP' | 'Later';
  payment: string;
  addToCart: (item: Omit<CartItem, 'uid'>) => void;
  updateQty: (uid: string, delta: number) => void;
  removeItem: (uid: string) => void;
  clearCart: () => void;
  toggleFavorite: (id: string) => void;
  markAllRead: () => void;
  placeOrder: () => Order;
  setPickupTime: (t: string) => void;
  setOrderType: (t: 'Pickup' | 'Dine-in') => void;
  setWhen: (w: 'ASAP' | 'Later') => void;
  setPayment: (p: string) => void;
};

const AppContext = createContext<AppState | null>(null);

let counter = 100;
let orderNumber = 1043;

const OPTIONS_DEFAULT = 'Normal ice \u00B7 Normal sweetness Dairy milk \u00B7 No add-ons';

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([
    { uid: 'u1', product: getById('chill-latte')!, size: 'Small', options: OPTIONS_DEFAULT, quantity: 1, unitPrice: 89 },
    { uid: 'u2', product: getById('caramel-cloud')!, size: 'Small', options: OPTIONS_DEFAULT, quantity: 1, unitPrice: 89 },
  ]);
  const [favorites, setFavorites] = useState<string[]>(['chill-latte', 'caramel-cloud', 'velvet-macchiato']);
  const [pickupTime, setPickupTime] = useState('Today \u00B7 10:30 AM');
  const [orderType, setOrderType] = useState<'Pickup' | 'Dine-in'>('Pickup');
  const [when, setWhen] = useState<'ASAP' | 'Later'>('ASAP');
  const [payment, setPayment] = useState('GCash');
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '#KP-1042',
      status: 'Preparing',
      dateLabel: 'Today \u00B7 9:41 AM \u00B7 Pickup',
      type: 'Pickup',
      payment: 'GCash',
      total: 178,
      items: [
        { productId: 'chill-latte', name: 'Chill Latte', size: 'Small \u00B7 Normal ice & sweetness', price: 89 },
        { productId: 'caramel-cloud', name: 'Caramel Cloud', size: 'Small \u00B7 Normal ice & sweetness', price: 89 },
      ],
    },
    {
      id: '#KP-1038',
      status: 'Completed',
      dateLabel: 'Sep 28 \u00B7 10:15 AM \u00B7 Pickup',
      type: 'Pickup',
      payment: 'GCash',
      total: 178,
      items: [
        { productId: 'chill-latte', name: 'Chill Latte', size: 'Small \u00B7 Normal ice & sweetness', price: 89 },
        { productId: 'caramel-cloud', name: 'Caramel Cloud', size: 'Small \u00B7 Normal ice & sweetness', price: 89 },
      ],
    },
    {
      id: '#KP-1021',
      status: 'Completed',
      dateLabel: 'Sep 24 \u00B7 2:30 PM \u00B7 Dine-in',
      type: 'Dine-in',
      payment: 'Cash',
      total: 89,
      items: [{ productId: 'midnight-brew', name: 'Midnight Brew', size: 'Small', price: 89 }],
    },
  ]);
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, icon: 'coffee', title: 'Your Chill Latte is ready!', body: 'Order #KP-1042 is ready at Kapresco \u2014 Mati.', time: 'Just now', read: false },
    { id: 2, icon: 'receipt', title: 'Your order is being prepared.', body: 'Your barista is making your two favorites.', time: '12 min ago', read: false },
    { id: 3, icon: 'sparkles', title: 'New Kapresco favorite just arrived.', body: 'Meet Ube Rush. A fresh take on a local favorite.', time: 'Yesterday', read: true },
    { id: 4, icon: 'ticket', title: '20% off your next drink.', body: 'Use PRESKO20 on your next visit. Until Oct 7.', time: '2 days ago', read: true },
  ]);

  const state = useMemo<AppState>(() => {
    const placeOrder = (): Order => {
      const total = cart.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
      const order: Order = {
        id: `#KP-${orderNumber++}`,
        status: 'Preparing',
        dateLabel: `Today \u00B7 9:41 AM \u00B7 ${orderType}`,
        type: orderType,
        payment,
        total,
        items: cart.map(i => ({ productId: i.product.id, name: i.product.name, size: `${i.size} \u00B7 Normal ice & sweetness`, price: i.unitPrice * i.quantity })),
      };
      setOrders(o => [order, ...o]);
      setLastOrder(order);
      setCart([]);
      return order;
    };

    return {
      cart,
      favorites,
      orders,
      notifications,
      lastOrder,
      pickupTime,
      orderType,
      when,
      payment,
      markAllRead: () => setNotifications(n => n.map(x => ({ ...x, read: true }))),
      addToCart: (item) => setCart(c => [...c, { ...item, uid: `u${counter++}` }]),
      updateQty: (uid, delta) => setCart(c => c.map(it => (it.uid === uid ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it))),
      removeItem: (uid) => setCart(c => c.filter(it => it.uid !== uid)),
      clearCart: () => setCart([]),
      toggleFavorite: (id) => setFavorites(f => (f.includes(id) ? f.filter(x => x !== id) : [...f, id])),
      placeOrder,
      setPickupTime,
      setOrderType,
      setWhen,
      setPayment,
    };
  }, [cart, favorites, orders, notifications, lastOrder, pickupTime, orderType, when, payment]);

  return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
}

export function useApp() {
  const s = useContext(AppContext);
  if (!s) throw new Error('useApp must be used within AppProvider');
  return s;
}