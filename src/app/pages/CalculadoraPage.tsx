import { useState } from "react";
import { Plus, Trash2, TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";

interface CustoItem {
  id: string;
  label: string;
  valor: string;
}

const parseNum = (v: string) => {
  const n = parseFloat(v.replace(",", "."));
  return isNaN(n) ? 0 : n;
};

const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function CalculadoraPage() {
  // Etapa 1 — Rendimento de Carcaça (pode inverter: % -> kg ou kg -> %)
  const [pesoAnimal, setPesoAnimal] = useState("");
  const [percentualRendimento, setPercentualRendimento] = useState("");
  const [kgAproveitadoInput, setKgAproveitadoInput] = useState("");
  const [modoInvertido, setModoInvertido] = useState(false);

  const kgAproveitado = modoInvertido
    ? parseNum(kgAproveitadoInput)
    : parseNum(pesoAnimal) * (parseNum(percentualRendimento) / 100);

  const percentualCalculado =
    modoInvertido && parseNum(pesoAnimal) > 0
      ? (parseNum(kgAproveitadoInput) / parseNum(pesoAnimal)) * 100
      : parseNum(percentualRendimento);

  // Etapa 2 — Conversão em Arrobas
  const [kgParaArrobas, setKgParaArrobas] = useState("");
  const [kgPorArroba, setKgPorArroba] = useState("15");

  const kgArrobasEfetivo = kgParaArrobas.trim() ? parseNum(kgParaArrobas) : kgAproveitado;
  const divisorArroba = parseNum(kgPorArroba) || 15;
  const numeroArrobas = kgArrobasEfetivo / divisorArroba;

  // Etapa 3 — Receita Bruta
  const [precoArroba, setPrecoArroba] = useState("");
  const receitaBruta = parseNum(precoArroba) * numeroArrobas;

  // Etapa 4 — Custos
  const [custos, setCustos] = useState<CustoItem[]>([
    { id: "abate", label: "Taxa de Abate (por unidade)", valor: "" },
    { id: "frete", label: "Frete", valor: "" },
    { id: "impostos", label: "Impostos", valor: "" },
  ]);

  const totalCustos = custos.reduce((sum, c) => sum + parseNum(c.valor), 0);
  const resultadoLiquido = receitaBruta - totalCustos;

  const handleCustoValorChange = (id: string, valor: string) => {
    setCustos((prev) => prev.map((c) => (c.id === id ? { ...c, valor } : c)));
  };

  const handleCustoLabelChange = (id: string, label: string) => {
    setCustos((prev) => prev.map((c) => (c.id === id ? { ...c, label } : c)));
  };

  const handleAddCusto = () => {
    setCustos((prev) => [...prev, { id: `custo-${Date.now()}`, label: "", valor: "" }]);
  };

  const handleRemoveCusto = (id: string) => {
    setCustos((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Calculadora</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
            Rendimento, arrobas, receita e custos do abate
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Etapa 1 — Rendimento de Carcaça */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              1. Rendimento de Carcaça
            </h3>
            <button
              type="button"
              onClick={() => setModoInvertido((prev) => !prev)}
              className="flex items-center gap-1 text-[11px] font-semibold text-[#c51d1f] border border-red-200 bg-red-50 hover:bg-red-100 rounded-full px-2.5 py-1 transition-colors"
              title="Inverter cálculo: % ↔ kg"
            >
              <ArrowUpDown className="w-3 h-3" />
              {modoInvertido ? "Calculando %" : "Calculando kg"}
            </button>
          </div>
          <Card className="border-gray-200 p-4 space-y-4">
            <div>
              <Label className="text-gray-700 font-medium">Peso do Animal Vivo (kg)</Label>
              <Input
                type="number"
                placeholder="Ex: 500"
                value={pesoAnimal}
                onChange={(e) => setPesoAnimal(e.target.value)}
                className="mt-1.5 bg-white border-gray-300 text-gray-900"
              />
            </div>

            {modoInvertido ? (
              <>
                <div>
                  <Label className="text-gray-700 font-medium">Peso do Animal Morto (kg)</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 260"
                    value={kgAproveitadoInput}
                    onChange={(e) => setKgAproveitadoInput(e.target.value)}
                    className="mt-1.5 bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">Rendimento da Carcaça</span>
                  <span className="text-lg font-bold text-[#c51d1f]">
                    {percentualCalculado > 0 ? percentualCalculado.toFixed(1) : "0,0"}%
                  </span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label className="text-gray-700 font-medium">Rendimento da Carcaça (%)</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 52"
                    value={percentualRendimento}
                    onChange={(e) => setPercentualRendimento(e.target.value)}
                    className="mt-1.5 bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
                  <span className="text-xs text-gray-600 font-medium">Peso do Animal Morto</span>
                  <span className="text-lg font-bold text-[#c51d1f]">
                    {kgAproveitado > 0 ? kgAproveitado.toFixed(2) : "0,00"} kg
                  </span>
                </div>
              </>
            )}
          </Card>
        </section>

        {/* Etapa 2 — Conversão em Arrobas */}
        <section>
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
            2. Conversão em Arrobas (@)
          </h3>
          <Card className="border-gray-200 p-4 space-y-4">
            <div>
              <Label className="text-gray-700 font-medium">Quantos Kg</Label>
              <Input
                type="number"
                placeholder={kgAproveitado > 0 ? kgAproveitado.toFixed(2) : "Ex: 260"}
                value={kgParaArrobas}
                onChange={(e) => setKgParaArrobas(e.target.value)}
                className="mt-1.5 bg-white border-gray-300 text-gray-900"
              />
              <p className="text-[11px] text-gray-400 mt-1">
                Deixe em branco para usar o peso do animal morto calculado acima.
              </p>
            </div>
            <div>
              <Label className="text-gray-700 font-medium">Kg por Arroba (conversão)</Label>
              <Input
                type="number"
                placeholder="15"
                value={kgPorArroba}
                onChange={(e) => setKgPorArroba(e.target.value)}
                className="mt-1.5 bg-white border-gray-300 text-gray-900"
              />
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center justify-between">
              <span className="text-xs text-gray-600 font-medium">Número de Arrobas</span>
              <span className="text-lg font-bold text-[#c51d1f]">
                {numeroArrobas > 0 ? numeroArrobas.toFixed(2) : "0,00"} @
              </span>
            </div>
          </Card>
        </section>

        {/* Etapa 3 — Receita Bruta */}
        <section>
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
            3. Receita Bruta
          </h3>
          <Card className="border-gray-200 p-4 space-y-4">
            <div>
              <Label className="text-gray-700 font-medium">Preço da Arroba (R$)</Label>
              <Input
                type="number"
                placeholder="Ex: 235.00"
                value={precoArroba}
                onChange={(e) => setPrecoArroba(e.target.value)}
                className="mt-1.5 bg-white border-gray-300 text-gray-900"
              />
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between">
              <span className="text-xs text-gray-600 font-medium">Receita Bruta</span>
              <span className="text-lg font-bold text-emerald-700">{formatBRL(receitaBruta)}</span>
            </div>
          </Card>
        </section>

        {/* Etapa 4 — Custos */}
        <section>
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">4. Custos</h3>
          <Card className="border-gray-200 p-4 space-y-3">
            {custos.map((custo) => (
              <div key={custo.id} className="flex items-end gap-2">
                <div className="flex-1">
                  <Label className="text-gray-700 font-medium text-xs">Descrição</Label>
                  <Input
                    type="text"
                    placeholder="Ex: Taxa de Abate"
                    value={custo.label}
                    onChange={(e) => handleCustoLabelChange(custo.id, e.target.value)}
                    className="mt-1 bg-white border-gray-300 text-gray-900 text-sm"
                  />
                </div>
                <div className="w-28">
                  <Label className="text-gray-700 font-medium text-xs">Valor (R$)</Label>
                  <Input
                    type="number"
                    placeholder="0,00"
                    value={custo.valor}
                    onChange={(e) => handleCustoValorChange(custo.id, e.target.value)}
                    className="mt-1 bg-white border-gray-300 text-gray-900 text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCusto(custo.id)}
                  className="mb-1.5 p-2 text-gray-400 hover:text-[#c51d1f] hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                  title="Remover custo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddCusto}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-[#c51d1f] border border-dashed border-red-300 hover:bg-red-50 rounded-lg py-2.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Custo
            </button>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between">
              <span className="text-xs text-gray-600 font-medium">Total de Custos</span>
              <span className="text-base font-bold text-gray-800">{formatBRL(totalCustos)}</span>
            </div>
          </Card>
        </section>

        {/* Resultado Final */}
        <section>
          <Card
            className={`border-2 p-4 ${
              resultadoLiquido >= 0 ? "border-emerald-300 bg-emerald-50" : "border-red-300 bg-red-50"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {resultadoLiquido >= 0 ? (
                <TrendingUp className="w-5 h-5 text-emerald-700" />
              ) : (
                <TrendingDown className="w-5 h-5 text-[#c51d1f]" />
              )}
              <h4 className="font-bold text-gray-900">Resultado Líquido</h4>
            </div>
            <p className="text-xs text-gray-500 mb-1.5">Receita Bruta − Total de Custos</p>
            <p className={`text-2xl font-bold ${resultadoLiquido >= 0 ? "text-emerald-700" : "text-[#c51d1f]"}`}>
              {formatBRL(resultadoLiquido)}
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}
