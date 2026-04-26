import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Login.css";

import {
  SIMULATOR_OPTIONS,
  ANALYSIS_STAGES,
  formatCurrency,
  type CreditSimulatorData,
} from "../state/appState";
import { ApiError, api } from "../lib/api";
import { clearAuthSession, getAccessToken, getAuthUser, hasRequiredConsent, isAuthenticated } from "../lib/auth";
import type { DecisionStatus } from "../lib/types";

interface SimulatorApiResult {
  score: number;
  decisionStatus: DecisionStatus;
  creditLimit: number;
  reason: string;
}

const DEFAULT_SIMULATOR_DATA: CreditSimulatorData = {
  rendaMensal: "",
  frequencia: "",
  atividade: "",
  tempoAtividade: "",
  gastoMedio: "",
};

export default function CreditSimulator() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  const [formData, setFormData] = useState(DEFAULT_SIMULATOR_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState<"idle" | "running" | "done">("idle");
  const [result, setResult] = useState<SimulatorApiResult | null>(null);
  const [submitError, setSubmitError] = useState("");

  const isAnalyzing = analysisStage === "running";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    const formatted = name === "gastoMedio" ? formatCurrency(value) : value;

    setFormData((prev) => ({ ...prev, [name]: formatted }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.rendaMensal) newErrors.rendaMensal = "Selecione sua renda";
    if (!formData.frequencia) newErrors.frequencia = "Selecione a frequência";
    if (!formData.gastoMedio) newErrors.gastoMedio = "Informe o gasto";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getReferenceMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}-01`;
  };

  const parseCurrencyToNumber = (value: string) => Number(value.replace(/\D/g, "")) || 0;

  const mapIncomeToNumber = (incomeLabel: string) => {
    const map: Record<string, number> = {
      "até 2.000": 1800,
      "2.001-5.000": 3800,
      "5.001-10.000": 7600,
      "acima de 10.000": 12000,
    };
    return map[incomeLabel] || 1800;
  };

  const mapFrequencyToApiValue = (frequency: string): "daily" | "weekly" | "monthly" | "irregular" => {
    const map: Record<string, "daily" | "weekly" | "monthly" | "irregular"> = {
      Mensal: "monthly",
      Quinzenal: "weekly",
      Semanal: "weekly",
    };
    return map[frequency] || "irregular";
  };

  const getStatusLabel = (status: DecisionStatus) => {
    if (status === "approved") return "Aprovado";
    if (status === "approved_with_risk") return "Aprovado com ressalvas";
    return "Negado";
  };

  const buildResult = (scoreValue: number, status: DecisionStatus, creditLimitRaw: string, reason?: string): SimulatorApiResult => {
    const creditLimit = Number(creditLimitRaw) || 0;
    return {
      score: scoreValue,
      decisionStatus: status,
      creditLimit,
      reason: reason || "Análise concluída com sucesso.",
    };
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const token = getAccessToken();
    const user = getAuthUser();
    if (!token || !user) {
      navigate("/login");
      return;
    }

    setSubmitError("");
    setAnalysisStage("running");
    setAnalysisProgress(0);
    setResult(null);

    const interval = setInterval(() => {
      setAnalysisProgress((prev) => Math.min(92, prev + Math.floor(Math.random() * 8) + 4));
    }, 180);

    try {
      const referenceMonth = getReferenceMonth();

      await api.createFinancialData({
        user_id: user.id,
        reference_month: referenceMonth,
        monthly_income: mapIncomeToNumber(formData.rendaMensal),
        income_frequency: mapFrequencyToApiValue(formData.frequencia),
        monthly_expenses: parseCurrencyToNumber(formData.gastoMedio),
      }, token);

      const score = await api.createScore({
        user_id: user.id,
        reference_month: referenceMonth,
      }, token);

      const decision = await api.createDecision({
        user_id: user.id,
        score_id: score.id,
      }, token);

      const nextResult = buildResult(score.score, decision.status, decision.creditLimit, decision.reason || score.reason);
      setResult(nextResult);
      setAnalysisProgress(100);
      setAnalysisStage("done");
    } catch (error) {
      setAnalysisStage("idle");
      setAnalysisProgress(0);

      if (error instanceof ApiError) {
        if (error.status === 401) {
          clearAuthSession();
          navigate("/login");
          return;
        }
        setSubmitError(error.message || "Falha ao processar simulação no servidor.");
      } else {
        setSubmitError("Erro inesperado ao simular crédito.");
      }
    } finally {
      clearInterval(interval);
    }
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const user = getAuthUser();
    if (!user || !hasRequiredConsent(user.id)) {
      navigate("/consent");
    }
  }, [navigate]);

  const currentStage = useMemo(() => {
    if (!isAnalyzing) return "";
    if (analysisProgress < 35) return ANALYSIS_STAGES[0];
    if (analysisProgress < 75) return ANALYSIS_STAGES[1];
    return ANALYSIS_STAGES[2];
  }, [analysisProgress, isAnalyzing]);

  return (
    <div className="auth-page">
      <div className="login-card auth-card auth-card--simulator shadow-lg w-100">
        <div className="row g-0">

          {/* ESQUERDA - IDENTIDADE */}
          <div className="col-md-5 d-none d-md-flex flex-column justify-content-center p-4 text-white bg-gradient-bank">
            <h2 className="fw-bold">NewBank</h2>
            <p className="small opacity-75">Simulação inteligente</p>

            <div className="mt-4 text-center">
              <img src="/celula.png" className="worker-img" alt="" />
              <h5 className="fw-bold mt-3">
                Descubra seu crédito em segundos
              </h5>
            </div>

            <div className="mt-4">
              <div className="feature-tag d-flex align-items-center gap-2">
                <i className="bi bi-lightning-charge-fill"></i>
                <span>Análise rápida</span>
              </div>
              <div className="feature-tag d-flex align-items-center gap-2">
                <i className="bi bi-shield-lock-fill"></i>
                <span>100% seguro</span>
              </div>
            </div>
          </div>

          {/* DIREITA - CONTEÚDO */}
          <div className="col-12 col-md-7 p-4 p-md-5">
            <div className="d-flex justify-content-end mb-3">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
                Sair
              </button>
            </div>

            <div className="text-center text-md-start mb-4">
              <h3 className="fw-bold">Simular crédito</h3>
              <p className="text-muted small">
                Descubra seu limite na hora
              </p>
            </div>

            {/* FORM */}
            {!isAnalyzing && !result && (
              <form onSubmit={handleSubmit}>
                <div className="row">

                  {[
                    { name: "rendaMensal", label: "Renda mensal", options: SIMULATOR_OPTIONS.rendaMensal },
                    { name: "frequencia", label: "Frequência", options: SIMULATOR_OPTIONS.frequencia },
                  ].map((field) => (
                    <div className="col-12 mb-3" key={field.name}>
                      <label className="form-label small fw-bold text-secondary">
                        {field.label}
                      </label>
                      <select
                        name={field.name}
                        className={`form-select ${errors[field.name] ? "is-invalid" : ""}`}
                        value={(formData as any)[field.name]}
                        onChange={handleChange}
                      >
                        <option value="">Selecione</option>
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}

                  <div className="col-12 mb-4">
                    <label className="form-label small fw-bold text-secondary">
                      Gasto médio
                    </label>
                    <input
                      type="text"
                      name="gastoMedio"
                      className={`form-control ${errors.gastoMedio ? "is-invalid" : ""}`}
                      value={formData.gastoMedio}
                      onChange={handleChange}
                      placeholder="R$ 0"
                    />
                  </div>

                </div>

                <button className="btn btn-success w-100 fw-bold">
                  Simular crédito
                </button>

                {submitError && (
                  <div className="alert alert-danger mt-3 mb-0" role="alert">
                    {submitError}
                  </div>
                )}
              </form>
            )}

            {/* ANALISE */}
            {isAnalyzing && (
              <div className="text-center">
                <h5 className="fw-bold mb-3">Analisando...</h5>

                <div className="progress mb-3">
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${analysisProgress}%` }}
                  />
                </div>

                <p className="text-muted small">{currentStage}</p>
              </div>
            )}

            {/* RESULTADO */}
            {result && (
              <div className="text-center">
                <h5 className="fw-bold mb-4">Resultado</h5>

                <div
                  className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: 90, height: 90 }}
                >
                  <span className="fw-bold fs-4">{result.score}</span>
                </div>

                <p className="text-muted small mb-4">Score</p>

                <h4 className="fw-bold mb-3">
                  R$ {result.creditLimit.toLocaleString("pt-BR")}
                </h4>

                <p className="mb-1"><strong>Status:</strong> {getStatusLabel(result.decisionStatus)}</p>
                <p className="small text-muted mb-4">{result.reason}</p>

                <button
                  className="btn btn-success w-100 fw-bold"
                  onClick={() =>
                    navigate("/approved", {
                      state: { credit: result },
                    })
                  }
                >
                  Solicitar crédito
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
