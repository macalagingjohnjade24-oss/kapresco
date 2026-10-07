import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '@expo/vector-icons/Ionicons';
import { colors, typography, radius, metrics } from '../../theme';

type Route = { name: string; title: string; icon: React.ComponentProps<typeof Icon>['name'] };

const ROUTES: Route[] = [
  { name: 'home', title: 'Home', icon: 'home' },
  { name: 'menu', title: 'Menu', icon: 'cafe' },
  { name: 'orders', title: 'Orders', icon: 'receipt-outline' },
  { name: 'favorites', title: 'Favorites', icon: 'heart' },
  { name: 'profile', title: 'Profile', icon: 'person-circle' },
];

type TabBarProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: { navigate: (name: string) => void };
};

function FloatingTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.barWrap, { paddingBottom: Math.max(insets.bottom, 12) }]} pointerEvents="box-none">
      <View style={styles.bar}>
        {ROUTES.map((route, i) => {
          const focused = state.index === i;
          return (
            <TouchableOpacity
              key={route.name}
              style={[styles.tab, focused ? styles.tabOn : null]}
              onPress={() => navigation.navigate(route.name)}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={route.title}
            >
              <Icon name={route.icon} size={22} color={colors.coffee} />
              <Text style={focused ? styles.labelOn : styles.labelOff}>{route.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarHideOnKeyboard: true }} tabBar={props => <FloatingTabBar {...props} />}>
      {ROUTES.map(r => (
        <Tabs.Screen key={r.name} name={r.name} />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  barWrap: { position: 'absolute', left: 16, right: 16, bottom: 0, paddingTop: 12 },
  bar: {
    height: metrics.tabBar.height,
    borderRadius: radius.sheet,
    backgroundColor: colors.paper,
    padding: 8,
    flexDirection: 'row',
    gap: 0,
  },
  tab: {
    flex: 1,
    height: metrics.tabBar.tabHeight,
    borderRadius: metrics.tabBar.tabRadius,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabOn: { backgroundColor: colors.chip },
  labelOn: { ...typography.tabActive, color: colors.coffee },
  labelOff: { ...typography.tab, color: colors.coffee },
});