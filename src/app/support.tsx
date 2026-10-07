import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, typography } from '../theme';
import { Page, GroupedList, ListRow, SectionLabel } from '../components/ui';

export default function Support() {
  return (
    <Page title="Profile" headerRight="bag" bottom={100}>
      <SectionLabel>SUPPORT</SectionLabel>
      <GroupedList>
        <ListRow title="Help Center" icon="help-circle-outline" onPress={() => router.push('/help')} />
        <ListRow title="Contact Kapresco" icon="call-outline" onPress={() => router.push('/contact')} />
        <ListRow title="Terms & Privacy" icon="document-text-outline" onPress={() => router.push('/terms')} />
      </GroupedList>

      <SectionLabel>YOUR KAPRESCO</SectionLabel>
      <GroupedList>
        <ListRow title="Visit Kapresco" icon="location-outline" onPress={() => router.push('/visit')} />
        <ListRow title="About Kapresco" icon="information-circle-outline" onPress={() => router.push('/about')} />
        <ListRow title="Settings" icon="settings-outline" onPress={() => router.push('/settings')} />
      </GroupedList>

      <View style={styles.signoff}>
        <Text style={styles.slogan}>Sip. Chill. Repeat.</Text>
      </View>
    </Page>
  );
}

const styles = StyleSheet.create({
  signoff: { alignItems: 'center', paddingVertical: 24 },
  slogan: { ...typography.heading, color: colors.coffee, letterSpacing: 0.5 },
});
