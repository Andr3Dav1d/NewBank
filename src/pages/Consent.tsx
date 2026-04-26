import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../styles/Login.css'
import { clearAuthSession, getAuthUser, isAuthenticated, saveConsentState } from '../lib/auth'

function Consent() {
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState('')

  const handleLogout = () => {
    clearAuthSession()
    navigate('/login')
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login')
    }
  }, [navigate])

  const [consents, setConsents] = useState({
    termos: false,
    privacidade: false,
    marketing: false,
    dados: false
  })

  const handleConsentChange = (type: string) => {
    setConsents(prev => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev]
    }))
    setSubmitError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!consents.termos || !consents.privacidade) {
      setSubmitError('Aceite os termos obrigatórios para continuar.')
      return
    }

    const user = getAuthUser()
    if (!user) {
      navigate('/login')
      return
    }

    saveConsentState({
      userId: user.id,
      acceptedAt: new Date().toISOString(),
      terms: consents.termos,
      privacy: consents.privacidade,
      marketing: consents.marketing,
      dataUsage: consents.dados,
    })

    navigate("/simulator")
  }

  return (
    <div className="auth-page auth-page--padded">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-xl-10">

          <div className="row g-0 login-card auth-card auth-card--consent shadow-lg rounded overflow-hidden bg-white">

            {/* ESQUERDA */}
            <div className="col-lg-5 d-none d-lg-flex flex-column justify-content-center p-4 p-xl-5 text-white bg-gradient-bank">

              <h2 className="fw-bold mb-2">NewBank</h2>
              <p className="small opacity-75 mb-4">Privacidade e Segurança</p>

              <img
                src="/celula.png"
                alt="privacidade"
                className="img-fluid mb-4"
                style={{ maxHeight: 220, objectFit: 'contain' }}
              />

              <h4 className="fw-bold text-center mb-3">
                Seus dados, sua escolha
              </h4>

              <div className="d-flex flex-column gap-2 mt-3">
                <div className="feature-tag"><i className="bi bi-shield-lock-fill me-2"></i>Dados protegidos</div>
                <div className="feature-tag"><i className="bi bi-patch-check-fill me-2"></i>LGPD</div>
                <div className="feature-tag"><i className="bi bi-eye-fill me-2"></i>Transparência</div>
              </div>
            </div>

            {/* DIREITA */}
            <div className="col-12 col-lg-7 p-4 p-md-5">
              <div className="d-flex justify-content-end mb-3">
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>
                  Sair
                </button>
              </div>

              <div className="text-center d-lg-none mb-4">
                <h2 className="fw-bold text-success">NewBank</h2>
              </div>

              <h3 className="fw-bold mb-1">Consentimento</h3>
              <p className="text-muted mb-4">
                Precisamos da sua autorização para continuar
              </p>

              <form onSubmit={handleSubmit}>
                <div className="d-flex flex-column gap-3">

                  {/* CARD */}
                  <label className="border rounded p-3 d-flex align-items-start gap-2">
                    <input
                      type="checkbox"
                      checked={consents.termos}
                      onChange={() => handleConsentChange('termos')}
                    />
                    <div>
                      <strong>Termos de Uso *</strong>
                      <p className="small text-muted mb-0">Obrigatório</p>
                    </div>
                  </label>

                  <label className="border rounded p-3 d-flex align-items-start gap-2">
                    <input
                      type="checkbox"
                      checked={consents.privacidade}
                      onChange={() => handleConsentChange('privacidade')}
                    />
                    <div>
                      <strong>Política de Privacidade *</strong>
                      <p className="small text-muted mb-0">Obrigatório</p>
                    </div>
                  </label>

                  <label className="border rounded p-3 d-flex align-items-start gap-2">
                    <input
                      type="checkbox"
                      checked={consents.marketing}
                      onChange={() => handleConsentChange('marketing')}
                    />
                    <div>
                      <strong>Marketing</strong>
                      <p className="small text-muted mb-0">Opcional</p>
                    </div>
                  </label>

                  <label className="border rounded p-3 d-flex align-items-start gap-2">
                    <input
                      type="checkbox"
                      checked={consents.dados}
                      onChange={() => handleConsentChange('dados')}
                    />
                    <div>
                      <strong>Uso de dados</strong>
                      <p className="small text-muted mb-0">Opcional</p>
                    </div>
                  </label>

                </div>

                <button className="btn btn-success w-100 fw-bold mt-4">
                  ACEITAR E CONTINUAR
                </button>

                {submitError && (
                  <div className="alert alert-danger mt-3 mb-0" role="alert">
                    {submitError}
                  </div>
                )}
              </form>

              <p className="text-center mt-3 small">
                <Link to="/" className="text-success fw-bold text-decoration-none">
                  Voltar
                </Link>
              </p>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Consent
