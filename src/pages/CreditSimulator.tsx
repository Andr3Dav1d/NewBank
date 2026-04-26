import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Login.css";

import {
  SIMULATOR_OPTIONS,
  ANALYSIS_STAGES,
  formatCurrency,
  type CreditSimulatorData,
} from "../../../NewBank/src/state/appState";

import { api } from "../../../NewBank/src/lib/api";
import { getAccessToken, getAuthUser } from "../../../NewBank/src/lib/auth";
import type { DecisionStatus } from "../../../NewBank/src/lib/types";

interface CreditResult {
  score: number;
  approvedValue: number;
  status: DecisionStatus;
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

  const [formData, setFormData] = useState(DEFAULT_SIMULATOR_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState<"idle" | "running" | "done">("idle");
  const [result, setResult] = useState<CreditResult | null>(null);
  const [submitError, setSubmitError] = useState("");

  const isAnalyzing = analysisStage === "running";

  // 🧠 LABELS BONITAS
  const fieldLabels: Record<string, string> = {
    rendaMensal: "Renda mensal",
    frequencia: "Frequência",
    atividade: "Atividade",
    tempoAtividade: "Tempo de atividade",
  };

  // 🔧 HELPERS
  const parseCurrency = (value: string) =>
    Number((value || "").replace(/\D/g, "")) || 0;

  const mapIncome = (value: string): number => {
    const map: Record<string, number> = {
      "até 2.000": 1800,
      "2.001-5.000": 4000,
      "5.001-10.000": 8000,
      "acima de 10.000": 12000,
    };
    return map[value] || 0;
  };

  const mapFrequency = (
    value: string
  ): "daily" | "weekly" | "monthly" | "irregular" => {
    const map = {
      Mensal: "monthly",
      Semanal: "weekly",
      Quinzenal: "weekly",
    } as const;

    return map[value as keyof typeof map] || "irregular";
  };

  const getStatusLabel = (status: DecisionStatus) => {
    if (status === "approved") return "Aprovado";
    if (status === "approved_with_risk") return "Aprovado com ressalvas";
    if (status === "denied") return "Negado";
    return "Em análise";
  };

  const getStatusMessage = (status: DecisionStatus) => {
    if (status === "approved")
      return "Seu crédito foi aprovado com base na sua análise financeira.";
    if (status === "approved_with_risk")
      return "Aprovado com algumas condições após análise.";
    if (status === "denied")
      return "No momento não foi possível aprovar seu crédito.";
    return "Estamos finalizando a análise do seu perfil.";
  };

  const getStatusColor = (status: DecisionStatus) => {
    if (status === "approved") return "text-success";
    if (status === "approved_with_risk") return "text-warning";
    if (status === "denied") return "text-danger";
    return "text-secondary";
  };

  // 🔥 HANDLERS
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    if (!formData.atividade) newErrors.atividade = "Selecione sua atividade";
    if (!formData.tempoAtividade) newErrors.tempoAtividade = "Selecione o tempo";
    if (!formData.gastoMedio) newErrors.gastoMedio = "Informe o gasto";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

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
      setAnalysisProgress((prev) =>
        Math.min(92, prev + Math.floor(Math.random() * 8) + 4)
      );
    }, 150);

    try {
      const referenceMonth = new Date().toISOString().slice(0, 7) + "-01";

      await api.createFinancialData(
        {
          user_id: user.id,
          reference_month: referenceMonth,
          monthly_income: mapIncome(formData.rendaMensal),
          income_frequency: mapFrequency(formData.frequencia),
          monthly_expenses: parseCurrency(formData.gastoMedio),
        },
        token
      );

      const score = await api.createScore(
        {
          user_id: user.id,
          reference_month: referenceMonth,
        },
        token
      );

      const decision = await api.createDecision(
        {
          user_id: user.id,
          score_id: score.id,
        },
        token
      );
setResult({
  score: score.score,
  approvedValue: decision.creditLimit ?? 0,
  decisionStatus: decision.status,
});

      setAnalysisProgress(100);
      setAnalysisStage("done");
    } catch (err) {
      console.error(err);
      setSubmitError("Erro ao comunicar com o servidor.");
      setAnalysisStage("idle");
      setAnalysisProgress(0);
    } finally {
      clearInterval(interval);
    }
  };

  const currentStage = useMemo(() => {
    if (!isAnalyzing) return "";
    if (analysisProgress < 35) return ANALYSIS_STAGES[0];
    if (analysisProgress < 75) return ANALYSIS_STAGES[1];
    return ANALYSIS_STAGES[2];
  }, [analysisProgress, isAnalyzing]);

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light p-3">
      <div className="login-card shadow-lg w-100" style={{ maxWidth: "900px" }}>
        <div className="row g-0">

          {/* ESQUERDA */}
          <div className="col-md-5 d-none d-md-flex flex-column justify-content-center p-4 text-white bg-gradient-bank">
            <h2 className="fw-bold">NewBank</h2>
            <p className="small opacity-75">Simulação inteligente</p>
          </div>

          {/* DIREITA */}
          <div className="col-12 col-md-7 p-4 p-md-5">
            <h3 className="fw-bold mb-3">Simular crédito</h3>

            {!isAnalyzing && !result && (
              <form onSubmit={handleSubmit}>
                <div className="row">

                  {(["rendaMensal","frequencia","atividade","tempoAtividade"] as const).map((field) => (
                    <div className="col-12 mb-3" key={field}>
                      <label className="form-label fw-semibold text-muted mb-1">
                        {fieldLabels[field]}
                      </label>

                      <select
                        name={field}
                        className={`form-select ${errors[field] ? "is-invalid" : ""}`}
                        value={formData[field]}
                        onChange={handleChange}
                      >
                        <option value="">Selecione</option>
                        {SIMULATOR_OPTIONS[field].map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  ))}

                  <div className="col-12 mb-4">
                    <label className="form-label fw-semibold text-muted mb-1">
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
                  <div className="alert alert-danger mt-3">{submitError}</div>
                )}
              </form>
            )}

            {isAnalyzing && (
              <div className="text-center">
                <div className="progress mb-3">
                  <div className="progress-bar bg-success" style={{ width: `${analysisProgress}%` }} />
                </div>
                <p className="text-muted small">{currentStage}</p>
              </div>
            )}

            {result && (
              <div className="text-center">
                <h4 className="fw-bold mb-2">Score: {result.score}</h4>

                <h5 className="fw-bold mb-3">
                  R$ {result.approvedValue.toLocaleString("pt-BR")}
                </h5>

                <p className={`fw-semibold ${getStatusColor(result.status)}`}>
                  {getStatusLabel(result.status)}
                </p>

                <p className="text-muted small mb-4">
                  {getStatusMessage(result.status)}
                </p>

                <button
                  className="btn btn-success w-100 fw-bold mt-2"
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