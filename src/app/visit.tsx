import { View, Text, StyleSheet, Linking } from 'react-native';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/Ionicons';
import { colors, radius } from '../theme';
import { Media, Page, GroupedCard, FloatingActionBar, Button, T } from '../components/ui';
import { images } from '../data/images';

export const KAPRESCO_ADDRESS = 'Madang, Central, City of Mati, Davao Oriental';

export const directions = () =>
  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Kapresco, ${KAPRESCO_ADDRESS}`)}`);

export default function Visit() {
  return (
    <Page back="/support" title="Visit Kapresco" bottom={100}>
      <Text style={T.heading}>Come for the coffee, stay for the vibes.</Text>

      <View style={styles.map}>
        <View style={styles.roadA} />
        <View style={styles.roadB} />
        <View style={styles.pin}>
          <Icon name="cafe" size={22} color={colors.white} />
        </View>
        <Text style={styles.mapLabel}>Kapresco</Text>
        <Text style={styles.mapNote}>Illustrative preview · Not verified cartography</Text>
      </View>

      <Media source={images.visitPhoto} ratio={354 / 184} style={styles.photo} />

      <GroupedCard pad={12} gap={4}>
        <Text style={T.row}>Kapresco — Mati</Text>
        <Text style={T.caption}>Madang, Central, City of Mati, Davao Oriental</Text>
        <Text style={T.caption}>Mon–Sat: 8:00 AM – 9:00 PM{ '\n' }Sun: 10:00 AM – 7:00 PM</Text>
      </GroupedCard>

      <Text style={T.heading}>Contact &amp; visitor information</Text>
      <Button label="Visitor information" variant="secondary" onPress={() => router.push('/visitor')} />

      <FloatingActionBar>
        <Button label="Get Directions" onPress={directions} />
      </FloatingActionBar>
    </Page>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    aspectRatio: 354 / 200,
    borderRadius: radius.card,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  roadA: { position: 'absolute', top: '38%', left: 0, right: 0, height: 10, backgroundColor: colors.border },
  roadB: { position: 'absolute', left: '46%', top: 0, bottom: 0, width: 10, backgroundColor: colors.border },
  pin: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.coffee, alignItems: 'center', justifyContent: 'center' },
  mapLabel: { ...T.row },
  mapNote: { ...T.caption, color: colors.stone },
  photo: { width: '100%', aspectRatio: 354 / 184, borderRadius: radius.card, backgroundColor: colors.chip },
});
