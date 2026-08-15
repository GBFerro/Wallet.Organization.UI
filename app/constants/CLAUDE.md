# Constants

Three files, three distinct jobs. Nothing here imports from `@components`, `@feature`, or `@services`.

## `theme.ts` — design tokens

Exports `Colors.light` / `Colors.dark` plus `Spacing`, `BorderRadius`, `Typography`, `Effects`. Full design-system documentation is in `/DESIGN_SYSTEM.md`.

Consume colors through the hook, never the raw object — it resolves light/dark for you:

```tsx
const { theme, isDark } = useTheme();   // @hooks/useTheme → useThemeContext()
<View style={{ backgroundColor: theme.primary, padding: Spacing.xl }} />
```

`Colors` is imported directly only by `ThemeContext` and by `useTheme`'s `Theme` type alias (`typeof Colors.light`). **`Colors.light` and `Colors.dark` must keep identical key sets** — that type alias, and every `theme.x` lookup, silently depends on it.

Hex literals live only in this file, as named locals (`primaryEmerald`, `softMint`, …) that the palettes reference. Add a semantic token rather than a raw hex anywhere else.

## `text.ts` — all user-facing copy

Single nested `TEXT` object (`nav`, `header`, `auth`, …). No string shown to a user should be written inline in a component. Copy is Brazilian Portuguese and, by existing convention, **written without diacritics** (`"Previsao"`, `"Faca login"`, `"Cartao de Credito"`) — match that rather than "fixing" the accents piecemeal.

## `api.ts` — domain model

Dates from the API are `CivilDate` (`"yyyy-MM-dd"`, no time, no offset — `DateOnly` server-side). **Never `new Date(civilDate)`** — that parses as UTC and slides every day-1 into the previous month in UTC-3. Use `parseCivilDate` from `@utils/format`.

The forecast series is **dense and ascending**: every day of the period is present, zeroed when there's no movement. So "has a projection" is always true — test `income > 0 || totalExpenses > 0` for actual movement. Expenses carry positive magnitude; only `netChange` is signed. Period totals come ready in `ForecastResponse.openingBalance`/`closingBalance` — don't derive them from the last projection.

Backend enums (`TransactionEnum`, `RecurrenceEnum`, `PaymentMethodEnum`, `CardEnum`, `PeriodEnum`) with string values that must match the backend exactly, the interfaces (`Transaction`, `Payment`, `BankInfo`, `Projection`, `ForecastResponse`), and a `*_LABELS` record per enum mapping each member to its pt-BR display string.

`TransactionPayload` is the write shape for `POST`/`PUT /api/transactions` and is deliberately narrower than `Transaction`: the server rejects `installment` outside `RecurrenceEnum.Monthly` and rejects a value below two parcels, while `bankInfo` is omitted entirely for non-card methods (`CARD_PAYMENT_METHODS` is the list that requires it). Sending a placeholder bank to satisfy the type is what the old form did — don't.

Every enum is paired with a full `Record<TheEnum, string>` label map — adding an enum member without adding its label is a TypeScript error, which is the intended safety net. Look up labels through the record; never `switch` on an enum to produce display text.
