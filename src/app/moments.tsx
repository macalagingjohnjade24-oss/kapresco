import { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, radius } from '../theme';
import { Media, Page, GroupedCard, StarRating, Button, T } from '../components/ui';
import { images } from '../data/images';
import type { ImageSourcePropType } from 'react-native';

type Moment = { name: string; role: string; quote: string; avatar: ImageSourcePropType };

const TOP: Moment[] = [
  { name: 'Andrea M.', role: 'Student', quote: 'Kapresco is my go-to tambayan after class. Super relaxing!', avatar: images.momentOne },
  { name: 'Leah C.', role: 'First-time visitor', quote: 'Didn’t expect a coffee shop to feel this homey.', avatar: images.momentTwo },
];

const MORE: Moment[] = [
  { name: 'Kevin R.', role: 'Freelancer', quote: 'The vibe is unbeatable. Fast Wi-Fi, great coffee, and lami kaayo!', avatar: images.momentThree },
];

function MomentCard({ m }: { m: Moment }) {
  return (
    <GroupedCard gap={12}>
      <View style={styles.head}>
        <Image source={m.avatar} style={styles.avatar} resizeMode="cover" />
        <View style={styles.who}>
          <Text style={T.row}>{m.name}</Text>
          <Text style={T.caption}>{m.role}</Text>
        </View>
      </View>
      <StarRating />
      <Text style={styles.quote}>{`“${m.quote}”`}</Text>
    </GroupedCard>
  );
}

export default function Moments() {
  const [expanded, setExpanded] = useState(false);

  return (
    <Page back="/about" title="Kapresco Moments" bottom={0}>
      <Text style={T.body}>Real moments. Real feedback. Straight from our Kaprescopeeps.</Text>
      <Media source={images.momentsHero} ratio={354 / 160} style={styles.hero} />

      {TOP.map(m => (
        <MomentCard key={m.name} m={m} />
      ))}

      {!expanded ? (
        <Button label="More moments from our community" variant="secondary" onPress={() => setExpanded(true)} />
      ) : (
        <>
          <View style={styles.block}>
            <Text style={T.heading}>Our kind of tambayan</Text>
            <Text style={T.body}>Your people. Your presko place.</Text>
            <Text style={T.body}>
              Students, freelancers, couples, and friends — everyone’s welcome to pause, breathe, and feel at home.
            </Text>
          </View>

          {MORE.map(m => (
            <MomentCard key={m.name} m={m} />
          ))}

          <Button label="Visit Kapresco" onPress={() => router.push('/visit')} />
        </>
      )}
    </Page>
  );
}

const styles = StyleSheet.create({
  hero: { width: '100%', aspectRatio: 354 / 160, borderRadius: radius.card, backgroundColor: colors.chip },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 48, height: 48, borderRadius: radius.card, backgroundColor: colors.chip },
  who: { flex: 1, gap: 4 },
  quote: { ...T.body, color: colors.stone },
  block: { gap: 8 },
});
