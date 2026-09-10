# Planejamento de Divisão de Tarefas

## Estrutura do Projeto

- **Backend:** Node.js + TypeScript + Express 5
- **Frontend:** React 19 + TypeScript + Vite 8
- **Banco de dados:** Arrays em memória (Sprint 1)
- **Auth:** JWT + bcrypt

## Branches

| Branch | Responsável | Status |
|--------|-------------|--------|
| `main` | Pessoa A | Backend login |
| `UI` | Pessoa B | Frontend login + painel |
| `pessoa-c` | Pessoa C | CRUD usuários |
| `pessoa-d` | Pessoa D | CRUD motoristas/veículos/postos |

## Regras de Independência

1. Cada pessoa parte da branch **main**
2. Ninguém toca arquivo que não é da sua responsabilidade
3. Arquivos compartilhados têm **um único dono**
4. Não fazer merge entre branches antes do merge final
5. Fazer `git push` da sua branch ao finalizar

## Divisão por Pessoa

### Pessoa A (Backend - Login) — branch `main`

**Cria:**
- `src/tipos.ts` — interfaces básicas (Perfil, Usuario, DadosAutenticacao)
- `src/autenticacao/auth.ts` — geração/verificação de JWT
- `src/autenticacao/login.ts` — lógica de autenticação
- `src/dados/usuarios.ts` — dados em memória + funções CRUD
- `src/rotas/auth.ts` — rota POST /login
- `src/server.ts` — ponto de entrada
- `src/app.ts` — Express app com rotas de auth

**Adiciona depois (quando C e D finalizarem):**
- `src/app.ts`: linhas de import + `app.use` para rotas de C e D
- `src/tipos.ts`: interfaces Motorista, Veiculo, Posto (do D)

### Pessoa B (Frontend - Login) — branch `UI`

**Cria (tudo em `frontend/`):**
- `frontend/src/App.tsx` — rotas com placeholders para C e D
- `frontend/src/main.tsx` — entry point React
- `frontend/src/contextos/Autenticacao.tsx` — contexto de auth
- `frontend/src/componentes/RotaProtegida.tsx` — guard de rotas
- `frontend/src/servicos/api.ts` — instância axios com JWT
- `frontend/src/paginas/Login.tsx` + `Login.css` — tela de login
- `frontend/src/paginas/Painel.tsx` + `Painel.css` — painel base
- `frontend/src/index.css` — reset global
- `frontend/package.json`, `frontend/vite.config.ts`, `frontend/tsconfig*`
- `frontend/index.html`

**Não toca backend.**

### Pessoa C (CRUD Usuários) — branch `pessoa-c`

**Cria (backend):**
- `src/rotas/usuarios.ts` — CRUD completo (GET, POST, PUT, PATCH, DELETE)
- `src/middlewares/verificarPerfil.ts` — middleware de autenticação

**Cria (frontend):**
- `frontend/src/paginas/usuarios/ListaUsuarios.tsx` — tabela + ações
- `frontend/src/paginas/usuarios/FormularioUsuario.tsx` — formulário criar/editar

**Não edita arquivos existentes** — só cria arquivos novos.
A rota `/usuarios` no `App.tsx` já foi criada pelo B.

### Pessoa D (CRUD Cadastros) — branch `pessoa-d`

**Cria (backend):**
- `src/rotas/cadastros.ts` — rotas para motoristas, veículos, postos
- `src/controladores/motoristaController.ts` — controller classe
- `src/controladores/veiculoController.ts` — controller classe
- `src/controladores/postoController.ts` — controller classe
- `src/dados/cadastros.ts` — dados em memória + funções CRUD

**Cria (frontend):**
- `frontend/src/paginas/cadastros/ListaMotoristas.tsx` — tabela + modal
- `frontend/src/paginas/cadastros/ListaVeiculos.tsx` — tabela + modal
- `frontend/src/paginas/cadastros/ListaPostos.tsx` — tabela + modal
- `frontend/src/paginas/cadastros/Cadastro.module.css` — estilos compartilhados

**Não edita arquivos existentes** — só cria arquivos novos.
A rota `/cadastros` no `App.tsx` já foi criada pelo B.

## Ordem de Merge

```bash
git checkout main
git merge UI           # 1. Frontend base
git merge pessoa-c     # 2. CRUD usuários
git merge pessoa-d     # 3. CRUD cadastros
```

## Arquivos Compartilhados (um dono por arquivo)

| Arquivo | Dono | Outros |
|---------|------|--------|
| `src/app.ts` | A cria | C e D não mexem (A adiciona rotas depois) |
| `src/tipos.ts` | A cria | D não mexe (A adiciona interfaces depois) |
| `frontend/src/App.tsx` | B cria | C e D não mexem (já tem placeholders) |
| `frontend/src/paginas/Painel.tsx` | B cria | D não mexe (já tem estrutura de abas) |
| `frontend/src/paginas/Painel.css` | B cria | D não mexe (já tem estilos de abas) |

## Dependências entre Branches

```
main (A)
  └── UI (B) — depende de A
        ├── pessoa-c (C) — depende de B
        └── pessoa-d (D) — depende de B
```

B precisa terminar antes de C e D.
C e D são independentes entre si.

## Histórico de Decisões

### Sprint 1
- Arrays em memória para dados (sem PostgreSQL)
- "Esqueci minha senha" adiado para Sprint 2
- Express 5 exigiu usar `app.use()` em vez de `router.use()` para middlewares
- TypeScript 7 exigiu trocar `ts-node-dev` por `tsx`
- Padrões diferentes por pessoa: funções (A/C), classes estáticas (D), CSS puro (B), CSS Modules (D)
