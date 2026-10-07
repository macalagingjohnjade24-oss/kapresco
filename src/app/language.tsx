import { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, typography } from '../theme';
import { Page, GroupedList, ListRow, FeedbackMessage, Button, T } from '../components/ui';

const LANGUAGES = ['English', 'Filipino', 'Cebuano', 'Bisaya'];

export default function Language() {
  const [language, setLanguage] = useState('English');

  return (
    <Page back="/settings" title="Language" bottom={0}>
      <Text style={T.body}>A familiar voice for your everyday coffee moments.</Text>
      <GroupedList>
        {LANGUAGES.map(l => (
          <ListRow key={l} title={l} selected={l === language} onPress={() => setLanguage(l)} />
        ))}
      </GroupedList>
      <FeedbackMessage title={`${language} selected`} body="App labels will use English. Drink names stay the same." icon="language-outline" />
      <Text style={styles.note}>Presko feels like home, in any language.</Text>
      <Button label="Done" onPress={() => router.back()} />
    </Page>
  );
}

const styles = StyleSheet.create({
  note: { ...typography.heading, color: colors.coffee, textAlign: 'center' },
});
