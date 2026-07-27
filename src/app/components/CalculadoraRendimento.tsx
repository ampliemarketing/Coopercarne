import { useState } from "react";
import { Calculator, TrendingUp } from "lucide-react";
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

export function CalculadoraRendimento() {
  const [tipoAnimal, setTipoAnimal] = useState("bovino");
  const [pesoVivo, setPesoVivo] = useState("");
  const [precoKg, setPrecoKg] = useState("");
  const [resultado, setResultado] = useState<any>(null);

  const rendimentos = {
    bovino: { carcaca: 0.52, desossa: 0.72 },
    suino: { carcaca: 0.75, desossa: 0.68 },
    ovino: { carcaca: 0.48, desossa: 0.65 },
  };

  const calcular = () => {
    const peso = parseFloat(pesoVivo);
    const preco = parseFloat(precoKg);

    if (!peso || !preco) return;

    const rendimento = rendimentos[tipoAnimal as keyof typeof rendimentos];
    const pesoCarcaca = peso * rendimento.carcaca;
    const pesoDesossado = pesoCarcaca * rendimento.desossa;
    const custoTotal = peso * preco;
    const custoKgCarcaca = custoTotal / pesoCarcaca;
    const custoKgDesossado = custoTotal / pesoDesossado;

    setResultado({
      pesoCarcaca: pesoCarcaca.toFixed(2),
      pesoDesossado: pesoDesossado.toFixed(2),
      custoTotal: custoTotal.toFixed(2),
      custoKgCarcaca: custoKgCarcaca.toFixed(2),
      custoKgDesossado: custoKgDesossado.toFixed(2),
      rendimentoCarcaca: (rendimento.carcaca * 100).toFixed(1),
      rendimentoDesossa: (rendimento.desossa * 100).toFixed(1),
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#c51d1f] p-3 rounded-lg">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Calculadora de Rendimento
          </h3>
          <p className="text-sm text-gray-500">
            Calcule o rendimento e custo por kg
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-gray-700 font-medium">Tipo de Animal</Label>
          <Select value={tipoAnimal} onValueChange={setTipoAnimal}>
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
          <Label className="text-gray-700 font-medium">Peso Vivo (kg)</Label>
          <Input
            type="number"
            placeholder="Ex: 500"
            value={pesoVivo}
            onChange={(e) => setPesoVivo(e.target.value)}
            className="bg-white border-gray-300 text-gray-900"
          />
        </div>

        <div>
          <Label className="text-gray-700 font-medium">Preço por kg (R$)</Label>
          <Input
            type="number"
            placeholder="Ex: 325.00"
            value={precoKg}
            onChange={(e) => setPrecoKg(e.target.value)}
            className="bg-white border-gray-300 text-gray-900"
          />
        </div>

        <Button
          onClick={calcular}
          className="w-full bg-[#c51d1f] hover:bg-[#a01718] text-white"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calcular
        </Button>
      </div>

      {resultado && (
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-[#c51d1f]" />
            <h4 className="font-semibold text-gray-900">Resultados</h4>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Peso Carcaça</p>
              <p className="text-lg font-bold text-gray-900">
                {resultado.pesoCarcaca} kg
              </p>
              <p className="text-xs text-gray-500">
                ({resultado.rendimentoCarcaca}%)
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Peso Desossado</p>
              <p className="text-lg font-bold text-gray-900">
                {resultado.pesoDesossado} kg
              </p>
              <p className="text-xs text-gray-500">
                ({resultado.rendimentoDesossa}%)
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Custo/kg Carcaça</p>
              <p className="text-lg font-bold text-[#c51d1f]">
                R$ {resultado.custoKgCarcaca}
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Custo/kg Desossado</p>
              <p className="text-lg font-bold text-[#c51d1f]">
                R$ {resultado.custoKgDesossado}
              </p>
            </div>
          </div>

          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
            <p className="text-xs text-gray-600 mb-1">Custo Total</p>
            <p className="text-2xl font-bold text-[#c51d1f]">
              R$ {resultado.custoTotal}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}