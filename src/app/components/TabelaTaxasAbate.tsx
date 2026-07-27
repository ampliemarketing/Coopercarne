import { Scissors } from "lucide-react";
import { Card } from "@/app/components/ui/card";

export function TabelaTaxasAbate() {
  const taxasAbate = [
    { especie: "Bovino", cooperado: 85, terceiros: 115, unidade: "cabeça" },
    { especie: "Suíno", cooperado: 85, terceiros: 105, unidade: "cabeça" },
    { especie: "Cordeiro", cooperado: 35, terceiros: 50, unidade: "cabeça" },
    { especie: "Leitão", cooperado: 40, terceiros: 60, unidade: "cabeça" },
  ];

  return (
    <Card className="border-gray-200 p-0 bg-white overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-100">
        <div className="bg-[#c51d1f] p-2.5 rounded-lg text-white">
          <Scissors className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide">
            Tabela de Taxas de Abate
          </h3>
          <p className="text-xs text-gray-500">
            Valores por cabeça para Cooperados e Terceiros
          </p>
        </div>
      </div>

      {/* Tabela Unificada */}
      <div className="divide-y divide-gray-100">
        {/* Table Header */}
        <div className="bg-gray-50 px-4 py-2.5 grid grid-cols-12 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
          <div className="col-span-4">Espécie</div>
          <div className="col-span-4 text-right text-[#c51d1f]">Cooperado</div>
          <div className="col-span-4 text-right text-gray-700">Terceiros</div>
        </div>

        {/* Table Body */}
        {taxasAbate.map((item) => (
          <div
            key={item.especie}
            className="px-4 py-3 grid grid-cols-12 items-center hover:bg-gray-50/80 transition-colors"
          >
            <div className="col-span-4">
              <span className="text-sm font-bold text-gray-900">{item.especie}</span>
              <span className="block text-[10px] text-gray-400">por {item.unidade}</span>
            </div>

            <div className="col-span-4 text-right">
              <span className="text-sm font-bold text-[#c51d1f]">
                R$ {item.cooperado.toFixed(2)}
              </span>
            </div>

            <div className="col-span-4 text-right">
              <span className="text-sm font-bold text-gray-700">
                R$ {item.terceiros.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
