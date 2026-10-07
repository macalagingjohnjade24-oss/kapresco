import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
import { Page, GroupedList, ListRow, Toggle, SectionLabel, T } from '../components/ui';

export default function NotificationsSettings() {
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [favorites, setFavorites] = useState(false);
  const [offers, setOffers] = useState(false);

  return (
    <Page back="/settings" title="Notifications" bottom={0}>
      <Text style={T.body}>Keep the updates you need. Leave the rest for later.</Text>

      <SectionLabel>YOUR ORDERS</SectionLabel>
      <GroupedList>
        <ListRow
          title="Order updates"
          subtitle="Confirmed, preparing, and ready"
          right={<Toggle value={orderUpdates} onChange={setOrderUpdates} />}
        />
        <ListRow
          title="Pickup reminders"
          subtitle="A nudge when your coffee is ready"
          right={<Toggle value={reminders} onChange={setReminders} />}
        />
      </GroupedList>

      <SectionLabel>KAPRESCO NEWS</SectionLabel>
      <GroupedList>
        <ListRow
          title="New favorites"
          subtitle="Fresh drinks and seasonal additions"
          right={<Toggle value={favorites} onChange={setFavorites} />}
        />
        <ListRow
          title="Offers & promotions"
          subtitle="Little treats for your next chill"
          right={<Toggle value={offers} onChange={setOffers} />}
        />
      </GroupedList>

      <View style={styles.note}>
        <Text style={T.body}>
          These preferences control Kapresco updates. You can also manage notification permissions in your iPhone Settings.
        </Text>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  note: { backgroundColor: colors.chip, borderRadius: 16, padding: 16 },
});
