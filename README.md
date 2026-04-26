# NewBank Frontend

Aplicação frontend para o NewBank, uma plataforma de simulação e aprovação de crédito para autônomos, entregadores e freelancers.

## Funcionalidades
- Cadastro e login de usuários
- Consentimento de termos e privacidade
- Simulador de crédito com análise de perfil
- Visualização de crédito aprovado
- Fluxo protegido por autenticação e consentimento

## Tecnologias Utilizadas
- React + TypeScript
- Vite
- React Router
- CSS Modules
- Bootstrap Icons

## Estrutura do Projeto
```
├── public/
├── src/
│   ├── pages/         # Páginas principais (Login, Register, Consent, etc)
│   ├── lib/           # Lógica de API, autenticação, tipos, hooks
│   ├── state/         # Estado e helpers do simulador
│   ├── styles/        # Estilos globais e de componentes
│   ├── App.tsx        # Definição de rotas e ProtectedRoute
│   └── main.tsx       # Ponto de entrada
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Como rodar localmente

1. Instale as dependências:
	```bash
	npm install
	```
2. Inicie o servidor de desenvolvimento:
	```bash
	npm run dev
	```
3. Acesse em [http://localhost:5173](http://localhost:5173)

## Configuração de ambiente
- O endpoint da API está definido em `src/lib/api.ts`.
- Para ambientes diferentes, altere a constante `API_BASE_URL`.

## Scripts úteis
- `npm run dev` — inicia o servidor de desenvolvimento
- `npm run build` — gera build de produção
- `npm run preview` — executa build localmente

## Licença
MIT
