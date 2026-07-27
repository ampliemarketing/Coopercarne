import { AlertOctagon, CreditCard, ChevronRight } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useNavigate } from "react-router";

export function BannerPendenciaFinanceira() {
  const { user, pagarPendenciaFinanceira } = useAuth();
  const navigate = useNavigate();

  if (!user || !user.pendenciaFinanceira?.bloqueado) {
    return null;
  }

  const valorTotal = user.pendenciaFinanceira.valorTotal || 21000.00;

  return (
    <div className="bg-gradient-to-r from-[#c51d1f] to-red-700 text-white px-4 py-3 shadow-md border-b border-red-800 animate-in fade-in slide-in-from-top duration-300">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="bg-white/20 p-1.5 rounded-full flex-shrink-0">
            <AlertOctagon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wider leading-tight">
              Acesso Bloqueado para Novos Pedidos
            </p>
            <p className="text-[11px] text-white/90 truncate mt-0.5">
              Pendência financeira de R$ {valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => {
              pagarPendenciaFinanceira();
            }}
            className="hidden sm:inline-flex px-2.5 py-1 bg-white text-[#c51d1f] hover:bg-gray-100 text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            Regularizar
          </button>
          <button
            onClick={() => navigate("/financeiro")}
            className="flex items-center gap-1 text-xs font-semibold text-white bg-black/20 hover:bg-black/30 px-2.5 py-1 rounded-lg transition-colors"
          >
            Ver <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
