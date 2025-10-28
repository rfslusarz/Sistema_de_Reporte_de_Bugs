# Tech Support Backend

API backend para o sistema de gerenciamento de chamados de suporte técnico.

## Tecnologias

- Node.js + Express
- TypeScript
- SQLite (better-sqlite3)
- Multer (upload de arquivos)

## Instalação

```bash
npm install
```

## Configuração

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário:

```env
PORT=3000
FRONTEND_URL=http://localhost:5173
```

## Executar

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm run build
npm start
```

## Migração do Banco de Dados

```bash
npm run migrate
```

## Endpoints da API

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

## Estrutura do Projeto

```
server/
├── src/
│   ├── db/
│   │   └── database.ts      # Configuração do SQLite
│   ├── routes/
│   │   ├── tickets.ts       # Rotas de tickets
│   │   └── uploads.ts       # Rotas de upload
│   └── index.ts              # Entrada da aplicação
├── uploads/                  # Arquivos enviados
├── tickets.db                # Banco de dados SQLite
└── package.json
```

