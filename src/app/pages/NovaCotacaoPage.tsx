import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Card } from "@/app/components/ui/card";
import { toast } from "sonner";

interface ItemCotacao {
  id: string;
  descricao: string;
  quantidade: string;
}

export function NovaCotacaoPage() {
  const navigate = useNavigate();
  const [tipoCarne, setTipoCarne] = useState("");
  const [prazo, setPrazo] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [itens, setItens] = useState<ItemCotacao[]>([
    { id: "1", descricao: "", quantidade: "" }
  ]);

  const handleSubmit = () => {
    if (!tipoCarne || itens.some(item => !item.descricao || !item.quantidade)) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    toast.success("Cotação solicitada com sucesso!");
    navigate("/cotacoes");
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-md mx-auto">
          <button onClick={() => navigate("/cotacoes")} className="flex items-center text-gray-600 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Nova Cotação</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <Card className="p-4">
          <Label>Tipo de Carne *</Label>
          <Select value={tipoCarne} onValueChange={setTipoCarne}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bovina">Bovina</SelectItem>
              <SelectItem value="Suína">Suína</SelectItem>
              <SelectItem value="Ovina">Ovina</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Label>Itens *</Label>
            <Button onClick={() => setItens([...itens, { id: Date.now().toString(), descricao: "", quantidade: "" }])} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-3">
            {itens.map((item, index) => (
              <div key={item.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Item {index + 1}</span>
                  {itens.length > 1 && (
                    <button
                      onClick={() => setItens(itens.filter(i => i.id !== item.id))}
                      className="text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <Input
                  placeholder="Descrição do item"
                  value={item.descricao}
                  onChange={(e) => {
                    const newItens = [...itens];
                    newItens[index].descricao = e.target.value;
                    setItens(newItens);
                  }}
                />
                <Input
                  placeholder="Quantidade (ex: 500kg)"
                  value={item.quantidade}
                  onChange={(e) => {
                    const newItens = [...itens];
                    newItens[index].quantidade = e.target.value;
                    setItens(newItens);
                  }}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <Label>Prazo para Resposta</Label>
          <Input
            type="date"
            value={prazo}
            onChange={(e) => setPrazo(e.target.value)}
            className="mt-2"
            min={new Date().toISOString().split('T')[0]}
          />
        </Card>

        <Card className="p-4">
          <Label>Observações</Label>
          <Textarea
            placeholder="Informações adicionais..."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="mt-2"
            rows={4}
          />
        </Card>

        <Button onClick={handleSubmit} className="w-full bg-[#c51d1f] hover:bg-[#a01517]">
          Enviar Solicitação
        </Button>
      </div>
    </div>
  );
}
