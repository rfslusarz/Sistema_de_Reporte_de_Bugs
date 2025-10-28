# 🚀 Guia de Deploy - Tech Support suporte de empresa

Este guia explica como fazer deploy da aplicação em servidores gratuitos para demonstrar para a equipe.

## 📋 Pré-requisitos

- Conta no GitHub
- Conta no Render.com OU Railway.app (ambos gratuitos)

## 🌐 Opção 1: Render.com (Recomendado)

### 1. Preparar o código

```bash
# 1. Instalar dependências
npm run setup

# 2. Criar arquivo .env no servidor
cd server
cat > .env << EOF
PORT=10000
FRONTEND_URL=https://tech-support.onrender.com
EOF
cd ..

# 3. Commit e push para GitHub
git add .
git commit -m "Add backend and deploy config"
git push origin main
```

### 2. Deploy no Render

1. Acesse: [https://render.com](https://render.com)
2. Faça login com GitHub
3. Clique em "New" → "Web Service"
4. Conecte seu repositório
5. Configure:
   - **Name**: `tech-support-app`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install && npm run build && cd .. && npm install && npm run build`
   - **Start Command**: `node render-start.js`
   - **Port**: `10000`

6. Adicione variáveis de ambiente:
   - `PORT`: `10000`
   - `FRONTEND_URL`: `https://tech-support.onrender.com`
   - `NODE_ENV`: `production`

7. Clique em "Create Web Service"

### 3. Aguardar deploy (5-10 minutos)

### 4. Acessar aplicação

Sua aplicação estará disponível em:
`https://tech-support.onrender.com`

## 🚂 Opção 2: Railway.app

### 1. Preparar o código

```bash
# Criar arquivo railway.json
cat > railway.json << EOF
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "cd server && npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF

git add railway.json
git commit -m "Add Railway config"
git push origin main
```

### 2. Deploy no Railway

1. Acesse: [https://railway.app](https://railway.app)
2. Faça login com GitHub
3. Clique em "New Project" → "Deploy from GitHub repo"
4. Selecione seu repositório
5. Railway detecta automaticamente e faz o deploy

### 3. Variáveis de ambiente

No painel do Railway:
- `PORT`: deixe Railway definir automaticamente
- `FRONTEND_URL`: URL gerada pelo Railway
- `NODE_ENV`: `production`

### 4. Acessar aplicação

URL disponível no painel do Railway

## 🔄 Opção 3: Vercel (Frontend) + Render/Railway (Backend)

### Passo 1: Deploy do Backend

Siga as instruções acima para deploy do backend em Render ou Railway.

Anote a URL do backend (ex: `https://tech-support-backend.onrender.com`)

### Passo 2: Deploy do Frontend na Vercel

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Criar arquivo .env.local
echo "VITE_API_URL=https://tech-support-backend.onrender.com" > .env.local

# 3. Deploy
vercel --prod
```

OU via interface web:

1. Acesse [https://vercel.com](https://vercel.com)
2. Conecte GitHub
3. Import project
4. Configure variáveis:
   - `VITE_API_URL`: URL do seu backend

## 🧪 Testar Localmente

### 1. Iniciar tudo

```bash
npm run dev:all
```

Isso inicia:
- Frontend: http://localhost:8080
- Backend: http://localhost:3000

### 2. Testar criação de ticket

1. Acesse http://localhost:8080
2. Preencha o formulário
3. Clique em "Criar Chamado"
4. Verifique se o ticket aparece na lista

### 3. Testar upload

1. Crie um novo ticket
2. Adicione uma foto
3. Verifique se o upload funciona

## 📝 Notas Importantes

### Render.com

- **Limite gratuito**: 750 horas/mês
- Instâncias dormem após 15 minutos de inatividade
- Primeiro start pode levar 30-60 segundos

### Railway.app

- **Limite gratuito**: $5 créditos/mês
- Não dorme em plano pago
- Deploy mais rápido

### Vercel

- **Limite gratuito**: Ilimitado para frontend
- Edge functions
- Deploy instantâneo

## 🐛 Resolução de Problemas

### Erro: "Cannot connect to database"

Execute a migração manualmente:
```bash
cd server
npm run migrate
```

### Erro: "CORS policy"

Verifique se `FRONTEND_URL` está correto no `.env`

### Frontend não conecta ao backend

1. Verifique `VITE_API_URL` no frontend
2. Teste a API: `curl https://seu-backend.com/api/health`

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no painel do Render/Railway
2. Teste localmente primeiro
3. Verifique variáveis de ambiente

## 🎉 Após o Deploy

Sua equipe pode acessar:
- **URL da aplicação**: será fornecida pelo serviço escolhido
- **API**: `https://sua-url.com/api/tickets`

Compartilhe o link com a equipe de projetos!

