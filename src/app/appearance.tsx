import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors } from '../theme';
import { Page, SegmentedControl, GroupedList, ListRow, FeedbackMessage, SectionLabel, Button, T } from '../components/ui';

const OPTIONS = ['Light', 'Dark', 'System'];

export default function Appearance() {
  const [mode, setMode] = useState('System');

  return (
    <Page back="/settings" title="Appearance" bottom={0}>
      <Text style={T.body}>Choose the look that feels right for your everyday chill.</Text>
      <SegmentedControl options={OPTIONS} value={mode} onChange={setMode} />
      <GroupedList>
        {OPTIONS.map(o => (
          <ListRow
            key={o}
            title={o}
            subtitle={o === 'System' ? 'Match your iPhone’s appearance' : undefined}
            selected={o === mode}
            onPress={() => setMode(o)}
          />
        ))}
      </GroupedList>
      <FeedbackMessage
        title={`${mode} appearance selected`}
        body="Kapresco follows your device’s Light or Dark setting."
        icon="contrast-outline"
      />
      <SectionLabel>PREVIEW</SectionLabel>
      <View style={styles.preview}>
        <Text style={T.headingMd}>Kapresco</Text>
        <Text style={T.body}>Cream canvas, paper surfaces, coffee accents.</Text>
      </View>
      <Button label="Done" onPress={() => router.back()} />
    </Page>
  );
}

const styles = StyleSheet.create({
  preview: { backgroundColor: colors.paper, borderRadius: 24, padding: 16, gap: 8 },
});
