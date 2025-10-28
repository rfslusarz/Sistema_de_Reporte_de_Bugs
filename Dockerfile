# Backend Dockerfile
FROM node:20-alpine AS backend

WORKDIR /app/server

# Copiar arquivos do backend
COPY server/package*.json ./
RUN npm ci --only=production

COPY server/ ./
RUN npm run build

# Frontend build
FROM node:20-alpine AS frontend

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copiar backend
COPY --from=backend /app/server/node_modules ./server/node_modules
COPY --from=backend /app/server/dist ./server/dist
COPY --from=backend /app/server/package*.json ./server/
COPY server/tsconfig.json ./server/

# Copiar frontend build
COPY --from=frontend /app/dist ./dist
COPY --from=frontend /app/public ./public
COPY --from=frontend /app/package*.json ./

# Criar diretório de uploads
RUN mkdir -p server/uploads

# Instalar serve para servir o frontend
RUN npm install -g serve

# Expor porta
EXPOSE 3000

# Script de inicialização
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

CMD ["./docker-entrypoint.sh"]

