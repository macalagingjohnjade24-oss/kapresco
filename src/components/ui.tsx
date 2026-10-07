import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Modal,
  Pressable,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Icon from '@expo/vector-icons/Ionicons';
import { colors, typography, radius, metrics, pesos } from '../theme';
import { Product } from '../data/products';
import { images } from '../data/images';

export type IconName = React.ComponentProps<typeof Icon>['name'];

/* ------------------------------------------------------------------ *
 * Layout shells
 * ------------------------------------------------------------------ */

/** Safe-area aware page background. */
export function Screen({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const insets = useSafeAreaInsets();
  return <View style={[styles.screen, { paddingTop: insets.top }, style]}>{children}</View>;
}

/**
 * Screen body used by every Figma screen: brand/nav header, scrollable
 * content with 24pt screen insets and a 16pt vertical rhythm.
 */
export function Page({
  brand = true,
  headerRight = 'bag',
  title,
  titleSize = 'large',
  back,
  backTitle,
  children,
  bottom = 0,
  style,
}: {
  brand?: boolean;
  headerRight?: IconName | null;
  title?: string;
  titleSize?: 'large' | 'small';
  back?: string;
  backTitle?: string;
  children: React.ReactNode;
  bottom?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  const navTitle = backTitle ?? title;
  return (
    <Screen>
      {back !== undefined ? (
        <BackNav title={navTitle} titleSize={titleSize} fallback={back ?? '/'} />
      ) : brand ? (
        <BrandHeader right={headerRight} title={title} titleSize={titleSize} />
      ) : title ? (
        <Text style={titleSize === 'large' ? styles.largeTitle : styles.smallTitle}>{title}</Text>
      ) : null}
      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, { paddingBottom: metrics.button.height + metrics.gap * 2 + bottom + insets.bottom }, style]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </Screen>
  );
}

/**
 * Navigation header shell. Figma fixes the header height: 88 for the
 * brand-row variant, 104 when a back row is present, always 24pt insets and
 * a 4pt gap before the large title.
 */
function NavHeader({ kind, children }: { kind: 'brand' | 'back'; children: React.ReactNode }) {
  return <View style={[styles.navHeader, kind === 'brand' ? styles.navBrand : styles.navBack]}>{children}</View>;
}

/** KAPRESCO wordmark row (11/600, 1.6 tracking) + trailing icon + screen title. */
export function BrandHeader({
  right = 'bag',
  onRight,
  title,
  titleSize = 'large',
}: {
  right?: IconName | null;
  onRight?: () => void;
  title?: string;
  titleSize?: 'large' | 'small';
}) {
  return (
    <NavHeader kind="brand">
      <View style={styles.brandRow}>
        <Text style={styles.brand}>KAPRESCO</Text>
        {right ? (
          <TouchableOpacity
            onPress={onRight ?? (() => router.push('/cart'))}
            hitSlop={12}
            style={styles.iconHit}
            accessibilityRole="button"
            accessibilityLabel={right}
          >
            <Icon name={right} size={20} color={colors.coffee} />
          </TouchableOpacity>
        ) : null}
      </View>
      {title ? <Text style={titleSize === 'large' ? styles.largeTitle : styles.smallTitle}>{title}</Text> : null}
    </NavHeader>
  );
}

/** Native back navigation: chevron + "Back" + trailing ellipsis + screen title. */
export function BackNav({
  title,
  fallback = '/home',
  right = 'ellipsis-horizontal',
  titleSize = 'large',
}: {
  title?: string;
  fallback?: string;
  right?: IconName | null;
  titleSize?: 'large' | 'small';
}) {
  const go = () => {
    if (router.canGoBack()) router.back();
    else router.replace(fallback as never);
  };
  return (
    <NavHeader kind="back">
      <View style={styles.backRow}>
        <TouchableOpacity onPress={go} style={styles.backBtn} hitSlop={10} accessibilityRole="button" accessibilityLabel="Back">
          <Icon name="chevron-back" size={20} color={colors.coffee} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.flex} />
        {right ? (
          <TouchableOpacity style={styles.iconHit} hitSlop={12} accessibilityRole="button" accessibilityLabel={right}>
            <Icon name={right} size={22} color={colors.coffee} />
          </TouchableOpacity>
        ) : null}
      </View>
      {title ? <Text style={titleSize === 'large' ? styles.largeTitle : styles.smallTitle}>{title}</Text> : null}
    </NavHeader>
  );
}

/* ------------------------------------------------------------------ *
 * Text tokens
 * ------------------------------------------------------------------ */

export const T = {
  largeTitle: { ...typography.largeTitle, color: colors.espresso } as const,
  smallTitle: { ...typography.title, color: colors.espresso } as const,
  heading: { ...typography.heading, color: colors.espresso } as const,
  headingMd: { ...typography.headingMd, color: colors.espresso } as const,
  coffee: { ...typography.headingMd, color: colors.coffee } as const,
  body: { ...typography.body, color: colors.stone } as const,
  bodyInk: { ...typography.body, color: colors.espresso } as const,
  row: { ...typography.body, color: colors.espresso } as const,
  secondary: { ...typography.secondary, color: colors.stone } as const,
  secondaryInk: { ...typography.secondary, color: colors.espresso } as const,
  caption: { ...typography.caption, color: colors.stone } as const,
  priceDeep: { ...typography.priceLarge, color: colors.coffeeDeep } as const,
  priceTotal: { ...typography.priceTotal, color: colors.coffeeDeep } as const,
  priceItem: { ...typography.priceItem, color: colors.espresso } as const,
  priceBody: { ...typography.priceBody, color: colors.coffee } as const,
};

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

export function Divider() {
  return <View style={styles.divider} />;
}

/* ------------------------------------------------------------------ *
 * Surfaces
 * ------------------------------------------------------------------ */

/** Grouped content surface: 24 radius, 16 padding, 12 gap. */
export function GroupedCard({ children, style, pad = 16, gap = 12 }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; pad?: number; gap?: number }) {
  return <View style={[styles.groupedCard, { padding: pad, gap }, style]}>{children}</View>;
}

/** Grouped list surface: 24 radius, 12 padding, holds ListRows. */
export function GroupedList({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.groupedList, style]}>{children}</View>;
}

/** 52 high, 16 radius. variant: primary | secondary | ghost. */
export function Button({
  label,
  onPress,
  variant = 'primary',
  disabled,
  style,
}: {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.button, variant === 'secondary' ? styles.buttonSecondary : null, disabled ? { opacity: 0.4 } : null, style]}
    >
      <Text style={variant === 'secondary' ? styles.buttonTextSecondary : styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
}

export const PrimaryButton = (p: { label: string; onPress?: () => void; disabled?: boolean; style?: StyleProp<ViewStyle> }) => <Button {...p} />;
export const SecondaryButton = (p: { label: string; onPress?: () => void; style?: StyleProp<ViewStyle> }) => <Button {...p} variant="secondary" />;

/** 52 high 24 radius paper bar pinned above the home indicator. */
export function FloatingActionBar({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.actionBar, { paddingBottom: Math.max(insets.bottom, 12), pointerEvents: 'box-none' }]}>
      <View style={styles.actionBarInner}>{children}</View>
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Inputs + controls
 * ------------------------------------------------------------------ */

export function CategoryChip({ label, selected, onPress }: { label: string; selected?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={[styles.chip, selected ? styles.chipOn : styles.chipOff]}
    >
      <Text style={selected ? styles.chipTextOn : styles.chipTextOff}>{label}</Text>
    </TouchableOpacity>
  );
}

export function CategoryScroller({
  categories,
  value,
  onChange,
}: {
  categories: string[];
  value: string;
  onChange: (c: string) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.flex} contentContainerStyle={styles.chipRow}>
      {categories.map(c => (
        <CategoryChip key={c} label={c} selected={c === value} onPress={() => onChange(c)} />
      ))}
    </ScrollView>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Search drinks and food',
  onSubmit,
}: {
  value: string;
  onChange: (t: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
}) {
  return (
    <View style={styles.searchField}>
      <Icon name="search" size={22} color={colors.coffee} />
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
        placeholder={placeholder}
        placeholderTextColor={colors.stone}
        returnKeyType="search"
        autoCorrect={false}
      />
      {value ? (
        <TouchableOpacity onPress={() => onChange('')} hitSlop={10} accessibilityRole="button" accessibilityLabel="Clear search">
          <Icon name="close" size={18} color={colors.stone} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

/** Circular 44 icon control on paper. */
export function IconControl({
  name,
  onPress,
  color = colors.coffee,
  filled = colors.paper,
  label,
}: {
  name: IconName;
  onPress?: () => void;
  color?: string;
  filled?: string;
  label?: string;
}) {
  return (
    <TouchableOpacity
      style={[styles.iconControl, { backgroundColor: filled }]}
      onPress={onPress}
      hitSlop={6}
      accessibilityRole="button"
      accessibilityLabel={label ?? name}
    >
      <Icon name={name} size={22} color={color} />
    </TouchableOpacity>
  );
}

/** 52 high segmented control: chip track, 12 radius segments. */
export function SegmentedControl({
  options,
  value,
  onChange,
  style,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.segmented, style]}>
      {options.map(o => {
        const on = o === value;
        return (
          <TouchableOpacity key={o} style={[styles.segment, on ? styles.segmentOn : null]} onPress={() => onChange(o)} accessibilityRole="button" accessibilityState={{ selected: on }}>
            <Text style={on ? styles.segmentTextOn : styles.segmentTextOff}>{o}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/** 121 x 44 stepper with white circular controls. */
export function QtyStepper({ value, onChange }: { value: number; onChange: (delta: number) => void }) {
  return (
    <View style={styles.stepper}>
      <IconControl name="remove" onPress={() => onChange(-1)} />
      <Text style={styles.stepperValue}>{value}</Text>
      <IconControl name="add" onPress={() => onChange(1)} />
    </View>
  );
}

export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <TouchableOpacity
      onPress={() => onChange(!value)}
      style={[styles.toggle, value ? styles.toggleOn : null]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
    >
      <View style={[styles.toggleKnob, value ? styles.toggleKnobOn : null]} />
    </TouchableOpacity>
  );
}

export function Check({ on }: { on?: boolean }) {
  return on ? <Icon name="checkmark" size={22} color={colors.coffee} /> : <Icon name="chevron-forward" size={18} color={colors.stone} />;
}

export function StarRating({ count = 5 }: { count?: number }) {
  return (
    <View style={styles.stars} accessibilityLabel={`${count} of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Icon key={i} name="star" size={16} color={colors.coffee} />
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Rows + messages
 * ------------------------------------------------------------------ */

/** 52 high disclosure row: 22 icon, title 17, optional value 15, chevron. */
export function ListRow({
  title,
  subtitle,
  value,
  icon,
  onPress,
  right,
  selected,
  gap = 12,
}: {
  title: string;
  subtitle?: string;
  value?: string;
  icon?: IconName;
  onPress?: () => void;
  right?: React.ReactNode;
  selected?: boolean;
  gap?: number;
}) {
  return (
    <TouchableOpacity style={[styles.listRow, { gap }]} onPress={onPress} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel={title}>
      {icon ? <Icon name={icon} size={22} color={colors.coffee} /> : null}
      <View style={styles.flex}>
        <Text style={T.row}>{title}</Text>
        {subtitle ? <Text style={T.caption}>{subtitle}</Text> : null}
      </View>
      {value ? <Text style={T.secondary}>{value}</Text> : null}
      {right !== undefined ? right : <Check on={selected} />}
    </TouchableOpacity>
  );
}

export function FeedbackMessage({
  title,
  body,
  tone = 'success',
  icon,
}: {
  title: string;
  body?: string;
  tone?: 'success' | 'error';
  icon?: IconName;
}) {
  const color = tone === 'success' ? colors.success : colors.error;
  const bg = tone === 'success' ? colors.successBg : colors.errorBg;
  return (
    <View style={[styles.feedback, { backgroundColor: bg }]}>
      <Icon name={icon ?? (tone === 'success' ? 'checkmark-circle' : 'alert-circle')} size={22} color={color} />
      <View style={styles.flex}>
        <Text style={[styles.feedbackTitle, { color }]}>{title}</Text>
        {body ? <Text style={[styles.feedbackBody, { color }]}>{body}</Text> : null}
      </View>
    </View>
  );
}

/**
 * Empty-state action button: 90% of the available content width, centred, so it
 * keeps equal left/right margins and scales with the device instead of hugging
 * the label. Height, radius, colours and type come from `Button` (52 / 16 / coffee).
 */
export function EmptyAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <View style={styles.emptyAction}>
      <Button label={label} onPress={onPress} style={styles.emptyActionButton} />
    </View>
  );
}

/** Empty state: 156 illustration tile, 28 title, 17 body, action button. */
export function EmptyState({
  icon,
  title,
  body,
  actionLabel,
  onAction,
}: {
  icon: IconName;
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <View style={styles.emptyState}>
      <View style={styles.emptyIllustration}>
        <Icon name={icon} size={64} color={colors.coffee} />
        <View style={styles.beans}>
          <View style={[styles.bean, { backgroundColor: colors.caramel }]} />
          <View style={[styles.bean, { backgroundColor: colors.coffee }]} />
        </View>
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
      <EmptyAction label={actionLabel} onPress={onAction} />
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Media
 * ------------------------------------------------------------------ */

/**
 * Full-bleed image frame locked to the Figma box ratio.
 * The frame owns the aspect ratio and the image fills it, so the height is
 * identical on iOS and on web previews.
 */
export function Media({
  source,
  ratio,
  style,
}: {
  source: ImageSourcePropType;
  ratio: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ aspectRatio: ratio, overflow: 'hidden', backgroundColor: colors.chip }, style]}>
      <Image source={source} style={styles.mediaFill} resizeMode="cover" />
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Products
 * ------------------------------------------------------------------ */

export function ProductCard({
  product,
  favorite,
  onPress,
  onToggleFav,
  onAdd,
}: {
  product: Product;
  favorite?: boolean;
  onPress?: () => void;
  onToggleFav?: () => void;
  onAdd?: () => void;
}) {
  return (
    <View style={styles.productCard}>
      <View>
        <TouchableOpacity activeOpacity={0.9} onPress={onPress} accessibilityRole="button" accessibilityLabel={product.name}>
          <Media source={images[product.image]} ratio={metrics.productMedia.width / metrics.productMedia.height} style={styles.productMedia} />
        </TouchableOpacity>
        <View style={styles.cardHeart} pointerEvents="box-none">
          <IconControl
            name={favorite ? 'heart' : 'heart-outline'}
            label={favorite ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
            onPress={onToggleFav}
            color={favorite ? colors.error : colors.coffee}
          />
        </View>
      </View>
      <View style={styles.productInfo}>
        <TouchableOpacity activeOpacity={0.7} onPress={onPress} accessibilityRole="button" accessibilityLabel={`${product.name} details`}>
          <Text style={styles.productName} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={T.caption} numberOfLines={2}>
            {product.description}
          </Text>
        </TouchableOpacity>
        <View style={styles.priceRow}>
          <Text style={T.priceDeep}>{pesos(product.price)}</Text>
          <TouchableOpacity style={styles.addControl} onPress={onAdd} hitSlop={6} accessibilityRole="button" accessibilityLabel={`Add ${product.name} to cart`}>
            <Icon name="add" size={22} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export function ProductGrid({ products, renderCard }: { products: Product[]; renderCard?: (p: Product) => React.ReactNode }) {
  const rows: Product[][] = [];
  for (let i = 0; i < products.length; i += 2) rows.push(products.slice(i, i + 2));
  return (
    <View style={styles.grid}>
      {rows.map((row, i) => (
        <View key={i} style={styles.gridRow}>
          {row.map(p => (
            <View key={p.id} style={styles.gridCell}>
              {renderCard ? renderCard(p) : null}
            </View>
          ))}
          {row.length === 1 ? <View style={styles.gridCell} /> : null}
        </View>
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ *
 * Sheet
 * ------------------------------------------------------------------ */

/** Bottom sheet over a dimmed backdrop, exactly as the Figma "Filter and sort" / "Payment selection" frames. */
export function BottomSheet({
  visible,
  onClose,
  children,
  maxHeightRatio = 0.92,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxHeightRatio?: number;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.sheetRoot}>
        <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close sheet" />
        <View
          style={[
            styles.sheet,
            { paddingBottom: Math.max(insets.bottom, 24) + 16, maxHeight: `${maxHeightRatio * 100}%` },
          ]}
        >
          <View style={styles.grabberArea}>
            <View style={styles.grabber} />
          </View>
          {/* Sheets carry more content than fits on short screens (the Menu
              filter sheet runs ~690pt against a 0.92-ratio cap), and the
              maxHeight above clips whatever overflows. Without a scroll view the
              trailing actions are unreachable. The grabber stays pinned outside
              the scroll area so it reads as a fixed handle. */}
          <ScrollView
            style={styles.sheetBody}
            contentContainerStyle={styles.sheetBodyContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/** Payment method choices inside a sheet — matches the Figma "Payment selection" frame. */
export const PAYMENT_METHODS: { id: string; icon: IconName; caption: (total: number) => string }[] = [
  { id: 'GCash', icon: 'phone-portrait-outline', caption: () => 'Pay with your mobile wallet' },
  { id: 'Cash', icon: 'cash-outline', caption: total => `Pay ${pesos(total)} at the counter` },
  { id: 'Card', icon: 'card-outline', caption: () => 'Visa or Mastercard' },
];

export function PaymentMethodSheet({
  visible,
  total,
  payment,
  onSelect,
  onClose,
  confirmLabel,
  onConfirm,
}: {
  visible: boolean;
  total: number;
  payment: string;
  onSelect: (p: string) => void;
  onClose: () => void;
  confirmLabel?: string;
  onConfirm?: () => void;
}) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={T.heading}>Payment method</Text>
      <Text style={styles.sheetCaption}>{`Choose how to pay for your ${pesos(total)} order.`}</Text>
      <GroupedList>
        {PAYMENT_METHODS.map(m => (
          <ListRow key={m.id} title={m.id} subtitle={m.caption(total)} icon={m.icon} selected={m.id === payment} onPress={() => onSelect(m.id)} />
        ))}
      </GroupedList>
      {onConfirm ? (
        <Button label={confirmLabel ?? `Confirm ${payment}`} onPress={onConfirm} />
      ) : (
        <Button label={`Confirm ${payment}`} onPress={onClose} />
      )}
    </BottomSheet>
  );
}

/* ------------------------------------------------------------------ *
 * Styles
 * ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  flex: { flex: 1 },
  content: { paddingHorizontal: metrics.inset, paddingTop: 0, gap: metrics.gap },

  navHeader: { gap: 4, paddingHorizontal: metrics.inset },
  navBrand: { height: 88 },
  navBack: { height: 104 },
  brandRow: { height: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brand: { ...typography.brand, color: colors.coffee },
  iconHit: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },

  backRow: { height: metrics.backNav.height, flexDirection: 'row', alignItems: 'center', gap: 4 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  backText: { ...typography.secondary, color: colors.coffee },

  largeTitle: { ...typography.largeTitle, color: colors.espresso },
  smallTitle: { ...typography.title, color: colors.espresso },
  sectionLabel: { ...typography.captionBold, color: colors.stone, letterSpacing: 1 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },

  groupedCard: { backgroundColor: colors.paper, borderRadius: radius.card },
  groupedList: { backgroundColor: colors.paper, borderRadius: radius.card, padding: 12, gap: 12 },

  button: { height: metrics.button.height, borderRadius: radius.control, backgroundColor: colors.coffee, alignItems: 'center', justifyContent: 'center' },
  buttonSecondary: { backgroundColor: colors.chip },
  buttonText: { ...typography.bodyBold, color: colors.white },
  buttonTextSecondary: { ...typography.bodyBold, color: colors.coffee },

  actionBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    backgroundColor: colors.paper,
    borderRadius: radius.card,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  actionBarInner: { gap: 8 },

  chip: { height: metrics.chip.height, paddingHorizontal: 16, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  chipOn: { backgroundColor: colors.coffee },
  chipOff: { backgroundColor: colors.paper },
  chipRow: { gap: 8, paddingRight: 24 },
  chipTextOn: { ...typography.secondaryBold, color: colors.white },
  chipTextOff: { ...typography.secondary, color: colors.coffee },

  searchField: {
    height: metrics.button.height,
    borderRadius: radius.control,
    backgroundColor: colors.paper,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: { flex: 1, ...typography.secondary, color: colors.espresso, paddingVertical: 0 },

  iconControl: { width: metrics.iconControl, height: metrics.iconControl, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },

  segmented: { height: metrics.button.height, borderRadius: radius.control, backgroundColor: colors.chip, padding: 4, flexDirection: 'row', gap: 4 },
  segment: { flex: 1, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white },
  segmentOn: { backgroundColor: colors.paper },
  segmentTextOn: { ...typography.secondaryBold, color: colors.coffee },
  segmentTextOff: { ...typography.secondary, color: colors.coffee },

  stepper: { width: metrics.stepper.width, height: metrics.stepper.height, borderRadius: radius.control, backgroundColor: colors.chip, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4 },
  stepperValue: { ...typography.bodyBold, color: colors.espresso },

  toggle: { width: metrics.toggle.width, height: metrics.toggle.height, borderRadius: radius.pill, backgroundColor: colors.borderDark, padding: 3, justifyContent: 'center' },
  toggleOn: { backgroundColor: colors.coffee },
  toggleKnob: { width: 25, height: 25, borderRadius: radius.pill, backgroundColor: colors.white },
  toggleKnobOn: { alignSelf: 'flex-end' },

  stars: { flexDirection: 'row', gap: 4 },

  listRow: { minHeight: 52, flexDirection: 'row', alignItems: 'center' },

  feedback: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16, borderRadius: radius.control },
  feedbackTitle: { ...typography.secondaryBold },
  feedbackBody: { ...typography.caption },

  emptyState: { alignItems: 'center', gap: 24, paddingTop: 8 },
  // Action spans 90% of the content width so it stays inside the screen
  // margins and scales with the device instead of hugging the label.
  emptyAction: { width: '100%', alignItems: 'center' },
  emptyActionButton: { width: '90%' },
  emptyIllustration: {
    width: 156,
    height: 156,
    borderRadius: 64,
    backgroundColor: colors.chip,
    alignItems: 'center',
    justifyContent: 'center',
  },
  beans: { flexDirection: 'row', gap: 8, marginTop: -6 },
  bean: { width: 19, height: 22, borderRadius: 10 },
  emptyTitle: { ...typography.title, color: colors.espresso, textAlign: 'center' },
  emptyBody: { ...typography.body, color: colors.stone, textAlign: 'center' },

  productCard: { backgroundColor: colors.paper, borderRadius: radius.card, overflow: 'hidden' },
  productMedia: { width: '100%', borderRadius: 0 },
  mediaFill: { width: '100%', height: '100%' },
  cardHeart: { position: 'absolute', top: 8, right: 8 },
  productInfo: { padding: 8, gap: 4 },
  productName: { ...typography.secondaryBold, color: colors.espresso },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  addControl: { width: 44, height: 44, borderRadius: radius.control, backgroundColor: colors.coffee, alignItems: 'center', justifyContent: 'center' },

  grid: { gap: 16 },
  gridRow: { flexDirection: 'row', gap: 16 },
  gridCell: { flex: 1 },

  groupList: { backgroundColor: colors.paper, borderRadius: radius.card, overflow: 'hidden' },
  sheetCaption: { ...typography.body, color: colors.stone },

  sheetRoot: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors.espresso, opacity: 0.4 },
  sheet: { backgroundColor: colors.paper, borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, paddingHorizontal: metrics.sheetPadding, paddingTop: 12 },
  // The sheet was a single gap:16 row; the gap now lives on the scroll content
  // so spacing between the grabber and the title is preserved while the body
  // scrolls independently.
  sheetBody: { flexGrow: 0, marginTop: 16 },
  sheetBodyContent: { gap: 16, paddingBottom: 8 },
  grabberArea: { alignItems: 'center' },
  grabber: { width: 40, height: 5, borderRadius: 10, backgroundColor: colors.borderDark },
});

export const uiStyles = styles;