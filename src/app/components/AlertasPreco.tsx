import { useState } from "react";
import { Bell, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { toast } from "sonner";

interface Alerta {
  id: string;
  tipoAnimal: string;
  condicao: "maior" | "menor";
  valor: number;
  ativo: boolean;
}

export function AlertasPreco() {
  const [alertas, setAlertas] = useState<Alerta[]>([
    { id: "1", tipoAnimal: "bovino", condicao: "maior", valor: 330, ativo: true },
    { id: "2", tipoAnimal: "suino", condicao: "menor", valor: 8.0, ativo: true },
  ]);

  const [alertasExpanded, setAlertasExpanded] = useState(false);

  const [novoAlerta, setNovoAlerta] = useState({
    tipoAnimal: "bovino",
    condicao: "maior" as "maior" | "menor",
    valor: "",
  });

  const adicionarAlerta = () => {
    if (!novoAlerta.valor) {
      toast.error("Preencha o valor do alerta");
      return;
    }

    const alerta: Alerta = {
      id: Date.now().toString(),
      tipoAnimal: novoAlerta.tipoAnimal,
      condicao: novoAlerta.condicao,
      valor: parseFloat(novoAlerta.valor),
      ativo: true,
    };

    setAlertas([...alertas, alerta]);
    setNovoAlerta({ tipoAnimal: "bovino", condicao: "maior", valor: "" });
    toast.success("Alerta criado com sucesso!");
  };

  const removerAlerta = (id: string) => {
    setAlertas(alertas.filter((a) => a.id !== id));
    toast.success("Alerta removido");
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#c51d1f] p-3 rounded-lg">
          <Bell className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Alertas de Preço
          </h3>
          <p className="text-sm text-gray-500">
            Receba notificações quando o preço atingir o valor desejado
          </p>
        </div>
      </div>

      {/* Novo Alerta */}
      <div className="space-y-4 mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900">Criar Novo Alerta</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-gray-700 font-medium">Animal</Label>
            <Select
              value={novoAlerta.tipoAnimal}
              onValueChange={(value) =>
                setNovoAlerta({ ...novoAlerta, tipoAnimal: value })
              }
            >
              <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bovino">Bovino</SelectItem>
                <SelectItem value="suino">Suíno</SelectItem>
                <SelectItem value="ovino">Ovino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-gray-700 font-medium">Condição</Label>
            <Select
              value={novoAlerta.condicao}
              onValueChange={(value: "maior" | "menor") =>
                setNovoAlerta({ ...novoAlerta, condicao: value })
              }
            >
              <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maior">Maior que</SelectItem>
                <SelectItem value="menor">Menor que</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-700 font-medium">Valor (R$)</Label>
          <Input
            type="number"
            placeholder="Ex: 330.00"
            value={novoAlerta.valor}
            onChange={(e) =>
              setNovoAlerta({ ...novoAlerta, valor: e.target.value })
            }
            className="bg-white border-gray-300 text-gray-900"
          />
        </div>

        <Button
          onClick={adicionarAlerta}
          className="w-full bg-[#c51d1f] hover:bg-[#a01718] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Alerta
        </Button>
      </div>

      {/* Lista de Alertas */}
      <div className="space-y-3">
        <button
          onClick={() => setAlertasExpanded(!alertasExpanded)}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-sm font-semibold text-gray-700">
            Alertas Ativos ({alertas.length})
          </h4>
          {alertasExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>
        
        {alertasExpanded && (
          <>
            {alertas.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  Nenhum alerta configurado
                </p>
              </div>
            ) : (
              alertas.map((alerta) => (
                <div
                  key={alerta.id}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {alerta.tipoAnimal}
                    </p>
                    <p className="text-xs text-gray-500">
                      {alerta.condicao === "maior" ? "Maior que" : "Menor que"} R${" "}
                      {alerta.valor.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" title="Ativo" />
                    <button
                      onClick={() => removerAlerta(alerta.id)}
                      className="p-2 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}