# Abastece Bus

Sistema de gestão de frota de ônibus com cadastros e painel de controle.

## Sprint 1 - Esboço Inicial do Projeto

### Objetivo
Levantar os requisitos e estruturar a base do sistema Abastece Bus, definindo a arquitetura, stack tecnológica e funcionalidades essenciais.

### O que foi feito
- Definição do escopo: sistema de gestão de frota de ônibus (veículos, motoristas, postos)
- Escolha das tecnologias: React + Vite no frontend, Express + TypeScript no backend
- Configuração do projeto com arquitetura em camadas (rotas, controladores, dados, middlewares)
- Criação do backend com endpoints REST para autenticação, usuários e cadastros (veículos, motoristas, postos)
- Desenvolvimento do frontend com páginas de login, painel de controle e formulários de cadastro

### Funcionalidades implementadas
- Login
- Cadastro e listagem de veículos, motoristas e postos
- Cadastro e gestão de usuários (apenas gestores)
- Painel de controle
- Integração frontend-backend via API REST

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/)

## Backend

```bash
# Na raiz do projeto
npm install
npm run dev
```

O servidor rodará em `http://localhost:3001` (configurável via variável de ambiente `PORTA`).

## Frontend

```bash
# Dentro da pasta frontend
cd frontend
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

## Estrutura do Projeto

```
bus-main/
├── frontend/          # React + Vite + TypeScript
│   └── src/
│       ├── componentes/
│       ├── contextos/
│       ├── paginas/
│       └── servicos/
└── src/               # Backend Express + TypeScript
    ├── autenticacao/
    ├── controladores/
    ├── dados/
    ├── middlewares/
    └── rotas/
```

## Tecnologias

- **Backend:** Express, TypeScript
- **Frontend:** React, Vite, Axios, React Router
