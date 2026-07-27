import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { RootLayout } from "@/app/components/RootLayout";
import { RouteErrorFallback } from "@/app/components/ErrorBoundary";
import { HomePage } from "@/app/pages/HomePage";
import { LoginPage } from "@/app/pages/LoginPage";
import { CadastroPage } from "@/app/pages/CadastroPage";
import { PedidosPage } from "@/app/pages/PedidosPage";
import { NovoPedidoPage } from "@/app/pages/NovoPedidoPage";
import { AgendaAbatePage } from "@/app/pages/AgendaAbatePage";
import { AgendaEntregaPage } from "@/app/pages/AgendaEntregaPage";
import { DocumentosPage } from "@/app/pages/DocumentosPage";
import { ComunicacaoPage } from "@/app/pages/ComunicacaoPage";
import { PrecosPage } from "@/app/pages/PrecosPage";
import { CotacoesPage } from "@/app/pages/CotacoesPage";
import { NovaCotacaoPage } from "@/app/pages/NovaCotacaoPage";
import { FinanceiroPage } from "@/app/pages/FinanceiroPage";
import { SugestoesPage } from "@/app/pages/SugestoesPage";
import { ChamadosPage } from "@/app/pages/ChamadosPage";
import { NovoChamadoPage } from "@/app/pages/NovoChamadoPage";
import { PerfilPage } from "@/app/pages/PerfilPage";
import { NoticiasPage } from "@/app/pages/NoticiasPage";

function AuthLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    ErrorBoundary: RouteErrorFallback,
    children: [
      { path: "/login", Component: LoginPage },
      { path: "/cadastro", Component: CadastroPage },
      {
        path: "/",
        Component: RootLayout,
        children: [
          { index: true, Component: HomePage },
          { path: "pedidos", Component: PedidosPage },
          { path: "pedidos/novo", Component: NovoPedidoPage },
          { path: "agenda-abate", Component: AgendaAbatePage },
          { path: "agenda-entrega", Component: AgendaEntregaPage },
          { path: "documentos", Component: DocumentosPage },
          { path: "comunicacao", Component: ComunicacaoPage },
          { path: "precos", Component: PrecosPage },
          { path: "cotacoes", Component: CotacoesPage },
          { path: "cotacoes/nova", Component: NovaCotacaoPage },
          { path: "financeiro", Component: FinanceiroPage },
          { path: "sugestoes", Component: SugestoesPage },
          { path: "chamados", Component: ChamadosPage },
          { path: "chamados/novo", Component: NovoChamadoPage },
          { path: "perfil", Component: PerfilPage },
          { path: "noticias", Component: NoticiasPage },
        ],
      },
    ],
  },
]);
