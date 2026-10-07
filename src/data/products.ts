import type { ImageKey } from './images';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: ImageKey;
  rating?: string;
};

export const CATEGORIES = ['Coffee', 'Tea', 'Cold Drinks', 'Blended', 'Frappe', 'Pastries', 'Sandwiches'];

export const PRODUCTS: Product[] = [
  { id: 'midnight-brew', name: 'Midnight Brew', description: 'Strong, bold, all-day energy.', price: 89, category: 'Coffee', image: 'coffee1' },
  { id: 'chill-latte', name: 'Chill Latte', description: 'Cool, creamy, perfectly smooth.', price: 89, category: 'Coffee', image: 'coffee2' },
  { id: 'caramel-cloud', name: 'Caramel Cloud', description: 'Sweet, light, topped with foam.', price: 89, category: 'Coffee', image: 'coffee3' },
  { id: 'velvet-macchiato', name: 'Velvet Macchiato', description: 'Espresso with a touch of foam.', price: 89, category: 'Coffee', image: 'coffee4' },
  { id: 'iced-spanish-latte', name: 'Iced Spanish Latte', description: 'Rich milk, bold espresso.', price: 99, category: 'Coffee', image: 'coffee5' },
  { id: 'cafe-mocha', name: 'Café Mocha', description: 'Cocoa meets espresso.', price: 99, category: 'Coffee', image: 'coffee6' },
  { id: 'americano', name: 'Americano', description: 'Clean and full-bodied.', price: 79, category: 'Coffee', image: 'coffee7' },
  { id: 'dalgona-latte', name: 'Dalgona Latte', description: 'Whipped coffee, silky milk.', price: 99, category: 'Coffee', image: 'coffee8' },
  { id: 'matcha-latte', name: 'Matcha Latte', description: 'Earthy, creamy green tea.', price: 99, category: 'Tea', image: 'tea1' },
  { id: 'calamansi-tea', name: 'Calamansi Tea', description: 'Bright local citrus sip.', price: 79, category: 'Tea', image: 'tea2' },
  { id: 'peach-iced-tea', name: 'Peach Iced Tea', description: 'Fruity, light and fresh.', price: 79, category: 'Tea', image: 'tea3' },
  { id: 'jasmine-tea', name: 'Jasmine Tea', description: 'A gentle floral pause.', price: 69, category: 'Tea', image: 'tea4' },
  { id: 'calamansi-cooler', name: 'Calamansi Cooler', description: 'Citrusy, sparkling presko.', price: 79, category: 'Cold Drinks', image: 'cold1' },
  { id: 'berry-soda', name: 'Berry Soda', description: 'Berries with a little fizz.', price: 89, category: 'Cold Drinks', image: 'cold2' },
  { id: 'iced-chocolate', name: 'Iced Chocolate', description: 'Chocolate comfort on ice.', price: 89, category: 'Cold Drinks', image: 'cold3' },
  { id: 'cold-brew', name: 'Cold Brew', description: 'Slow brewed, easy sipping.', price: 89, category: 'Cold Drinks', image: 'cold4' },
  { id: 'ube-rush', name: 'Ube Rush', description: 'Local ube, creamy bliss.', price: 109, category: 'Blended', image: 'blend1' },
  { id: 'mango-chill', name: 'Mango Chill', description: 'Sunshine in every sip.', price: 99, category: 'Blended', image: 'blend2' },
  { id: 'banana-cocoa', name: 'Banana Cocoa', description: 'Banana and chocolate.', price: 109, category: 'Blended', image: 'blend3' },
  { id: 'strawberry-cream', name: 'Strawberry Cream', description: 'Berries blended smooth.', price: 109, category: 'Blended', image: 'blend4' },
  { id: 'caramel-frappe', name: 'Caramel Frappe', description: 'Caramel, coffee, crushed ice.', price: 119, category: 'Frappe', image: 'frappe1' },
  { id: 'mocha-frappe', name: 'Mocha Frappe', description: 'Chocolate-coffee chill.', price: 119, category: 'Frappe', image: 'frappe2' },
  { id: 'cookies-cream', name: 'Cookies & Cream', description: 'Cookie crunch, creamy sip.', price: 119, category: 'Frappe', image: 'frappe3' },
  { id: 'vanilla-frappe', name: 'Vanilla Frappe', description: 'Soft vanilla, cool comfort.', price: 109, category: 'Frappe', image: 'frappe4' },
  { id: 'butter-croissant', name: 'Butter Croissant', description: 'Flaky, golden, fresh baked.', price: 69, category: 'Pastries', image: 'pastry1' },
  { id: 'butter-cookies', name: 'Butter Cookies', description: 'Little bites of comfort.', price: 49, category: 'Pastries', image: 'pastry2' },
  { id: 'pain-au-chocolat', name: 'Pain au Chocolat', description: 'Layers of buttery chocolate.', price: 79, category: 'Pastries', image: 'pastry3' },
  { id: 'cheese-bread', name: 'Cheese Bread', description: 'Soft bread, savory cheese.', price: 59, category: 'Pastries', image: 'pastry4' },
  { id: 'ham-cheese', name: 'Ham & Cheese', description: 'Toasted café classic.', price: 99, category: 'Sandwiches', image: 'sandwich1' },
  { id: 'chicken-pesto', name: 'Chicken Pesto', description: 'Tender chicken, fresh basil.', price: 129, category: 'Sandwiches', image: 'sandwich2' },
  { id: 'tuna-melt', name: 'Tuna Melt', description: 'Creamy tuna, golden cheese.', price: 119, category: 'Sandwiches', image: 'sandwich3' },
  { id: 'veggie-toastie', name: 'Veggie Toastie', description: 'Fresh greens, cheesy layers.', price: 99, category: 'Sandwiches', image: 'sandwich4' },
];

export const getById = (id: string) => PRODUCTS.find(p => p.id === id);

export const productsByCategory = (c: string) => PRODUCTS.filter(p => p.category === c);