#!/bin/sh

# Inicializar banco de dados se não existir
if [ ! -f "server/dist/db/tickets.db" ]; then
  echo "Inicializando banco de dados..."
  node server/dist/db/migrate.js
fi

# Iniciar backend em background
cd server && node dist/index.js &

# Esperar um pouco para o backend iniciar
sleep 2

# Iniciar servidor de arquivos estáticos do frontend
cd .. && serve -s dist -l 3000

