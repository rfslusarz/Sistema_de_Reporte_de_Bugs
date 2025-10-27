import { useState } from "react";
import { TicketForm, Ticket } from "@/components/TicketForm";
import { TicketList } from "@/components/TicketList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import shippifyLogo from "@/assets/shippify-logo.png";

const Index = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const handleTicketSubmit = (ticketData: Omit<Ticket, "id" | "createdAt" | "status">) => {
    const ticketNumber = String(tickets.length + 1).padStart(4, '0');
    const newTicket: Ticket = {
      ...ticketData,
      id: `#${ticketNumber}`,
      status: "aberto",
      createdAt: new Date(),
    };
    setTickets((prev) => [newTicket, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src={shippifyLogo} 
              alt="Shippify Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Tech Support Shippify
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
            <TicketList tickets={tickets} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
