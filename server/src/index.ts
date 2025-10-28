import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDb } from './db/database.js';
import ticketsRouter from './routes/tickets.js';
import uploadsRouter from './routes/uploads.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static('uploads'));

// Rotas
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Tech Support API está rodando!' });
});

app.use('/api/tickets', ticketsRouter);
app.use('/api/uploads', uploadsRouter);

// Inicializar banco de dados
initDb();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 API disponível em: http://localhost:${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});

