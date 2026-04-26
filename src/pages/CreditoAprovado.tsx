import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/Login.css";
import type { DecisionStatus } from "../lib/types";
import { clearAuthSession } from "../lib/auth";

interface ApprovedCreditState {
  score: number;
  decisionStatus?: DecisionStatus;
  creditLimit?: number;
  approvedValue?: number;
  reason?: string;
  parcela?: string;
  taxa?: string;
  prazo?: string;
}

function CreditApproved() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login');
  };

  const credit = state?.credit as ApprovedCreditState | undefined;

  const approvedAmount = credit?.creditLimit ?? credit?.approvedValue ?? 0;
  const isApproved = credit?.decisionStatus === "approved" || credit?.decisionStatus === "approved_with_risk";

  const getStatusLabel = (status?: DecisionStatus) => {
    if (status === "approved") return "Aprovado";
    if (status === "approved_with_risk") return "Aprovado com ressalvas";
    if (status === "denied") return "Negado";
    return "Em análise";
  };

  if (!credit) {
    return (
      <div className="container vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <h4 className="mb-3">Nenhuma informação encontrada 😢</h4>
          <button className="btn btn-success" onClick={() => navigate("/")}>
            Voltar ao início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="row g-0 login-card auth-card auth-card--approved shadow-lg w-100 overflow-hidden">
        {/* LADO ESQUERDO - VISUAL */}
        <div className="col-lg-5 d-none d-lg-flex flex-column justify-content-center align-items-center text-white p-5 bg-gradient-bank">
          <i className="bi bi-check-circle-fill mb-4" style={{ fontSize: "70px" }}></i>

          <h2 className="fw-bold text-center">{isApproved ? "Crédito aprovado!" : "Crédito não aprovado"}</h2>

          <p className="text-center opacity-75 mt-3">
            {isApproved
              ? "Seu limite já está disponível para uso imediato."
              : "No momento, não foi possível aprovar seu crédito."}
          </p>
        </div>

        {/* LADO DIREITO - DETALHES */}
        <div className="col-lg-7 p-4 p-md-5 d-flex flex-column justify-content-center">
          <div className="d-flex justify-content-end mb-3">
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
              Sair
            </button>
          </div>

          {/* MOBILE ICON */}
          <div className="d-lg-none text-center mb-4">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: "60px" }}></i>
          </div>

          <h3 className="fw-bold mb-2 text-dark text-center text-lg-start">
            {isApproved ? "Tudo certo por aqui 🎉" : "Resultado da análise"}
          </h3>

          <p className="text-muted mb-4 text-center text-lg-start">
            {isApproved
              ? "Seu crédito foi aprovado. Confira os detalhes abaixo."
              : "Confira os detalhes da análise abaixo."}
          </p>

          {/* CARD DE INFORMAÇÕES */}
          <div className="border rounded p-3 mb-4">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Valor liberado</span>
              <strong>R$ {approvedAmount.toLocaleString("pt-BR")}</strong>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Status</span>
              <strong>{getStatusLabel(credit.decisionStatus)}</strong>
            </div>

            {credit.parcela && (
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Parcela</span>
                <strong>{credit.parcela}</strong>
              </div>
            )}

            {credit.taxa && (
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Taxa</span>
                <strong>{credit.taxa}</strong>
              </div>
            )}

            {credit.prazo && (
              <div className="d-flex justify-content-between">
                <span className="text-muted">Prazo</span>
                <strong>{credit.prazo}</strong>
              </div>
            )}

            {credit.reason && (
              <p className="small text-muted mb-0 mt-3">{credit.reason}</p>
            )}
          </div>

          {/* BOTÕES */}
          {isApproved && (
            <button
              className="btn btn-success w-100 fw-bold mb-2 shadow-sm"
              onClick={() => alert("Contrato em breve 😏")}
            >
              VER CONTRATO
            </button>
          )}

          <button
            className="btn btn-outline-secondary w-100 fw-bold"
            onClick={() => navigate("/")}
          >
            IR PARA INÍCIO
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreditApproved;
