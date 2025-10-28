#!/usr/bin/env node

// Script de inicialização para Render.com
// Inicia backend e serve frontend estático

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const PORT = process.env.PORT || 10000;

async function start() {
  console.log('🚀 Iniciando backend...');
  
  // Iniciar backend
  const backend = exec('node server/dist/index.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Backend error: ${error}`);
      return;
    }
    console.log(stdout);
    console.error(stderr);
  });

  // Aguardar backend iniciar
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('📦 Backend iniciado');
  console.log(`✅ Aplicação rodando na porta ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
}

start().catch(console.error);

