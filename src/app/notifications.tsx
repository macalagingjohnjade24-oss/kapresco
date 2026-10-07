import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/Ionicons';
import { colors, typography } from '../theme';
import { Page, GroupedCard, Button, T } from '../components/ui';
import { useApp, Notification } from '../store/AppContext';

const ICONS: Record<Notification['icon'], React.ComponentProps<typeof Icon>['name']> = {
  coffee: 'cafe-outline',
  receipt: 'receipt-outline',
  sparkles: 'sparkles-outline',
  ticket: 'ticket-outline',
};

export default function Notifications() {
  const { notifications, markAllRead } = useApp();

  return (
    <Page back="/home" title="Notifications" bottom={0}>
      <Text style={styles.mark} onPress={markAllRead} accessibilityRole="button" accessibilityLabel="Mark all as read">
        Mark all as read
      </Text>

      {notifications.length === 0 ? (
        <View style={styles.empty}>
          <Text style={T.heading}>All quiet for now.</Text>
          <Text style={styles.emptyBody}>Order updates and fresh Kapresco news will appear here.</Text>
          <Button label="Back to Home" onPress={() => router.replace('/home')} />
        </View>
      ) : (
        notifications.map(n => (
          <GroupedCard
            key={n.id}
            gap={8}
            style={n.read ? undefined : styles.unread}
            pad={16}
          >
            <View style={styles.row}>
              <Icon name={ICONS[n.icon]} size={22} color={colors.coffee} />
              <View style={styles.flex}>
                <Text style={T.row}>{n.title}</Text>
                <Text style={styles.body}>{n.body}</Text>
                <Text style={styles.time}>{`${n.time} · ${n.read ? 'Read' : 'Unread'}`}</Text>
              </View>
              {!n.read ? <View style={styles.dot} /> : null}
            </View>
          </GroupedCard>
        ))
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  mark: { ...typography.secondary, color: colors.coffee, alignSelf: 'flex-end' },
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  flex: { flex: 1 },
  body: { ...typography.caption, color: colors.stone },
  time: { ...typography.caption, color: colors.stone },
  unread: { borderWidth: 1, borderColor: colors.caramel },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.caramel, marginTop: 6 },
  empty: { alignItems: 'center', gap: 12, paddingVertical: 48 },
  emptyBody: { ...typography.body, color: colors.stone, textAlign: 'center' },
});
