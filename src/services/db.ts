import * as SQLite from 'expo-sqlite';
import { PRODUCTS, type Product } from '../data/products';

export type InventoryProduct = Product & {
  stock: number;
};

type ProductRow = {
  id: number;
  product_id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: Product['image'];
  rating: string | null;
  stock: number;
};

let db: SQLite.SQLiteDatabase | null = null;
let openError: string | null = null;
let isInitialized = false;

/**
 * Open the handle on first use, never at module scope.
 *
 * Expo Router's route manifest loads every route file when the app boots, and
 * this module is imported by one. A top-level `openDatabaseSync` that throws —
 * which is exactly what happens on web, where the sync implementation needs
 * `SharedArrayBuffer` and therefore cross-origin isolation headers — would take
 * down the whole app before a single screen paints. Deferring the open keeps the
 * failure local to this screen.
 */
function getDb(): SQLite.SQLiteDatabase | null {
  if (db || openError) return db;
  try {
    db = SQLite.openDatabaseSync('kapresco_inventory.db');
  } catch (error) {
    openError = error instanceof Error ? error.message : String(error);
  }
  return db;
}

/** Non-null when the local database could not be opened; screens show this instead of crashing. */
export function getDbError(): string | null {
  getDb();
  return openError;
}

function recordFailure(error: unknown): void {
  if (!openError) {
    openError = error instanceof Error ? error.message : String(error);
  }
}

export function initDatabase(): void {
  const handle = getDb();
  if (!handle || isInitialized) {
    return;
  }

  try {
    handle.execSync(`
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

    const row = handle.getFirstSync<{ count: number }>('SELECT COUNT(*) AS count FROM products;');

    if (!row || row.count === 0) {
      const insertSql = `INSERT INTO products (product_id, name, description, category, price, image, rating, stock) VALUES ${PRODUCTS.map(() => '(?, ?, ?, ?, ?, ?, ?, ?)').join(', ')};`;
      const values = PRODUCTS.flatMap((product) => [
        product.id,
        product.name,
        product.description,
        product.category,
        product.price,
        product.image,
        product.rating ?? '4.9',
        12,
      ]);

      handle.runSync(insertSql, values);
    }

    isInitialized = true;
  } catch (error) {
    recordFailure(error);
  }
}

export function getProducts(search = '', refreshTick = 0): InventoryProduct[] {
  void refreshTick;
  initDatabase();

  const handle = getDb();
  if (!handle) {
    return [];
  }

  const trimmed = search.trim();

  try {
    const rows = trimmed
      ? handle.getAllSync<ProductRow>('SELECT * FROM products WHERE name LIKE ? ORDER BY name ASC;', [`%${trimmed}%`])
      : handle.getAllSync<ProductRow>('SELECT * FROM products ORDER BY id DESC;');

    return rows.map((row) => ({
      id: row.product_id,
      name: row.name,
      description: row.description,
      category: row.category,
      price: Number(row.price),
      image: row.image,
      rating: row.rating ?? undefined,
      stock: Number(row.stock),
    }));
  } catch (error) {
    recordFailure(error);
    return [];
  }
}

export function addProduct(input: { name: string; category: string; price: number; stock: number }): void {
  const name = input.name.trim();
  const category = input.category.trim() || 'Coffee';
  const price = Number(input.price) || 0;
  const stock = Number(input.stock) || 0;

  if (!name) {
    throw new Error('Product name is required.');
  }

  const handle = getDb();
  if (!handle) {
    throw new Error(openError ?? 'The local inventory database is unavailable.');
  }

  const id = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `item-${Date.now()}`;

  handle.runSync(
    'INSERT INTO products (product_id, name, description, category, price, image, rating, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
    [
      id,
      name,
      `Freshly added ${name}.`,
      category,
      price,
      'coffee1',
      '4.9',
      stock,
    ],
  );
}

export function deleteProduct(productId: string): void {
  const handle = getDb();
  if (!handle) return;
  handle.runSync('DELETE FROM products WHERE product_id = ?;', [productId]);
}

export function updateProductStock(productId: string, delta: number): void {
  const handle = getDb();
  if (!handle) return;
  handle.runSync(
    'UPDATE products SET stock = CASE WHEN stock + ? < 0 THEN 0 ELSE stock + ? END WHERE product_id = ?;',
    [delta, delta, productId],
  );
}
