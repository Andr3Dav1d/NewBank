/**
 * config.ts - Tipos e constantes do projeto
 * Consolidado para manter o projeto leve
 */

// ============================================================================
// TIPOS
// ============================================================================

export interface FinanceData {
  renda: string;
  frequencia: string;
  profissao: string;
  tempoAtividade: string;
  gastos: string;
  descricao: string;
  outrasRendas: boolean;
  recebeViaApp: boolean;
  consent: boolean;
}

// Tipos Decision e Score agora vêm de ../lib/types
import type { Decision, Score } from '../lib/types';

export interface Factor {
  label: string;
  value: number;
}

export interface CreditSimulatorData {
  rendaMensal: string;
  frequencia: string;
  atividade: string;
  tempoAtividade: string;
  gastoMedio: string;
}

export interface CreditResult {
  score: number;
  approvedValue: number;
  taxa: string;
  prazo: string;
  parcela: string;
}

// ============================================================================
// CONSTANTES - FORMULÁRIO
// ============================================================================

export const FINANCIAL_OPTIONS = {
  renda: [
    { value: "ate-2000", label: "Até R$ 2.000" },
    { value: "2000-5000", label: "R$ 2.000–5.000" },
    { value: "5000-10000", label: "R$ 5.000–10.000" },
    { value: "maior-10000", label: "Acima de R$ 10.000" },
  ] as const,

  frequencia: [
    { value: "diaria", label: "Diária" },
    { value: "semanal", label: "Semanal" },
    { value: "mensal", label: "Mensal" },
    { value: "irregular", label: "Irregular" },
  ] as const,

  tempo: [
    { value: "menos-6-meses", label: "Menos de 6 meses" },
    { value: "6-12-meses", label: "6 meses – 1 ano" },
    { value: "mais-1-ano", label: "1+ ano" },
  ] as const,
} as const;

export const SIMULATOR_OPTIONS = {
  rendaMensal: ["até 2.000", "2.001-5.000", "5.001-10.000", "acima de 10.000"],
  frequencia: ["Mensal", "Quinzenal", "Semanal"],
  atividade: ["Empregado", "Autônomo", "Microempreendedor", "Estudante"],
  tempoAtividade: ["Menos de 1 ano", "1-2 anos", "Mais de 2 anos"],
} as const;

export const FIELD_VALIDATIONS = {
  profissao: { minLength: 3, maxLength: 100 },
  descricao: { maxLength: 500 },
} as const;

// ============================================================================
// CONSTANTES - RESULTADO
// ============================================================================

export const INTEREST_RATES = {
  excellent: { min: 700, rate: 1.99 },
  good: { min: 500, rate: 2.99 },
  fair: { min: 0, rate: 4.49 },
} as const;

export const ANALYSIS_STAGES = ["Coletando dados", "Analisando perfil", "Calculando score"];

// ============================================================================
// FUNÇÕES HELPER
// ============================================================================

export function getInterestRateByScore(score: number): string {
  if (score > 80) return "1,7% a.m.";
  if (score > 65) return "1,9% a.m.";
  return "2,2% a.m.";
}

export function getTenorByScore(score: number): string {
  return score > 80 ? "36 meses" : "24 meses";
}

export function formatCurrency(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return `R$ ${digits.replace(/(\d)(?=(\d{3})+$)/g, "$1.")}`;
}

export function computeScoreAndCredit(data: CreditSimulatorData): CreditResult {
  const incomeScore = {
    "até 2.000": 10,
    "2.001-5.000": 24,
    "5.001-10.000": 36,
    "acima de 10.000": 45,
  }[data.rendaMensal] || 8;

  const freqScore = {
    Mensal: 18,
    Quinzenal: 12,
    Semanal: 8,
  }[data.frequencia] || 6;

  const activityScore = {
    Empregado: 20,
    Autônomo: 14,
    Microempreendedor: 12,
    Estudante: 8,
  }[data.atividade] || 6;

  const timeScore = {
    "Mais de 2 anos": 18,
    "1-2 anos": 12,
    "Menos de 1 ano": 6,
  }[data.tempoAtividade] || 4;

  const expense = Number(data.gastoMedio.replace(/\D/g, ""));
  const expenseScore = expense > 0 ? Math.max(0, 15 - Math.floor(expense / 1200)) : 0;

  const score = Math.min(100, incomeScore + freqScore + activityScore + timeScore + expenseScore);

  const estimatedIncome = {
    "até 2.000": 1800,
    "2.001-5.000": 3800,
    "5.001-10.000": 7600,
    "acima de 10.000": 12000,
  }[data.rendaMensal] || 1800;

  const approvedValue = Math.max(
    1200,
    Math.min(25000, Math.round((estimatedIncome - expense * 0.25) * 1.15))
  );

  const taxa = getInterestRateByScore(score);
  const prazo = getTenorByScore(score);
  const monthsCount = prazo === "36 meses" ? 36 : 24;
  const parcela = `R$ ${Math.round(approvedValue / monthsCount).toLocaleString("pt-BR")}`;

  return { score, approvedValue, taxa, prazo, parcela };
}