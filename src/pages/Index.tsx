import { useState, useEffect } from "react";
import { TicketForm, Ticket } from "@/components/TicketForm";
import { TicketList } from "@/components/TicketList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import shippifyLogo from "@/assets/shippify-logo.png";
import { ticketApi, Ticket as ApiTicket } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar tickets ao iniciar
  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const apiTickets = await ticketApi.getTickets();
      setTickets(apiTickets.map(convertApiTicketToTicket));
    } catch (error) {
      console.error('Erro ao carregar tickets:', error);
      toast({
        title: "Erro ao carregar tickets",
        description: "Não foi possível conectar ao servidor.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTicketSubmit = async (ticketData: Omit<Ticket, "id" | "createdAt" | "status">) => {
    try {
      // Criar ticket
      const newTicket = await ticketApi.createTicket({
        type: ticketData.type,
        priority: ticketData.priority,
        product: ticketData.product,
        title: ticketData.title,
        description: ticketData.description,
      });

      // Upload de arquivos se houver
      if (ticketData.attachments && ticketData.attachments.length > 0) {
        for (const file of ticketData.attachments) {
          try {
            await ticketApi.uploadFile(newTicket.id, file);
          } catch (error) {
            console.error('Erro ao fazer upload de arquivo:', error);
          }
        }
      }

      // Recarregar tickets
      await loadTickets();
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
      toast({
        title: "Erro ao criar chamado",
        description: error instanceof Error ? error.message : "Não foi possível criar o chamado.",
        variant: "destructive",
      });
    }
  };

  // Converter ticket da API para o formato local
  const convertApiTicketToTicket = (apiTicket: ApiTicket): Ticket => {
    return {
      id: apiTicket.id,
      type: apiTicket.type,
      priority: apiTicket.priority,
      product: apiTicket.product,
      title: apiTicket.title,
      description: apiTicket.description,
      status: apiTicket.status,
      createdAt: new Date(apiTicket.created_at),
      attachments: [],
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src={shippifyLogo} 
              alt="suporte de empresa Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Tech Support suporte de empresa
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Gerencie seus chamados de suporte técnico
          </p>
        </header>

        <Tabs defaultValue="novo" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="novo">Novo Chamado</TabsTrigger>
            <TabsTrigger value="lista">
              Meus Chamados {tickets.length > 0 && `(${tickets.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="novo" className="space-y-6">
            <TicketForm onSubmit={handleTicketSubmit} />
          </TabsContent>

          <TabsContent value="lista" className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Carregando tickets...</p>
              </div>
            ) : (
              <TicketList tickets={tickets} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
