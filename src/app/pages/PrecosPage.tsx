import { Card } from "@/app/components/ui/card";
import { HistoricoPrecos } from "@/app/components/HistoricoPrecos";
import { CalculadoraRendimento } from "@/app/components/CalculadoraRendimento";
import { AlertasPreco } from "@/app/components/AlertasPreco";
import { TabelaTaxasAbate } from "@/app/components/TabelaTaxasAbate";

const precoAtual = {
  bovino: { valor: 325.00, variacao: 2.5, unidade: "@" },
  suino: { valor: 8.50, variacao: -1.2, unidade: "kg" },
  ovino: { valor: 18.00, variacao: 0, unidade: "kg" },
};

export function PrecosPage() {
  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Preços de Animais</h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
            Atualizado em {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Preços Atuais */}
        <section>
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-4">Cotação Atual</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(precoAtual).map(([tipo, preco]) => {
              return (
                <Card key={tipo} className="border-gray-200 p-3">
                  <div className="text-center space-y-2">
                    <h3 className="text-xs font-semibold capitalize text-gray-900 uppercase tracking-wide">{tipo}</h3>
                    <div>
                      <p className="text-lg font-bold text-gray-900">
                        R$ {preco.valor.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                        por {preco.unidade}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Tabela de Taxas de Abate (Cooperados vs Terceiros) */}
        <section>
          <TabelaTaxasAbate />
        </section>

        {/* Histórico de Preços Consolidado */}
        <section>
          <Card className="border-gray-200">
            <HistoricoPrecos />
          </Card>
        </section>

        {/* Calculadora de Rendimento */}
        <section>
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-4">Calculadora de Rendimento</h3>
          <Card className="border-gray-200">
            <CalculadoraRendimento />
          </Card>
        </section>

        {/* Alertas de Preço */}
        <section>
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-4">Alertas de Preço</h3>
          <Card className="border-gray-200">
            <AlertasPreco />
          </Card>
        </section>
      </div>
    </div>
  );
}
