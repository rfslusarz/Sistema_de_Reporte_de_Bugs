# Tech Support - Sistema de Gerenciamento de Chamados

Sistema completo de gerenciamento de chamados de suporte técnico para suporte de empresa.

## 🚀 Funcionalidades

- Abertura e acompanhamento de tickets
- Upload de arquivos (imagens, vídeos, PDFs)
- Priorização por tipo e criticidade
- Integração frontend React + backend Node/Express + SQLite

## 📂 Estrutura do Projeto

- `src/`: Frontend React (Vite + TypeScript + shadcn/ui)
- `server/`: Backend Node.js (Express + TypeScript + better-sqlite3)
- `docs/`: Documentação do projeto
  - `docs/RESUMO_PROJETO.md`: Resumo do projeto
  - `docs/DEPLOY.md`: Guia de deploy
  - `docs/COMO_DEPLOYAR.txt`: Guia rápido de deploy

## ▶️ Como rodar

```bash
# instalar dependências de frontend e backend
npm run setup

# rodar frontend e backend juntos
npm run dev:all
```

- Frontend: http://localhost:8080
- Backend: http://localhost:3000

## 🔧 Build de Produção

```bash
# build do frontend
npm run build

# build do backend
cd server && npm run build
```

## 🌐 Variáveis de Ambiente

- `FRONTEND_URL`: URL do frontend (CORS do backend)
- `PORT`: Porta do backend (default 3000)

## 📄 Licença

Este projeto é propriedade da empresa.

----

Desenvolvido para a equipe de suporte de empresa.
