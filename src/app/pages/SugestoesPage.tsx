import { useState } from "react";
import { Send, Lightbulb, X } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { toast } from "sonner";

const mockSugestoes = [
  { id: "1", categoria: "Atendimento", texto: "Sugestão de melhor horário de atendimento telefônico", data: "2026-01-25", lida: true },
  { id: "2", categoria: "Produtos", texto: "Incluir mais opções de cortes especiais", data: "2026-01-20", lida: true },
];

export function SugestoesPage() {
  const [categoria, setCategoria] = useState("");
  const [texto, setTexto] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleEnviar = () => {
    if (!categoria || !texto) {
      toast.error("Preencha todos os campos");
      return;
    }

    toast.success("Sugestão enviada com sucesso!");
    setCategoria("");
    setTexto("");
    setMostrarFormulario(false);
  };

  if (mostrarFormulario) {
    return (
      <div className="min-h-full bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Nova Sugestão</h1>
            <button
              onClick={() => setMostrarFormulario(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-6">
          <Card className="p-4 border-gray-200">
            <div className="space-y-4">
              <div>
                <Label className="text-gray-900 font-medium">Categoria *</Label>
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger className="mt-2 border-gray-300">
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Atendimento">Atendimento</SelectItem>
                    <SelectItem value="Produtos">Produtos</SelectItem>
                    <SelectItem value="Logística">Logística</SelectItem>
                    <SelectItem value="Qualidade">Qualidade</SelectItem>
                    <SelectItem value="Portal">Portal/App</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-900 font-medium">Sua Sugestão *</Label>
                <Textarea
                  placeholder="Descreva sua sugestão ou ideia..."
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  className="mt-2 border-gray-300"
                  rows={8}
                />
              </div>

              <Button onClick={handleEnviar} className="w-full bg-[#c51d1f] hover:bg-[#a01517] shadow-md">
                <Send className="w-4 h-4 mr-2" />
                Enviar Sugestão
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Caixa de Sugestões</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <Card className="p-4 bg-white border-gray-200">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-6 h-6 text-gray-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900 mb-1">Sua opinião é importante!</h3>
              <p className="text-sm text-gray-600">
                Envie suas sugestões para melhorarmos nossos serviços. Valorizamos cada contribuição.
              </p>
            </div>
          </div>
        </Card>

        <Button 
          onClick={() => setMostrarFormulario(true)}
          className="w-full bg-[#c51d1f] hover:bg-[#a01517] shadow-md"
        >
          <Send className="w-4 h-4 mr-2" />
          Nova Sugestão
        </Button>

        <div>
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Minhas Sugestões Anteriores</h3>
          <div className="space-y-3">
            {mockSugestoes.map((sug) => (
              <Card key={sug.id} className="p-4 border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <Badge className="bg-gray-600 text-white text-xs uppercase tracking-wide">{sug.categoria}</Badge>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {new Date(sug.data).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <p className="text-sm text-gray-900">{sug.texto}</p>
                {sug.lida && (
                  <p className="text-xs text-gray-500 mt-2">✓ Lida pela equipe</p>
                )}
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
