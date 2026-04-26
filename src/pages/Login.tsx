import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/Login.css';
import { ApiError, api } from '../lib/api';
import { saveAuthSession } from '../lib/auth';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as { registeredEmail?: string; successMessage?: string } | null;

  const [formData, setFormData] = useState({
    email: locationState?.registeredEmail || '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const successMessage = useMemo(() => locationState?.successMessage || '', [locationState]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    setSubmitError('');
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Senha obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const auth = await api.login({
        email: formData.email.trim(),
        password: formData.password,
      });

      saveAuthSession(auth.access_token, auth.user);
      navigate('/consent');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          setSubmitError('Email ou senha inválidos.');
                  setSubmitError('Email ou senha inválidos.');
        } else {
          setSubmitError(error.message || 'Não foi possível entrar agora.');
        }
      } else {
        setSubmitError('Erro inesperado ao fazer login.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="row g-0 login-card auth-card auth-card--login shadow-lg w-100">
        {/* ESQUERDA */}
        <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-center p-5 text-white bg-gradient-bank">
          
          <div className="mb-4">
            <h2 className="fw-bold m-0">NewBank</h2>
            <p className="small opacity-75">
              NewBank: Crédito real para o seu futuro.
            </p>
          </div>

          <div className="my-4 text-center">
            <img src="/logincadastro.png" alt="App" className="worker-img" />
            <h1 className="display-6 fw-bold">
              Seu trabalho <br /> tem valor.
            </h1>
          </div>

          <p className="lead fs-6 mb-4 opacity-75 text-center">
            Análise justa para autônomos, entregadores e freelancers.
          </p>

          <div className="mt-2">
            <div className="feature-tag d-flex align-items-center gap-2">
              <i className="bi bi-bicycle"></i>
              <span>Motoristas de app</span>
            </div>

            <div className="feature-tag d-flex align-items-center gap-2">
              <i className="bi bi-box-seam"></i>
              <span>Entregadores</span>
            </div>

            <div className="feature-tag d-flex align-items-center gap-2">
              <i className="bi bi-briefcase-fill"></i>
              <span>Autônomos e Freelancers</span>
            </div>
          </div>
        </div>

        {/* DIREITA */}
        <div className="col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-center">

          <div className="d-lg-none mb-4 text-center">
            <h2 className="fw-bold text-success">NewBank</h2>
          </div>

          <div className="mb-4">
            <h3 className="fw-bold text-dark mb-1">
              Bem-vindo(a) de volta!
            </h3>
            <p className="text-muted">
              Acesse sua conta para gerenciar seu crédito.
            </p>
          </div>

          <form autoComplete="off" onSubmit={handleSubmit} noValidate>
            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}
            
            {/* EMAIL */}
            <div className="mb-4 position-relative">
              <label className="form-label small fw-bold text-secondary">
                EMAIL
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  className={`form-control form-control-custom ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="seuemail@exemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.email}</div>
              </div>
            </div>

            {/* SENHA */}
            <div className="mb-2">
              <label className="form-label small fw-bold text-secondary">
                SENHA
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  className={`form-control form-control-custom ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.password}</div>
              </div>
            </div>

            <div className="text-end mb-4">
              <span className="text-muted small">
                Recuperação de senha em breve.
              </span>
            </div>

              <button
                type="submit"
                className="btn btn-success w-100 text-white fw-bold shadow-sm"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'ENTRANDO...' : 'ENTRAR'}
              </button>
              {submitError && (
                <div className="alert alert-danger mt-3 mb-0" role="alert">
                  {submitError}
                </div>
              )}
          </form>

          <div className="text-center mt-5">
            <p className="text-muted small">
              Ainda não tem uma conta?
              <Link
                to="/register"
                className="ms-2 text-decoration-none fw-bold text-success"
              >
                Cadastre-se agora
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
