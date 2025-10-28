const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface Ticket {
  id: string;
  type: 'requisicao' | 'bug' | 'pedido_acesso' | 'solicitacao_arquivo';
  priority: 'baixa' | 'media' | 'alta' | 'muito_alta';
  product: 'login' | 'nova_entrega' | 'importacao_entregas' | 'historicos' | 'motoristas' | 'usuarios' | 'pagamentos' | 'rotas' | 'monitor' | 'fleet';
  title: string;
  description: string;
  status: 'aberto' | 'em_analise' | 'em_desenvolvimento' | 'resolvido' | 'fechado';
  created_at: string;
  updated_at: string;
  attachments_count?: number;
}

export interface Attachment {
  id: string;
  ticket_id: string;
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  path: string;
  created_at: string;
}

export const ticketApi = {
  // Listar todos os tickets
  async getTickets(): Promise<Ticket[]> {
    const response = await fetch(`${API_URL}/api/tickets`);
    if (!response.ok) throw new Error('Erro ao buscar tickets');
    return response.json();
  },

  // Obter ticket por ID
  async getTicket(id: string): Promise<Ticket & { attachments: Attachment[] }> {
    const response = await fetch(`${API_URL}/api/tickets/${id}`);
    if (!response.ok) throw new Error('Erro ao buscar ticket');
    return response.json();
  },

  // Criar novo ticket
  async createTicket(data: Omit<Ticket, 'id' | 'created_at' | 'updated_at' | 'status' | 'attachments_count'>): Promise<Ticket> {
    const response = await fetch(`${API_URL}/api/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro ao criar ticket');
    }
    return response.json();
  },

  // Atualizar ticket
  async updateTicket(id: string, data: Partial<Pick<Ticket, 'status' | 'title' | 'description'>>): Promise<Ticket> {
    const response = await fetch(`${API_URL}/api/tickets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Erro ao atualizar ticket');
    return response.json();
  },

  // Deletar ticket
  async deleteTicket(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/tickets/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar ticket');
  },

  // Upload de arquivo
  async uploadFile(ticketId: string, file: File): Promise<Attachment> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/api/uploads/${ticketId}`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Erro ao fazer upload do arquivo');
    return response.json();
  },

  // Listar anexos de um ticket
  async getAttachments(ticketId: string): Promise<Attachment[]> {
    const response = await fetch(`${API_URL}/api/uploads/${ticketId}`);
    if (!response.ok) throw new Error('Erro ao buscar anexos');
    return response.json();
  },

  // Download de arquivo
  getDownloadUrl(ticketId: string, fileId: string): string {
    return `${API_URL}/api/uploads/${ticketId}/${fileId}/download`;
  },
};

