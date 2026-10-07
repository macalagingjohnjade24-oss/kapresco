import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Linking } from 'react-native';
import { colors, typography } from '../theme';
import { Screen, BackNav, GroupedCard, FloatingActionBar, Button, T } from '../components/ui';
import { KAPRESCO_PHONE, KAPRESCO_EMAIL } from './visitor';

type Key = 'email' | 'subject' | 'message';
const INITIAL: Record<Key, string> = {
  email: 'macalalingjade@gmail.com',
  subject: 'Help with order #KP-1042',
  message: 'Hi Kapresco! I have a question about my pickup.',
};

const FIELDS: { key: Key; label: string; placeholder: string; multiline?: boolean }[] = [
  { key: 'email', label: 'Your email', placeholder: 'you@email.com' },
  { key: 'subject', label: 'Subject', placeholder: 'Subject' },
  { key: 'message', label: 'Message', placeholder: 'Message', multiline: true },
];

export default function Contact() {
  const [values, setValues] = useState(INITIAL);
  const [sent, setSent] = useState(false);

  const set = (k: Key, v: string) => {
    setSent(false);
    setValues(s => ({ ...s, [k]: v }));
  };

  const canSend = /^\S+@\S+\.\S+$/.test(values.email) && values.subject.trim().length > 0 && values.message.trim().length > 0;

  const send = () => {
    setSent(true);
    Linking.openURL(
      `mailto:${KAPRESCO_EMAIL}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(`${values.message}\n\n— ${values.email}`)}`,
    ).catch(() => undefined);
  };

  return (
    <Screen>
      <BackNav title="Contact Kapresco" fallback="/support" right={null} />
      <View style={styles.content}>
        <Text style={T.body}>A question, a little feedback, or help with your order — we’re here.</Text>

        <GroupedCard pad={12} gap={4}>
          <Text style={T.row}>{KAPRESCO_PHONE}</Text>
          <Text style={styles.link} onPress={() => Linking.openURL(`tel:${KAPRESCO_PHONE}`)} accessibilityRole="link">
            Call the Kapresco — Mati team
          </Text>
        </GroupedCard>

        <GroupedCard pad={12} gap={4}>
          <Text style={T.row}>{KAPRESCO_EMAIL}</Text>
          <Text style={styles.link} onPress={() => Linking.openURL(`mailto:${KAPRESCO_EMAIL}`)} accessibilityRole="link">
            Email us your questions
          </Text>
        </GroupedCard>

        {FIELDS.map(f => (
          <GroupedCard key={f.key} pad={12} gap={8}>
            <Text style={T.secondary}>{f.label}</Text>
            <TextInput
              style={[styles.input, f.multiline ? styles.multiline : null]}
              value={values[f.key]}
              onChangeText={v => set(f.key, v)}
              placeholder={f.placeholder}
              placeholderTextColor={colors.stone}
              multiline={f.multiline}
              keyboardType={f.key === 'email' ? 'email-address' : 'default'}
              autoCapitalize="sentences"
              accessibilityLabel={f.label}
            />
          </GroupedCard>
        ))}

        <View style={styles.note}>
          <Text style={T.body}>For time-sensitive order questions, calling the shop is the quickest way to reach us.</Text>
        </View>

        {sent ? <Text style={styles.sent}>Opening your mail app — we’ll be right back with a presko.</Text> : null}
      </View>

      <FloatingActionBar>
        <Button label="Send message" disabled={!canSend} onPress={send} />
      </FloatingActionBar>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 160, gap: 16 },
  link: { ...typography.priceBody, color: colors.coffee },
  input: { ...typography.secondary, color: colors.espresso, paddingVertical: 0 },
  multiline: { minHeight: 72, textAlignVertical: 'top' },
  note: { backgroundColor: colors.chip, borderRadius: 16, padding: 16 },
  sent: { ...typography.caption, color: colors.success },
});
