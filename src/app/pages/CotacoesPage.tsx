import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, Clock, CheckCircle, XCircle, TrendingUp, TrendingDown, DollarSign, Download, BarChart2 } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { exportToCSV, exportToPDFPrint } from "@/app/utils/exportUtils";
import { toast } from "sonner";

const mockHistoricoCotacoes = [
  { data: "01/Jan", boi: 242.50, vaca: 218.00, suino: 7.20 },
  { data: "05/Jan", boi: 245.00, vaca: 220.00, suino: 7.35 },
  { data: "10/Jan", boi: 244.00, vaca: 219.50, suino: 7.40 },
  { data: "15/Jan", boi: 248.20, vaca: 223.00, suino: 7.60 },
  { data: "20/Jan", boi: 251.00, vaca: 225.50, suino: 7.55 },
  { data: "25/Jan", boi: 255.00, vaca: 229.00, suino: 7.80 },
  { data: "26/Jan", boi: 258.40, vaca: 231.50, suino: 7.95 },
];

const mockCotacoes = [
  {
    id: "COT001",
    data: "2026-01-28",
    tipo: "Bovina (Boi Gordo @)",
    status: "aguardando",
    validade: "2026-02-04",
    valor: null,
  },
  {
    id: "COT002",
    data: "2026-01-25",
    tipo: "Suína (Kg Vivo)",
    status: "respondida",
    validade: "2026-02-01",
    valor: "R$ 7,95 / kg",
    observacao: "Válido para lote mínimo de 100 cabeças",
  },
  {
    id: "COT003",
    data: "2026-01-20",
    tipo: "Bovina (Vaca Gorda @)",
    status: "expirada",
    validade: "2026-01-27",
    valor: "R$ 231,50 / @",
  },
];

const statusConfig: Record<string, { color: string; icon: any }> = {
  "aguardando": { color: "bg-amber-500", icon: Clock },
  "respondida": { color: "bg-emerald-600", icon: CheckCircle },
  "expirada": { color: "bg-slate-500", icon: XCircle },
};

export function CotacoesPage() {
  const navigate = useNavigate();
  const [filtroGrafico, setFiltroGrafico] = useState<"boi" | "vaca" | "suino">("boi");

  const exportarRelatorioCotacoes = (formato: "pdf" | "excel") => {
    const headers = ["Data", "Boi Gordo (@)", "Vaca Gorda (@)", "Suíno (Kg)"];
    const rows = mockHistoricoCotacoes.map(h => [
      h.data,
      `R$ ${h.boi.toFixed(2)}`,
      `R$ ${h.vaca.toFixed(2)}`,
      `R$ ${h.suino.toFixed(2)}`
    ]);

    if (formato === "pdf") {
      exportToPDFPrint("Histórico de Cotações da Arroba - COOPERCARNE", headers, rows);
      toast.success("Relatório de cotações gerado em PDF!");
    } else {
      exportToCSV("Historico_Cotacoes_COOPERCARNE", headers, rows);
      toast.success("Histórico exportado para Excel!");
    }
  };

  return (
    <div className="min-h-full bg-slate-50/70 pb-12">
      {/* Header */}
      <div className="glass-header border-b border-slate-200/70 px-4 py-4 sticky top-0 z-20">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Cotações & Mercado BI</h1>
          <Badge className="bg-emerald-100/80 text-emerald-800 border border-emerald-300 font-bold text-[11px] gap-1 shadow-xs">
            <TrendingUp className="w-3 h-3 text-emerald-600" />
            Mercado em Alta (+2.4%)
          </Badge>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-5 space-y-5">
        
        {/* Gráfico Interativo BI de Cotações */}
        <Card className="p-4 border-slate-200/80 card-ambient-shadow rounded-2xl bg-white space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-50 rounded-lg text-[#c51d1f]">
                <BarChart2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Histórico de Mercado (B3 / Praça)</h3>
                <p className="text-[11px] text-slate-500">Evolução do preço nos últimos 30 dias</p>
              </div>
            </div>
          </div>

          {/* Seletor de Categoria do Gráfico */}
          <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
            <button
              onClick={() => setFiltroGrafico("boi")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                filtroGrafico === "boi" ? "bg-white text-[#c51d1f] shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Boi Gordo (@)
            </button>
            <button
              onClick={() => setFiltroGrafico("vaca")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                filtroGrafico === "vaca" ? "bg-white text-[#c51d1f] shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Vaca Gorda (@)
            </button>
            <button
              onClick={() => setFiltroGrafico("suino")}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                filtroGrafico === "suino" ? "bg-white text-[#c51d1f] shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Suíno (Kg)
            </button>
          </div>

          {/* Componente Gráfico Recharts */}
          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockHistoricoCotacoes} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c51d1f" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c51d1f" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="data" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(value: any) => [`R$ ${Number(value).toFixed(2)}`, filtroGrafico === 'suino' ? 'R$ / Kg' : 'R$ / @']}
                />
                <Area type="monotone" dataKey={filtroGrafico} stroke="#c51d1f" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Botões de Exportação do Gráfico */}
          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <Button
              onClick={() => exportarRelatorioCotacoes("pdf")}
              variant="outline"
              size="sm"
              className="flex-1 text-xs font-semibold text-slate-700 border-slate-300 hover:bg-slate-50"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Exportar PDF
            </Button>
            <Button
              onClick={() => exportarRelatorioCotacoes("excel")}
              variant="outline"
              size="sm"
              className="flex-1 text-xs font-semibold text-slate-700 border-slate-300 hover:bg-slate-50"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              Exportar Excel
            </Button>
          </div>
        </Card>

        {/* Ação Nova Cotação */}
        <Button
          onClick={() => navigate("/cotacoes/nova")}
          className="w-full gradient-brand hover:opacity-95 btn-interactive text-white font-bold h-12 rounded-xl shadow-md"
        >
          <Plus className="w-5 h-5 mr-2" />
          Solicitar Nova Cotação
        </Button>

        {/* Lista de Cotações Solicitadas */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Minhas Solicitacões</h3>
          {mockCotacoes.map((cotacao) => {
            const StatusIcon = statusConfig[cotacao.status].icon;
            return (
              <Card key={cotacao.id} className="p-4 border-slate-200/90 shadow-sm bg-white rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{cotacao.id}</h3>
                    <p className="text-xs text-slate-500 font-medium">{cotacao.tipo}</p>
                  </div>
                  <Badge className={`${statusConfig[cotacao.status].color} text-white flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5`}>
                    <StatusIcon className="w-3 h-3" />
                    {cotacao.status}
                  </Badge>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Data Solicitação:</span>
                    <span className="font-semibold text-slate-700">{new Date(cotacao.data).toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Validade da Proposta:</span>
                    <span className="font-semibold text-slate-700">{new Date(cotacao.validade).toLocaleDateString("pt-BR")}</span>
                  </div>
                  {cotacao.valor && (
                    <div className="flex justify-between pt-2 border-t border-slate-100">
                      <span className="text-slate-500 font-medium">Valor Negociado:</span>
                      <span className="font-extrabold text-[#c51d1f] text-sm">{cotacao.valor}</span>
                    </div>
                  )}
                  {cotacao.observacao && (
                    <p className="text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 text-[11px] mt-2">{cotacao.observacao}</p>
                  )}
                </div>

                {cotacao.status === "respondida" && (
                  <Button
                    onClick={() => navigate("/pedidos")}
                    className="w-full mt-3 bg-[#c51d1f] hover:bg-[#a01517] text-white font-bold text-xs shadow-xs"
                  >
                    Aceitar Proposta e Gerar Pedido
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
