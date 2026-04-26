export interface AuthUser {
  id: string;
  name: string;
  email: string;
  riskLevel?: "low" | "medium" | "high";
  lastLoginAt?: string;
}

export interface AuthTokenResponse {
  access_token: string;
  token_type?: string;
  user: AuthUser;
}

export interface RegisterInput {
  name: string;
  email: string;
  cpf: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
  passwordEncrypted?: boolean;
}

export type IncomeFrequency = "daily" | "weekly" | "monthly" | "irregular";

export interface FinancialDataInput {
  user_id: string;
  reference_month: string;
  monthly_income: number;
  income_frequency: IncomeFrequency;
  monthly_expenses: number;
}

export interface FinancialData {
  id: string;
  userId: string;
  referenceMonth: string;
  monthlyIncome: string;
  incomeFrequency: IncomeFrequency;
  monthlyExpenses: string;
  createdAt: string;
}

export interface ScoreInput {
  user_id: string;
  reference_month?: string;
}

export interface Score {
  id: string;
  userId: string;
  score: number;
  reason?: string;
  createdAt: string;
}

export type DecisionStatus = "approved" | "approved_with_risk" | "denied";

export interface DecisionInput {
  user_id: string;
  score_id?: string;
}

export interface Decision {
  id: string;
  userId: string;
  scoreId?: string;
  status: DecisionStatus;
  creditLimit: string;
  reason?: string;
  createdAt: string;
}

export interface ApiErrorPayload {
  error?: string;
  message?: string;
}
