import { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';
import { Screen, BackNav, GroupedCard, FeedbackMessage, IconControl, FloatingActionBar, BottomSheet, Button, T } from '../components/ui';
import { images } from '../data/images';

type Field = { key: 'name' | 'email' | 'phone'; label: string; value: string; placeholder: string; keyboard?: 'default' | 'email-address' | 'phone-pad' };

const INITIAL: Field[] = [
  { key: 'name', label: 'Full name', value: 'John Jade Macalaging', placeholder: 'Full name' },
  { key: 'email', label: 'Email address', value: 'macalalingjade@gmail.com', placeholder: 'Email address', keyboard: 'email-address' },
  { key: 'phone', label: 'Mobile number', value: '0917 234 5678', placeholder: 'Mobile number', keyboard: 'phone-pad' },
];

/** The account holder's photo first, then the Kapresco moment shots. */
const AVATARS = [images.userAvatar, images.profileAvatar, images.momentOne, images.momentTwo];

export default function PersonalInfo() {
  const [fields, setFields] = useState(INITIAL);
  const [saved, setSaved] = useState(false);
  const [avatar, setAvatar] = useState(0);
  const [picker, setPicker] = useState(false);

  const set = (key: Field['key'], value: string) => {
    setSaved(false);
    setFields(f => f.map(x => (x.key === key ? { ...x, value } : x)));
  };

  const invalid = fields.some(f => (f.key === 'email' ? !/^\S+@\S+\.\S+$/.test(f.value) : f.value.trim().length === 0));

  return (
    <Screen>
      <BackNav title="Personal Information" titleSize="small" fallback="/profile" right={null} />
      <View style={styles.content}>
        <GroupedCard pad={12} gap={12}>
          <View style={styles.photoRow}>
            <Image source={AVATARS[avatar]} style={styles.photo} resizeMode="cover" />
            <View style={styles.flex}>
              <Text style={T.row}>Change profile photo</Text>
              <Text style={T.caption}>Pick one of your Kapresco moments</Text>
            </View>
            <IconControl name="camera-outline" onPress={() => setPicker(true)} />
          </View>
        </GroupedCard>

        {fields.map(f => (
          <GroupedCard key={f.key} pad={12} gap={8}>
            <Text style={T.secondary}>{f.label}</Text>
            <TextInput
              style={styles.input}
              value={f.value}
              onChangeText={v => set(f.key, v)}
              placeholder={f.placeholder}
              placeholderTextColor={colors.stone}
              keyboardType={f.keyboard ?? 'default'}
              autoCapitalize={f.key === 'email' ? 'none' : 'words'}
              accessibilityLabel={f.label}
            />
            {f.key === 'email' && !/^\S+@\S+\.\S+$/.test(f.value) ? (
              <Text style={styles.error}>Enter a valid email address.</Text>
            ) : null}
          </GroupedCard>
        ))}

        <Text style={T.body}>We use your details for order updates and to make your visits feel more personal.</Text>

        {saved ? <FeedbackMessage title="Your information is up to date" body="Your details are stored on this device only." /> : null}
      </View>

      <FloatingActionBar>
        <Button label="Save changes" disabled={invalid} onPress={() => { setSaved(true); setPicker(false); }} />
      </FloatingActionBar>

      <BottomSheet visible={picker} onClose={() => setPicker(false)}>
        <Text style={T.heading}>Change profile photo</Text>
        <View style={styles.avatarRow}>
          {AVATARS.map((src, i) => (
            <Button key={i} label={i === avatar ? 'Selected' : `Photo ${i + 1}`} variant={i === avatar ? 'primary' : 'secondary'} onPress={() => setAvatar(i)} style={styles.avatarBtn} />
          ))}
        </View>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 160, gap: 16 },
  photoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  photo: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.chip },
  flex: { flex: 1 },
  input: {
    height: 32,
    ...typography.secondary,
    color: colors.espresso,
    paddingVertical: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  error: { ...typography.caption, color: colors.error },
  avatarRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  avatarBtn: { paddingHorizontal: 16 },
});
