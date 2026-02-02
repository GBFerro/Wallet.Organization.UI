# Compound Components Guide

This guide demonstrates how to use the compound component pattern implemented in our components.

## What are Compound Components?

Compound components are a React pattern that provides a flexible and intuitive API for components that need to work together. They share implicit state and communicate internally while exposing a declarative API.

### Benefits
- **Flexible Composition**: Mix and match sub-components as needed
- **Clean API**: More readable and self-documenting
- **Encapsulated Logic**: State and logic are shared via Context
- **Type Safety**: Full TypeScript support with proper types

## Available Compound Components

### 1. Card

The `Card` component now supports flexible composition with Header, Body, Footer, Title, and Description.

#### Basic Usage
```tsx
import { Card } from "@components/atoms";

// Simple card without press interaction
<Card elevation={1}>
  <Card.Title>My Card Title</Card.Title>
  <Card.Description>This is a description</Card.Description>
</Card>

// Card with press interaction
<Card elevation={2} onPress={() => console.log("Pressed")}>
  <Card.Header>
    <Card.Title>Interactive Card</Card.Title>
  </Card.Header>
  <Card.Body>
    <ThemedText>Some content here</ThemedText>
  </Card.Body>
  <Card.Footer>
    <ThemedText type="small">Footer content</ThemedText>
  </Card.Footer>
</Card>
```

#### API Reference

**Card (Root)**
- `elevation?: number` - Controls background color (1-3, default: 1)
- `onPress?: () => void` - Makes card pressable with animation
- `children: React.ReactNode` - Card content
- `style?: ViewStyle` - Additional styles

**Card.Header**
- `children: React.ReactNode`
- `style?: ViewStyle`

**Card.Body**
- `children: React.ReactNode`
- `style?: ViewStyle`

**Card.Footer**
- `children: React.ReactNode`
- `style?: ViewStyle`

**Card.Title**
- `children: React.ReactNode`
- `style?: ViewStyle`

**Card.Description**
- `children: React.ReactNode`
- `style?: ViewStyle`

---

### 2. SummaryCard

The `SummaryCard` now uses compound components for more flexible icon, title, and value composition.

#### Basic Usage
```tsx
import { SummaryCard } from "@components/molecules";

<SummaryCard>
  <SummaryCard.Icon name="dollar-sign" color="#4CAF50" />
  <SummaryCard.Title>Total Balance</SummaryCard.Title>
  <SummaryCard.Value>R$ 1.234,56</SummaryCard.Value>
</SummaryCard>
```

#### Old vs New

**Old API:**
```tsx
<SummaryCard
  title="Total Balance"
  value="R$ 1.234,56"
  icon="dollar-sign"
  color="#4CAF50"
/>
```

**New API:**
```tsx
<SummaryCard>
  <SummaryCard.Icon name="dollar-sign" color="#4CAF50" />
  <SummaryCard.Title>Total Balance</SummaryCard.Title>
  <SummaryCard.Value>R$ 1.234,56</SummaryCard.Value>
</SummaryCard>
```

#### API Reference

**SummaryCard (Root)**
- `children: React.ReactNode`
- `style?: ViewStyle`

**SummaryCard.Icon**
- `name: keyof typeof Feather.glyphMap` - Feather icon name
- `color: string` - Icon color
- `size?: number` - Icon size (default: 20)

**SummaryCard.Title**
- `children: React.ReactNode` - Title text

**SummaryCard.Value**
- `children: React.ReactNode` - Value text
- `numberOfLines?: number` - Max lines (default: 1)

---

### 3. TransactionCard

The `TransactionCard` provides granular control over icon, details, amount, and actions.

#### Basic Usage
```tsx
import { TransactionCard } from "@components/organisms";

// Default layout (simple)
<TransactionCard transaction={transaction} onPress={handleEdit}>
  <TransactionCard.Content>
    <TransactionCard.Icon />
    <TransactionCard.Details />
  </TransactionCard.Content>
  <TransactionCard.Amount />
  <TransactionCard.Actions onDelete={handleDelete} />
</TransactionCard>
```

#### Custom Layout
```tsx
<TransactionCard transaction={transaction}>
  <TransactionCard.Content>
    <TransactionCard.Icon size={24} />
    <TransactionCard.Details>
      <TransactionCard.Meta>
        <CustomBadge />
        <CustomLabel />
      </TransactionCard.Meta>
    </TransactionCard.Details>
  </TransactionCard.Content>
  <TransactionCard.Amount />
  <TransactionCard.Actions>
    <CustomEditButton />
    <CustomDeleteButton />
  </TransactionCard.Actions>
</TransactionCard>
```

#### API Reference

**TransactionCard (Root)**
- `transaction: Transaction` - Transaction data
- `onPress?: () => void` - Card press handler
- `children: React.ReactNode`

**TransactionCard.Icon**
- `size?: number` - Icon size (default: 20)

**TransactionCard.Content**
- `children: React.ReactNode` - Usually Icon + Details

**TransactionCard.Details**
- `children?: React.ReactNode` - Custom meta info (optional, shows default if empty)

**TransactionCard.Amount**
- `style?: ViewStyle` - Custom style

**TransactionCard.Actions**
- `onEdit?: () => void` - Edit handler
- `onDelete?: () => void` - Delete handler
- `children?: React.ReactNode` - Custom action buttons

**TransactionCard.Meta**
- `children?: React.ReactNode` - Custom badges/labels (optional, shows default if empty)

---

### 4. MonthCard

The `MonthCard` is split into Header, Calendar, and DayDetail for maximum flexibility.

#### Basic Usage
```tsx
import { MonthCard } from "@components/organisms";

<MonthCard monthData={monthData}>
  <MonthCard.Header />
  <MonthCard.Calendar />
  <MonthCard.DayDetail />
</MonthCard>
```

#### Custom Layout
```tsx
<MonthCard monthData={monthData}>
  <MonthCard.Header />
  {/* Add custom content between header and calendar */}
  <CustomMonthStats />
  <MonthCard.Calendar />
  <MonthCard.DayDetail />
</MonthCard>
```

#### API Reference

**MonthCard (Root)**
- `monthData: MonthData` - Month projection data
  ```typescript
  interface MonthData {
    month: string;
    year: number;
    monthIndex: number;
    projections: Projection[];
    totalIncome: number;
    totalExpenses: number;
    finalBalance: number;
  }
  ```
- `children: React.ReactNode`

**MonthCard.Header**
- No props - automatically renders month name, stats, and toggle button

**MonthCard.Calendar**
- No props - automatically renders calendar grid when expanded

**MonthCard.DayDetail**
- No props - automatically renders modal with day details when a day is selected

---

## Migration Guide

### Before (Old API)
```tsx
// Old Card
<Card elevation={1} onPress={handlePress} />

// Old SummaryCard
<SummaryCard
  title="Balance"
  value="R$ 100"
  icon="dollar-sign"
  color="#4CAF50"
/>

// Old TransactionCard
<TransactionCard
  transaction={transaction}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>

// Old MonthCard
<MonthCard monthData={monthData} />
```

### After (New Compound API)
```tsx
// New Card
<Card elevation={1} onPress={handlePress}>
  <Card.Title>Card - Elevation 1</Card.Title>
  <Card.Description>This card has an elevation of 1</Card.Description>
</Card>

// New SummaryCard
<SummaryCard>
  <SummaryCard.Icon name="dollar-sign" color="#4CAF50" />
  <SummaryCard.Title>Balance</SummaryCard.Title>
  <SummaryCard.Value>R$ 100</SummaryCard.Value>
</SummaryCard>

// New TransactionCard
<TransactionCard transaction={transaction} onPress={handleEdit}>
  <TransactionCard.Content>
    <TransactionCard.Icon />
    <TransactionCard.Details />
  </TransactionCard.Content>
  <TransactionCard.Amount />
  <TransactionCard.Actions onDelete={handleDelete} />
</TransactionCard>

// New MonthCard
<MonthCard monthData={monthData}>
  <MonthCard.Header />
  <MonthCard.Calendar />
  <MonthCard.DayDetail />
</MonthCard>
```

## Best Practices

### 1. Always Use Within Root Component
```tsx
// ❌ Wrong - will throw error
<Card.Title>Title</Card.Title>

// ✅ Correct
<Card>
  <Card.Title>Title</Card.Title>
</Card>
```

### 2. Leverage Default Behavior
Many sub-components provide sensible defaults when no children are passed:

```tsx
// Default metadata
<TransactionCard.Details />

// Custom metadata
<TransactionCard.Details>
  <CustomContent />
</TransactionCard.Details>
```

### 3. Composition Over Configuration
Prefer composing multiple simple components over passing many props:

```tsx
// ❌ Less flexible
<SummaryCard title="..." value="..." icon="..." color="..." />

// ✅ More flexible
<SummaryCard>
  <SummaryCard.Icon name="dollar-sign" color="#4CAF50" />
  <SummaryCard.Title>Balance</SummaryCard.Title>
  <SummaryCard.Value>R$ 100</SummaryCard.Value>
  {/* Can easily add custom elements */}
  <CustomBadge />
</SummaryCard>
```

### 4. Type Safety
All compound components are fully typed. Use TypeScript autocomplete:

```tsx
<TransactionCard transaction={transaction}>
  {/* TypeScript will suggest available sub-components */}
  <TransactionCard.
  {/* Shows: Icon, Content, Details, Amount, Actions, Meta */}
</TransactionCard>
```

## Advanced Patterns

### Conditional Rendering
```tsx
<Card elevation={2}>
  <Card.Title>Transaction Details</Card.Title>
  {hasDescription && (
    <Card.Description>{description}</Card.Description>
  )}
  {showActions && (
    <Card.Footer>
      <ActionButtons />
    </Card.Footer>
  )}
</Card>
```

### Custom Styling
```tsx
<SummaryCard style={{ width: 200 }}>
  <SummaryCard.Icon name="trending-up" color={theme.income} size={24} />
  <SummaryCard.Title>Custom Styled</SummaryCard.Title>
  <SummaryCard.Value numberOfLines={2}>
    Multi-line value support
  </SummaryCard.Value>
</SummaryCard>
```

### Context Access (Advanced)
If you need to access the internal context (not recommended unless necessary):

```tsx
// Each compound component exports its context
import { MonthCard } from "@components/organisms";

// Use the hook within a custom sub-component
function CustomMonthStat() {
  // Note: This is internal API and may change
  const { monthData, theme } = useMonthCardContext();
  return <ThemedText>{monthData.month}</ThemedText>;
}
```

## Summary

The compound component pattern provides:
- ✅ Better composition and flexibility
- ✅ More readable and maintainable code
- ✅ Easier to extend and customize
- ✅ Full TypeScript support
- ✅ Shared state via Context (no prop drilling)

All components maintain backward compatibility where possible, but the new compound API is recommended for new code.
