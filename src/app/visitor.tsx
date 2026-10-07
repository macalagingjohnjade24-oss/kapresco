import { View, Text, StyleSheet, Linking } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../theme';
import { Page, GroupedCard, Button, T } from '../components/ui';
import { KAPRESCO_ADDRESS } from './visit';

export const KAPRESCO_PHONE = '0912-352-1096';
export const KAPRESCO_EMAIL = 'kapresco@gmail.com';

export default function Visitor() {
  return (
    <Page back="/visit" title="Plan your chill" bottom={0}>
      <GroupedCard pad={12} gap={4}>
        <Text style={T.row}>Kapresco — Mati</Text>
        <Text style={T.caption}>{KAPRESCO_ADDRESS}</Text>
        <Text style={T.caption}>Mon–Sat: 8:00 AM – 9:00 PM{ '\n' }Sun: 10:00 AM – 7:00 PM</Text>
        <Text style={styles.link} onPress={() => Linking.openURL(`tel:${KAPRESCO_PHONE}`)} accessibilityRole="link">
          {KAPRESCO_PHONE}
        </Text>
        <Text style={styles.link} onPress={() => Linking.openURL(`mailto:${KAPRESCO_EMAIL}`)} accessibilityRole="link">
          {KAPRESCO_EMAIL}
        </Text>
      </GroupedCard>

      <View style={styles.note}>
        <Text style={T.body}>Fresh coffee, cozy tables, and a warm welcome.</Text>
      </View>

      <Button label="Call" variant="secondary" onPress={() => Linking.openURL(`tel:${KAPRESCO_PHONE}`)} />
      <Button label="Contact Us" onPress={() => router.push('/contact')} />
    </Page>
  );
}

const styles = StyleSheet.create({
  link: { ...T.priceBody, color: colors.coffee },
  note: { backgroundColor: colors.chip, borderRadius: 16, padding: 16 },
});
