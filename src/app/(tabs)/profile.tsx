import { View, Text, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, typography } from '../../theme';
import { Page, GroupedList, ListRow, SectionLabel, T } from '../../components/ui';
import { images } from '../../data/images';

export default function Profile() {
  return (
    <Page title="Profile" headerRight="bag" bottom={100}>
      <View style={styles.hero}>
        <Image source={images.userAvatar} style={styles.avatar} resizeMode="cover" />
        <Text style={styles.name}>John Jade Macalaging</Text>
        <Text style={T.secondary}>macalalingjade@gmail.com</Text>
        <Text style={styles.tagline}>Your everyday Kaprescopeep</Text>
      </View>

      <SectionLabel>MY ACCOUNT</SectionLabel>
      <GroupedList>
        <ListRow title="Personal Information" icon="person-outline" onPress={() => router.push('/personal-info')} />
        <ListRow title="Favorites" icon="heart-outline" onPress={() => router.push('/favorites')} />
        <ListRow title="Order History" icon="receipt-outline" onPress={() => router.push('/orders')} />
      </GroupedList>

      <SectionLabel>PREFERENCES</SectionLabel>
      <GroupedList>
        <ListRow title="Notifications" icon="notifications-outline" onPress={() => router.push('/notifications-settings')} />
        <ListRow title="Appearance" icon="contrast-outline" onPress={() => router.push('/appearance')} />
        <ListRow title="System" value="iOS" icon="phone-portrait-outline" onPress={() => router.push('/settings')} />
        <ListRow title="Language" value="English" icon="language-outline" onPress={() => router.push('/language')} />
      </GroupedList>

      <GroupedList>
        <ListRow title="Support & more" icon="help-circle-outline" onPress={() => router.push('/support')} />
      </GroupedList>
    </Page>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 8, paddingVertical: 8 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.chip },
  name: { ...typography.title, color: colors.espresso },
  tagline: { ...typography.caption, color: colors.stone, textAlign: 'center' },
});
