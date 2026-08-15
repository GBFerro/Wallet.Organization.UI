# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Monexo** — React Native / Expo (SDK 54, New Architecture, React 19, React Compiler enabled) personal finance app in **Brazilian Portuguese**. Tracks income/expenses and renders a forward-looking cash-flow forecast from a .NET-style backend.

## Commands

```bash
npm run dev            # expo start (dev server)
npm run android        # expo start --android
npm run ios            # expo start --ios
npm run web            # expo start --web
npm run lint           # biome lint (check only)
npm run check          # biome check --write (lint + format + organize imports; run before committing)
npx tsc --noEmit       # typecheck (no npm script for this)
```

There is **no test framework configured** — no jest, no test files, no `npm test`. Do not invent test commands; if a change needs verification, run `npx tsc --noEmit` and `npm run lint`.

## Layered guidance

Subsystem-specific rules live next to the code. Read the relevant one before editing there:

| Area | File |
|---|---|
| Components (atomic design, compound pattern, NativeWind) | `app/components/CLAUDE.md` |
| API layer & auth token handling | `app/services/CLAUDE.md` |
| Navigation (hybrid Expo Router + React Navigation) | `app/navigation/CLAUDE.md` |
| Screens & feature state | `app/feature/CLAUDE.md` |
| Design tokens, domain enums, UI copy | `app/constants/CLAUDE.md` |

Longer-form component references (kept from earlier refactors, still accurate): `app/components/README.md`, `app/components/BEST_PRACTICES.md`, `app/components/COMPOUND_COMPONENTS.md`, and `DESIGN_SYSTEM.md` at the root.

## Architecture

### Routing is a hybrid — and mostly not Expo Router

`main` is `expo-router/entry`, so the **whole `app/` directory is the router root**. But there are only two real routes:

- `app/_layout.tsx` — provider stack + splash control
- `app/index.tsx` — auth gate: `isLoading` → spinner, unauthenticated → `LoginScreen`/`RegisterScreen` (toggled by local state, not routes), authenticated → `MainTabNavigator`

Everything below `app/index.tsx` is **React Navigation** (bottom tabs → native stacks), not file-based routing. Consequence: `app/components/**`, `app/services/**`, etc. are all registered by Expo Router as spurious routes (visible in `.expo/types/router.d.ts` and `/_sitemap`). This is pre-existing; **do not add files to `app/` expecting them to become screens**, and do not "fix" it by moving directories without checking every `@`-alias import.

### Provider stack (`app/_layout.tsx`, order matters)

```
ThemeProvider → ErrorBoundary → EventProvider → ToastProvider → (AuthProvider → AppContent) + ToastContainer
```

`ThemeProvider` is outermost because `ErrorFallback` and toasts need `useTheme()`. `ToastContainer` sits as a sibling of `AuthProvider` so toasts render above screens. `AppContent` calls `useApiToastIntegration()` — this is what wires the module-level toast handler in `@services/http-client` to the React toast context, so **API errors surface as toasts automatically**; without that hook mounted, HTTP errors are silent.

### Cross-screen invalidation via EventContext

There is no react-query / SWR. `app/contexts/EventContext.tsx` is a tiny pub-sub: after a screen mutates transactions it calls `emitTransactionChange()`, and `ForecastScreen` subscribes with `onTransactionChange(...)` to refetch. When adding a mutation, emit the event; when adding a screen that shows derived data, subscribe to it.

### Path aliases

Always import via aliases (`tsconfig.json`), never relative paths that climb out of a folder:

`@components/*` `@constants/*` `@hooks/*` `@services/*` `@contexts/*` `@utils/*` `@feature/*` `@navigation/*` `@assets/*`

## Cross-cutting conventions

- **Formatting is Biome, tabs, double quotes.** `npm run check` also sorts imports — expect it to rewrite import blocks.
- **Named exports everywhere**, except navigators and Expo Router route files, which must default-export.
- **Props are `Readonly<T>`**: `function Card({ ... }: Readonly<CardProps>)`.
- **Never hardcode colors, spacing, radii, or font sizes** — use `useTheme()` and `Spacing`/`BorderRadius`/`Typography`/`Effects` from `@constants/theme`.
- **Never hardcode user-facing strings** — add them to `TEXT` in `@constants/text`. All copy is pt-BR, written without accents in most places (`"Previsao"`, `"Cartao de Credito"`); match that.
- **`logger` from `@utils/logger`, not `console`** — it no-ops outside `__DEV__`.
- **No comments.** Not "few" — none. Make the information unnecessary with a better name, an extracted function, or a type; if it genuinely cannot live in the code, it belongs in a commit message or a doc, not in a `//`. JSDoc counts. The only exceptions are directives the toolchain reads: `@ts-ignore`, `@ts-expect-error`, `biome-ignore`. A `PostToolUse` hook (`.claude/hooks/no-comments.mjs`, wired in `.claude/settings.json`) blocks writes that add one.
- Biome's linter runs with `recommended: false` and a hand-picked rule set, so it will **not** catch `any`, unused imports in every case, or non-null assertions. Those are still forbidden by convention — enforce them by reading, not by trusting the linter.

## Known rough edges

Do not treat these as intentional patterns to copy:

- `TransactionCard/` still holds a monolithic `*.full.tsx` file with a `TODO` to split it into per-sub-component files like `Card/`, `MonthCard/` and `TransactionForm/` already are.
- The API base URL is a hardcoded ngrok tunnel in `app/services/http-client.ts` and goes stale whenever the tunnel restarts.
- `npx expo install --check` reports ~9 packages off their SDK 54 expected versions (`expo`, `expo-router`, `expo-font`, `@react-navigation/*`, …). `@react-navigation/native` is pinned at `7.1.28`, which is why `@react-navigation/native-stack` must stay at `7.11.0` — newer native-stack requires `native@^7.3.16`.
- `ThemeContext` persists under `@ledgernote:theme_mode` while everything else uses the `@monexo:` prefix (renaming it would silently reset users' theme choice).
