import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { Page, GroupedCard, SectionLabel, T } from '../components/ui';
import { KAPRESCO_EMAIL, KAPRESCO_PHONE } from './visitor';

export default function Terms() {
  return (
    <Page back="/support" title="Terms & Privacy" bottom={0}>
      <SectionLabel>YOUR COFFEE. YOUR CHOICES.</SectionLabel>

      <GroupedCard gap={8}>
        <Text style={T.headingMd}>Your personal information</Text>
        <Text style={T.body}>
          Your name, contact details, and order history help us prepare your orders and send relevant updates. Review your details in
          Personal Information and choose which updates you receive in Notifications.
        </Text>
      </GroupedCard>

      <GroupedCard gap={8}>
        <Text style={T.headingMd}>Ordering with Kapresco</Text>
        <Text style={T.body}>
          Check your order, customizations, pickup time, and payment method before confirming. If you need to change a placed order,
          contact the shop with your order number.
        </Text>
      </GroupedCard>

      <View style={styles.contact}>
        <Text style={T.row}>Privacy questions? Contact us</Text>
        <Text style={T.secondary}>{`${KAPRESCO_EMAIL} · ${KAPRESCO_PHONE}`}</Text>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  contact: { backgroundColor: colors.chip, borderRadius: 24, padding: 16, gap: 4 },
});
