import { useState } from "react";
import { Bell, ChevronRight } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

const mockAvisos = [
  {
    id: "1",
    titulo: "Novo horário de atendimento",
    mensagem: "A partir de fevereiro, o frigorífico funcionará de segunda a sexta, das 7h às 17h.",
    data: "2026-01-28",
    lido: false,
    tipo: "oficial",
  },
  {
    id: "2",
    titulo: "Manutenção programada",
    mensagem: "Haverá manutenção no sistema dia 05/02. O portal ficará indisponível das 22h às 2h.",
    data: "2026-01-27",
    lido: false,
    tipo: "oficial",
  },
  {
    id: "3",
    titulo: "Seu pedido foi faturado",
    mensagem: "O pedido PED002 foi faturado e está pronto para retirada.",
    data: "2026-01-26",
    lido: true,
    tipo: "notificacao",
  },
  {
    id: "4",
    titulo: "Novos preços disponíveis",
    mensagem: "Os preços foram atualizados. Confira as novas cotações.",
    data: "2026-01-25",
    lido: true,
    tipo: "notificacao",
  },
  {
    id: "5",
    titulo: "Agendamento confirmado",
    mensagem: "Seu agendamento de abate para 05/02 foi confirmado.",
    data: "2026-01-24",
    lido: true,
    tipo: "notificacao",
  },
];

export function ComunicacaoPage() {
  const [mensagens, setMensagens] = useState(mockAvisos);

  const naoLidas = mensagens.filter(m => !m.lido).length;

  const marcarComoLido = (id: string) => {
    setMensagens(mensagens.map(m => m.id === id ? { ...m, lido: true } : m));
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Comunicados</h1>
            {naoLidas > 0 && (
              <Badge className="bg-[#c51d1f] text-white text-xs uppercase tracking-wide">{naoLidas} novas</Badge>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        <Tabs defaultValue="todas">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="todas" className="uppercase text-xs tracking-wide">Todas</TabsTrigger>
            <TabsTrigger value="nao-lidas" className="uppercase text-xs tracking-wide">Não Lidas ({naoLidas})</TabsTrigger>
          </TabsList>

          <TabsContent value="todas" className="space-y-3">
            {mensagens.map((msg) => (
              <Card
                key={msg.id}
                onClick={() => marcarComoLido(msg.id)}
                className={`cursor-pointer border-gray-200 hover:shadow-lg transition-shadow ${!msg.lido ? "bg-gray-50" : ""}`}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <Bell className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 text-sm pr-2">{msg.titulo}</h3>
                        {!msg.lido && (
                          <div className="w-2 h-2 bg-gray-800 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{msg.mensagem}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          {new Date(msg.data).toLocaleDateString("pt-BR")}
                        </p>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="nao-lidas" className="space-y-3">
            {mensagens.filter(m => !m.lido).length === 0 ? (
              <Card className="p-8 text-center border-gray-200">
                <p className="text-sm text-gray-500">Nenhuma mensagem não lida</p>
              </Card>
            ) : (
              mensagens.filter(m => !m.lido).map((msg) => (
                <Card
                  key={msg.id}
                  onClick={() => marcarComoLido(msg.id)}
                  className="cursor-pointer border-gray-200 hover:shadow-lg transition-shadow bg-gray-50"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-gray-100">
                        <Bell className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900 text-sm pr-2">{msg.titulo}</h3>
                          <div className="w-2 h-2 bg-gray-800 rounded-full flex-shrink-0 mt-1"></div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{msg.mensagem}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            {new Date(msg.data).toLocaleDateString("pt-BR")}
                          </p>
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}