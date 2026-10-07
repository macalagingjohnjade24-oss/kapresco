import { Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, typography } from '../theme';
import { Page, GroupedList, ListRow, SectionLabel } from '../components/ui';

export default function Settings() {
  return (
    <Page back="/profile" title="Settings" bottom={0}>
      <SectionLabel>ACCOUNT</SectionLabel>
      <GroupedList>
        <ListRow title="Account" value="John Jade" icon="person-outline" onPress={() => router.push('/personal-info')} />
      </GroupedList>

      <SectionLabel>PREFERENCES</SectionLabel>
      <GroupedList>
        <ListRow title="Notifications" icon="notifications-outline" onPress={() => router.push('/notifications-settings')} />
        <ListRow title="Appearance" icon="contrast-outline" onPress={() => router.push('/appearance')} />
        <ListRow title="System" value="iOS" icon="phone-portrait-outline" onPress={() => router.push('/appearance')} />
        <ListRow title="Language" value="English" icon="language-outline" onPress={() => router.push('/language')} />
        <ListRow title="SQLite Inventory" icon="server-outline" onPress={() => router.push('/sqlite')} />
      </GroupedList>

      <SectionLabel>SUPPORT &amp; INFORMATION</SectionLabel>
      <GroupedList>
        <ListRow title="Privacy" icon="lock-closed-outline" onPress={() => router.push('/terms')} />
        <ListRow title="Terms" icon="document-text-outline" onPress={() => router.push('/terms')} />
        <ListRow title="Help & Support" icon="help-circle-outline" onPress={() => router.push('/help')} />
        <ListRow title="About Kapresco" icon="information-circle-outline" onPress={() => router.push('/about')} />
      </GroupedList>

      <Text style={styles.version}>KAPRESCO · Version 1.0</Text>
    </Page>
  );
}

const styles = StyleSheet.create({
  version: { ...typography.caption, color: colors.stone, textAlign: 'center' },
});
