import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import styles from '../styles/App.module.css'

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2Z" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
    title: 'Conta digital gratuita',
    desc: 'Abra sua conta em minutos, sem taxas e sem burocracia. 100% pelo celular.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Criptografia de ponta',
    desc: 'Seus dados e transações protegidos com a mais avançada tecnologia de segurança.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Transferências instantâneas',
    desc: 'Pix, TED e DOC sem custo adicional. Envie e receba dinheiro a qualquer hora.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    title: 'Cartão sem anuidade',
    desc: 'Crédito e débito Visa com cashback em todas as compras. Zero anuidade para sempre.',
  },
]

const STEPS = [
  { num: '01', title: 'Baixe o app', desc: 'Disponível para iOS e Android. Gratuito.' },
  { num: '02', title: 'Crie sua conta', desc: 'Preencha seus dados em menos de 3 minutos.' },
  { num: '03', title: 'Ative seu cartão', desc: 'Receba em casa e comece a usar imediatamente.' },
]

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)
  const heroSection = useInView(0.1)
  const featuresSection = useInView(0.1)
  const stepsSection = useInView(0.1)
  const ctaSection = useInView(0.1)

  return (
    <div className={styles.root}>
      {/* NAV */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <img
            src="/NewBank_-_Prototipo_6_(3).png"
            alt="NewBank logo"
            className={styles.navLogo}
          />
          <div className={`${styles.navLinks} ${menuOpen ? styles.navLinksOpen : ''}`}>
            <a href="#features" onClick={() => setMenuOpen(false)}>Benefícios</a>
            <a href="#how" onClick={() => setMenuOpen(false)}>Como funciona</a>
            <a href="#cta" onClick={() => setMenuOpen(false)}>Abrir conta</a>
            <Link to="/login" className={styles.navCta} onClick={() => setMenuOpen(false)}>
              Entrar
            </Link>
          </div>
          <button
            className={styles.burger}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
          >
            <span className={menuOpen ? styles.burgerTopOpen : ''} />
            <span className={menuOpen ? styles.burgerMidOpen : ''} />
            <span className={menuOpen ? styles.burgerBotOpen : ''} />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className={styles.hero} ref={heroSection.ref}>
        <div className={`${styles.heroContent} ${heroSection.visible ? styles.fadeIn : ''}`}>
          <span className={styles.heroBadge}>Novo jeito de bancar</span>
          <h1 className={styles.heroTitle}>
            O banco que<br />
            <span className={styles.heroAccent}>evolui com você</span>
          </h1>
          <p className={styles.heroDesc}>
            Conta digital gratuita, cartão Visa sem anuidade e controle total das suas finanças — tudo no seu celular.
          </p>
          <div className={styles.heroCtas}>
            <Link to="/login" className={styles.btnPrimary}>Abrir conta grátis</Link>
            <a href="#how" className={styles.btnGhost}>Ver como funciona</a>
          </div>
          <div className={styles.heroStats}>
            <div className={styles.stat}>
              <span className={styles.statNum}>+500k</span>
              <span className={styles.statLabel}>clientes ativos</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>4.9★</span>
              <span className={styles.statLabel}>nota na App Store</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.stat}>
              <span className={styles.statNum}>R$0</span>
              <span className={styles.statLabel}>anuidade</span>
            </div>
          </div>
        </div>

        <div className={`${styles.heroVisual} ${heroSection.visible ? styles.fadeInRight : ''}`}>
          <div className={styles.glowOrb} />
          <div className={styles.phoneWrapper}>
            <img
              src="/NewBank_-_Prototipo_6_(3).png"
              alt="NewBank app no celular"
              className={styles.phoneImg}
            />
          </div>
          <div className={styles.floatCard1}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3d8a56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            <span>Pix enviado</span>
          </div>
          <div className={styles.floatCard2}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3d8a56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <span>Dados protegidos</span>
          </div>
        </div>

        {/* decorative blobs */}
        <div className={styles.blobTL} />
        <div className={styles.blobBR} />
      </section>

      {/* FEATURES */}
      <section id="features" className={styles.features} ref={featuresSection.ref}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Por que NewBank?</span>
          <h2 className={styles.sectionTitle}>Tudo que você precisa,<br />em um só lugar</h2>
        </div>
        <div className={`${styles.featGrid} ${featuresSection.visible ? styles.fadeIn : ''}`}>
          {FEATURES.map((f, i) => (
            <div key={i} className={styles.featCard} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.featIcon}>{f.icon}</div>
              <h3 className={styles.featTitle}>{f.title}</h3>
              <p className={styles.featDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className={styles.how} ref={stepsSection.ref}>
        <div className={styles.howInner}>
          <div className={styles.howText}>
            <span className={styles.sectionBadge}>Simples assim</span>
            <h2 className={styles.sectionTitle}>Em 3 passos você<br />já está dentro</h2>
            <p className={styles.howSubtext}>
              Sem filas, sem papel, sem complicação. Abrir sua conta NewBank é a coisa mais fácil que você vai fazer hoje.
            </p>
            <div className={`${styles.steps} ${stepsSection.visible ? styles.fadeIn : ''}`}>
              {STEPS.map((s, i) => (
                <div key={i} className={styles.step} style={{ animationDelay: `${i * 0.15}s` }}>
                  <span className={styles.stepNum}>{s.num}</span>
                  <div>
                    <h4 className={styles.stepTitle}>{s.title}</h4>
                    <p className={styles.stepDesc}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${styles.howVisual} ${stepsSection.visible ? styles.fadeInRight : ''}`}>
            <div className={styles.phoneMockup}>
              <div className={styles.screen}>
                <div className={styles.appHeader}>
                  <div className={styles.appIcon} />
                  <span>NewBank</span>
                </div>
                <div className={styles.balance}>
                  <span className={styles.balanceLabel}>Saldo disponível</span>
                  <span className={styles.balanceAmount}>R$ 2.847,32</span>
                </div>
                <div className={styles.quickActions}>
                  <div className={styles.action}>
                    <span>Pagar</span>
                  </div>
                  <div className={styles.action}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    <span>Receber</span>
                  </div>
                  <div className={styles.action}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    <span>Transferir</span>
                  </div>
                  <div className={styles.action}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2Z" /></svg>
                    <span>Cartão</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className={styles.cta} ref={ctaSection.ref}>
        <div className={`${styles.ctaInner} ${ctaSection.visible ? styles.fadeIn : ''}`}>
          <h2 className={styles.ctaTitle}>
            Pronto para<br />
            <span className={styles.ctaAccent}>mudar de banco?</span>
          </h2>
          <p className={styles.ctaDesc}>
            Junte-se a mais de 500 mil clientes que já descobriram o novo jeito de bancar.
          </p>
          <Link to="/login" className={styles.btnPrimary}>Começar agora</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          
          <div className={styles.footerLinks}>
            <div className={styles.footerCol}>
              <h4>Produto</h4>
              <a href="#">Conta digital</a>
              <a href="#">Cartão Visa</a>
              <a href="#">Pix</a>
              <a href="#">Investimentos</a>
            </div>
            <div className={styles.footerCol}>
              <h4>Empresa</h4>
              <a href="#">Sobre nós</a>
              <a href="#">Carreiras</a>
              <a href="#">Imprensa</a>
              <a href="#">Contato</a>
            </div>
            <div className={styles.footerCol}>
              <h4>Suporte</h4>
              <a href="#">Central de ajuda</a>
              <a href="#">Segurança</a>
              <a href="#">Status</a>
              <a href="#">API</a>
            </div>
            <div className={styles.footerCol}>
              <h4>Legal</h4>
              <a href="#">Privacidade</a>
              <a href="#">Termos</a>
              <a href="#">Cookies</a>
              <a href="#">LGPD</a>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2024 NewBank. Todos os direitos reservados.</p>
            <div className={styles.footerSocial}>
              <a href="#" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}