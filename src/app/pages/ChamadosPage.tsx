import { useState, useRef, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useAuth } from "@/app/contexts/AuthContext";

interface Message {
  id: string;
  texto: string;
  remetente: "usuario" | "admin";
  timestamp: Date;
}

const mockMensagens: Message[] = [
  {
    id: "1",
    texto: "Olá! Bem-vindo à Central de Relacionamento COOPERCARNE. Como posso ajudá-lo?",
    remetente: "admin",
    timestamp: new Date("2026-01-29T09:00:00"),
  },
  {
    id: "2",
    texto: "Bom dia! Gostaria de saber sobre o status do meu pedido PED002",
    remetente: "usuario",
    timestamp: new Date("2026-01-29T09:05:00"),
  },
  {
    id: "3",
    texto: "Deixe-me verificar para você. Um momento, por favor.",
    remetente: "admin",
    timestamp: new Date("2026-01-29T09:06:00"),
  },
  {
    id: "4",
    texto: "Seu pedido PED002 está em produção e a previsão de entrega é para amanhã, dia 30/01. Precisa de mais alguma informação?",
    remetente: "admin",
    timestamp: new Date("2026-01-29T09:08:00"),
  },
];

export function ChamadosPage() {
  const { user } = useAuth();
  const [mensagens, setMensagens] = useState<Message[]>(mockMensagens);
  const [novaMensagem, setNovaMensagem] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const handleEnviar = () => {
    if (!novaMensagem.trim()) return;

    const mensagem: Message = {
      id: Date.now().toString(),
      texto: novaMensagem,
      remetente: "usuario",
      timestamp: new Date(),
    };

    setMensagens([...mensagens, mensagem]);
    setNovaMensagem("");

    // Simula resposta automática do admin após 2 segundos
    setTimeout(() => {
      const respostaAdmin: Message = {
        id: (Date.now() + 1).toString(),
        texto: "Obrigado pela mensagem! Nossa equipe irá responder em breve.",
        remetente: "admin",
        timestamp: new Date(),
      };
      setMensagens((prev) => [...prev, respostaAdmin]);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    const hoje = new Date();
    const ontem = new Date(hoje);
    ontem.setDate(ontem.getDate() - 1);

    if (date.toDateString() === hoje.toDateString()) {
      return "Hoje";
    } else if (date.toDateString() === ontem.toDateString()) {
      return "Ontem";
    } else {
      return date.toLocaleDateString("pt-BR");
    }
  };

  return (
    <div className="min-h-full bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex-shrink-0">
        <div className="max-w-md mx-auto">
          <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Central de Relacionamento</h1>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="max-w-md mx-auto px-4 py-4 space-y-4">
          {mensagens.map((mensagem, index) => {
            const mostrarData =
              index === 0 ||
              formatDate(mensagens[index - 1].timestamp) !== formatDate(mensagem.timestamp);

            return (
              <div key={mensagem.id}>
                {mostrarData && (
                  <div className="flex justify-center mb-4">
                    <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                      {formatDate(mensagem.timestamp)}
                    </span>
                  </div>
                )}

                <div
                  className={`flex ${
                    mensagem.remetente === "usuario" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] rounded-lg px-4 py-2 ${
                      mensagem.remetente === "usuario"
                        ? "bg-[#c51d1f] text-white"
                        : "bg-white border border-gray-200 text-gray-900"
                    }`}
                  >
                    {mensagem.remetente === "admin" && (
                      <p className="text-xs font-semibold text-gray-600 mb-1">Administrador</p>
                    )}
                    <p className="text-sm whitespace-pre-wrap break-words">{mensagem.texto}</p>
                    <p
                      className={`text-xs mt-1 ${
                        mensagem.remetente === "usuario"
                          ? "text-white/70"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(mensagem.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-b border-gray-200 px-4 py-3 z-10">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-gray-500" />
          </button>
          <Input
            placeholder="Digite sua mensagem..."
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border-gray-300"
          />
          <Button
            onClick={handleEnviar}
            disabled={!novaMensagem.trim()}
            className="bg-[#c51d1f] hover:bg-[#a01517] px-4"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}