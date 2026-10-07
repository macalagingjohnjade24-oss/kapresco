import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, radius } from '../theme';
import { Media, Page, Button, T } from '../components/ui';
import { images } from '../data/images';

export default function About() {
  return (
    <Page back="/support" title="About Kapresco" bottom={0}>
      <Text style={T.heading}>More than coffee — it’s a preskong experience.</Text>
      <Media source={images.aboutPhoto} ratio={354 / 184} style={styles.photo} />

      <View style={styles.block}>
        <Text style={T.headingMd}>Our story</Text>
        <Text style={T.body}>
          Kapresco started as a simple dream — a place where friends could hang out, relax, and enjoy good coffee without breaking the
          bank. We opened our first shop in Mati City, inspired by the presko vibes of everyday life here in Mindanao.
        </Text>
      </View>

      <Button label="Our philosophy & community" onPress={() => router.push('/philosophy')} />
    </Page>
  );
}

const styles = StyleSheet.create({
  photo: { width: '100%', aspectRatio: 354 / 184, borderRadius: radius.card, backgroundColor: colors.chip },
  block: { gap: 8 },
});
