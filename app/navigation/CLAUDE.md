# Navigation

This directory is plain **React Navigation**, mounted from inside the single Expo Router route `app/index.tsx`. Nothing here is file-based routing — adding a file to this folder creates no route.

## Shape

```
app/index.tsx (auth gate)
└── MainTabNavigator            createBottomTabNavigator
    ├── ForecastTab   → ForecastStackNavigator     → ForecastScreen
    ├── ExpensesTab   → TransactionsStackNavigator → TransactionsScreen (type=Expense)
    ├── IncomesTab    → TransactionsStackNavigator → TransactionsScreen (type=Income)
    └── SettingsTab   → SettingsStackNavigator     → SettingsScreen
```

`TransactionsStackNavigator` is **parameterised and reused twice** — it takes `name`, `headerTitle`, and a `TransactionEnum type`, so Expenses and Incomes are the same stack instantiated with different props. Distinct `name`/`id` values per instance are what keep the two navigators from colliding; keep them unique when adding another.

## Conventions

- Navigators **default-export** (the one place named exports don't apply) and declare a `ParamList` type next to the component (`MainTabParamList`, `TransactionsStackParamList`).
- Stack screen options come from `getCommonScreenOptions({ theme, isDark })` in `screenOptions.ts` — centralised header tint, background, and gesture config. Spread it, then override per-screen:
  ```tsx
  <Stack.Navigator screenOptions={{ ...getCommonScreenOptions({ theme, isDark }) }}>
  ```
- Tab bar is `position: "absolute"` with `borderTopWidth: 0`. This is why screen content needs `useScreenInsets()` / the `Screen*` layout wrappers for bottom padding.
- Tab icons are Feather glyphs declared as **named top-level components** (`ForecastTabIcon`, …), not inline arrow functions — inline `tabBarIcon` closures remount on every render.
- Headers: tabs set `headerShown: false`; the inner stacks own the header, titled from `TEXT.header.*`.

## Never pass an inline function to `component`

```tsx
// WRONG — new component identity every render
component={() => TransactionsScreen({ type })}
component={() => ForecastStackNavigator({ headerTitle })}

// RIGHT — stable module-level component
function ForecastTabStack() { return <ForecastStackNavigator headerTitle={TEXT.header.forecast} />; }
component={ForecastTabStack}

// RIGHT — when the wrapper needs props, memoize on them
const TransactionsRoute = useMemo(
  () => function TransactionsRoute() { return <TransactionsScreen type={type} />; },
  [type],
);
```

An arrow function in `component` is a *different component type* on every parent render, so React unmounts and remounts the whole subtree each time. Under `react-native-screens` that tears down and rebuilds native `RNSScreen` views mid-transition, which is a known source of **hard iOS crashes with no JS error message** (Android tends to survive it). It also calls the screen as a plain function, running its hooks in the caller's hook slots.

Both instances of this were removed; don't reintroduce them.

## Navigator `id`

All four navigators pass `id={undefined}`. React Navigation 7 types `id` as required once the navigator is generic over its ParamList, and `undefined` is the correct value when you don't need `navigation.getParent(id)`. Do not pass an arbitrary string — the previous code used ids that collided with screen names (`id="ForecastScreen"`, `id={name}` alongside `name={name}`).
