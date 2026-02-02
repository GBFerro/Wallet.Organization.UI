---
agent: agent
---

## Best Practices for Components

### 1. Component Structure

#### File Organization
```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.styles.ts
│   │   ├── Button.types.ts
│   │   └── index.ts
│   └── ...
```

#### Base Component Template
```typescript
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './ComponentName.styles';
import type { ComponentNameProps } from './ComponentName.types';

export const ComponentName: React.FC<ComponentNameProps> = ({
  prop1,
  prop2,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      {/* Component content */}
    </View>
  );
};
```

---

### 2. TypeScript - Typing

#### Props Interface
```typescript
// ComponentName.types.ts
import { ViewStyle, TextStyle } from 'react-native';

export interface ComponentNameProps {
  // Required props
  title: string;
  onPress: () => void;

  // Optional props
  subtitle?: string;
  disabled?: boolean;

  // Customizable styles
  style?: ViewStyle;
  textStyle?: TextStyle;

  // Children
  children?: React.ReactNode;
}
```

#### Common Types
```typescript
// Use native React Native types
import { ViewProps, TextProps, TouchableOpacityProps } from 'react-native';

// Extend native props
export interface CustomButtonProps extends TouchableOpacityProps {
  variant: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}
```

---

### 3. Styling

#### StyleSheet
```typescript
// ComponentName.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
```

#### Dynamic Styles
```typescript
// Use function for conditional styles
const getButtonStyle = (variant: string, disabled: boolean) => [
  styles.button,
  variant === 'primary' && styles.buttonPrimary,
  disabled && styles.buttonDisabled,
];
```

---

### 4. Performance

#### React.memo
```typescript
export const ComponentName = React.memo<ComponentNameProps>(({
  prop1,
  prop2
}) => {
  // Component
}, (prevProps, nextProps) => {
  // Custom comparison (optional)
  return prevProps.id === nextProps.id;
});
```

#### useCallback and useMemo
```typescript
const handlePress = useCallback(() => {
  onPress?.();
}, [onPress]);

const computedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

---

### 5. Accessibility

```typescript
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Confirm button"
  accessibilityHint="Double tap to confirm action"
  accessibilityRole="button"
  accessibilityState={{ disabled: isDisabled }}
>
  <Text>Confirm</Text>
</TouchableOpacity>
```

---

### 6. General Best Practices

#### ✅ Do
- Use **functional components** with hooks
- Type **all props** and state
- Extract **complex logic** into custom hooks
- Use **constants** for fixed values (colors, sizes, etc.)
- Implement **error handling**
- Add **PropTypes** or runtime validation when needed
- Use **destructuring** for props
- Keep components **small and focused** (Single Responsibility)

#### ❌ Avoid
- Business logic inside UI components
- Complex inline styles
- Excessive props drilling (use Context or state management)
- Direct state mutation
- Anonymous functions in render props
- Components with more than 200 lines

---

### 7. Naming Conventions

```typescript
// Components: PascalCase
export const UserProfile: React.FC = () => {};

// Custom hooks: camelCase with 'use' prefix
export const useUserData = () => {};

// Constants: UPPER_SNAKE_CASE
export const MAX_ITEMS = 10;

// Utility functions: camelCase
export const formatDate = (date: Date) => {};

// Types/Interfaces: PascalCase with descriptive suffix
export interface UserProfileProps {}
export type ButtonVariant = 'primary' | 'secondary';
```

---

### 8. Complete Example

```typescript
// Button.types.ts
import { TouchableOpacityProps } from 'react-native';

export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  icon?: React.ReactNode;
}

// Button.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: '#8E8E93',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

// Button.tsx
import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { styles } from './Button.styles';
import type { ButtonProps } from './Button.types';

export const Button: React.FC<ButtonProps> = React.memo(({
  title,
  variant = 'primary',
  loading = false,
  icon,
  disabled,
  style,
  ...rest
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        style,
      ]}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={title}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <>
          {icon}
          <Text style={styles.text}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
});

Button.displayName = 'Button';

// index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button.types';
```

---

## Guidelines for the Agent

1. **Always** provide typed TypeScript code
2. **Follow** the file structure patterns presented
3. **Include** explanatory comments when necessary
4. **Consider** performance and accessibility
5. **Suggest** improvements when identifying code smells
6. **Adapt** examples to the specific project context
