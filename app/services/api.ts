import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ForecastResponse,
  Transaction,
  PeriodEnum,
  TransactionEnum,
  PaymentMethodEnum,
  RecurrenceEnum,
  CardEnum,
} from "@constants/api";

const API_BASE_URL = "https://parapodial-lamellarly-lue.ngrok-free.dev";
const TOKEN_KEY = "@finforecast:token";
const USER_KEY = "@finforecast:user";

interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

interface SignInRequest {
  email: string;
  password: string;
}

interface SignInResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface CreateTransactionRequest {
  description: string;
  date: string;
  type: TransactionEnum;
  payment: {
    amount: number;
    currency: string;
    frequency: RecurrenceEnum;
    installment?: number;
    method: PaymentMethodEnum;
    bankInfo: {
      name: string;
      card: CardEnum;
    };
  };
}

const defaultHeaders = {
  "Content-Type": "application/json",
  "ngrok-skip-browser-warning": "true",
};

async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  return {
    ...defaultHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function saveToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function removeToken(): Promise<void> {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USER_KEY);
}

export async function saveUser(user: SignInResponse["user"]): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<SignInResponse["user"] | null> {
  const user = await AsyncStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export async function signUp(data: SignUpRequest): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-up`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, message: error || "Erro ao criar conta" };
    }

    return { success: true };
  } catch (error) {
    console.error("Sign up error:", error);
    return { success: false, message: "Erro de conexao. Tente novamente." };
  }
}

export async function signIn(data: SignInRequest): Promise<{ success: boolean; message?: string; data?: SignInResponse }> {
  try {
    console.log("API: Calling sign-in endpoint...");
    const response = await fetch(`${API_BASE_URL}/api/auth/sign-in`, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify(data),
      mode: "cors",
    });

    console.log("API: Response status:", response.status);

    if (!response.ok) {
      const error = await response.text();
      console.log("API: Error response:", error);
      return { success: false, message: error || "Email ou senha incorretos" };
    }

    const result = await response.json();
    console.log("API: Login response:", JSON.stringify(result));

    // Handle different response formats - check nested data object
    const responseData = result.data || result;
    const token = responseData.accessToken || responseData.token || responseData.access_token ||
                  result.accessToken || result.token || result.access_token;

    const user = responseData.user || result.user || {
      id: responseData.id || responseData.userId || result.id || "user-" + Date.now(),
      name: responseData.username || responseData.name || responseData.userName ||
            result.username || result.name || data.email.split("@")[0],
      email: responseData.email || result.email || data.email,
    };

    console.log("API: Extracted token:", token ? "present" : "missing");
    console.log("API: Extracted user:", JSON.stringify(user));

    if (token) {
      await saveToken(token);
      await saveUser(user);
      return { success: true, data: { token, user } };
    }

    return { success: false, message: "Token nao recebido da API" };
  } catch (error: any) {
    console.error("Sign in error:", error);
    const errorMessage = error?.message?.includes("fetch")
      ? "Erro de conexao. Verifique se a API esta acessivel e permite CORS."
      : "Erro de conexao. Tente novamente.";
    return { success: false, message: errorMessage };
  }
}

export async function fetchForecast(period: PeriodEnum): Promise<ForecastResponse | null> {
  try {
    const headers = await getAuthHeaders();
    console.log("API: Fetching forecast for period:", period);

    const response = await fetch(
      `${API_BASE_URL}/api/forecast?Period=${period}`,
      { headers }
    );

    if (!response.ok) {
      console.error("Forecast error:", response.status);
      return null;
    }

    const result = await response.json();
    console.log("API: Forecast response received");

    // Handle different response formats - check nested data object
    const data = result.data || result;

    // The API might return projections directly or nested
    const projections = data.projections || data.items || data;
    const startDate = data.startDate || data.start_date || new Date().toISOString().split("T")[0];

    // If projections is an array, use it directly
    if (Array.isArray(projections) && projections.length > 0) {
      console.log("API: Found", projections.length, "projections");
      return {
        startDate,
        projections: projections.map((p: any) => ({
          date: p.date || p.Date,
          net: p.net ?? p.Net ?? 0,
          income: p.income ?? p.Income ?? 0,
          cardExpenses: p.cardExpenses ?? p.CardExpenses ?? 0,
          debitExpenses: p.debitExpenses ?? p.DebitExpenses ?? 0,
          otherExpenses: p.otherExpenses ?? p.OtherExpenses ?? 0,
          totalExpenses: p.totalExpenses ?? p.TotalExpenses ?? 0,
          currentAmount: p.currentAmount ?? p.CurrentAmount ?? p.balance ?? p.Balance ?? 0,
        })),
      };
    }

    console.log("API: No projections found in response");
    return null;
  } catch (error) {
    console.error("Fetch forecast error:", error);
    return null;
  }
}

function parseTransaction(t: any): Transaction {
  return {
    id: t.id || t.Id || t._id || `trans-${Date.now()}`,
    description: t.description || t.Description || "",
    date: t.date || t.Date || new Date().toISOString().split("T")[0],
    type: t.type || t.Type || TransactionEnum.Expense,
    payment: {
      id: t.payment?.id || t.Payment?.Id || `pay-${Date.now()}`,
      amount: t.payment?.amount ?? t.Payment?.Amount ?? t.amount ?? 0,
      currency: t.payment?.currency || t.Payment?.Currency || "BRL",
      frequency: t.payment?.frequency || t.Payment?.Frequency || RecurrenceEnum.OneTime,
      installment: t.payment?.installment || t.Payment?.Installment,
      method: t.payment?.method || t.Payment?.Method || PaymentMethodEnum.Pix,
      bankInfo: {
        id: t.payment?.bankInfo?.id || t.Payment?.BankInfo?.Id || `bank-${Date.now()}`,
        name: t.payment?.bankInfo?.name || t.Payment?.BankInfo?.Name || "Banco",
        card: t.payment?.bankInfo?.card || t.Payment?.BankInfo?.Card || CardEnum.Physical,
      },
    },
  };
}

export async function fetchTransactions(): Promise<{ success: boolean; data: Transaction[]; error?: string }> {
  try {
    const headers = await getAuthHeaders();
    console.log("API: Fetching transactions...");
    const response = await fetch(`${API_BASE_URL}/api/transactions`, { headers });

    if (!response.ok) {
      console.error("Transactions error:", response.status);
      return { success: false, data: [], error: `Erro ao carregar transacoes (${response.status})` };
    }

    const result = await response.json();
    console.log("API: Transactions response received");

    // Handle different response formats
    const responseData = result.data || result;
    const items = Array.isArray(responseData) ? responseData :
                  (responseData.items || responseData.transactions || []);

    if (Array.isArray(items)) {
      console.log("API: Found", items.length, "transactions");
      return {
        success: true,
        data: items.map(parseTransaction)
      };
    }

    return { success: true, data: [] };
  } catch (error) {
    console.error("Fetch transactions error:", error);
    return { success: false, data: [], error: "Erro de conexao ao carregar transacoes" };
  }
}

export async function createTransaction(data: CreateTransactionRequest): Promise<{ success: boolean; data?: Transaction; error?: string }> {
  try {
    const headers = await getAuthHeaders();
    console.log("API: Creating transaction...");
    const response = await fetch(`${API_BASE_URL}/api/transactions`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Create transaction error:", response.status, errorText);
      return { success: false, error: `Erro ao criar transacao (${response.status})` };
    }

    const result = await response.json();
    const transactionData = result.data || result;
    console.log("API: Transaction created successfully");
    return { success: true, data: parseTransaction(transactionData) };
  } catch (error) {
    console.error("Create transaction error:", error);
    return { success: false, error: "Erro de conexao ao criar transacao" };
  }
}

export async function updateTransaction(id: string, data: CreateTransactionRequest): Promise<{ success: boolean; data?: Transaction; error?: string }> {
  try {
    const headers = await getAuthHeaders();
    console.log("API: Updating transaction:", id);
    const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Update transaction error:", response.status, errorText);
      return { success: false, error: `Erro ao atualizar transacao (${response.status})` };
    }

    const result = await response.json();
    const transactionData = result.data || result;
    console.log("API: Transaction updated successfully");
    return { success: true, data: parseTransaction(transactionData) };
  } catch (error) {
    console.error("Update transaction error:", error);
    return { success: false, error: "Erro de conexao ao atualizar transacao" };
  }
}

export async function deleteTransaction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const headers = await getAuthHeaders();
    console.log("API: Deleting transaction:", id);
    const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      console.error("Delete transaction error:", response.status);
      return { success: false, error: `Erro ao excluir transacao (${response.status})` };
    }

    console.log("API: Transaction deleted successfully");
    return { success: true };
  } catch (error) {
    console.error("Delete transaction error:", error);
    return { success: false, error: "Erro de conexao ao excluir transacao" };
  }
}
