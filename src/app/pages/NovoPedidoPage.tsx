import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Plus, Trash2, AlertOctagon, CreditCard } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Card } from "@/app/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/app/contexts/AuthContext";

interface ItemPedido {
  id: string;
  corte: string;
  quantidade: string;
  unidade: string;
}

export function NovoPedidoPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tipoCarne, setTipoCarne] = useState("");
  const [dataDesejada, setDataDesejada] = useState("");
  const [localEntrega, setLocalEntrega] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [itens, setItens] = useState<ItemPedido[]>([
    { id: "1", corte: "", quantidade: "", unidade: "kg" }
  ]);

  const isBloqueado = user?.pendenciaFinanceira?.bloqueado;

  const handleAddItem = () => {
    setItens([...itens, { id: Date.now().toString(), corte: "", quantidade: "", unidade: "kg" }]);
  };

  const handleRemoveItem = (id: string) => {
    if (itens.length > 1) {
      setItens(itens.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (status: "rascunho" | "enviado") => {
    if (isBloqueado) {
      toast.error("Envio de pedidos bloqueado por pendência financeira. Regularize no menu Financeiro.");
      return;
    }

    if (!tipoCarne) {
      toast.error("Selecione o tipo de carne");
      return;
    }

    if (status === "enviado") {
      const hasEmptyItems = itens.some(item => !item.corte || !item.quantidade);
      if (hasEmptyItems) {
        toast.error("Preencha todos os itens do pedido");
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
        {isBloqueado && (
          <Card className="border-red-300 bg-red-50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-[#c51d1f] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-xs font-bold text-[#c51d1f] uppercase tracking-wide">
                  Acesso Bloqueado para Envio de Pedidos
                </h3>
                <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                  Identificamos pendências financeiras em seu cadastro. O envio de novos pedidos está desabilitado até a regularização dos débitos.
                </p>
                <Button
                  size="sm"
                  onClick={() => navigate("/financeiro")}
                  className="mt-3 bg-[#c51d1f] hover:bg-[#a01517] text-white text-xs font-bold"
                >
                  <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                  Ir para Financeiro & Regularizar
                </Button>
              </div>
            </div>
          </Card>
        )}

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

        {/* Itens do Pedido */}
        <Card className="p-4 border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <Label>Itens do Pedido</Label>
            <Button onClick={handleAddItem} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-1" />
              Adicionar
            </Button>
          </div>

          <div className="space-y-3">
            {itens.map((item, index) => (
              <div key={item.id} className="p-3 border border-gray-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Item {index + 1}</span>
                  {itens.length > 1 && (
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <Input
                    placeholder="Corte (ex: Dianteiro, Traseiro, Alcatra...)"
                    value={item.corte}
                    onChange={(e) => {
                      const newItens = [...itens];
                      newItens[index].corte = e.target.value;
                      setItens(newItens);
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Quantidade"
                    value={item.quantidade}
                    onChange={(e) => {
                      const newItens = [...itens];
                      newItens[index].quantidade = e.target.value;
                      setItens(newItens);
                    }}
                  />
                  <Select
                    value={item.unidade}
                    onValueChange={(value) => {
                      const newItens = [...itens];
                      newItens[index].unidade = value;
                      setItens(newItens);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kg</SelectItem>
                      <SelectItem value="unidades">Unidades</SelectItem>
                      <SelectItem value="@">@ (Arroba)</SelectItem>
                    </SelectContent>
                  </Select>
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
