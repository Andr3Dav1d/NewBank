import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css'
import '../styles/Login.css'
import { ApiError, api } from '../lib/api'

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    password: '',
    confirmarPassword: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData(prev => ({ ...prev, [name]: value }))
    setSubmitError('')

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório'

    if (!formData.email.trim()) newErrors.email = 'Email é obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Email inválido'

    if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório'

    if (!formData.password.trim()) newErrors.password = 'Senha obrigatória'
    else if (formData.password.length < 8)
      newErrors.password = 'Mínimo 8 caracteres'

    if (formData.confirmarPassword !== formData.password)
      newErrors.confirmarPassword = 'Senhas não coincidem'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setSubmitError('')

    try {
      await api.register({
        name: formData.nome.trim(),
        email: formData.email.trim(),
        cpf: formData.cpf.replace(/\D/g, ''),
        password: formData.password,
      })

      navigate('/login', {
        state: {
          registeredEmail: formData.email.trim(),
          successMessage: 'Conta criada com sucesso. Faça login para continuar.',
        },
      })
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          setSubmitError('Este e-mail ou CPF já está cadastrado.')
        } else if (error.status === 400) {
          setSubmitError(error.message || 'Dados inválidos. Revise o formulário.')
        } else {
          setSubmitError(error.message || 'Não foi possível criar a conta agora.')
        }
      } else {
        setSubmitError('Erro inesperado ao criar conta. Tente novamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page auth-page--padded">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-xl-10">

          <div className="row g-0 login-card auth-card auth-card--register shadow-lg rounded overflow-hidden bg-white">

            {/* ESQUERDA */}
            <div className="col-lg-5 d-none d-lg-flex flex-column justify-content-center p-4 p-xl-5 text-white bg-gradient-bank">
              
              <h2 className="fw-bold mb-2">NewBank</h2>
              <p className="small opacity-75 mb-4">Sua conta em minutos</p>

              <img
                src="/celula.png"
                alt="app"
                className="img-fluid mb-4"
                style={{ maxHeight: 220, objectFit: 'contain' }}
              />

              <h4 className="fw-bold text-center mb-3">
                Junte-se a nós hoje
              </h4>

              <div className="feature-tag d-flex align-items-center gap-2">
                <i className="bi bi-lightning-charge-fill"></i>
                <span>Cadastro rápido</span>
              </div>
              <div className="feature-tag d-flex align-items-center gap-2">
                <i className="bi bi-shield-lock-fill"></i>
                <span>Segurança total</span>
              </div>
              <div className="feature-tag d-flex align-items-center gap-2">
                <i className="bi bi-credit-card-fill"></i>
                <span>Cartão gratuito</span>
              </div>
            </div>

            {/* DIREITA */}
            <div className="col-12 col-lg-7 p-4 p-md-5">

              <div className="text-center d-lg-none mb-4">
                <h2 className="fw-bold text-success">NewBank</h2>
              </div>

              <h3 className="fw-bold mb-1">Criar conta</h3>
              <p className="text-muted mb-4">Preencha seus dados</p>

              <form onSubmit={handleSubmit} noValidate>
                <div className="row g-3">

                  <div className="col-12">
                    <input
                      type="text"
                      name="nome"
                      className={`form-control ${errors.nome && 'is-invalid'}`}
                      placeholder="Nome completo"
                      value={formData.nome}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.nome}</div>
                  </div>

                  <div className="col-12">
                    <input
                      type="email"
                      name="email"
                      className={`form-control ${errors.email && 'is-invalid'}`}
                      placeholder="E-mail"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.email}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <input
                      type="text"
                      name="cpf"
                      className={`form-control ${errors.cpf && 'is-invalid'}`}
                      placeholder="CPF"
                      value={formData.cpf}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.cpf}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <input
                      type="tel"
                      name="telefone"
                      className={`form-control ${errors.telefone && 'is-invalid'}`}
                      placeholder="Telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.telefone}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <input
                      type="password"
                      name="password"
                      className={`form-control ${errors.password && 'is-invalid'}`}
                      placeholder="Senha"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.password}</div>
                                      <div className="invalid-feedback">{errors.password}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <input
                      type="password"
                      name="confirmarPassword"
                      className={`form-control ${errors.confirmarPassword && 'is-invalid'}`}
                      placeholder="Confirmar senha"
                      value={formData.confirmarPassword}
                      onChange={handleChange}
                    />
                    <div className="invalid-feedback">{errors.confirmarPassword}</div>
                                      <div className="invalid-feedback">{errors.confirmarPassword}</div>
                  </div>

                </div>

                <button className="btn btn-success w-100 fw-bold mt-4" disabled={isSubmitting}>
                  {isSubmitting ? 'CRIANDO...' : 'CRIAR CONTA'}
                </button>

                {submitError && (
                  <div className="alert alert-danger mt-3 mb-0" role="alert">
                    {submitError}
                  </div>
                )}

                <p className="text-muted small text-center mt-3 mb-0">
                  Ao continuar, você aceita nossos termos
                </p>
                <p className="text-muted small text-center mt-2 mb-0">
                  Já tem conta?
                  <Link to="/login" className="ms-2 text-decoration-none fw-bold text-success">
                    Entrar
                  </Link>
                </p>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
