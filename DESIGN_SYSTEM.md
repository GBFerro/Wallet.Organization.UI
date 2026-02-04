# Monexo Design System

**Philosophy:** Calm, Premium, Minimal, Data-First

Monexo is a modern financial application that emphasizes clarity, trust, and premium aesthetics through minimalism and generous whitespace. The design system balances data-first functionality with a calm, approachable interface.

---

## Color Palette

### Primary Colors

#### Emerald Refined - Main Brand Color
- **Hex:** `#1A9B7F`
- **HSL:** `165° 65% 38%`
- **Usage:** Main brand color, call-to-actions, positive trends, income indicators
- **Foreground:** `#FFFFFF` (white text on Emerald)

```typescript
// Access via theme
theme.primary         // #1A9B7F
theme.primaryLight    // #4DB8A1
```

#### Soft Mint - Secondary Surface
- **Hex:** `#E8F3F0`
- **HSL:** `165° 30% 94%`
- **Usage:** Backgrounds for pills, secondary elements, card headers
- **Foreground:** `#147A65` (dark emerald text)

```typescript
theme.backgroundSecondary  // #E8F3F0
theme.cardHeader          // #E8F3F0
```

#### Deep Navy - Accent & High Contrast
- **Hex:** `#1F3A5F`
- **HSL:** `215° 45% 20%`
- **Usage:** Key text, high contrast elements, tertiary backgrounds
- **Foreground:** `#FFFFFF`

```typescript
theme.backgroundTertiary  // Deep Navy in dark mode contexts
```

### Neutral Colors

#### Off-White - Background
- **Hex:** `#F9FAFB`
- **HSL:** `210° 20% 98%`
- **Usage:** Main app background, provides breathing room

```typescript
theme.backgroundRoot  // #F9FAFB
```

#### Charcoal - Primary Text
- **Hex:** `#3A4A5C`
- **HSL:** `215° 25% 27%`
- **Usage:** Primary text color (softer than pure black for calm feel)

```typescript
theme.text  // #3A4A5C
```

#### Pale Gray - Muted Elements
- **Hex:** `#F3F4F6`
- **HSL:** `210° 20% 96%`
- **Usage:** Subtle backgrounds, borders, disabled states

```typescript
theme.backgroundTertiary  // #F3F4F6 (light mode)
theme.border             // #E5E7EB (slightly darker)
```

### Status Colors

#### Soft Red - Destructive/Negative
- **Hex:** `#EF5350`
- **HSL:** `0° 84% 60%`
- **Usage:** Error states, negative trends, expense indicators, destructive actions
- **Foreground:** `#F9FAFB`

```typescript
theme.error     // #EF5350
theme.expense   // #EF5350
```

### Chart Colors

Five-color palette for data visualization:

1. **Primary Emerald** - `#1A9B7F` (HSL 165° 65% 38%)
2. **Soft Blue** - `#5A7BA6` (HSL 215° 45% 40%)
3. **Warm Gold** - `#F4C430` (HSL 45° 90% 60%)
4. **Soft Coral** - `#E57373` (HSL 12° 76% 61%)
5. **Muted Purple** - `#9575CD` (HSL 260° 40% 60%)

```typescript
// Access chart colors
theme.chart1  // Emerald
theme.chart2  // Soft Blue
theme.chart3  // Warm Gold
theme.chart4  // Soft Coral
theme.chart5  // Muted Purple
```

### Dark Mode Palette

- **Background Root:** `#0F1419` (deep dark)
- **Background Default:** `#1A1F26` (elevated surface)
- **Background Secondary:** `#1A4A3F` (dark mint)
- **Primary:** `#22C39F` (lighter Emerald for contrast)
- **Text:** `#E5E7EB` (light foreground)

---

## Typography

### Font Families

#### Manrope - Display & Headings
- **Weight:** 600–700
- **Usage:** Hero headings, section titles, product name
- **Character:** Modern, geometric, professional

```typescript
Typography.h1    // 48px, weight 700
Typography.h2    // 32px, weight 700
Typography.h3    // 24px, weight 600
```

#### Inter - Body & UI
- **Weight:** 400–500
- **Usage:** Body copy, navigation, labels, buttons, captions
- **Character:** Highly readable, clean, versatile

```typescript
Typography.body        // 16px, weight 400
Typography.bodyLarge   // 18px, weight 400
Typography.label       // 16px, weight 500
Typography.caption     // 13px, weight 400
Typography.captionSmall // 12px, weight 400
```

#### JetBrains Mono - Data & Code
- **Weight:** 600
- **Usage:** Currency values, data tables, code blocks
- **Character:** Monospace, technical, precise

```typescript
Typography.currency  // 16px, weight 600
```

### Type Scale

| Token | Size | Weight | Family | Usage |
|-------|------|--------|--------|-------|
| h1 | 48px | 700 | Manrope | Hero headings |
| h2 | 32px | 700 | Manrope | Section titles |
| h3 | 24px | 600 | Manrope | Subsection headings |
| body | 16px | 400 | Inter | Body text |
| bodyLarge | 18px | 400 | Inter | Emphasized body |
| label | 16px | 500 | Inter | Form labels, buttons |
| caption | 13px | 400 | Inter | Helper text |
| captionSmall | 12px | 400 | Inter | Micro text |
| currency | 16px | 600 | JetBrains Mono | Financial values |

---

## Spacing

Consistent spacing scale for layouts and components:

```typescript
Spacing.xs    // 4px
Spacing.sm    // 8px
Spacing.md    // 12px
Spacing.lg    // 16px
Spacing.xl    // 20px
Spacing.2xl   // 24px
Spacing.3xl   // 32px
Spacing.4xl   // 40px
Spacing.5xl   // 48px

// Component-specific
Spacing.inputHeight   // 48px
Spacing.buttonHeight  // 52px
Spacing.fabSize       // 56px
```

**Guidelines:**
- Use `xl` (20px) for horizontal screen padding
- Use `2xl` (24px) for section spacing
- Use `md`–`lg` for internal component padding
- Prioritize generous whitespace for calm aesthetic

---

## Border Radius

Rounded geometry creates soft, approachable feel:

```typescript
BorderRadius.xs    // 4px
BorderRadius.sm    // 8px
BorderRadius.md    // 12px
BorderRadius.lg    // 16px (base radius, 1rem)
BorderRadius.xl    // 20px
BorderRadius.2xl   // 24px
BorderRadius.3xl   // 32px
BorderRadius.full  // 9999px (fully rounded)
```

**Usage:**
- Cards: `2xl` (24px) for prominent elevation
- Buttons: `full` for pill shape
- Input fields: `lg` (16px)
- Icons/avatars: `full` for circular
- Pills/chips: `full` or `lg`

---

## Effects

### Shadows

#### Soft Shadow (Subtle Elevation)
```typescript
Effects.softShadow
// shadowColor: #000000
// shadowOffset: { width: 0, height: 4 }
// shadowOpacity: 0.05
// shadowRadius: 20
// elevation: 2

// CSS equivalent: 0 4px 20px -2px rgba(0, 0, 0, 0.05)
```

#### Card Shadow
```typescript
Effects.cardShadow
// elevation: 4
// Same as softShadow but more prominent
```

#### Primary Glow (Emerald Glow)
```typescript
Effects.primaryGlow
// shadowColor: #1A9B7F (Emerald)
// shadowOffset: { width: 0, height: 0 }
// shadowOpacity: 0.3
// shadowRadius: 20

// CSS equivalent: 0 0 20px -5px rgba(26, 155, 127, 0.3)
```

### Glassmorphism

#### Glass Effect
```typescript
Effects.glass
// backgroundColor: rgba(255, 255, 255, 0.8)
// Web: backdrop-filter: blur(12px)
```

**Tailwind:** `bg-white/80 backdrop-blur-md border-white/20`

#### Glass Card
```typescript
Effects.glassCard
// backgroundColor: rgba(255, 255, 255, 0.6)
// Web: backdrop-filter: blur(16px)
```

**Tailwind:** `bg-white/60 backdrop-blur-lg border-white/40 shadow-soft`

### Focus Ring (Accessibility)
```typescript
Effects.focusRing
// borderColor: #1A9B7F
// borderWidth: 2
// shadowColor: #1A9B7F
// shadowOpacity: 0.3
// shadowRadius: 8
```

---

## Motion & Animation

### Spring Configuration
Standard spring animation for all interactive elements:

```typescript
const springConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
  energyThreshold: 0.001,
};
```

### Press Scale Animation
Standard press interaction (1 → 0.98):

```typescript
import { usePressScale } from "@utils/animations";

const { animatedStyle, onPressIn, onPressOut } = usePressScale(0.98);
```

### FieldMotion Component
Declarative enter/exit animations:

```tsx
<FieldMotion
  fieldMotion={{
    from: { opacity: 0, translateY: 8 },
    to: { opacity: 1, translateY: 0 },
    type: 'spring',
    duration: 300,
    delay: 0
  }}
>
  <Component />
</FieldMotion>
```

**Properties:**
- `from/to` - opacity, translateY, scale
- `type` - 'spring' or 'timing'
- `duration` - milliseconds (default 300)
- `delay` - milliseconds (default 0)

---

## Component Patterns

### Button Variants

```tsx
// Primary (Emerald background)
<Button className="bg-primary">Save</Button>

// Secondary (Soft Mint background)
<Button className="bg-secondary">Cancel</Button>

// Destructive (Soft Red background)
<Button className="bg-destructive">Delete</Button>
```

### Card Elevation Levels

```tsx
<Card elevation={1}>  {/* backgroundDefault - white */}
<Card elevation={2}>  {/* backgroundSecondary - soft mint */}
<Card elevation={3}>  {/* backgroundTertiary - pale gray */}
```

### Glassmorphism Card (Web)

```tsx
<View className="bg-white/60 backdrop-blur-lg border border-white/40 shadow-soft rounded-2xl p-6">
  {/* Glass card content */}
</View>
```

---

## Tailwind CSS Integration

### Color Classes

```css
/* Primary */
bg-primary text-primary-foreground border-primary

/* Secondary */
bg-secondary text-secondary-foreground

/* Backgrounds */
bg-background bg-background-secondary bg-background-tertiary

/* Text */
text-foreground text-foreground-secondary

/* Charts */
bg-chart-1 bg-chart-2 bg-chart-3 bg-chart-4 bg-chart-5

/* Status */
bg-destructive text-destructive-foreground
```

### Utilities

```css
/* Shadows */
shadow-soft shadow-glow shadow-card shadow-focus

/* Glassmorphism */
backdrop-blur-glass backdrop-blur-glass-card

/* Border radius */
rounded-lg  /* 16px - base */
rounded-2xl /* 24px - cards */
rounded-full /* pills, buttons */
```

---

## Best Practices

### 1. **Whitespace is Premium**
- Use generous padding (`Spacing.xl`, `Spacing.2xl`)
- Avoid cramped layouts
- Let content breathe

### 2. **Theme Constants Only**
- Never hardcode colors: ❌ `#1A9B7F`
- Always use theme: ✅ `theme.primary`
- Never hardcode spacing: ❌ `padding: 20`
- Always use constants: ✅ `padding: Spacing.xl`

### 3. **Accessibility First**
- Use `Effects.focusRing` for keyboard navigation
- Ensure color contrast (Charcoal text on Off-White = WCAG AAA)
- Add accessible labels to interactive elements

### 4. **Motion Guidelines**
- Use spring config for natural feel
- Press scale: 1 → 0.98
- Entrance animations: fade + slide up (8px)
- Keep animations under 300ms

### 5. **Glassmorphism (Web Only)**
- Use sparingly for premium feel
- Apply to overlays, modals, floating elements
- Combine with soft shadows
- Ensure sufficient backdrop content

---

## File References

- **Theme Constants:** `app/constants/theme.ts`
- **Tailwind Config:** `tailwind.config.js`
- **Animation Utilities:** `app/utils/animations.ts`
- **FieldMotion Component:** `app/components/FieldMotion/FieldMotion.tsx`
- **Design Token Usage:** `app/hooks/useTheme.ts`
- **Copilot Instructions:** `.github/copilot-instructions.md`

---

## Quick Reference

```typescript
// Import theme
import { useTheme } from "@hooks/useTheme";
const { theme, isDark } = useTheme();

// Import constants
import { Spacing, BorderRadius, Typography, Effects } from "@constants/theme";

// Use in components
<View style={{
  backgroundColor: theme.primary,
  padding: Spacing.xl,
  borderRadius: BorderRadius.lg,
  ...Effects.softShadow
}}>
  <ThemedText type="h2">Monexo</ThemedText>
</View>

// Tailwind alternative
<View className="bg-primary p-5 rounded-lg shadow-soft">
  <Text className="text-2xl font-bold text-primary-foreground">Monexo</Text>
</View>
```

---

**Last Updated:** February 2026
**Version:** 1.0.0
**Design System:** Monexo
