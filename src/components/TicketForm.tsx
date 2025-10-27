import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export type TicketType = "requisicao" | "bug" | "pedido_acesso" | "solicitacao_arquivo";
export type Priority = "baixa" | "media" | "alta" | "muito_alta";
export type Status = "aberto" | "em_analise" | "em_desenvolvimento" | "resolvido" | "fechado";
export type Product = "login" | "nova_entrega" | "importacao_entregas" | "historicos" | "motoristas" | "usuarios" | "pagamentos" | "rotas" | "monitor" | "fleet";

export interface Ticket {
  id: string;
  type: TicketType;
  priority: Priority;
  product: Product;
  title: string;
  description: string;
  attachments: File[];
  status: Status;
  createdAt: Date;
}

interface TicketFormProps {
  onSubmit: (ticket: Omit<Ticket, "id" | "createdAt" | "status">) => void;
}

export const TicketForm = ({ onSubmit }: TicketFormProps) => {
  const [type, setType] = useState<TicketType | "">("");
  const [priority, setPriority] = useState<Priority | "">("");
  const [product, setProduct] = useState<Product | "">("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
      toast({
        title: "Arquivos adicionados",
        description: `${newFiles.length} arquivo(s) anexado(s) com sucesso.`,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!type || !priority || !product || !title || !description) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      type: type as TicketType,
      priority: priority as Priority,
      product: product as Product,
      title,
      description,
      attachments,
    });

    // Reset form
    setType("");
    setPriority("");
    setProduct("");
    setTitle("");
    setDescription("");
    setAttachments([]);
    
    toast({
      title: "Chamado criado!",
      description: "Seu chamado foi registrado com sucesso.",
    });
  };

  const typeLabels = {
    requisicao: "Requisição",
    bug: "Bug",
    pedido_acesso: "Pedido de Acesso",
    solicitacao_arquivo: "Solicitação de Arquivo",
  };

  const priorityLabels = {
    baixa: "Baixa",
    media: "Média",
    alta: "Alta",
    muito_alta: "Muito Alta",
  };

  const productLabels = {
    login: "Login",
    nova_entrega: "Nova Entrega",
    importacao_entregas: "Importação de Entregas",
    historicos: "Históricos",
    motoristas: "Motoristas",
    usuarios: "Usuários",
    pagamentos: "Pagamentos",
    rotas: "Rotas",
    monitor: "Monitor",
    fleet: "Fleet",
  };

  return (
    <Card className="shadow-[var(--shadow-medium)] bg-gradient-to-b from-card to-card/95">
      <CardHeader>
        <CardTitle className="text-2xl">Novo Chamado</CardTitle>
        <CardDescription>Preencha os dados para abrir um novo chamado de suporte</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Chamado *</Label>
              <Select value={type} onValueChange={(value) => setType(value as TicketType)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(typeLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade *</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(priorityLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="product">Produto do Sistema *</Label>
            <Select value={product} onValueChange={(value) => setProduct(value as Product)}>
              <SelectTrigger id="product">
                <SelectValue placeholder="Selecione o produto" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(productLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título do Chamado *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite um título descritivo"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva detalhadamente o problema ou solicitação"
              className="min-h-[120px]"
              maxLength={1000}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments">Evidências (Fotos/Vídeos)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="attachments"
                type="file"
                onChange={handleFileChange}
                multiple
                accept="image/*,video/*"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("attachments")?.click()}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                Adicionar Arquivos
              </Button>
            </div>
            {attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    <span>{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Criar Chamado
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
