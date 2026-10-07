import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../theme';
import { Page, SearchField, GroupedCard, Button, T } from '../components/ui';

type Faq = { q: string; a: string };
const FAQS: Faq[] = [
  {
    q: 'Where do I pick up my order?',
    a: 'Visit the Kapresco — Mati counter when your order says Ready for Pickup. Show your order number to our team and we’ll hand you your freshly made drinks.',
  },
  { q: 'Can I change my order?', a: 'For an active order, contact the shop directly and include your order number.' },
  { q: 'How do scheduled orders work?', a: 'Choose Schedule for later at checkout, pick a time, and we’ll brew closer to that time.' },
  { q: 'Which payments can I use?', a: 'GCash, Cash, and Card (Visa or Mastercard) are all available at Kapresco — Mati.' },
  { q: 'Milk choices & allergies', a: 'Dairy is our default. Oat and Soy are available on most drinks — ask our team about allergens.' },
];

export default function Help() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(FAQS[0].q);
  const list = query.trim() ? FAQS.filter(f => f.q.toLowerCase().includes(query.trim().toLowerCase())) : FAQS;

  return (
    <Page back="/support" title="Help Center" bottom={0}>
      <Text style={T.body}>How can we help you chill?</Text>
      <SearchField value={query} onChange={setQuery} placeholder="Search drinks and food" />

      {list.length === 0 ? (
        <View style={styles.empty}>
          <Text style={T.heading}>No answers found.</Text>
          <Text style={styles.emptyBody}>Try a different word, or contact Kapresco directly.</Text>
        </View>
      ) : (
        list.map(f => (
          <GroupedCard key={f.q} pad={12} gap={8}>
            <Text style={T.row} onPress={() => setOpen(o => (o === f.q ? null : f.q))} accessibilityRole="button">
              {f.q}
            </Text>
            {open === f.q ? <Text style={styles.answer}>{f.a}</Text> : null}
          </GroupedCard>
        ))
      )}

      <Button label="Contact Kapresco" onPress={() => router.push('/contact')} />
    </Page>
  );
}

const styles = StyleSheet.create({
  answer: { ...T.body, color: colors.stone },
  empty: { alignItems: 'center', gap: 12, paddingVertical: 32 },
  emptyBody: { ...T.body, color: colors.stone, textAlign: 'center' },
});
