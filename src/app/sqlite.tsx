import { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BackNav, Screen, T } from '../components/ui';
import { CATEGORIES } from '../data/products';
import {
  addProduct,
  deleteProduct,
  getDbError,
  getProducts,
  initDatabase,
  updateProductStock,
  type InventoryProduct,
} from '../services/db';

export default function SQLiteInventoryScreen() {
  const [search, setSearch] = useState('');
  const [refreshTick, setRefreshTick] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('12');
  const [dbError] = useState(() => {
    // Run once, during first render, and keep the result: opening a local SQLite
    // handle is idempotent, and doing it here rather than in an effect both avoids
    // a pointless mount/unmount cycle and guarantees the error is available before
    // the first paint. On web the sync SQLite build needs cross-origin isolation,
    // so this can fail while the rest of the app stays healthy — callers read the
    // failure instead of crashing on it.
    initDatabase();
    return getDbError();
  });

  const products = useMemo<InventoryProduct[]>(() => getProducts(search, refreshTick), [search, refreshTick]);

  const handleAddProduct = () => {
    const cleanName = name.trim();
    const parsedPrice = Number.parseFloat(price);
    const parsedStock = Number.parseInt(stock, 10);

    if (!cleanName) {
      Alert.alert('Validation Error', 'Please enter a product name.');
      return;
    }

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid price greater than zero.');
      return;
    }

    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      Alert.alert('Validation Error', 'Please enter a valid stock count.');
      return;
    }

    addProduct({
      name: cleanName,
      category: category.trim() || CATEGORIES[0],
      price: parsedPrice,
      stock: parsedStock,
    });

    setName('');
    setCategory(CATEGORIES[0]);
    setPrice('');
    setStock('12');
    setModalVisible(false);
    setRefreshTick((current) => current + 1);
  };

  const handleDelete = (id: string, itemName: string) => {
    Alert.alert('Delete confirmation', `Remove ${itemName} from SQLite?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteProduct(id);
          setRefreshTick((current) => current + 1);
        },
      },
    ]);
  };

  const handleStockUpdate = (id: string, delta: number) => {
    updateProductStock(id, delta);
    setRefreshTick((current) => current + 1);
  };

  return (
    <Screen>
      <BackNav title="SQLite Inventory" fallback="/settings" />

      {dbError ? (
        <View style={styles.errorWrap}>
          <Text style={T.heading}>Inventory unavailable</Text>
          <Text style={styles.errorBody}>
            The local SQLite database could not be opened, so there is nothing to list. The rest of
            the app is unaffected.
          </Text>
          <Text style={styles.errorDetail}>{dbError}</Text>
        </View>
      ) : (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={T.heading}>Offline-first inventory</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>+ Add item</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search inventory by name"
          placeholderTextColor="#8B94A6"
          style={styles.searchBar}
        />

        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.empty}>No products found in the SQLite database.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardBody}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.meta}>Category: {item.category}</Text>
                <Text style={styles.meta}>Stock: {item.stock} units</Text>
              </View>

              <View style={styles.rightColumn}>
                <Text style={styles.itemPrice}>₱{item.price.toFixed(2)}</Text>
                <View style={styles.stockControls}>
                  <TouchableOpacity style={styles.stockButton} onPress={() => handleStockUpdate(item.id, -1)}>
                    <Text style={styles.stockButtonText}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.stockButton} onPress={() => handleStockUpdate(item.id, 1)}>
                    <Text style={styles.stockButtonText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id, item.name)}>
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </View>
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Add new menu item</Text>
            <Text style={styles.modalSubtitle}>Save a new item directly to the local SQLite database.</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
                placeholder="e.g. Kapresco Special"
                placeholderTextColor="#8B94A6"
              />
            </View>

            <View style={styles.rowFields}>
              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>Category</Text>
                <TextInput
                  value={category}
                  onChangeText={setCategory}
                  style={styles.input}
                  placeholder="Coffee"
                  placeholderTextColor="#8B94A6"
                />
              </View>

              <View style={styles.halfField}>
                <Text style={styles.fieldLabel}>Price</Text>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  style={styles.input}
                  placeholder="99"
                  keyboardType="decimal-pad"
                  placeholderTextColor="#8B94A6"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Initial stock</Text>
              <TextInput
                value={stock}
                onChangeText={setStock}
                style={styles.input}
                placeholder="12"
                keyboardType="number-pad"
                placeholderTextColor="#8B94A6"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleAddProduct}>
                <Text style={styles.saveText}>Save item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  errorWrap: { flex: 1, paddingHorizontal: 16, gap: 10, paddingTop: 12 },
  errorBody: { fontSize: 14, lineHeight: 20, color: '#64748B' },
  errorDetail: { fontSize: 12, color: '#94A3B8' },
  container: { flex: 1, paddingHorizontal: 16, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  addButton: { backgroundColor: '#2F6B5C', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  addButtonText: { color: '#FFF', fontWeight: '700' },
  searchBar: {
    backgroundColor: '#FFF',
    borderColor: '#D7DFEA',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    color: '#1B2430',
  },
  listContent: { paddingBottom: 18 },
  card: {
    backgroundColor: '#FFF',
    borderColor: '#E7EDF4',
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardBody: { flex: 1, marginRight: 12 },
  itemName: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 4 },
  meta: { fontSize: 12, color: '#64748B', marginTop: 2 },
  rightColumn: { alignItems: 'flex-end' },
  itemPrice: { color: '#2F6B5C', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  stockControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stockButton: { width: 28, height: 28, borderRadius: 8, backgroundColor: '#EAF5F1', alignItems: 'center', justifyContent: 'center' },
  stockButtonText: { color: '#205E4D', fontWeight: '700', fontSize: 18 },
  deleteButton: { backgroundColor: '#FDECEC', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8 },
  deleteButtonText: { color: '#C43D3D', fontWeight: '700', fontSize: 11 },
  empty: { textAlign: 'center', color: '#64748B', marginTop: 32 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.32)',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 18,
    elevation: 8,
  },
  modalHandle: {
    width: 50,
    height: 5,
    backgroundColor: '#DCE4EE',
    borderRadius: 999,
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  modalSubtitle: { fontSize: 13, color: '#64748B', marginBottom: 18 },
  fieldGroup: { marginBottom: 12 },
  rowFields: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  halfField: { flex: 1 },
  fieldLabel: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 8, letterSpacing: 0.3 },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#1E293B',
    fontSize: 15,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 18 },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  cancelText: { color: '#475569', fontWeight: '700' },
  saveButton: {
    flex: 1.2,
    backgroundColor: '#2F6B5C',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveText: { color: '#FFF', fontWeight: '700' },
});
