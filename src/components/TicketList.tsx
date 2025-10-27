import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket } from "./TicketForm";
import { AlertCircle, Bug, FileText, Lock, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TicketListProps {
  tickets: Ticket[];
}

export const TicketList = ({ tickets }: TicketListProps) => {
  const getTypeIcon = (type: Ticket["type"]) => {
    switch (type) {
      case "bug":
        return <Bug className="h-5 w-5" />;
      case "pedido_acesso":
        return <Lock className="h-5 w-5" />;
      case "solicitacao_arquivo":
        return <FileText className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: Ticket["type"]) => {
    const labels = {
      requisicao: "Requisição",
      bug: "Bug",
      pedido_acesso: "Pedido de Acesso",
      solicitacao_arquivo: "Solicitação de Arquivo",
    };
    return labels[type];
  };

  const getPriorityLabel = (priority: Ticket["priority"]) => {
    const labels = {
      baixa: "Baixa",
      media: "Média",
      alta: "Alta",
      muito_alta: "Muito Alta",
    };
    return labels[priority];
  };

  const getPriorityColor = (priority: Ticket["priority"]) => {
    const colors = {
      baixa: "bg-priority-low/10 text-priority-low border-priority-low/20",
      media: "bg-priority-medium/10 text-priority-medium border-priority-medium/20",
      alta: "bg-priority-high/10 text-priority-high border-priority-high/20",
      muito_alta: "bg-priority-critical/10 text-priority-critical border-priority-critical/20",
    };
    return colors[priority];
  };

  const getStatusLabel = (status: Ticket["status"]) => {
    const labels = {
      aberto: "🟡 Aberto",
      em_analise: "🔵 Em Análise",
      em_desenvolvimento: "🟠 Em Desenvolvimento",
      resolvido: "🟢 Resolvido",
      fechado: "⚪ Fechado",
    };
    return labels[status];
  };

  const getStatusDescription = (status: Ticket["status"]) => {
    const descriptions = {
      aberto: "Criado pela operação, aguardando análise",
      em_analise: "Avaliado pelo desenvolvedor responsável",
      em_desenvolvimento: "Correção ou implementação em andamento",
      resolvido: "Concluído e aguardando validação da operação",
      fechado: "Validação feita, ticket encerrado",
    };
    return descriptions[status];
  };

  if (tickets.length === 0) {
    return (
      <Card className="shadow-[var(--shadow-soft)]">
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Nenhum chamado criado ainda.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket) => (
        <Card
          key={ticket.id}
          className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-all duration-300 hover:scale-[1.01]"
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1 text-primary">{getTypeIcon(ticket.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{ticket.title}</CardTitle>
                    <Badge variant="outline" className="text-xs font-mono">
                      {ticket.id}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {getTypeLabel(ticket.type)}
                    </Badge>
                    <Badge className={`text-xs border ${getPriorityColor(ticket.priority)}`}>
                      {getPriorityLabel(ticket.priority)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs" title={getStatusDescription(ticket.status)}>
                      {getStatusLabel(ticket.status)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                Criado em {format(ticket.createdAt, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
            {ticket.attachments.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {ticket.attachments.length} arquivo(s) anexado(s)
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
