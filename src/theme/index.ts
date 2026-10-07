export const colors = {
  espresso: '#2D211B',
  coffee: '#693B23',
  coffeeDeep: '#603809',
  cream: '#F8F5EF',
  paper: '#FFFEFC',
  chip: '#F0E7D9',
  stone: '#776B61',
  border: '#E6DDD2',
  borderDark: '#D8CFC4',
  caramel: '#ECBD63',
  success: '#38614B',
  error: '#AB4336',
  errorBg: '#FAECE7',
  successBg: '#EAF1E9',
  white: '#FFFFFF',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 40 };

export const radius = {
  control: 16,
  card: 24,
  sheet: 32,
  pill: 100,
};

export const fonts = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export const typography = {
  largeTitle: { fontFamily: fonts.bold, fontSize: 34, lineHeight: 44 },
  title: { fontFamily: fonts.bold, fontSize: 28, lineHeight: 36 },
  heading: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28 },
  headingMd: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 26 },
  body: { fontFamily: fonts.regular, fontSize: 17, lineHeight: 22 },
  bodyBold: { fontFamily: fonts.semiBold, fontSize: 17, lineHeight: 22 },
  secondary: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 20 },
  secondaryBold: { fontFamily: fonts.semiBold, fontSize: 15, lineHeight: 20 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 17 },
  captionBold: { fontFamily: fonts.semiBold, fontSize: 13, lineHeight: 17 },
  brand: { fontFamily: fonts.semiBold, fontSize: 11, lineHeight: 13 },
  tab: { fontFamily: fonts.medium, fontSize: 10, lineHeight: 12 },
  tabActive: { fontFamily: fonts.bold, fontSize: 10, lineHeight: 12 },
  priceLarge: { fontFamily: fonts.bold, fontSize: 28, lineHeight: 34 },
  priceTotal: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 27 },
  priceAction: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 28 },
  priceItem: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 21 },
  priceBody: { fontFamily: fonts.semiBold, fontSize: 17, lineHeight: 21 },
};

export const pesos = (n: number) => `\u20B1${n}`;
export const pesos2 = (n: number) => `\u20B1${n}.00`;

/** Design metrics from the Figma component kit (402 x 874 reference frame). */
export const metrics = {
  screen: { width: 402, height: 874 },
  safeTop: 54,
  safeBottom: 32,
  inset: 24,
  gap: 16,
  navBar: { height: 88 },
  backNav: { height: 44 },
  button: { height: 52 },
  input: { height: 54 },
  chip: { height: 44 },
  iconControl: 44,
  stepper: { width: 121, height: 44 },
  toggle: { width: 51, height: 31 },
  tabBar: { height: 76, radius: 32, tabHeight: 60, tabRadius: 24 },
  productMedia: { width: 169, height: 108 },
  productCardHeight: 229,
  sheetPadding: 24,
};