# Sistema Interno de Requisição de Chamados

Sistema de helpdesk interno da empresa: solicitantes abrem chamados, atendentes os resolvem, administradores gerenciam usuários e categorias.

## Stack

- **Backend**: Node.js + Express, MySQL (via Knex), JWT para autenticação.
- **Frontend**: React (Vite) + React Query + Tailwind CSS.
- **Dev**: Docker Compose (MySQL + backend + frontend).

## Estrutura

```
backend/    API REST (Express)
frontend/   SPA (React)
docker-compose.yml
```

Veja a organização interna de cada serviço em `backend/src` e `frontend/src`.

## Como rodar (desenvolvimento)

Pré-requisitos: Docker e Docker Compose instalados.

1. Copie os arquivos de ambiente (já existem versões de desenvolvimento prontas, mas ajuste conforme necessário):
   ```
   cp .env.example .env
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

2. Suba os serviços:
   ```
   docker compose up --build
   ```

3. Em outro terminal, rode as migrations e o seed inicial (após o MySQL estar saudável):
   ```
   docker compose exec backend npm run migrate
   docker compose exec backend npm run seed
   ```

4. Acesse:
   - Frontend: http://127.0.0.1:5173
   - API: http://127.0.0.1:4000/api/health
   - Emails de teste (MailDev): http://127.0.0.1:1080
   - Banco de dados (Adminer): http://127.0.0.1:8080 — sistema `MySQL`, servidor `mysql`, usuario/senha/banco conforme `backend/.env` (`MYSQL_USER`/`MYSQL_PASSWORD`/`MYSQL_DATABASE`)

## Usuários de exemplo (seed)

| Papel        | Email                     | Senha            |
|--------------|----------------------------|-------------------|
| Admin        | admin@empresa.com         | admin123          |
| Agente (TI)  | agente.ti@empresa.com     | agente123         |
| Solicitante  | solicitante@empresa.com   | solicitante123    |

Troque essas senhas antes de qualquer uso real. A senha do admin pode ser sobrescrita definindo `SEED_ADMIN_PASSWORD` antes de rodar o seed.

## Variáveis de ambiente

Veja `.env.example` (raiz), `backend/.env.example` e `frontend/.env.example` para os arquivos completos. Resumo:

| Variável | Onde | Descrição |
|---|---|---|
| `MYSQL_ROOT_PASSWORD` | raiz | Senha root do MySQL (container) |
| `MYSQL_DATABASE` / `MYSQL_USER` / `MYSQL_PASSWORD` | raiz, backend | Credenciais do banco da aplicação |
| `MYSQL_HOST` / `MYSQL_PORT` | backend | Host/porta do MySQL (`mysql` dentro do compose) |
| `PORT` | backend | Porta da API (padrão 4000) |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | backend | Segredo e validade do token de autenticação |
| `UPLOAD_DIR` / `MAX_UPLOAD_MB` | backend | Diretório e tamanho máximo de anexos |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | backend | Configuração de envio de email |
| `NOTIFICATIONS_ENABLED` | backend | Liga/desliga o envio real de emails (com MailDev, deixe `true`) |
| `CORS_ORIGIN` | backend | Origem permitida para requisições do frontend |
| `VITE_API_BASE_URL` | frontend | URL base da API consumida pelo SPA |

Os arquivos `.env` já existem neste checkout com valores de desenvolvimento (não usar em produção). Se clonar o repositório do zero, copie os `.env.example` conforme o passo 1 acima.

## Adicionando uma nova migration

```
cd backend
npx knex --knexfile src/db/knexfile.js migrate:make nome_da_migration
```

## Papeis e permissoes

- **Solicitante**: abre chamados, acompanha e comenta apenas os proprios chamados (pode editar enquanto o status for "aberto").
- **Agente**: ve a fila do seu departamento, pode se auto-atribuir chamados, mudar status (respeitando as transicoes validas), comentar (inclusive notas internas) e anexar arquivos.
- **Admin**: acesso irrestrito a chamados, gerencia usuarios, departamentos e categorias, ve o dashboard.

## Transicoes de status validas

```
aberto -> em_andamento
em_andamento -> aguardando_solicitante | resolvido
aguardando_solicitante -> em_andamento | resolvido
resolvido -> fechado | em_andamento
fechado -> em_andamento
```

## Ambiente de desenvolvimento — cuidados conhecidos

- **`localhost` pode travar**: nesta maquina (e possivelmente em outras Windows), `localhost` resolve devagar (tenta IPv6 `::1` antes de cair para IPv4). Use **`http://127.0.0.1:5173`** e **`http://127.0.0.1:4000`** em vez de `localhost`. `VITE_API_BASE_URL` e `CORS_ORIGIN` ja estao configurados para `127.0.0.1` por padrao.
- **Hot-reload precisa de rebuild em alguns casos**: só `backend/src` e `frontend/src` sao bind mounts no `docker-compose.yml`. Editar qualquer arquivo **fora** dessas pastas (`package.json`, `Dockerfile`, `backend/nodemon.json`, `frontend/vite.config.js`, `frontend/tailwind.config.js` etc.) so tem efeito depois de `docker compose up -d --build <servico>` — um `restart` sozinho nao basta. Arquivos dentro de `src/` recarregam sozinhos (nodemon com `legacyWatch` no backend, Vite com `usePolling` no frontend — ambos necessarios porque bind mounts do Docker Desktop no Windows nao disparam eventos de arquivo nativos).

## Status do projeto

MVP completo (marcos 1-13) validado de ponta a ponta via API e visualmente no navegador: autenticacao, CRUD de chamados com transicoes de status e atribuicao, comentarios/historico, anexos, notificacoes por email, dashboard e painel admin. Rodada de polimento visual/UX aplicada em seguida: tokens de design (`brand` color scale, `shadow-card`), primitivos de UI reutilizaveis (`Card`, `Input`, `Select`, `Textarea`, `EmptyState`, `ConfirmDialog`, `Toast`), confirmacao antes de acoes destrutivas, toasts de sucesso/erro em todas as mutacoes, estados vazios com call-to-action, e tela de login/header redesenhados.

Bugs reais encontrados e corrigidos durante a validacao: middleware de autenticacao nao incluia `department_id` (agentes nao viam chamados do proprio departamento — corrigido buscando o usuario atual no banco a cada request, que tambem revoga tokens de usuarios desativados na hora); reabrir um chamado nao limpava `resolved_at`/`closed_at`, inflando a metrica de tempo medio de resolucao no dashboard.

Roteiro de teste manual:
1. Login como solicitante (`solicitante@empresa.com` / `solicitante123`) → abrir um chamado novo → ver ele na lista.
2. Login como agente (`agente.ti@empresa.com` / `agente123`) → assumir o chamado → mudar status → comentar → anexar um arquivo.
3. Conferir os emails em http://127.0.0.1:1080.
4. Login como admin (`admin@empresa.com` / `admin123`) → ver o dashboard → criar/remover usuario/departamento/categoria no painel admin (confirmar que o dialog de confirmacao aparece nas remocoes).

## Testes automatizados

- **Backend** (Jest + Supertest, testes de integracao contra a API real e o MySQL do docker-compose): `docker compose exec backend npm test`. O `globalSetup` roda migrations + seed automaticamente antes da suite, reaproveitando os mesmos scripts de seed do dev (isso reseta o banco de dev compartilhado — normal para um projeto deste porte, sem dados de producao). Cobre principalmente autenticacao/permissoes e o ciclo de vida de chamados (inclui testes de regressao dos dois bugs reais encontrados durante a validacao manual: `department_id` faltando no usuario autenticado, e timestamps nao limpos ao reabrir um chamado).
- **Frontend** (Vitest + Testing Library, jsdom): `docker compose exec frontend npm test`. Cobre os componentes/paginas onde ja apareceram bugs reais (labels de status/prioridade, timeline de eventos, formulario de login).
- **CI**: `.github/workflows/ci.yml` roda lint + testes (backend com um MySQL de servico efemero) + build do frontend a cada push/PR na `main`.

## Fora do escopo do MVP (proximos passos sugeridos)

- SLA / prazos de atendimento com alertas automaticos.
- Aplicativo mobile (a API ja é desacoplada do frontend, entao um app futuro pode reusa-la).
- SSO / integracao com Active Directory.
- `npm audit` acusa vulnerabilidades em dependencias transitivas (backend e frontend) — nao investigadas/corrigidas ainda; rodar `npm audit` em cada projeto antes de ir para producao.
