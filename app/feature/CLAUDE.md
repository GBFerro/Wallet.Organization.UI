# Feature screens

One folder per feature (`auth/`, `forecast/`, `settings/`, `transactions/`), each exporting a named `*Screen` component. Screens are wired by `@navigation/*`, not by file location.

## Data flow

There is no data-fetching library. Every screen owns its own state:

```tsx
const [items, setItems] = useState<T[]>([]);
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const [error, setError] = useState<string | null>(null);

const load = useCallback(async () => {
  const result = await fetchX(...);          // never throws — see @services/CLAUDE.md
  if (!result.isSuccess) { setItems([]); return; }
  setItems(result.data);
}, [...]);
```

Failed requests already produce a toast from the HTTP layer, so screens generally set empty state rather than rendering their own error text.

## Invalidation is manual

After any mutation, call `emitTransactionChange()` from `useEvent()`. `ForecastScreen` subscribes via `onTransactionChange(() => reload())` inside a `useEffect` and must return the unsubscribe function. This pub-sub (`@contexts/EventContext`) is the only cross-screen refresh mechanism — a mutation that skips the emit leaves the forecast stale.

## Screen composition

Wrap content in a `Screen*` wrapper from `@components/layout` (insets, background, horizontal padding) and use the shared state components rather than ad-hoc markup:

- `LoadingState` / `EmptyState` from `@components/molecules`
- `SearchBar`, `FAB` from `@components/atoms`
- `RefreshControl` on the list for pull-to-refresh
- Forms open in a React Native `Modal` (`TransactionsScreen` → `TransactionForm`), not as a route

`auth/` is the exception: `LoginScreen` and `RegisterScreen` are toggled by local state in `app/index.tsx` via `onRegister` / `onLogin` callbacks, and they call `login`/`register` from `useAuth()` — which return the raw `ApiResponse`, so check `isSuccess` there too.

## Business logic placement

Data shaping lives in the screen file as module-level pure functions (e.g. `groupByMonth` in `ForecastScreen.tsx`), above the component and outside render. Anything reusable across screens belongs in `@utils` or a hook in `@hooks`, not in a component.

Dates from the API are ISO strings; `ForecastScreen` deliberately uses `getUTCFullYear`/`getUTCMonth` when bucketing by month — using local getters shifts transactions into the wrong month for negative-offset timezones like pt-BR.
