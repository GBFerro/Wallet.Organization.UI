# Components

Atomic design: `atoms/` → `molecules/` → `organisms/`, plus `layout/` for structural wrappers. Root guidance is in `/CLAUDE.md`; the long-form references here (`README.md`, `BEST_PRACTICES.md`, `COMPOUND_COMPONENTS.md`) are still accurate and worth reading before a large change.

## Folder-per-component

Every component is a **folder**, never a bare file:

```
Card/
├── Card.tsx            # root component
├── CardContext.tsx     # shared state, if compound
├── CardHeader.tsx      # one file per sub-component
├── utils.ts            # component-local helpers
└── index.ts            # Object.assign + type re-exports
```

The barrel is where composition happens, not the component file:

```ts
// Card/index.ts
import { Card as CardRoot } from "./Card";
import { CardHeader } from "./CardHeader";

export const Card = Object.assign(CardRoot, { Header: CardHeader, /* ... */ });
export type { CardProps } from "./Card";
```

Then re-export from the tier barrel (`atoms/index.ts`) — which is what `@components/atoms` resolves to. `components/index.ts` re-exports all four tiers.

## Compound component pattern

Used by `Card`, `SummaryCard`, `MonthCard`, `TransactionCard`. Root creates a context (value wrapped in `useMemo`), sub-components read it via a hook that **throws** when used outside the root:

```tsx
export function useCardContext() {
  const context = useContext(CardContext);
  if (!context) throw new Error("Card sub-components must be used within Card");
  return context;
}
```

`MonthCard/` and `Card/` are the reference implementations. Sub-components generally take no data props — they pull everything from context — so `<MonthCard.Header />` is prop-free by design.

## Styling: two systems coexist

NativeWind v4 is configured (`tailwind.config.js`, `metro.config.js`, `app/global.css` imported in `_layout.tsx`), but most existing components use `StyleSheet.create` + theme constants. Both are acceptable; follow whichever the file you are editing already uses.

When accepting Tailwind classes:

```tsx
export interface ComponentProps extends ViewProps {   // extend, never Omit<ViewProps, "style">
  className?: string;
}

export function Component({ className, style, ...rest }: Readonly<ComponentProps>) {
  return <View {...rest} className={cn("p-4 rounded-lg", className)} style={style} />;
}
```

- Merge with `cn()` from `@utils/cn` (clsx + tailwind-merge) — never string concatenation. Defaults first, incoming `className` last so callers win.
- `Omit<ViewProps, "style">` is banned: it breaks inline style pass-through, which is how dynamic theme values get applied.
- Static styles → `StyleSheet.create` or Tailwind classes. Dynamic/theme values → inline `style`, memoized with `useMemo` when non-trivial.

## `Pressable` style must be an array, never a callback

`babel.config.js` sets `jsxImportSource: "nativewind"`, so every element in the app is emitted through `react-native-css-interop/jsx-runtime`, which swaps `View`/`Text`/`Pressable` for interop wrappers **even when no `className` is present**. Those wrappers reprocess the `style` prop, and the callback form does not survive the round trip on native — the entire style object is dropped. On web it works, so this is invisible until you run iOS or Android.

```tsx
// Broken on native: silently loses width, height, flexDirection, backgroundColor — everything.
<Pressable style={({ pressed }) => [styles.card, { opacity: pressed ? 0.7 : 1 }]}>
```

Use `usePressed` from `@hooks/usePressed`, which tracks the press via `onPressIn`/`onPressOut` and lets the style stay an array:

```tsx
const { pressed, pressHandlers } = usePressed();

<Pressable {...pressHandlers} style={[styles.card, { opacity: pressed ? 0.7 : 1 }]}>
```

It takes optional handlers and chains them (`usePressed(props)`), for components that already forward `onPressIn`/`onPressOut`. Inside a `.map()` where a hook per item is impossible, use `Pressable`'s children render prop instead and put the pressed style on an inner `View` that fills the cell — `MonthCardCalendar.tsx` is the reference.

The same hazard applies to any interop'd prop: keep `style` a plain object or array everywhere.

## Layout wrappers

`ScreenScrollView`, `ScreenKeyboardAwareScrollView`, `ScreenFlatList` all apply `theme.backgroundRoot`, `Spacing.xl` horizontal padding, and insets from `useScreenInsets()` (tab bar height + safe area). Use them instead of re-deriving padding — but note they depend on being rendered inside a bottom-tab navigator, since `useScreenInsets` calls `useBottomTabBarHeight()`.

Do **not** add `useHeaderHeight()` to top padding. `screenOptions.ts` sets `headerTransparent: false`, so the native stack already lays screen content out below the header; adding the header height on top of that double-counts it and leaves a header-sized blank gap. The tab bar is the opposite case — it is `position: "absolute"` and floats over content, so `paddingBottom` *does* need `useBottomTabBarHeight()`.

## Rules with teeth

- `Readonly<T>` on every props type; export the props interface from the component file and re-export it from `index.ts`.
- No array indices as React keys; no non-null assertions (`!`); no nested ternaries in JSX — extract a helper.
- `Number.parseFloat` / `String.replaceAll`, not the globals.
- Accessibility props (`accessible`, `accessibilityRole`, `accessibilityLabel`) on anything pressable.
- Never pass `style` as a callback to `Pressable` — see the section above; it breaks silently on native only.
- Keep components under ~200–300 lines; that ceiling is why `Card` and `MonthCard` are split, and why the `*.full.tsx` files carry a `TODO`.

`EXAMPLES.tsx` is a gallery of usage snippets, not a rendered route — it exists for reference only.
