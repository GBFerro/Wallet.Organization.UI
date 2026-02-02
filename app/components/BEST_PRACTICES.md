# Component Best Practices

This document outlines the best practices applied to all components in this project.

## TypeScript Best Practices

### ✅ Use Readonly Props
All component props should be marked as `Readonly<T>` to prevent accidental mutations.

```tsx
// ❌ Bad
interface ButtonProps {
  label: string;
}
export function Button({ label }: ButtonProps) { ... }

// ✅ Good
interface ButtonProps {
  label: string;
}
export function Button({ label }: Readonly<ButtonProps>) { ... }
```

**Why?** Props are immutable in React. Using `Readonly<T>` enforces this at the type level and prevents bugs.

### ✅ Use Named Exports
Prefer named exports over default exports for better refactoring and IDE support.

```tsx
// ❌ Bad
export default function Button() { ... }

// ✅ Good
export function Button() { ... }
```

**Why?** Named exports provide better IDE autocomplete, easier refactoring, and clearer imports.

### ✅ Proper Type Annotations
Avoid using `any` type. Use proper TypeScript types or utility types.

```tsx
// ❌ Bad
const getColor = (theme: any) => theme.primary;

// ✅ Good
const getColor = (theme: ReturnType<typeof useTheme>["theme"]) => theme.primary;
```

### ✅ Use Number.parseFloat over parseFloat
Use the `Number.parseFloat` method instead of the global `parseFloat`.

```tsx
// ❌ Bad
const value = parseFloat(input);

// ✅ Good
const value = Number.parseFloat(input);
```

**Why?** `Number.parseFloat` is more explicit and aligns with modern JavaScript best practices.

## React Best Practices

### ✅ Extract Complex Logic
Avoid nested ternary operators. Extract complex logic into separate functions.

```tsx
// ❌ Bad
style={{ opacity: pressed ? 0.6 : isValid ? 1 : 0.4 }}

// ✅ Good
const getOpacity = (pressed: boolean) => {
  if (pressed) return 0.6;
  return isValid ? 1 : 0.4;
};

style={{ opacity: getOpacity(pressed) }}
```

### ✅ Use Proper Keys in Lists
Never use array indices as keys. Use unique identifiers.

```tsx
// ❌ Bad
{items.map((item, index) => <Item key={index} />)}

// ✅ Good
{items.map(item => <Item key={item.id} />)}

// ✅ Also good for static lists
{weeks.map((week, weekIndex) => (
  <View key={`week-${weekIndex}`}>
))}
```

**Why?** Using indices can cause rendering issues when items are reordered or removed.

### ✅ Avoid Non-Null Assertions
Don't use `!` to bypass TypeScript's null checks. Use proper conditionals.

```tsx
// ❌ Bad
{hasData && (
  <Text>{projection!.income}</Text>
)}

// ✅ Good
{hasData && projection && (
  <Text>{projection.income}</Text>
)}
```

**Why?** Non-null assertions can lead to runtime errors if the value is actually null/undefined.

### ✅ Use useMemo for Expensive Calculations
Memoize expensive calculations or inline object/style creation.

```tsx
// ❌ Bad (creates new object on every render)
<View style={{ backgroundColor: color + "20" }} />

// ✅ Good
const backgroundColor = useMemo(() => color + "20", [color]);
<View style={{ backgroundColor }} />
```

### ✅ Make Class Properties Readonly
For class components, mark static properties as readonly.

```tsx
// ❌ Bad
static defaultProps = { ... }

// ✅ Good
static readonly defaultProps = { ... }
```

## Component Structure

### Consistent Export Pattern
All components use named exports and are re-exported through barrel files:

```tsx
// Component file: Button.tsx
export function Button({ ... }: Readonly<ButtonProps>) { ... }

// Index file: atoms/index.ts
export { Button } from "./Button";

// Main index: components/index.ts
export * from "./atoms";
```

### Props Interface Naming
Props interfaces should be named after the component with a `Props` suffix:

```tsx
interface ButtonProps { ... }
interface TransactionCardProps { ... }
```

### Component File Structure
```tsx
// 1. Imports
import React from "react";
import { ... } from "react-native";

// 2. Type definitions
interface ComponentProps { ... }

// 3. Constants
const CONSTANT_VALUE = ...;

// 4. Helper functions (if small and specific to component)
function helperFunction() { ... }

// 5. Component
export function Component({ ... }: Readonly<ComponentProps>) { ... }

// 6. Styles
const styles = StyleSheet.create({ ... });
```

## Performance Optimization

### ✅ Use useCallback for Event Handlers
When passing callbacks to child components, use `useCallback` to prevent unnecessary re-renders.

```tsx
const handlePress = useCallback(() => {
  onPress?.(item.id);
}, [onPress, item.id]);
```

### ✅ Optimize re-renders with React.memo
For components that render frequently with the same props:

```tsx
export const ExpensiveComponent = React.memo(function ExpensiveComponent({
  data
}: Readonly<Props>) {
  // Complex rendering logic
});
```

## Styling Best Practices

### ✅ Use StyleSheet.create
Always use `StyleSheet.create` for static styles instead of inline objects.

```tsx
// ❌ Bad
<View style={{ padding: 16, margin: 8 }} />

// ✅ Good
const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    margin: Spacing.sm,
  },
});
```

### ✅ Use Theme Constants
Always use theme constants instead of hardcoded values.

```tsx
// ❌ Bad
<Text style={{ fontSize: 16, color: '#333' }} />

// ✅ Good
<ThemedText type="body" />
```

## Code Organization

### Component Categories

**Atoms (Basic Components):**
- Single responsibility
- No business logic
- Highly reusable
- Example: Button, ThemedText, Card

**Molecules (Composite Components):**
- Combination of 2-3 atoms
- Simple, focused purpose
- Reusable patterns
- Example: SummaryCard, HeaderTitle

**Organisms (Complex Components):**
- Feature-specific
- May contain business logic
- Combines molecules and atoms
- Example: TransactionForm, MonthCard

**Layout (Structural Components):**
- Screen wrappers
- Layout containers
- Error boundaries
- Example: ScreenScrollView, ErrorBoundary

## Testing Considerations

### Write Testable Components
- Keep components pure (same props = same output)
- Extract business logic to hooks or utilities
- Use dependency injection for external dependencies
- Avoid direct DOM manipulation

### Component Responsibilities
- **Atoms**: Test rendering with different props
- **Molecules**: Test interaction between atoms
- **Organisms**: Test business logic and user workflows
- **Layout**: Test layout behavior and error handling

## Accessibility

### ✅ Add Accessibility Props
Always include accessibility props for interactive elements.

```tsx
<Pressable
  accessible
  accessibilityRole="button"
  accessibilityLabel="Save transaction"
  accessibilityHint="Saves the current transaction"
>
  <Text>Save</Text>
</Pressable>
```

## Summary Checklist

When creating or updating components, ensure:

- [ ] Props are marked as `Readonly<T>`
- [ ] Named exports are used
- [ ] No `any` types (use proper TypeScript)
- [ ] No array indices as keys
- [ ] No non-null assertions (`!`)
- [ ] Complex logic is extracted from JSX
- [ ] `Number.parseFloat` instead of `parseFloat`
- [ ] Styles use `StyleSheet.create`
- [ ] Theme constants are used
- [ ] Proper accessibility props
- [ ] Component is in the correct category (atoms/molecules/organisms/layout)
- [ ] Exported in the appropriate index file
