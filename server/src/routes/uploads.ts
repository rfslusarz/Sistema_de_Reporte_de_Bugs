import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/database.js';

const router = express.Router();

// Configurar multer para salvar arquivos
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|mp4|mov|avi|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não permitido'));
    }
  }
});

// POST /api/uploads/:ticketId - Upload de arquivo para um ticket
router.post('/:ticketId', upload.single('file'), (req, res) => {
  try {
    const { ticketId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(ticketId) as Record<string, unknown> | undefined;
    
    if (!ticket) {
      // Deletar arquivo se ticket não existe
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Ticket não encontrado' });
    }

    const file = req.file as Express.Multer.File;
    const attachment = {
      id: uuidv4(),
      ticket_id: ticketId,
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      created_at: new Date().toISOString()
    };

    db.prepare(`
      INSERT INTO attachments (id, ticket_id, filename, originalname, mimetype, size, path, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      attachment.id,
      attachment.ticket_id,
      attachment.filename,
      attachment.originalname,
      attachment.mimetype,
      attachment.size,
      attachment.path,
      attachment.created_at
    );

    res.status(201).json(attachment);
  } catch (error) {
    console.error('Erro ao fazer upload:', error);
    res.status(500).json({ error: 'Erro ao fazer upload do arquivo' });
  }
});

// GET /api/uploads/:ticketId - Listar anexos de um ticket
router.get('/:ticketId', (req, res) => {
  try {
    const attachments = db.prepare('SELECT * FROM attachments WHERE ticket_id = ?').all(req.params.ticketId);
    res.json(attachments);
  } catch (error) {
    console.error('Erro ao listar anexos:', error);
    res.status(500).json({ error: 'Erro ao listar anexos' });
  }
});

// GET /api/uploads/:ticketId/:fileId/download - Download de arquivo
router.get('/:ticketId/:fileId/download', (req, res) => {
  try {
    const { ticketId, fileId } = req.params;
    
    const attachment = db.prepare('SELECT * FROM attachments WHERE id = ? AND ticket_id = ?')
      .get(fileId, ticketId) as { path: string; originalname: string } | undefined;
    
    if (!attachment) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    const filePath = path.join(process.cwd(), attachment.path);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Arquivo não encontrado no servidor' });
    }

    res.download(filePath, attachment.originalname);
  } catch (error) {
    console.error('Erro ao fazer download:', error);
    res.status(500).json({ error: 'Erro ao fazer download do arquivo' });
  }
});

// DELETE /api/uploads/:ticketId/:fileId - Deletar anexo
router.delete('/:ticketId/:fileId', (req, res) => {
  try {
    const { ticketId, fileId } = req.params;
    
    const attachment = db.prepare('SELECT * FROM attachments WHERE id = ? AND ticket_id = ?')
      .get(fileId, ticketId) as { path: string } | undefined;
    
    if (!attachment) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    // Deletar arquivo do sistema de arquivos
    const filePath = path.join(process.cwd(), attachment.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Deletar registro do banco
    db.prepare('DELETE FROM attachments WHERE id = ?').run(fileId);

    res.json({ message: 'Arquivo deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    res.status(500).json({ error: 'Erro ao deletar arquivo' });
  }
});

export default router;

