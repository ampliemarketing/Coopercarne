import { useAuth } from "@/app/contexts/AuthContext";
import { useNavigate } from "react-router";
import {
  User,
  Building2,
  Mail,
  Phone,
  Calendar,
  LogOut,
  ChevronRight,
  RotateCcw,
  Edit2,
  ShieldCheck,
  Lock,
  Bell,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { useTheme } from "@/app/contexts/ThemeContext";
import { useOnboarding } from "@/app/contexts/OnboardingContext";
import { useState } from "react";

export function PerfilPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { resetOnboarding } = useOnboarding();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleEdit = () => {
    alert("Edição de perfil em breve!");
  };

  // Gerar iniciais do nome
  const getInitials = (name?: string) => {
    if (!name) return "CC";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const personalInfo = [
    { icon: User, label: "Nome Completo", value: user?.nome },
    { icon: Calendar, label: "Data de Nascimento", value: user?.dataNascimento ? new Date(user.dataNascimento).toLocaleDateString("pt-BR") : "-" },
    { icon: Mail, label: "E-mail", value: user?.email },
    { icon: Phone, label: "Telefone", value: "(11) 98765-4321" },
  ];

  const businessInfo = [
    { icon: Building2, label: "Razão Social", value: user?.razaoSocial },
    { icon: Building2, label: "CNPJ", value: user?.cnpj },
  ];

  const menuOptions = [
    { icon: Lock, label: "Alterar Senha", path: "/perfil/senha", badge: null },
    { icon: Bell, label: "Notificações", path: "/perfil/notificacoes", badge: null },
    { icon: ShieldCheck, label: "Segurança & Privacidade", path: "/perfil/seguranca", badge: null },
    { icon: HelpCircle, label: "Ajuda e Suporte", path: "/ajuda", badge: null },
  ];

  return (
    <div className="min-h-full bg-slate-50/70 pb-12">
      {/* Header com Gradient Moderno */}
      <div className="relative bg-gradient-to-b from-[#b0181a] via-[#c51d1f] to-[#8d1113] text-white pt-8 pb-14 px-4 overflow-hidden shadow-md">
        {/* Elemento Decorativo no Fundo */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-black/10 rounded-full blur-xl pointer-events-none" />

        <div className="max-w-md mx-auto text-center relative z-10">
          {/* Avatar com Iniciais */}
          <div className="relative inline-block mb-3">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/40 shadow-xl">
              <span className="text-2xl font-black tracking-wider text-white drop-shadow-sm">
                {getInitials(user?.nome)}
              </span>
            </div>
            {/* Badge de Verificado */}
            <div 
              className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-[#c51d1f] shadow-md flex items-center justify-center"
              title="Cadastro Verificado"
            >
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <h2 className="text-xl font-bold tracking-tight">{user?.nome || "Cooperado"}</h2>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <span className="bg-white/15 backdrop-blur-md px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider text-red-100 border border-white/10">
              {user?.perfil || "Cooperado Ativo"}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Verificado
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6 relative z-20 space-y-5">

        {/* Informações Pessoais */}
        <section>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Dados Pessoais
            </h3>
            <button
              onClick={handleEdit}
              className="flex items-center gap-1 text-[#c51d1f] hover:text-[#901214] text-xs font-semibold transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Editar
            </button>
          </div>
          <Card className="border-slate-200/80 shadow-sm rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
            {personalInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="p-3.5 flex items-center gap-3 hover:bg-slate-50/60 transition-colors">
                  <div className="bg-slate-100/80 p-2 rounded-lg text-slate-600">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm text-slate-800 font-semibold truncate mt-0.5">{item.value || "-"}</p>
                  </div>
                </div>
              );
            })}
          </Card>
        </section>

        {/* Informações da Empresa */}
        <section>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Dados da Empresa
            </h3>
          </div>
          <Card className="border-slate-200/80 shadow-sm rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
            {businessInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="p-3.5 flex items-center gap-3 hover:bg-slate-50/60 transition-colors">
                  <div className="bg-red-50 p-2 rounded-lg text-[#c51d1f]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm text-slate-800 font-semibold truncate mt-0.5">{item.value || "-"}</p>
                  </div>
                </div>
              );
            })}
          </Card>
        </section>

        {/* Opções de Configurações */}
        <section>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 px-1">
            Configurações da Conta
          </h3>
          <Card className="border-slate-200/80 shadow-sm rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
            {menuOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(option.path)}
                  className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-lg text-slate-600 group-hover:bg-red-50 group-hover:text-[#c51d1f] transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                      {option.label}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              );
            })}
          </Card>
        </section>

        {/* Tutorial & Sair */}
        <section className="space-y-3 pt-1">
          <button
            onClick={resetOnboarding}
            className="w-full p-3.5 bg-white border border-slate-200/80 shadow-sm rounded-xl flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                <RotateCcw className="w-4 h-4" />
              </div>
              <span className="text-sm font-semibold text-slate-700">Ver Tutorial Novamente</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 font-semibold py-5 rounded-xl shadow-sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair da Conta
          </Button>
        </section>

        {/* Rodapé da Tela */}
        <p className="text-center text-slate-400 text-[11px] uppercase tracking-widest pt-2">
          COOPERCARNE © 2026 · Sistema do Cooperado
        </p>

      </div>
    </div>
  );
}