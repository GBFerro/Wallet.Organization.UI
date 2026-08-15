# Services (API layer)

All backend I/O goes through `http-client.ts`. Feature code must never call `axios` or `fetch` directly.

## The response envelope

Every endpoint returns the same shape, and **`request()` never throws** — network and HTTP failures are converted into a failed envelope:

```ts
interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;                             // {} as T on failure — not null
  errors: { code: string; message: string }[];
  warnings: { code: string; message: string }[];
}
```

So callers branch on `isSuccess`, never `try/catch`:

```ts
const result = await fetchTransactions({ type });
if (!result.isSuccess) { setTransactions([]); return; }
setTransactions(result.data);
```

Because `data` is `{} as T` on failure, reading `result.data.length` before checking `isSuccess` is a real crash risk — several service functions currently log it unguarded.

## Backend quirks the client compensates for

These are confirmed against the backend source — don't "simplify" the code that handles them:

- **Business errors come back as HTTP 500**, not 4xx. `BaseController.ToStatusCode` switches on `ErrorType` names while every emitted code is a dotted catalog key, so nothing matches and it defaults to 500 — with a perfectly valid envelope in the body. Since axios rejects on any non-2xx, the `catch` block **must** read `error.response.data`; that's what `asApiResponse()` is for. **Branch on `errors[0].code`, never on HTTP status.**
- **`code` is a catalog key** (`error.forecast.period-invalid`); **`message` is the human text**, already translated server-side to the request culture. Toasts show `message`. The 401 path swaps the two, which is why `humanText()` falls back when the chosen field looks like a key.
- **401 and unhandled-500 break the envelope.** `OnChallenge` emits `{ errors, warnings, isSuccess }` with no `data`; `GlobalExceptionHandler` emits a bare `{ code, message, traceId }` outside the envelope entirely. `asApiResponse()` normalises the first and rejects the second.
- **Model-binding failures never reach the envelope at all.** An unparseable enum in the query string (`?type=lixo`) or a body missing a `required` property answers with raw ASP.NET `ProblemDetails` (`{ title, status, errors: { Field: [msg] } }`). `asProblemDetails()` converts it, otherwise the real cause would surface as a generic "erro de conexao" toast.
- **`GET /api/transactions` warns on an empty list.** A successful empty response carries `warnings: [{ code: "Transactions.Empty" }]`, so `fetchTransactions` passes `showWarnings: false` — the screen's empty state already says it.
- **`DELETE` always answers 202 with `{ deleted: boolean }`.** Deleting an id that does not exist is `isSuccess: true` with `deleted: false`; check the flag, not just `isSuccess`.

## Automatic error toasts

`http-client.ts` holds a module-level `toastHandler`, installed by `setToastHandler()` from the `useApiToastIntegration()` hook mounted in `app/_layout.tsx`. When `isSuccess` is false, every `errors[]` entry becomes an error toast and every `warnings[]` entry a warning toast.

Pass `showToast: false` in the request config to suppress this and handle errors in the UI yourself.

## Request config

`RequestConfig` extends `AxiosRequestConfig` with:

- `requiresAuth` (default `false`) — attaches `Authorization: Bearer <token>` read from AsyncStorage. **Almost every real endpoint needs `requiresAuth: true`;** forgetting it yields a silent 401-shaped failure.
- `showToast` (default `true`), `showWarnings` (default `true`, suppresses only the warning toasts), `skipErrorLog` (default `false`)
- `params` — serialized as query string by axios; prefer this over hand-building URLs (`forecast.ts` still interpolates `?Period=` inline).

Default headers include `ngrok-skip-browser-warning: true`, required by the tunnelled backend.

## Layout

| File | Responsibility |
|---|---|
| `http-client.ts` | axios wrapper, envelope, auth headers, toast bridge, `API_BASE_URL` |
| `auth.ts` | `signIn` / `signUp`; persists access + refresh token and user on success |
| `transactions.ts` | CRUD on `/api/transactions` |
| `forecast.ts` | `/api/forecast?Period=` |
| `storage.ts` | AsyncStorage wrapper for token + user |
| `index.ts` | public barrel — add new exports here |

## Session and token refresh

The access token lives one hour. A 401 on a `requiresAuth` request is never handed back to the caller as-is — it always ends in one of two states:

1. **Renewed.** `http-client` posts the stored refresh token to `/api/auth/refresh-token`, saves the new pair and replays the original request once (`allowRefresh: false`, so a second 401 cannot loop). Parallel requests that expire together share one in-flight refresh.
2. **Session over.** Refresh rejected, *or no refresh token stored at all* (a session created before refresh tokens were persisted). `endSession()` drops both tokens, toasts once and fires `sessionExpiredHandler` — `AuthProvider` installs `logout` there, and the absent user sends `app/index.tsx` back to `LoginScreen`. The caller gets a failed envelope with code `error.auth.session-expired`.

`endSession()` runs once per session so five screens expiring together produce one toast and one logout; `markSessionActive()` (called by `persistSession` after a sign-in) re-arms it, so a later expiry still logs the user out. The trap to avoid is returning early on a missing refresh token: that strands the user on an authenticated screen where every call 401s.

**Logging out is a native teardown, so it must never run mid-transition.** Dropping the user swaps `MainTabNavigator` for `LoginScreen` in `app/index.tsx`, unmounting the whole `react-native-screens` tree; doing that while the tree is still mounting closes the app with no JS error at all. Two rules follow:

- `AuthProvider` fires the session-expired logout inside `InteractionManager.runAfterInteractions`.
- `checkAuth` refuses to restore a session that has no refresh token — it cannot survive its first 401, and mounting the tabs only to tear them down a frame later is exactly the crash above.

`POST /api/auth/sign-up` returns the created user, **not** a token — registering still requires a sign-in afterwards (`AuthContext.register` chains them). Its body field is `username`, not `name`, and the password must have 8+ chars with upper, lower and digit.

## Storage keys

`@monexo:token`, `@monexo:refresh-token` and `@monexo:user`. `TOKEN_KEY` and `REFRESH_TOKEN_KEY` are duplicated as literals in `http-client.ts` — change both together. (`ThemeContext` uses the older `@ledgernote:theme_mode`; leave it alone.)

## Base URL

`API_BASE_URL` in `http-client.ts` is a hardcoded ngrok tunnel that changes whenever the tunnel restarts. "All requests suddenly fail" is usually this, not a code bug.
