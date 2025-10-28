import express from 'express';
import { z } from 'zod';
import db from '../db/database.js';

const router = express.Router();

const ticketSchema = z.object({
  type: z.enum(['requisicao', 'bug', 'pedido_acesso', 'solicitacao_arquivo']),
  priority: z.enum(['baixa', 'media', 'alta', 'muito_alta']),
  product: z.enum(['login', 'nova_entrega', 'importacao_entregas', 'historicos', 'motoristas', 'usuarios', 'pagamentos', 'rotas', 'monitor', 'fleet']),
  title: z.string().min(1).max(100),
  description: z.string().min(1).max(1000),
});

// GET /api/tickets - Listar todos os tickets
router.get('/', (req, res) => {
  try {
    const tickets = db.prepare(`
      SELECT 
        t.*,
        COUNT(a.id) as attachments_count
      FROM tickets t
      LEFT JOIN attachments a ON t.id = a.ticket_id
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `).all();

    res.json(tickets);
  } catch (error) {
    console.error('Erro ao listar tickets:', error);
    res.status(500).json({ error: 'Erro ao listar tickets' });
  }
});

// GET /api/tickets/:id - Obter ticket específico
router.get('/:id', (req, res) => {
  try {
    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    const attachments = db.prepare('SELECT * FROM attachments WHERE ticket_id = ?').all(req.params.id);
    
    res.json({ ...ticket, attachments });
  } catch (error) {
    console.error('Erro ao obter ticket:', error);
    res.status(500).json({ error: 'Erro ao obter ticket' });
  }
});

// POST /api/tickets - Criar novo ticket
router.post('/', (req, res) => {
  try {
    const data = ticketSchema.parse(req.body);
    const id = `#${Date.now()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO tickets (id, type, priority, product, title, description, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.type,
      data.priority,
      data.product,
      data.title,
      data.description,
      'aberto',
      now,
      now
    );

    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
    res.status(201).json(ticket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }
    console.error('Erro ao criar ticket:', error);
    res.status(500).json({ error: 'Erro ao criar ticket' });
  }
});

// PUT /api/tickets/:id - Atualizar ticket
router.put('/:id', (req, res) => {
  try {
    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    const updateSchema = z.object({
      status: z.enum(['aberto', 'em_analise', 'em_desenvolvimento', 'resolvido', 'fechado']).optional(),
      title: z.string().min(1).max(100).optional(),
      description: z.string().min(1).max(1000).optional(),
    });

    const data = updateSchema.parse(req.body);
    const now = new Date().toISOString();

    const fields = [];
    const values = [];

    if (data.status) {
      fields.push('status = ?');
      values.push(data.status);
    }
    if (data.title) {
      fields.push('title = ?');
      values.push(data.title);
    }
    if (data.description) {
      fields.push('description = ?');
      values.push(data.description);
    }

    fields.push('updated_at = ?');
    values.push(now);
    values.push(req.params.id);

    db.prepare(`
      UPDATE tickets 
      SET ${fields.join(', ')}
      WHERE id = ?
    `).run(...values);

    const updatedTicket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
    res.json(updatedTicket);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }
    console.error('Erro ao atualizar ticket:', error);
    res.status(500).json({ error: 'Erro ao atualizar ticket' });
  }
});

// DELETE /api/tickets/:id - Deletar ticket
router.delete('/:id', (req, res) => {
  try {
    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    db.prepare('DELETE FROM attachments WHERE ticket_id = ?').run(req.params.id);
    db.prepare('DELETE FROM tickets WHERE id = ?').run(req.params.id);

    res.json({ message: 'Ticket deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar ticket:', error);
    res.status(500).json({ error: 'Erro ao deletar ticket' });
  }
});

export default router;

