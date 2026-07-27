import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Package, DollarSign, Clock, Scissors, AlertTriangle } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { useAuth } from "@/app/contexts/AuthContext";

const pedidosMensais = [
  { mes: "Jul", pedidos: 12 },
  { mes: "Ago", pedidos: 18 },
  { mes: "Set", pedidos: 15 },
  { mes: "Out", pedidos: 22 },
  { mes: "Nov", pedidos: 19 },
  { mes: "Dez", pedidos: 25 },
  { mes: "Jan", pedidos: 28 },
];

const distribuicaoTipos = [
  { name: "Bovino", value: 60 },
  { name: "Suíno", value: 25 },
  { name: "Ovino", value: 15 },
];

// Relatório de taxa de abate (R$/cabeça)
const taxaAbateMensal = [
  { mes: "Ago", bovino: 95, suino: 32, ovino: 45 },
  { mes: "Set", bovino: 95, suino: 32, ovino: 45 },
  { mes: "Out", bovino: 98, suino: 34, ovino: 47 },
  { mes: "Nov", bovino: 98, suino: 34, ovino: 47 },
  { mes: "Dez", bovino: 100, suino: 35, ovino: 48 },
  { mes: "Jan", bovino: 105, suino: 36, ovino: 50 },
];

const taxasAtualMes = [
  { tipo: "Bovino", taxaPorCabeca: 105.00, totalAbatidos: 287, receitaTotal: 30135.00, crescimento: "+5.0%" },
  { tipo: "Suíno", taxaPorCabeca: 36.00, totalAbatidos: 512, receitaTotal: 18432.00, crescimento: "+2.9%" },
  { tipo: "Ovino", taxaPorCabeca: 50.00, totalAbatidos: 98, receitaTotal: 4900.00, crescimento: "+4.2%" },
];

const COLORS = ["#c51d1f", "#6b7280", "#9ca3af"];

export function DashboardPage() {
  const { user } = useAuth();

  const receitaTotalAbate = taxasAtualMes.reduce((acc, t) => acc + t.receitaTotal, 0);
  const totalAnimaisAbatidos = taxasAtualMes.reduce((acc, t) => acc + t.totalAbatidos, 0);

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Dashboard
          </h2>
          <p className="text-sm text-gray-500">
            Visão geral das suas atividades
          </p>
        </div>

        {/* KPIs do Cooperado */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-[#c51d1f] p-2.5 rounded-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Pedidos</p>
                <p className="text-2xl font-bold text-gray-900">28</p>
                <p className="text-xs text-green-600">+12% vs mês anterior</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-gray-700 p-2.5 rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Gasto</p>
                <p className="text-2xl font-bold text-gray-900">R$145k</p>
                <p className="text-xs text-gray-500">Este mês</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-gray-600 p-2.5 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Volume</p>
                <p className="text-2xl font-bold text-gray-900">12.5t</p>
                <p className="text-xs text-green-600">+8% vs mês anterior</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-gray-500 p-2.5 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Prazo Médio</p>
                <p className="text-2xl font-bold text-gray-900">3.2d</p>
                <p className="text-xs text-gray-500">Entrega</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Relatório de Taxa de Abate */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Scissors className="w-4 h-4 text-[#c51d1f]" />
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Relatório de Taxa de Abate — Jan/2026
            </h3>
          </div>

          {/* KPIs de abate */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Card className="p-4 border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Receita Total</p>
              <p className="text-xl font-bold text-gray-900 mt-1">
                {receitaTotalAbate.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
              <p className="text-xs text-green-600 mt-1">Taxa de abate mês</p>
            </Card>
            <Card className="p-4 border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Total Abatidos</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{totalAnimaisAbatidos.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-gray-500 mt-1">cabeças no mês</p>
            </Card>
          </div>

          {/* Tabela de taxas por tipo */}
          <Card className="border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Taxa por Espécie</p>
            </div>
            {taxasAtualMes.map((taxa, i) => (
              <div
                key={taxa.tipo}
                className={`px-4 py-3 flex items-center justify-between ${i < taxasAtualMes.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">{taxa.tipo}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {taxa.totalAbatidos} cabeças · R$ {taxa.taxaPorCabeca.toFixed(2)}/cab
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {taxa.receitaTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                  <p className="text-xs text-green-600">{taxa.crescimento}</p>
                </div>
              </div>
            ))}
          </Card>
        </section>

        {/* Evolução da Taxa de Abate */}
        <Card className="p-6 border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Evolução da Taxa (R$/cab)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={taxaAbateMensal}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" tick={{ fill: "#6b7280", fontSize: 11 }} stroke="#9ca3af" />
              <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 12px" }}
              />
              <Line type="monotone" dataKey="bovino" stroke="#c51d1f" strokeWidth={2} dot={false} name="Bovino" />
              <Line type="monotone" dataKey="suino" stroke="#6b7280" strokeWidth={2} dot={false} name="Suíno" />
              <Line type="monotone" dataKey="ovino" stroke="#9ca3af" strokeWidth={2} dot={false} name="Ovino" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3">
            {[{ label: "Bovino", color: "#c51d1f" }, { label: "Suíno", color: "#6b7280" }, { label: "Ovino", color: "#9ca3af" }].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-3 h-0.5" style={{ backgroundColor: color }} />
                <span className="text-xs text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Limite de abate do cooperado */}
        {user?.limiteAbate && user?.abatesRealizadosMes && (
          <Card className="p-4 border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
              Utilização do Meu Limite
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {(["bovino", "suino", "ovino"] as const).map((tipo) => {
                const limite = user.limiteAbate[tipo];
                const realizado = user.abatesRealizadosMes[tipo];
                const pct = (realizado / limite) * 100;
                const isWarning = pct >= 80;
                const radius = 24;
                const strokeWidth = 10;
                const circumference = 2 * Math.PI * radius;
                const strokeDashoffset = circumference - (pct / 100) * circumference;
                const colorClass = isWarning ? "#f59e0b" : "#c51d1f";

                return (
                  <div key={tipo} className="flex flex-col items-center text-center p-2 rounded-lg bg-gray-50">
                    <span className="text-[11px] font-bold capitalize text-gray-900 uppercase tracking-wide mb-1.5">
                      {tipo}
                    </span>
                    <div className="relative w-16 h-16 flex items-center justify-center my-1">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 64 64">
                        <circle
                          cx="32"
                          cy="32"
                          r={radius}
                          stroke="currentColor"
                          strokeWidth={strokeWidth}
                          className="text-gray-200 fill-none"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r={radius}
                          stroke={colorClass}
                          strokeWidth={strokeWidth}
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          className="fill-none transition-all duration-500 ease-out"
                        />
                      </svg>
                      <span className="absolute text-xs font-bold text-gray-900">
                        {Math.round(pct)}%
                      </span>
                    </div>
                    <span className="text-[10px] text-gray-500 mt-1">
                      {realizado}/{limite} cab.
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Pedidos Mensais */}
        <Card className="p-6 border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Pedidos Mensais
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pedidosMensais}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="mes" tick={{ fill: "#6b7280", fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip
                contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "8px", padding: "8px 12px" }}
              />
              <Bar dataKey="pedidos" fill="#c51d1f" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Distribuição por Tipo */}
        <Card className="p-6 border-gray-200">
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">
            Distribuição de Pedidos
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={distribuicaoTipos}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {distribuicaoTipos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {distribuicaoTipos.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
