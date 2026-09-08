import { useAuth } from "@/app/contexts/AuthContext";
import { useNavigate } from "react-router";
import {
  FileText,
  Calendar,
  Bell,
  DollarSign,
  MessageSquare,
  HelpCircle,
  Package,
  ChevronRight,
  Newspaper,
  Truck,
  Calculator,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

const mockNoticias = [
  {
    id: "1",
    tipo: "comunicado",
    titulo: "Alteração no Horário de Abate a partir de Fevereiro",
    data: "2026-01-20",
    destaque: true,
    imagem: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    tipo: "mercado",
    titulo: "Cotação do Boi Gordo Atinge Nova Máxima — R$ 325/arroba",
    data: "2026-01-18",
    destaque: false,
    imagem: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    tipo: "cooperativa",
    titulo: "Assembleia Geral Ordinária — 15 de Fevereiro de 2026",
    data: "2026-01-15",
    destaque: true,
    imagem: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80",
  },
];

const tipoBadgeColor: Record<string, string> = {
  comunicado: "bg-[#c51d1f] text-white",
  mercado: "bg-gray-700 text-white",
  cooperativa: "bg-gray-500 text-white",
  legislacao: "bg-gray-400 text-white",
};

const tipoLabel: Record<string, string> = {
  comunicado: "Comunicado",
  mercado: "Mercado",
  cooperativa: "Cooperativa",
  legislacao: "Legislação",
};

export function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    { icon: FileText, label: "Novo Pedido", path: "/pedidos/novo" },
    { icon: Calendar, label: "Agendar Abate", path: "/agenda-abate" },
    { icon: Truck, label: "Ag. Entrega", path: "/agenda-entrega" },
    { icon: HelpCircle, label: "Abrir Chamado", path: "/chamados/novo" },
  ];

  // Definindo os itens categorizados
  const menuCategories = [
    {
      titulo: "Operacional & Logística",
      itens: [
        { icon: FileText, label: "Meus Pedidos", path: "/pedidos", badge: "3", badgeColor: "bg-[#c51d1f] text-white", iconBg: "bg-red-50 text-[#c51d1f]" },
        { icon: Calendar, label: "Agenda Abate", path: "/agenda-abate", badge: null, badgeColor: null, iconBg: "bg-red-50 text-[#c51d1f]" },
        { icon: Truck, label: "Agenda Entrega", path: "/agenda-entrega", badge: null, badgeColor: null, iconBg: "bg-red-50 text-[#c51d1f]" },
        { icon: MessageSquare, label: "Cotações", path: "/cotacoes", badge: "1", badgeColor: "bg-[#c51d1f] text-white", iconBg: "bg-red-50 text-[#c51d1f]" },
      ],
    },
    {
      titulo: "Mercado",
      itens: [
        { icon: DollarSign, label: "Preços", path: "/precos", badge: "Atualizado", badgeColor: "bg-red-100 text-[#c51d1f] font-bold border border-red-200", iconBg: "bg-red-50 text-[#c51d1f]" },
        { icon: Calculator, label: "Calculadora", path: "/calculadora", badge: null, badgeColor: null, iconBg: "bg-red-50 text-[#c51d1f]" },
      ],
    },
    {
      titulo: "Comunicação & Suporte",
      itens: [
        { icon: Bell, label: "Comunicados", path: "/comunicacao", badge: "5", badgeColor: "bg-[#c51d1f] text-white", iconBg: "bg-red-50 text-[#c51d1f]" },
        { icon: Newspaper, label: "Notícias", path: "/noticias", badge: null, badgeColor: null, iconBg: "bg-red-50 text-[#c51d1f]" },
        { icon: HelpCircle, label: "Chamados", path: "/chamados", badge: "2", badgeColor: "bg-[#c51d1f] text-white", iconBg: "bg-red-50 text-[#c51d1f]" },
        { icon: Package, label: "Sugestões", path: "/sugestoes", badge: null, badgeColor: null, iconBg: "bg-red-50 text-[#c51d1f]" },
      ],
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header Section / User Profile */}
      <div className="bg-white border-b border-slate-200/70 px-4 py-5">
        <div className="max-w-md mx-auto">
          <div
            onClick={() => navigate("/perfil")}
            className="flex items-center gap-3.5 cursor-pointer transition-all btn-interactive group"
          >
            {/* Avatar Circular com Gradiente e Badge Verificado */}
            <div className="relative">
              <div className="w-13 h-13 gradient-brand rounded-full flex items-center justify-center text-white shadow-sm text-lg font-extrabold tracking-tight">
                {user?.nome?.charAt(0)}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-white" title="Associado Ativo">
                <span className="text-[8px] font-bold">✓</span>
              </div>
            </div>

            {/* Informações do Associado */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#c51d1f] font-extrabold uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded-md border border-red-100/80">
                  Bem-vindo, Cooperado
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <h2 className="text-base font-extrabold text-slate-900 truncate leading-snug mt-1">
                {user?.nome}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium truncate mt-0.5">
                <span className="truncate">{user?.razaoSocial}</span>
                <span className="text-slate-300">·</span>
                <span className="font-mono text-[11px] text-slate-500 flex-shrink-0">{user?.cnpj}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">

        {/* Quick Actions */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Acesso Rápido</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card
                  key={action.path}
                  onClick={() => handleNavigate(action.path)}
                  className="p-4 cursor-pointer hover:shadow-lg transition-all border-gray-200 hover:border-gray-400"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-red-50 p-2.5 rounded-lg">
                      <Icon className="w-5 h-5 text-[#c51d1f]" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 flex-1">{action.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Notícias Feed */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#c51d1f] animate-pulse"></div>
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Feed de Notícias</h3>
          </div>

          <div className="space-y-4">
            {mockNoticias.map((noticia) => (
              <Card
                key={noticia.id}
                onClick={() => navigate("/noticias")}
                className="border-gray-200 bg-white overflow-hidden rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                {/* Imagem do Post com Badge */}
                <div className="relative w-full aspect-video bg-gray-900 overflow-hidden">
                  <img
                    src={noticia.imagem}
                    alt={noticia.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Badge no topo da imagem */}
                  <div className="absolute top-3 left-3">
                    <Badge className={`px-2.5 py-1 text-[9px] uppercase tracking-wider font-extrabold rounded-md shadow-sm ${tipoBadgeColor[noticia.tipo]}`}>
                      {tipoLabel[noticia.tipo]}
                    </Badge>
                  </div>

                  {/* Data no topo direito da imagem */}
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                    {new Date(noticia.data + "T00:00:00").toLocaleDateString("pt-BR")}
                  </div>

                  {/* Título sobre a imagem */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="text-sm sm:text-base font-bold drop-shadow-md leading-snug line-clamp-2">
                      {noticia.titulo}
                    </h4>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Botão Ver Mais Notícias */}
          <div className="pt-1">
            <button
              onClick={() => navigate("/noticias")}
              className="w-full bg-gray-100 hover:bg-gray-200/80 text-gray-800 font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 group"
            >
              <span>Ver Mais Notícias</span>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </section>

        {/* Prices Overview */}
        <section>
          <Card className="border-gray-200">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Cotação do Dia</h3>
                <button
                  onClick={() => navigate("/precos")}
                  className="text-gray-600 text-xs font-medium hover:text-gray-900 flex items-center gap-1"
                >
                  Ver detalhes
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {[
                { tipo: "Bovino", preco: "R$ 325,00", variacao: "+2.5%", positivo: true },
                { tipo: "Suíno", preco: "R$ 8,50", variacao: "-1.2%", positivo: false },
                { tipo: "Ovino", preco: "R$ 18,00", variacao: "Estável", positivo: null },
              ].map(({ tipo, preco, variacao, positivo }) => (
                <div key={tipo} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">{tipo}</p>
                    <p className="text-lg font-bold text-gray-900 mt-0.5">{preco}</p>
                  </div>
                  <span className={`text-xs font-medium ${positivo === true ? "text-green-600" : positivo === false ? "text-[#c51d1f]" : "text-gray-500"}`}>
                    {variacao}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* All Services - Categorized Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Todos os Serviços</h3>
            <span className="text-[11px] font-medium text-slate-500">Acesso completo</span>
          </div>

          {menuCategories.map((categoria) => (
            <div key={categoria.titulo} className="space-y-2.5">
              <h4 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider px-1">
                {categoria.titulo}
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                {categoria.itens.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      className="p-3 cursor-pointer hover:shadow-md transition-all border-slate-200/80 hover:border-slate-300 bg-white group flex flex-col justify-between min-h-[92px] relative overflow-hidden"
                    >
                      {/* Badge superior direito se existir */}
                      <div className="flex items-start justify-between gap-1 w-full">
                        <div className={`p-2 rounded-xl flex items-center justify-center ${item.iconBg} transition-transform group-hover:scale-110`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {item.badge && (
                          <Badge className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${item.badgeColor}`}>
                            {item.badge}
                          </Badge>
                        )}
                      </div>

                      {/* Título do Serviço */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 group-hover:text-slate-900 leading-tight">
                          {item.label}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-slate-600 transition-all flex-shrink-0" />
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
