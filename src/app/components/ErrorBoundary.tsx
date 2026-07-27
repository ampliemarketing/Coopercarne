import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full border border-gray-100 text-center">
            <div className="w-16 h-16 bg-red-50 text-[#c51d1f] rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Ops! Algo deu errado</h1>
            <p className="text-gray-600 text-sm mb-6">
              Ocorreu um erro inesperado na aplicação. Nossa equipe já foi notificada.
            </p>
            {this.state.error && (
              <div className="bg-gray-100 rounded-lg p-3 text-left font-mono text-xs text-red-600 mb-6 overflow-x-auto max-h-32">
                {this.state.error.message}
              </div>
            )}
            <div className="flex gap-3">
              <Button
                onClick={() => window.location.reload()}
                className="flex-1 bg-[#c51d1f] hover:bg-[#a01517] flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Recarregar
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" /> Início
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function RouteErrorFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full border border-gray-100 text-center">
        <div className="w-16 h-16 bg-red-50 text-[#c51d1f] rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Página com erro</h1>
        <p className="text-gray-600 text-sm mb-6">
          Não foi possível carregar este conteúdo no momento.
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() => window.location.reload()}
            className="flex-1 bg-[#c51d1f] hover:bg-[#a01517] flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Recarregar
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Início
          </Button>
        </div>
      </div>
    </div>
  );
}
