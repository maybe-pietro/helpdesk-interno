# Sistema Interno de Requisição de Chamados

Sistema de helpdesk interno (ver README.md para arquitetura, stack e como rodar).

## Workflow de Git

**Commit e push automáticos**: sempre que fizer uma mudança de código neste projeto, faça `git add`/`commit`/`push` para `origin main` sem pedir aprovação antes. O usuário autorizou isso explicitamente (2026-07-31) — não é necessário confirmar cada push individualmente.

- Escreva mensagens de commit claras, no mesmo estilo dos commits já existentes (curto, foco no "porquê").
- Isso vale para commits normais (`add`/`commit`/`push`). Operações destrutivas (force push, reset --hard, rewrite de história, deletar branches) continuam exigindo confirmação explícita — a autorização de automação cobre o fluxo normal de desenvolvimento, não isso.
- Repositório remoto: https://github.com/maybe-pietro/helpdesk-interno (público).

## Ambiente de desenvolvimento

Ver seção "Ambiente de desenvolvimento — cuidados conhecidos" no README.md: usar `127.0.0.1` em vez de `localhost`, e lembrar que mudanças em arquivos fora de `backend/src`/`frontend/src` (ex: `package.json`, `Dockerfile`, `tailwind.config.js`, `vite.config.js`, `nodemon.json`) exigem `docker compose up -d --build <servico>`, não só `restart`.
