import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, radius } from '../theme';
import { Media, Page, Button, T } from '../components/ui';
import { images } from '../data/images';

export default function Philosophy() {
  return (
    <Page back="/about" title="Rooted in presko" bottom={0}>
      <Text style={T.body}>
        We didn’t want anything fancy — just great brews, warm smiles, and a cozy space you can keep coming back to. Now, we’re growing
        little by little, but we’re still all about keeping things local, relaxed, and real.
      </Text>

      <Media source={images.philosophyPhoto} ratio={354 / 184} style={styles.photo} />

      <View style={styles.block}>
        <Text style={T.headingMd}>Fresh brews. Warm smiles.</Text>
        <Text style={T.body}>
          We serve quality, affordable coffee that feels like home — brewed fresh, shared with heart, and rooted in Filipino culture. A
          relaxing space to unwind, connect, and enjoy the moment.
        </Text>
      </View>

      <View style={styles.note}>
        <Text style={T.body}>
          Our vision: a go-to chill spot in every community, where each cup brings comfort, connection, and presko vibes.
        </Text>
      </View>

      <Button label="Kapresco Moments" variant="secondary" onPress={() => router.push('/moments')} />
    </Page>
  );
}

const styles = StyleSheet.create({
  photo: { width: '100%', aspectRatio: 354 / 184, borderRadius: radius.card, backgroundColor: colors.chip },
  block: { gap: 8 },
  note: { backgroundColor: colors.chip, borderRadius: 16, padding: 16 },
});
