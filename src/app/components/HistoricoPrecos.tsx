import { useState } from "react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

// Dados mensais (últimos 5 meses)
const historicoMensal = {
  bovino: [
    { data: "Set", preco: 310 },
    { data: "Out", preco: 315 },
    { data: "Nov", preco: 318 },
    { data: "Dez", preco: 320 },
    { data: "Jan", preco: 325 },
  ],
  suino: [
    { data: "Set", preco: 8.2 },
    { data: "Out", preco: 8.3 },
    { data: "Nov", preco: 8.4 },
    { data: "Dez", preco: 8.5 },
    { data: "Jan", preco: 8.5 },
  ],
  ovino: [
    { data: "Set", preco: 17.5 },
    { data: "Out", preco: 17.8 },
    { data: "Nov", preco: 18.0 },
    { data: "Dez", preco: 18.0 },
    { data: "Jan", preco: 18.0 },
  ],
};

export function HistoricoPrecos() {
  const [tipoAnimal, setTipoAnimal] = useState<"bovino" | "suino" | "ovino">("bovino");

  const dadosAtual = historicoMensal[tipoAnimal];
  const precoAtual = dadosAtual[dadosAtual.length - 1].preco;
  const precoAnterior = dadosAtual[dadosAtual.length - 2].preco;
  const variacao = ((precoAtual - precoAnterior) / precoAnterior) * 100;
  const isPositiva = variacao >= 0;

  const unidades = {
    bovino: "@",
    suino: "kg",
    ovino: "kg",
  };

  return (
    <div className="p-5 bg-white rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="bg-[#c51d1f] p-2 rounded-lg text-white">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Histórico de Preços
            </h3>
            <p className="text-xs text-gray-400">
              Evolução mensal
            </p>
          </div>
        </div>

        {/* Caixa de Seleção do Tipo de Animal */}
        <Select value={tipoAnimal} onValueChange={(v) => setTipoAnimal(v as any)}>
          <SelectTrigger className="w-32 border-gray-300 text-xs font-semibold bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bovino">Bovino</SelectItem>
            <SelectItem value="suino">Suíno</SelectItem>
            <SelectItem value="ovino">Ovino</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards Minimalistas */}
      <div className="grid grid-cols-3 gap-2.5 mb-6">
        <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100 text-center">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
            Atual
          </span>
          <span className="text-base font-extrabold text-gray-900 block mt-0.5">
            R$ {precoAtual.toFixed(2)}
          </span>
          <span className="text-[10px] text-gray-400 block">
            por {unidades[tipoAnimal]}
          </span>
        </div>

        <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100 text-center">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
            Variação
          </span>
          <div className="flex items-center justify-center gap-0.5 mt-0.5">
            {isPositiva ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 text-red-600" />
            )}
            <span className={`text-base font-extrabold ${
              isPositiva ? "text-emerald-600" : "text-red-600"
            }`}>
              {isPositiva ? "+" : ""}{variacao.toFixed(1)}%
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block">
            mês anterior
          </span>
        </div>

        <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100 text-center">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
            Anterior
          </span>
          <span className="text-base font-bold text-gray-700 block mt-0.5">
            R$ {precoAnterior.toFixed(2)}
          </span>
          <span className="text-[10px] text-gray-400 block">
            por {unidades[tipoAnimal]}
          </span>
        </div>
      </div>

      {/* Gráfico Extremamente Minimalista e Limpo */}
      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dadosAtual} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="minimalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c51d1f" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#c51d1f" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="data"
              tick={{ fill: "#9ca3af", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-gray-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg font-sans">
                      <span className="text-gray-300 font-medium mr-1.5">{label}:</span>
                      <span className="font-bold text-white">
                        R$ {Number(payload[0].value).toFixed(2)}
                      </span>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="preco"
              stroke="#c51d1f"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#minimalGradient)"
              dot={{ fill: "#c51d1f", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#c51d1f", stroke: "#ffffff", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}