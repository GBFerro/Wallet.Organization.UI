# Components Structure

This project follows **Atomic Design** principles to organize React components into a clear, scalable hierarchy.

## Directory Structure

```
app/components/
├── atoms/           # Basic building blocks
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Spacer.tsx
│   ├── ThemedText.tsx
│   ├── ThemedView.tsx
│   └── index.ts
├── molecules/       # Simple combinations of atoms
│   ├── HeaderTitle.tsx
│   ├── SummaryCard.tsx
│   └── index.ts
├── organisms/       # Complex, feature-specific components
│   ├── MonthCard.tsx
│   ├── TransactionCard.tsx
│   ├── TransactionForm.tsx
│   └── index.ts
├── layout/          # Layout wrappers and structural components
│   ├── ErrorBoundary.tsx
│   ├── ErrorFallback.tsx
│   ├── ScreenFlatList.tsx
│   ├── ScreenKeyboardAwareScrollView.tsx
│   ├── ScreenScrollView.tsx
│   └── index.ts
└── index.ts         # Main barrel export
```

## Component Categories

### Atoms
Basic, reusable UI primitives that don't depend on other components (except React Native components).

**Examples:**
- `Button` - Animated button component
- `Card` - Basic card with elevation
- `Spacer` - Spacing utility component
- `ThemedText` - Text with theme support
- `ThemedView` - View with theme support

### Molecules
Simple compositions of atoms that work together as a unit.

**Examples:**
- `HeaderTitle` - Header with icon and title
- `SummaryCard` - Summary card with icon, title, and value

### Organisms
Complex components that combine molecules and atoms into distinct sections of an interface.

**Examples:**
- `MonthCard` - Complex month calendar with projections
- `TransactionCard` - Transaction display card with actions
- `TransactionForm` - Complete transaction input form

### Layout
Layout wrappers and structural components that provide consistent screen structure.

**Examples:**
- `ErrorBoundary` - Error boundary wrapper
- `ErrorFallback` - Error display component
- `ScreenFlatList` - Screen wrapper with FlatList
- `ScreenKeyboardAwareScrollView` - Keyboard-aware screen wrapper
- `ScreenScrollView` - Basic scrollable screen wrapper

## Usage

### Importing Components

You can import components in several ways:

```tsx
// Import from specific category
import { Button, ThemedText } from "@components/atoms";
import { SummaryCard } from "@components/molecules";
import { TransactionForm } from "@components/organisms";
import { ErrorBoundary } from "@components/layout";

// Import from main barrel (exports all)
import { Button, SummaryCard, TransactionForm } from "@components";

// Import directly from file
import { Button } from "@components/atoms/Button";
```

## Guidelines

### When to create a component in each category:

**Atoms:**
- Component is a basic UI primitive
- Minimal or no business logic
- Highly reusable across the app
- Doesn't depend on other custom components

**Molecules:**
- Combines 2-3 atoms into a simple pattern
- Has a specific, single purpose
- Reusable in different contexts
- Limited business logic

**Organisms:**
- Complex, feature-specific component
- Combines multiple molecules/atoms
- May contain business logic
- Specific to certain features or screens

**Layout:**
- Provides structural layout
- Screen wrappers and containers
- Error boundaries
- Manages spacing, scrolling, or other layout concerns

## Benefits

1. **Clear Organization**: Easy to find components by their complexity level
2. **Scalability**: Logical place for new components
3. **Reusability**: Atoms and molecules are highly reusable
4. **Maintainability**: Changes to basic components propagate upward
5. **Testing**: Easier to test isolated atoms before testing complex organisms
