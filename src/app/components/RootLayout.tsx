import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { Home, FileText, Calendar, Newspaper, User, Search, AlertTriangle, X } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/app/components/ui/utils";
import { useAuth } from "@/app/contexts/AuthContext";
import { useAnalytics } from "@/app/contexts/AnalyticsContext";
import { useSearch } from "@/app/contexts/SearchContext";
import { NotificationPanel } from "@/app/components/NotificationPanel";
import { Onboarding } from "@/app/components/Onboarding";

// Routes accessible even when financially blocked
const ROTAS_LIBERADAS_BLOQUEIO = ["/financeiro", "/perfil", "/", "/noticias"];

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { trackPageView } = useAnalytics();
  const { searchQuery, setSearchQuery, isSearchOpen, setIsSearchOpen } = useSearch();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  useEffect(() => {
    setSearchQuery("");
    setIsSearchOpen(false);
  }, [location.pathname, setSearchQuery, setIsSearchOpen]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  // Financial blocking: redirect to financeiro if on a blocked route
  useEffect(() => {
    if (!user) return;
    const bloqueado = user.pendenciaFinanceira?.bloqueado;
    if (bloqueado) {
      const rotaLiberada = ROTAS_LIBERADAS_BLOQUEIO.some(r => location.pathname === r || location.pathname.startsWith(r + "/") && r !== "/");
      const isRaiz = location.pathname === "/";
      if (!rotaLiberada && !isRaiz) {
        navigate("/financeiro");
      }
    }
  }, [user, location.pathname, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#c51d1f] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm text-gray-500">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isBloqueado = user.pendenciaFinanceira?.bloqueado;

  const navItems = [
    { icon: FileText, label: "Pedidos", path: "/pedidos", bloqueado: isBloqueado },
    { icon: Calendar, label: "Abate", path: "/agenda-abate", bloqueado: isBloqueado },
    { icon: Home, label: "Início", path: "/" },
    { icon: Newspaper, label: "Notícias", path: "/noticias" },
    { icon: User, label: "Perfil", path: "/perfil" },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#c51d1f] border-b border-red-900/20 px-4 py-3 shadow-sm min-h-[56px] flex items-center">
        <div className="max-w-md mx-auto w-full">
          {isSearchOpen ? (
            <div className="flex items-center gap-2 w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Pesquisar nesta página..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-1.5 text-xs bg-white text-gray-900 rounded-full focus:outline-none shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="text-xs text-white hover:text-white/80 font-semibold px-1 flex-shrink-0"
              >
                Fechar
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <h1 className="text-lg font-bold text-white tracking-wide">COOPERCARNE</h1>
              <div className="flex items-center gap-2">
                {isBloqueado && (
                  <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-2.5 py-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-white" />
                    <span className="text-white text-[10px] font-bold uppercase tracking-wide">Bloqueado</span>
                  </div>
                )}
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                  title="Pesquisar nesta página"
                >
                  <Search className="w-5 h-5" />
                </button>
                <NotificationPanel />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Financial blocking banner */}
      {isBloqueado && (
        <div
          className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 cursor-pointer hover:bg-amber-100 transition-colors"
          onClick={() => navigate("/financeiro")}
        >
          <div className="max-w-md mx-auto flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-amber-800">Acesso restrito por pendência financeira</p>
              <p className="text-[10px] text-amber-600 mt-0.5">
                Total em aberto: {user.pendenciaFinanceira.valorTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} · Toque para regularizar
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation Curve Dock - Brand Colors with Smooth Motion */}
      <nav className="fixed bottom-3 left-0 right-0 z-40 px-3 pointer-events-none">
        <div className="max-w-md mx-auto relative pointer-events-auto">
          {/* Main Brand Red Bar */}
          <div className="bg-[#c51d1f] text-white rounded-[28px] shadow-2xl h-16 px-2 flex items-center justify-around relative border border-red-800/40">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isItemBloqueado = item.bloqueado;

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    if (isItemBloqueado) {
                      navigate("/financeiro");
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center flex-1 h-full relative transition-colors duration-200 btn-interactive",
                    isActive ? "text-[#c51d1f]" : isItemBloqueado ? "text-amber-200" : "text-white/70 hover:text-white"
                  )}
                >
                  {/* Sliding Active Pill & Circle Background using Framer Motion */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute -top-7 flex flex-col items-center pointer-events-none z-10"
                    >
                      {/* Floating Circle Button */}
                      <div className="w-13 h-13 rounded-full bg-[#c51d1f] p-1 shadow-2xl flex items-center justify-center">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-md">
                          <Icon className="w-6 h-6 text-[#c51d1f]" />
                        </div>
                      </div>
                      <span className="text-[11px] font-[900] text-white tracking-wider uppercase mt-1 drop-shadow-sm whitespace-nowrap">
                        {item.label}
                      </span>
                    </motion.div>
                  )}

                  {/* Inactive State Icon */}
                  {!isActive && (
                    <>
                      <Icon className="w-5 h-5 mb-0.5" />
                      <span className="text-[9px] font-bold tracking-wider text-white/80">
                        {item.label}
                      </span>
                    </>
                  )}

                  {/* Lock Indicator */}
                  {isItemBloqueado && !isActive && (
                    <span className="absolute top-2 right-4 w-2 h-2 bg-amber-300 rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Global Components */}
      <Onboarding />
    </div>
  );
}
