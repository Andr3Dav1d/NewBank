import type {
  ApiErrorPayload,
  AuthTokenResponse,
  AuthUser,
  Decision,
  DecisionInput,
  FinancialData,
  FinancialDataInput,
  LoginInput,
  RegisterInput,
  Score,
  ScoreInput,
} from "./types";

const API_BASE_URL = "https://api-newbank.adav1d-vps.mywire.org";

export class ApiError extends Error {
  readonly status: number;
  readonly payload?: ApiErrorPayload;

  constructor(status: number, message: string, payload?: ApiErrorPayload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const parsed = text ? tryParseJson(text) : undefined;

  if (!response.ok) {
    const payload = isApiErrorPayload(parsed) ? parsed : undefined;
    const message =
      payload?.message ||
      payload?.error ||
      `Falha na requisição (${response.status})`;
    throw new ApiError(response.status, message, payload);
  }

  return (parsed as T) ?? ({} as T);
}

function tryParseJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function isApiErrorPayload(payload: unknown): payload is ApiErrorPayload {
  if (!payload || typeof payload !== "object") return false;
  const candidate = payload as ApiErrorPayload;
  return typeof candidate.error === "string" || typeof candidate.message === "string";
}

export const api = {
  register(input: RegisterInput) {
    return request<AuthUser>("/auth/register", { method: "POST", body: input });
  },

  login(input: LoginInput) {
    return request<AuthTokenResponse>("/auth/login", { method: "POST", body: input });
  },

  me(token: string) {
    return request<AuthUser>("/auth/me", { token });
  },

  createFinancialData(input: FinancialDataInput, token?: string) {
    return request<FinancialData>("/financial-data", { method: "POST", body: input, token });
  },

  createScore(input: ScoreInput, token?: string) {
    return request<Score>("/scores", { method: "POST", body: input, token });
  },

  createDecision(input: DecisionInput, token?: string) {
    return request<Decision>("/decisions", { method: "POST", body: input, token });
  },
};

export { API_BASE_URL };
