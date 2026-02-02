# Copilot Instructions - FinForecast Wallet UI

## Project Overview
React Native/Expo financial forecast application using TypeScript, with file-based routing via Expo Router. Backend communicates with ngrok-tunneled API for transaction management and financial projections.

## Architecture & Critical Patterns

### 1. Component Organization (Atomic Design + Folder Structure)
Components follow strict atomic hierarchy in `app/components/`:
- **atoms/**: Primitives (Button, Card, ThemedText, ThemedView, Spacer) - no business logic
- **molecules/**: Simple compositions (SummaryCard, HeaderTitle) - 2-3 atoms
- **organisms/**: Complex features (MonthCard, TransactionCard, TransactionForm) - business logic allowed
- **layout/**: Wrappers (ScreenScrollView, ErrorBoundary) - structural only

**Critical**: Each component lives in its own folder with:
- Main component file (e.g., `Card/Card.tsx`)
- Sub-component files for compound components (e.g., `Card/CardHeader.tsx`)
- Context file if using shared state (e.g., `Card/CardContext.tsx`)
- Barrel export in `index.ts` with named exports only
- All prop types exported from component files

```tsx
// Folder structure example
Card/
├── Card.tsx              // Main component
├── CardContext.tsx       // Shared context (if needed)
├── CardHeader.tsx        // Sub-component
├── CardBody.tsx          // Sub-component
├── CardFooter.tsx        // Sub-component
├── CardTitle.tsx         // Sub-component
├── CardDescription.tsx   // Sub-component
├── utils.ts              // Helper functions (if needed)
└── index.ts              // Barrel exports

// index.ts - Named exports only
export { Card } from "./Card";
export type { CardProps } from "./Card";

// Never use default exports
// Wrong
export default function Button() { }

// Correct
export function Button({ ... }: Readonly<ButtonProps>) { }
```

### 2. Path Aliases (tsconfig.json)
```tsx
import { Button } from "@components/atoms";
import { useTheme } from "@hooks/useTheme";
import { API_BASE_URL } from "@constants/api";
import { formatCurrency } from "@utils/format";
import { AuthContext } from "@contexts/AuthContext";
```

### 3. TypeScript Requirements
- **All props must be `Readonly<T>`**:
  ```tsx
  function Component({ prop }: Readonly<ComponentProps>) { }
  ```
- **Props must extend native RN props directly** - DO NOT use `Omit<ViewProps, "style">`:
  ```tsx
  // Correct - allows style prop to be passed
  export interface ButtonProps extends PressableProps {
    variant?: "primary" | "secondary";
    className?: string;
  }

  // Wrong - breaks style prop compatibility
  export interface ButtonProps extends Omit<PressableProps, "style"> {
    variant?: "primary" | "secondary";
  }
  ```
- **Always export prop types** from component files:
  ```tsx
  export interface CardProps extends ViewProps {
    elevation?: number;
    className?: string;
  }
  export function Card({ elevation, className, ...props }: Readonly<CardProps>) { }
  ```
- Use `Number.parseFloat()` not `parseFloat()`
- Use `String.replaceAll()` not `String.replace()` for global replacements
- No `any` types - use proper typing or `ReturnType<typeof hook>`
- No non-null assertions (`!`) - use conditional rendering instead

### 4. Theme System
Centralized in `@constants/theme` with light/dark modes:
- Access via `useTheme()` hook: `const { theme, isDark } = useTheme()`
- Theme provides: text, backgroundRoot/Default/Secondary/Tertiary, primary, income, expense, border
- Typography constants: `Typography.h1/.h2/.h3/.h4/.body/.small`
- Spacing: `Spacing.xs/.sm/.md/.lg/.xl/.xxl/buttonHeight`
- Border radius: `BorderRadius.xs/.sm/.md/.lg/.xl/.2xl/.full`

**Always use theme constants, never hardcoded colors/sizes**

### 5. API Integration Pattern
API service (`@services/api`) uses AsyncStorage for auth tokens:
- `signUp/signIn` - returns `{ success, message?, data? }`
- `fetchForecast(period)` - handles various response formats (check `data.data` or `data`)
- `createTransaction/updateTransaction/deleteTransaction` - standard CRUD
- All API functions handle response normalization (camelCase vs PascalCase)
- Token stored as `@finforecast:token`, user as `@finforecast:user`

**API Base URL**: Hardcoded ngrok URL in `constants/api.ts` - update when tunnel changes

### 6. Authentication Flow
`AuthContext` provides: `{ user, isLoading, isAuthenticated, login, register, logout }`
- Uses AsyncStorage for persistence
- Check `isLoading` before rendering auth-dependent UI
- `login/register` return `{ success, message }` - handle errors in UI

### 7. Screen Layout Wrappers
Three layout components handle safe areas + keyboard:
- `ScreenScrollView` - basic scrollable screen
- `ScreenKeyboardAwareScrollView` - handles keyboard (falls back on web)
- `ScreenFlatList<T>` - for lists with insets

All automatically apply:
- Safe area insets (top/bottom padding)
- Theme background colors
- Horizontal padding (`Spacing.xl`)

### 8. Data Types & Enums
`@constants/api` defines all domain types:
- `TransactionEnum`, `RecurrenceEnum`, `PaymentMethodEnum`, `CardEnum`, `PeriodEnum`
- Each has corresponding `*_LABELS` record for Portuguese display
- `Transaction`, `Payment`, `BankInfo`, `Projection`, `ForecastResponse`

### 9. Animation Standards
Use `react-native-reanimated` with spring config:
```tsx
const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
  energyThreshold: 0.001,
};
```
Standard pattern: scale from 1 → 0.98 on press

### 10. Localization
Brazilian Portuguese (`pt-BR`):
- Currency formatting: `formatCurrency(value)` uses BRL
- Date formatting: `formatDate/formatShortDate/formatDayMonth` use pt-BR locale
- All UI text in Portuguese

### 11. NativeWind / Tailwind CSS Integration
All components support **Tailwind CSS** via NativeWind v4:

**Setup Files:**
- `tailwind.config.js` - Tailwind configuration with NativeWind preset
- `metro.config.js` - Metro bundler config for CSS preprocessing
- `app/global.css` - Tailwind directives (@base, @components, @utilities)
- `app/utils/cn.ts` - Class merging utility using `tailwind-merge` and `clsx`

**className Prop Pattern:**
```tsx
// All components accept className for Tailwind classes
<Card className="p-8 rounded-xl bg-blue-500">
  <Card.Header className="mb-4">
    <Card.Title className="text-2xl font-bold text-white">Title</Card.Title>
  </Card.Header>
</Card>

// className utility (cn) merges classes with proper precedence
import { cn } from "@utils/cn";

export function Component({ className, style, ...props }: Readonly<ComponentProps>) {
  return (
    <View
      {...props}
      className={cn("p-4 bg-gray-100", className)} // className overrides defaults
      style={style} // style prop still works for inline styles
    />
  );
}
```

**Class Merging with cn():**
```tsx
// Later classes override earlier ones
cn("p-4", "p-8") // Result: "p-8"
cn("bg-blue-500", "bg-red-500") // Result: "bg-red-500"

// Conditional classes
cn("p-4", isActive && "bg-blue-500", isDark && "text-white")
```

**Props Pattern for Tailwind Support:**
```tsx
export interface ComponentProps extends ViewProps {
  className?: string; // For Tailwind classes
  // style prop inherited from ViewProps - never omit it
}

export function Component({
  className,
  style,
  children,
  ...rest
}: Readonly<ComponentProps>) {
  return (
    <View
      {...rest}
      className={cn("default-classes", className)}
      style={style}
    >
      {children}
    </View>
  );
}
```

**Important Rules:**
- Always accept both `className` (Tailwind) and `style` (inline) props
- Use `cn()` utility to merge classes, never manual string concatenation
- Pass `className` to the outermost element, not nested elements (unless intentional)
- Default classes come first in `cn()`, overrides come last
- Never use `Omit<ViewProps, "style">` - breaks inline style support

### 12. Compound Components Pattern
Use compound components for complex UI with shared context:

**Pattern Structure:**
```tsx
// 1. Create Context
interface CardContextValue {
  elevation: number;
  variant: string;
}

const CardContext = createContext<CardContextValue | undefined>(undefined);

export function useCardContext() {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error("Card sub-components must be used within Card");
  }
  return context;
}

// 2. Main Component (Provider)
export function Card({
  elevation = 1,
  variant = "default",
  children,
  className,
  ...props
}: Readonly<CardProps>) {
  // Wrap context value in useMemo for performance
  const contextValue: CardContextValue = React.useMemo(
    () => ({ elevation, variant }),
    [elevation, variant]
  );

  return (
    <CardContext.Provider value={contextValue}>
      <View {...props} className={cn("rounded-lg", className)}>
        {children}
      </View>
    </CardContext.Provider>
  );
}

// 3. Sub-components
export function CardHeader({ className, ...props }: Readonly<ViewProps>) {
  const { variant } = useCardContext();
  return (
    <View
      {...props}
      className={cn("border-b", variant === "primary" && "border-blue-500", className)}
    />
  );
}

export function CardTitle({ className, ...props }: Readonly<TextProps>) {
  const { variant } = useCardContext();
  return (
    <Text
      {...props}
      className={cn("font-bold", variant === "primary" && "text-blue-600", className)}
    />
  );
}

// 4. Attach sub-components via Object.assign
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Description = CardDescription;
```

**Usage:**
```tsx
<Card elevation={2} variant="primary" className="p-6">
  <Card.Header className="mb-4">
    <Card.Title>My Card Title</Card.Title>
    <Card.Description>Subtitle here</Card.Description>
  </Card.Header>
  <Card.Body>
    <Text>Content</Text>
  </Card.Body>
  <Card.Footer>
    <Button>Action</Button>
  </Card.Footer>
</Card>
```

**File Organization:**
```
Card/
├── Card.tsx              // Main component + Object.assign
├── CardContext.tsx       // Context definition and hook
├── CardHeader.tsx        // Sub-component
├── CardBody.tsx          // Sub-component
├── CardFooter.tsx        // Sub-component
├── CardTitle.tsx         // Sub-component
├── CardDescription.tsx   // Sub-component
└── index.ts              // Barrel exports

// index.ts
export { Card } from "./Card";
export type { CardProps } from "./Card";
export type { CardContextValue } from "./CardContext";
```

**Key Rules:**
- Use `React.useMemo` for context values to prevent unnecessary re-renders
- Sub-components should use the context hook to access shared state
- Throw errors in context hook if used outside provider
- Attach sub-components via `Object.assign` after component definition
- Export both component and types from index.ts

## Development Commands
```bash
npm start              # Start Expo dev server
npm run android        # Run on Android
npm run ios            # Run on iOS
npm run web            # Run on web
npm run lint           # ESLint check
```

## Common Patterns

### Error Handling
Components use `ErrorBoundary` with `ErrorFallback`:
```tsx
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

### List Keys
Never use array indices - use stable IDs or template strings:
```tsx
{weeks.map((week, idx) => (
  <View key={`week-${idx}`}> {/* OK for static lists */}
))}
{items.map(item => (
  <Item key={item.id} /> {/* Preferred */}
))}
```

### Complex Logic
Extract nested ternaries/complex conditions into helper functions:
```tsx
// Avoid
style={{ opacity: pressed ? 0.6 : isValid ? 1 : 0.4 }}

// Extract
const getOpacity = (pressed: boolean) => pressed ? 0.6 : (isValid ? 1 : 0.4);
```

### Style Patterns
- Always use `StyleSheet.create()` for static styles
- Inline styles only for dynamic/theme values
- Use `useMemo` for computed style objects
- **Prefer Tailwind classes via `className` for most styling**
- Use `cn()` utility from `@utils/cn` to merge Tailwind classes
- Combine Tailwind and inline styles when needed:
  ```tsx
  <View
    className="p-4 rounded-lg" // Static/responsive styles
    style={{ backgroundColor: theme.primary }} // Dynamic theme values
  />
  ```

## File Structure
```
app/
├── components/        # Atomic design hierarchy (see above)
│   ├── atoms/        # Each component in own folder
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Spacer/
│   │   ├── ThemedText/
│   │   └── ThemedView/
│   ├── molecules/    # Each component in own folder
│   │   ├── HeaderTitle/
│   │   └── SummaryCard/
│   ├── organisms/    # Each component in own folder
│   │   ├── MonthCard/
│   │   ├── TransactionCard/
│   │   └── TransactionForm/
│   └── layout/       # Layout wrappers
├── constants/         # theme.ts, api.ts (types/enums/configs)
├── contexts/          # AuthContext.tsx (global state)
├── hooks/             # useTheme, useColorScheme, useScreenInsets
├── services/          # api.ts (all backend communication)
├── utils/             # format.ts, logger.ts, cn.ts (Tailwind merge)
├── _layout.tsx        # Root layout (Expo Router)
├── global.css         # Tailwind directives
└── index.tsx          # Home screen
```

## Component Best Practices

### Naming Conventions
```typescript
// Components: PascalCase with named exports
export function UserProfile({ ... }: Readonly<UserProfileProps>) {}

// Custom hooks: camelCase with 'use' prefix
export function useUserData() {}

// Constants: UPPER_SNAKE_CASE
export const MAX_ITEMS = 10;

// Utility functions: camelCase
export function formatDate(date: Date) {}

// Types/Interfaces: PascalCase with descriptive suffix
export interface UserProfileProps {}
export type ButtonVariant = 'primary' | 'secondary';
```

### Component Structure Pattern
Each component follows this structure:
```tsx
// 1. Imports
import React from "react";
import { View, StyleSheet } from "react-native";

// 2. Type definitions
interface ComponentProps {
  title: string;
  onPress?: () => void;
}

// 3. Constants (if needed)
const CONSTANT_VALUE = 10;

// 4. Helper functions (component-specific)
function helperFunction() { ... }

// 5. Component
export function Component({ title, onPress }: Readonly<ComponentProps>) {
  return <View>...</View>;
}

// 6. Styles
const styles = StyleSheet.create({
  container: { ... },
});
```

### Performance Optimization

#### React.memo for expensive renders
```tsx
export const ExpensiveComponent = React.memo(function ExpensiveComponent({
  data
}: Readonly<Props>) {
  // Complex rendering logic
});
```

#### useCallback and useMemo
```tsx
const handlePress = useCallback(() => {
  onPress?.(item.id);
}, [onPress, item.id]);

const computedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

### Accessibility
Always include accessibility props for interactive elements:
```tsx
<Pressable
  accessible
  accessibilityRole="button"
  accessibilityLabel="Save transaction"
  accessibilityHint="Saves the current transaction"
  accessibilityState={{ disabled: isDisabled }}
>
  <Text>Save</Text>
</Pressable>
```

### Component Do's and Don'ts

#### Do
- Use **functional components** with hooks
- Type **all props** with `Readonly<T>`
- Extract **complex logic** into helper functions or custom hooks
- Use **theme constants** for colors, spacing, typography
- Implement **error boundaries** for error handling
- Use **destructuring** for props
- Keep components **small and focused** (Single Responsibility)
- Use `StyleSheet.create()` for static styles
- Use `useMemo` for computed style objects

#### Avoid
- Default exports (use named exports)
- Business logic inside UI components (extract to hooks/services)
- Hardcoded colors, sizes, or spacing
- Excessive props drilling (use Context)
- Direct state mutation
- Non-null assertions (`!`)
- Array indices as keys
- Nested ternary operators in JSX
- Components with more than 200-300 lines

## Key Files to Reference
- Component patterns: `app/components/BEST_PRACTICES.md`
- Component structure: `app/components/README.md`
- Complete refactoring guide: `COMPLETE_REFACTORING.md`
- Theme system: `app/constants/theme.ts`
- API patterns: `app/services/api.ts`
- Type definitions: `app/constants/api.ts`
- Tailwind utilities: `app/utils/cn.ts`
