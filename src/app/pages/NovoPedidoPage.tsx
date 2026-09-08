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

const TIPOS_UNIDADE_CARCACA = ["Carcaça Inteira", "Meia Carcaça (Banda)"];

interface UnidadeCarcaca {
  id: string;
  tipo: string;
  quantidade: string;
}

export function NovoPedidoPage() {
  const navigate = useNavigate();
  const [tipoCarne, setTipoCarne] = useState("");
  const [dataDesejada, setDataDesejada] = useState("");
  const [localEntrega, setLocalEntrega] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [unidades, setUnidades] = useState<UnidadeCarcaca[]>([
    { id: "1", tipo: "", quantidade: "" }
  ]);

  const handleAddUnidade = () => {
    setUnidades([...unidades, { id: Date.now().toString(), tipo: "", quantidade: "" }]);
  };

  const handleRemoveUnidade = (id: string) => {
    if (unidades.length > 1) {
      setUnidades(unidades.filter(unidade => unidade.id !== id));
    }
  };

  const handleSubmit = (status: "rascunho" | "enviado") => {
    if (!tipoCarne) {
      toast.error("Selecione o tipo de carne");
      return;
    }

    if (status === "enviado") {
      const hasEmptyUnidades = unidades.some(unidade => !unidade.tipo || !unidade.quantidade);
      if (hasEmptyUnidades) {
        toast.error("Preencha todas as unidades de carcaça do pedido");
        return;
      }
    }

    toast.success(status === "rascunho" ? "Rascunho salvo com sucesso!" : "Pedido enviado com sucesso!");
    navigate("/pedidos");
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto">
          <button onClick={() => navigate("/pedidos")} className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wide">Novo Pedido</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Tipo de Carne */}
        <Card className="p-4 border-gray-200">
          <Label>Tipo de Carne *</Label>
          <Select value={tipoCarne} onValueChange={setTipoCarne}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bovina">Bovina</SelectItem>
              <SelectItem value="suina">Suína</SelectItem>
              <SelectItem value="ovina">Ovina</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* Unidades de Carcaça */}
        <Card className="p-4 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Label>Unidades de Carcaça</Label>
            <Button onClick={handleAddUnidade} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-3">
            {unidades.map((unidade, index) => (
              <div key={unidade.id} className="p-3 border border-gray-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Unidade {index + 1}</span>
                  {unidades.length > 1 && (
                    <button
                      onClick={() => handleRemoveUnidade(unidade.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={unidade.tipo}
                    onValueChange={(value) => {
                      const newUnidades = [...unidades];
                      newUnidades[index].tipo = value;
                      setUnidades(newUnidades);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de Unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_UNIDADE_CARCACA.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min={1}
                    placeholder="Quantidade"
                    value={unidade.quantidade}
                    onChange={(e) => {
                      const newUnidades = [...unidades];
                      newUnidades[index].quantidade = e.target.value;
                      setUnidades(newUnidades);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Data Desejada */}
        <Card className="p-4 border-gray-200">
          <Label>Data Desejada</Label>
          <Input
            type="date"
            value={dataDesejada}
            onChange={(e) => setDataDesejada(e.target.value)}
            className="mt-2"
            min={new Date().toISOString().split('T')[0]}
          />
        </Card>

        {/* Local de Entrega */}
        <Card className="p-4 border-gray-200">
          <Label>Local de Entrega/Retirada</Label>
          <Select value={localEntrega} onValueChange={setLocalEntrega}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Selecione o local" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="matriz">Matriz - Rua Principal, 123</SelectItem>
              <SelectItem value="filial1">Filial 1 - Av. Central, 456</SelectItem>
              <SelectItem value="retirada">Retirar no Frigorífico</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* Observações */}
        <Card className="p-4 border-gray-200">
          <Label>Observações</Label>
          <Textarea
            placeholder="Informações adicionais sobre o pedido..."
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="mt-2"
            rows={4}
          />
        </Card>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={() => handleSubmit("rascunho")}
            variant="outline"
            className="flex-1"
          >
            Salvar Rascunho
          </Button>
          <Button
            onClick={() => handleSubmit("enviado")}
            className="flex-1 bg-[#c51d1f] hover:bg-[#a01517]"
          >
            Enviar Pedido
          </Button>
        </div>
      </div>
    </div>
  );
}
