/**
 * Replays src/services/db.ts (initDatabase seed + addProduct) against a real
 * SQLite database so we can see the error the Save button throws, without
 * needing a device.
 *
 * Run: node sqlite-repro.mjs
 */
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';

const productsSrc = fs.readFileSync('src/data/products.ts', 'utf8');

// Pull the literal product entries out of PRODUCTS.
const rows = [...productsSrc.matchAll(
  /\{\s*id:\s*'([^']+)'.*?name:\s*'([^']+)'.*?category:\s*'([^']+)'.*?price:\s*(\d+).*?image:\s*'([^']+)'/g,
]).map((m) => ({ id: m[1], name: m[2], category: m[3], price: Number(m[4]), image: m[5] }));

console.log(`parsed ${rows.length} products from products.ts`);

const db = new DatabaseSync(':memory:');

db.exec(`
  PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT,
    rating TEXT,
    stock INTEGER NOT NULL DEFAULT 1
  );
`);

const insertSql = `INSERT INTO products (product_id, name, description, category, price, image, rating, stock) VALUES ${rows.map(() => '(?, ?, ?, ?, ?, ?, ?, ?)').join(', ')};`;
const values = rows.flatMap((p) => [p.id, p.name, p.description, p.category, p.price, p.image, '4.9', 12]);
db.prepare(insertSql).run(...values);
console.log(`seeded ${db.prepare('SELECT COUNT(*) c FROM products').get().c} products`);

// ---- replay addProduct exactly as src/services/db.ts does ----
function addProduct(input) {
  const name = input.name.trim();
  const category = input.category.trim() || 'Coffee';
  const price = Number(input.price) || 0;
  const stock = Number(input.stock) || 0;

  if (!name) throw new Error('Product name is required.');

  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || `item-${Date.now()}`;

  db.prepare(
    'INSERT INTO products (product_id, name, description, category, price, image, rating, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
  ).run(id, name, `Freshly added ${name}.`, category, price, 'coffee1', '4.9', stock);

  return id;
}

const cases = [
  { label: 'fresh name',             name: 'Kapresco Special', price: '99', stock: '12' },
  { label: 'duplicate of a seed',    name: 'Midnight Brew',    price: '89', stock: '12' },
  { label: 'duplicate added twice',  name: 'Iced Latte',       price: '99', stock: '5' },
  { label: 'non-ascii name',         name: 'Café Latte',       price: '99', stock: '5' },
  { label: 'digits only',            name: '123',              price: '50', stock: '5' },
  { label: 'emoji/symbols only',     name: '!!!',              price: '50', stock: '5' },
];

for (const c of cases) {
  try {
    const id = addProduct({ name: c.name, category: 'Coffee', price: c.price, stock: c.stock });
    if (c.label === 'duplicate added twice') addProduct({ name: c.name, category: 'Coffee', price: c.price, stock: c.stock });
    console.log(`  OK    ${c.label.padEnd(22)} -> product_id='${id}'`);
  } catch (e) {
    console.log(`  THROW ${c.label.padEnd(22)} -> ${e.message}`);
  }
}
