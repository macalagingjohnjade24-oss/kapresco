/**
 * Every entry is a Figma image-fill node exported at 3x from the Kapresco file.
 * Keys describe where the asset is used so screens never inline file names.
 */
export const images = {
  // Brand + welcome
  logo: require('../../assets/figma/logo.jpg'),
  splashVisual: require('../../assets/figma/img_576_471.jpg'),
  onboardLogo: require('../../assets/figma/img_576_488.jpg'),
  onboardChill: require('../../assets/figma/img_576_490.jpg'),
  onboardBrewHero: require('../../assets/figma/img_576_515.jpg'),
  onboardOrder: require('../../assets/figma/img_576_542.jpg'),

  // Home
  homeAvatar: require('../../assets/figma/img_576_571.jpg'),
  homeHero: require('../../assets/figma/img_576_577.jpg'),
  homeWhyMoments: require('../../assets/figma/img_576_765.jpg'),
  homeChillPhoto: require('../../assets/figma/img_576_805.jpg'),

  // Menu / products
  searchHero: require('../../assets/figma/img_576_1872.jpg'),
  addedHero: require('../../assets/figma/img_576_2299.jpg'),

  // Account
  profileAvatar: require('../../assets/figma/img_576_3110.jpg'),
  /** The account holder's own photo, used wherever their avatar appears. */
  userAvatar: require('../../assets/profile-jade.jpg'),

  // Cafe + community
  visitPhoto: require('../../assets/figma/img_576_3387.jpg'),
  aboutPhoto: require('../../assets/figma/img_576_3478.jpg'),
  philosophyPhoto: require('../../assets/figma/img_576_3509.jpg'),
  momentsHero: require('../../assets/figma/img_576_3535.jpg'),
  momentOne: require('../../assets/figma/img_576_3538.jpg'),
  momentTwo: require('../../assets/figma/img_576_3551.jpg'),
  momentThree: require('../../assets/figma/img_576_3586.jpg'),

  // Catalog
  coffee1: require('../../assets/figma/img_576_882.jpg'),
  coffee2: require('../../assets/figma/img_576_896.jpg'),
  coffee3: require('../../assets/figma/img_576_910.jpg'),
  coffee4: require('../../assets/figma/img_576_923.jpg'),
  coffee5: require('../../assets/figma/img_576_1002.jpg'),
  coffee6: require('../../assets/figma/img_576_1016.jpg'),
  coffee7: require('../../assets/figma/img_576_1031.jpg'),
  coffee8: require('../../assets/figma/img_576_1045.jpg'),
  tea1: require('../../assets/figma/img_576_1124.jpg'),
  tea2: require('../../assets/figma/img_576_1138.jpg'),
  tea3: require('../../assets/figma/img_576_1153.jpg'),
  tea4: require('../../assets/figma/img_576_1167.jpg'),
  cold1: require('../../assets/figma/img_576_1246.jpg'),
  cold2: require('../../assets/figma/img_576_1260.jpg'),
  cold3: require('../../assets/figma/img_576_1275.jpg'),
  cold4: require('../../assets/figma/img_576_1289.jpg'),
  blend1: require('../../assets/figma/img_576_1368.jpg'),
  blend2: require('../../assets/figma/img_576_1382.jpg'),
  blend3: require('../../assets/figma/img_576_1397.jpg'),
  blend4: require('../../assets/figma/img_576_1411.jpg'),
  frappe1: require('../../assets/figma/img_576_1490.jpg'),
  frappe2: require('../../assets/figma/img_576_1504.jpg'),
  frappe3: require('../../assets/figma/img_576_1519.jpg'),
  frappe4: require('../../assets/figma/img_576_1533.jpg'),
  pastry1: require('../../assets/figma/img_576_1612.jpg'),
  pastry2: require('../../assets/figma/img_576_1626.jpg'),
  pastry3: require('../../assets/figma/img_576_1641.jpg'),
  pastry4: require('../../assets/figma/img_576_1655.jpg'),
  sandwich1: require('../../assets/figma/img_576_1734.jpg'),
  sandwich2: require('../../assets/figma/img_576_1748.jpg'),
  sandwich3: require('../../assets/figma/img_576_1763.jpg'),
  sandwich4: require('../../assets/figma/img_576_1777.jpg'),
};

export type ImageKey = keyof typeof images;