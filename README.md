# Tech Support Shippify - Sistema de Gerenciamento de Chamados

Sistema completo de gerenciamento de chamados de suporte técnico para a empresa Shippify.

## 🚀 Funcionalidades

- ✅ Criação de chamados com categorias (Requisição, Bug, Pedido de Acesso, Solicitação de Arquivo)
- ✅ Sistema de prioridades (Baixa, Média, Alta, Muito Alta)
- ✅ Múltiplos produtos do sistema
- ✅ Upload de arquivos (fotos, vídeos, PDFs)
- ✅ Gestão de status (Aberto, Em Análise, Em Desenvolvimento, Resolvido, Fechado)
- ✅ Interface moderna e responsiva
- ✅ API REST completa com backend Node.js + Express
- ✅ Banco de dados SQLite

## 🛠️ Tecnologias

### Frontend
- React + TypeScript
- Vite
- shadcn/ui
- Tailwind CSS
- React Router
- React Query

### Backend
- Node.js + Express
- TypeScript
- SQLite (better-sqlite3)
- Multer (upload de arquivos)

## 📦 Instalação

### 1. Instalar dependências

```bash
npm run setup
```

Este comando instala as dependências do frontend e do backend.

### 2. Configurar variáveis de ambiente

Criar arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

Criar arquivo `server/.env`:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### 3. Inicializar banco de dados

```bash
cd server
npm run migrate
cd ..
```

## 🎮 Executar

### Desenvolvimento (Frontend + Backend)

```bash
npm run dev:all
```

Isso inicia:
- Frontend em: `http://localhost:8080`
- Backend em: `http://localhost:3000`

### Desenvolvimento separado

**Frontend:**
```bash
npm run dev
```

**Backend:**
```bash
npm run server:dev
```

## 📚 API Endpoints

### Tickets

- `GET /api/tickets` - Listar todos os tickets
- `GET /api/tickets/:id` - Obter ticket específico
- `POST /api/tickets` - Criar novo ticket
- `PUT /api/tickets/:id` - Atualizar ticket
- `DELETE /api/tickets/:id` - Deletar ticket

### Uploads

- `POST /api/uploads/:ticketId` - Upload de arquivo
- `GET /api/uploads/:ticketId` - Listar anexos de um ticket
- `GET /api/uploads/:ticketId/:fileId/download` - Download de arquivo
- `DELETE /api/uploads/:ticketId/:fileId` - Deletar anexo

## 🚢 Deploy

### Opção 1: Render.com (Gratuito)

1. Criar conta no [Render.com](https://render.com)
2. Conectar repositório GitHub
3. Render configura automaticamente via `render.yaml`
4. A aplicação ficará disponível em: `https://tech-support.onrender.com`

### Opção 2: Railway (Gratuito)

1. Criar conta no [Railway.app](https://railway.app)
2. Conectar repositório
3. Railway detecta automaticamente e faz o deploy
4. A aplicação ficará disponível em: `https://seu-projeto.railway.app`

### Opção 3: Vercel + Backend separado

1. Frontend: Deploy no Vercel
2. Backend: Deploy no Render ou Railway
3. Configurar `VITE_API_URL` no Vercel

## 📁 Estrutura do Projeto

```
├── src/                    # Frontend React
│   ├── components/         # Componentes React
│   ├── pages/             # Páginas
│   ├── lib/               # Utilitários e API
│   └── ...
├── server/                # Backend Node.js
│   ├── src/
│   │   ├── db/            # Banco de dados
│   │   ├── routes/        # Rotas da API
│   │   └── index.ts       # Entry point
│   └── ...
└── public/                # Arquivos estáticos
```

## 🔧 Scripts Disponíveis

```bash
# Frontend
npm run dev              # Desenvolvimento frontend
npm run build            # Build de produção
npm run preview          # Preview do build

# Backend
npm run server:dev       # Desenvolvimento backend
npm run server:build     # Build backend
npm run server:start     # Iniciar backend em produção

# Ambos
npm run dev:all          # Desenvolvimento (frontend + backend)
npm run setup            # Instalar todas as dependências
```

## 📄 Licença

Este projeto é propriedade da Shippify.

---

Desenvolvido para a equipe de projetos da Shippify.
