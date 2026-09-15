import { useState } from "react";
import { useNavigate } from "react-router";
import { Plus, ChevronRight, Filter, Download, Copy, XCircle, CheckCircle2, Clock, Truck, FileText, Package, Paperclip } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Card } from "@/app/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { toast } from "sonner";
import { useSearch } from "@/app/contexts/SearchContext";

interface PedidoItemDetalhe {
  tipoUnidade: string;
  quantidade: string;
}

interface Pedido {
  id: string;
  data: string;
  dataEntregaDesejada: string;
  tipo: string;
  status: "rascunho" | "enviado" | "em separação" | "faturado" | "entregue" | "cancelado";
  itensCount: number;
  localEntrega: string;
  observacoes?: string;
  detalhesItens: PedidoItemDetalhe[];
  anexoNome?: string; // Comprovante/anexo enviado pela COOPERCARNE
}

const mockPedidosIniciais: Pedido[] = [
  {
    id: "PED001",
    data: "2026-01-28",
    dataEntregaDesejada: "2026-02-02",
    tipo: "Bovina",
    status: "em separação",
    itensCount: 2,
    localEntrega: "Matriz - Rua Principal, 123",
    observacoes: "Entregar no período da manhã até as 10h.",
    detalhesItens: [
      { tipoUnidade: "Carcaça Inteira", quantidade: "3 un." },
      { tipoUnidade: "Meia Carcaça (Banda)", quantidade: "5 un." },
    ],
  },
  {
    id: "PED002",
    data: "2026-01-27",
    dataEntregaDesejada: "2026-01-30",
    tipo: "Suína",
    status: "faturado",
    itensCount: 1,
    localEntrega: "Filial 1 - Av. Central, 456",
    observacoes: "Embalagem a vácuo padrão.",
    detalhesItens: [
      { tipoUnidade: "Carcaça Inteira", quantidade: "8 un." },
    ],
    anexoNome: "nota-fiscal-PED002.pdf",
  },
  {
    id: "PED003",
    data: "2026-01-25",
    dataEntregaDesejada: "2026-01-28",
    tipo: "Bovina",
    status: "entregue",
    itensCount: 1,
    localEntrega: "Matriz - Rua Principal, 123",
    detalhesItens: [
      { tipoUnidade: "Meia Carcaça (Banda)", quantidade: "10 un." },
    ],
    anexoNome: "comprovante-entrega-PED003.pdf",
  },
  {
    id: "PED004",
    data: "2026-01-20",
    dataEntregaDesejada: "2026-01-26",
    tipo: "Ovina",
    status: "rascunho",
    itensCount: 1,
    localEntrega: "Retirar no Frigorífico",
    observacoes: "Rascunho pendente de confirmação de quantidade.",
    detalhesItens: [
      { tipoUnidade: "Carcaça Inteira", quantidade: "4 un." },
    ],
  },
];

const statusBadgeStyle: Record<string, string> = {
  "rascunho": "bg-[#c51d1f] text-white font-bold tracking-wide",
  "enviado": "bg-[#c51d1f] text-white font-bold tracking-wide",
  "em separação": "bg-[#c51d1f] text-white font-bold tracking-wide",
  "faturado": "bg-[#c51d1f] text-white font-bold tracking-wide",
  "entregue": "bg-[#c51d1f] text-white font-bold tracking-wide",
  "cancelado": "bg-[#c51d1f] text-white font-bold tracking-wide",
};

const statusSteps = [
  { key: "rascunho", label: "Rascunho" },
  { key: "enviado", label: "Enviado" },
  { key: "em separação", label: "Separação" },
  { key: "faturado", label: "Faturado" },
  { key: "entregue", label: "Entregue" },
];

export function PedidosPage() {
  const navigate = useNavigate();
  const { searchQuery } = useSearch();
  const [pedidos, setPedidos] = useState<Pedido[]>(mockPedidosIniciais);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);

  const filteredPedidos = pedidos.filter((pedido) => {
    if (!searchQuery) return true;
    return (
      pedido.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pedido.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pedido.status.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleCancelarPedido = (id: string) => {
    setPedidos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "cancelado" as const } : p))
    );
    if (pedidoSelecionado?.id === id) {
      setPedidoSelecionado((prev) => (prev ? { ...prev, status: "cancelado" } : null));
    }
    toast.success(`Pedido ${id} foi cancelado com sucesso.`);
  };

  const handleDuplicarPedido = (pedido: Pedido) => {
    const novoId = `PED${(pedidos.length + 1).toString().padStart(3, "0")}`;
    const novoPedido: Pedido = {
      ...pedido,
      id: novoId,
      data: new Date().toISOString().split("T")[0],
      status: "rascunho",
    };
    setPedidos([novoPedido, ...pedidos]);
    setPedidoSelecionado(null);
    toast.success(`Cópia criada como rascunho: ${novoId}`);
  };

  const getStepIndex = (status: string) => {
    if (status === "cancelado") return -1;
    return statusSteps.findIndex((s) => s.key === status);
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Content */}

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* New Order Button */}
        <Button
          onClick={() => navigate("/agenda-entrega")}
          className="w-full bg-[#c51d1f] hover:bg-[#a01517] text-white shadow-md font-bold py-5"
        >
          <Plus className="w-5 h-5 mr-2" />
          Criar Novo Pedido
        </Button>

        {/* Orders List */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Histórico de Pedidos
          </h3>

          {filteredPedidos.length === 0 ? (
            <Card className="p-8 text-center border-gray-200">
              <Package className="w-10 h-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">
                Nenhum pedido encontrado
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Tente ajustar sua busca ou filtros.
              </p>
            </Card>
          ) : (
            filteredPedidos.map((pedido) => (
              <Card
                key={pedido.id}
                onClick={() => setPedidoSelecionado(pedido)}
                className="border-gray-200 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">
                        {pedido.id}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wide">
                        {new Date(pedido.data + "T00:00:00").toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <Badge
                      className={`${statusBadgeStyle[pedido.status]} text-xs font-bold uppercase tracking-wide border px-2.5 py-0.5`}
                    >
                      {pedido.status}
                    </Badge>
                  </div>

                  <div className="space-y-1.5 text-xs py-3 border-t border-b border-gray-100">
                    <div className="flex justify-between">
                      <span className="text-gray-500 uppercase tracking-wide">Tipo</span>
                      <span className="font-medium text-gray-900">{pedido.tipo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 uppercase tracking-wide">Unidades</span>
                      <span className="font-medium text-gray-900">{pedido.itensCount} unidade(s)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 uppercase tracking-wide">Entrega</span>
                      <span className="font-medium text-gray-700 truncate max-w-[200px] text-right">
                        {pedido.localEntrega.split(" - ")[0]}
                      </span>
                    </div>
                  </div>

                  {pedido.anexoNome && (
                    <div className="flex items-center gap-1.5 text-[11px] text-[#c51d1f] font-semibold mt-2">
                      <Paperclip className="w-3 h-3" />
                      Comprovante anexado pela COOPERCARNE
                    </div>
                  )}

                  <div className="flex items-center justify-end mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center text-xs font-semibold text-[#c51d1f] gap-1">
                      Ver detalhes
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Modal de Detalhes do Pedido */}
      <Dialog open={!!pedidoSelecionado} onOpenChange={(open) => !open && setPedidoSelecionado(null)}>
        <DialogContent className="max-w-md w-[92vw] rounded-2xl max-h-[90vh] overflow-y-auto p-5">
          {pedidoSelecionado && (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl font-bold text-gray-900">
                      Pedido {pedidoSelecionado.id}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-gray-500 mt-0.5">
                      Realizado em {new Date(pedidoSelecionado.data + "T00:00:00").toLocaleDateString("pt-BR")}
                    </DialogDescription>
                  </div>
                  <Badge className={`${statusBadgeStyle[pedidoSelecionado.status]} uppercase font-bold text-xs`}>
                    {pedidoSelecionado.status}
                  </Badge>
                </div>
              </DialogHeader>

              {/* Status Timeline */}
              {pedidoSelecionado.status !== "cancelado" ? (
                <div className="py-2 border-y border-gray-100">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
                    Progresso do Pedido
                  </p>
                  <div className="flex items-center justify-between">
                    {statusSteps.map((step, idx) => {
                      const currentIdx = getStepIndex(pedidoSelecionado.status);
                      const isDone = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={step.key} className="flex flex-col items-center flex-1 relative">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all z-10 ${
                              isDone
                                ? "bg-[#c51d1f] text-white"
                                : "bg-gray-200 text-gray-500"
                            } ${isCurrent ? "ring-4 ring-red-100" : ""}`}
                          >
                            {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[9px] mt-1 font-medium text-center ${
                              isCurrent ? "text-[#c51d1f] font-bold" : "text-gray-500"
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                  <p className="text-xs font-bold text-red-700 uppercase">
                    Este pedido foi cancelado
                  </p>
                </div>
              )}

              {/* Informações Gerais */}
              <div className="space-y-2 text-xs bg-gray-50 p-3 rounded-xl">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tipo de Carne:</span>
                  <span className="font-semibold text-gray-900">{pedidoSelecionado.tipo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Previsão de Entrega:</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(pedidoSelecionado.dataEntregaDesejada + "T00:00:00").toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Local de Entrega:</span>
                  <span className="font-semibold text-gray-900 text-right truncate max-w-[200px]">
                    {pedidoSelecionado.localEntrega}
                  </span>
                </div>
                {pedidoSelecionado.observacoes && (
                  <div className="pt-1 border-t border-gray-200">
                    <span className="text-gray-500">Observações:</span>
                    <p className="text-gray-700 mt-0.5 font-normal">
                      {pedidoSelecionado.observacoes}
                    </p>
                  </div>
                )}
              </div>

              {/* Unidades de Carcaça do Pedido */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                  Unidades de Carcaça ({pedidoSelecionado.detalhesItens.length})
                </h4>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden">
                  {pedidoSelecionado.detalhesItens.map((item, i) => (
                    <div key={i} className="p-3 bg-white flex items-center justify-between">
                      <p className="text-xs font-bold text-gray-900">{item.tipoUnidade}</p>
                      <span className="text-xs font-semibold text-gray-700">
                        {item.quantidade}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comprovante / Anexo enviado pela COOPERCARNE */}
              {pedidoSelecionado.anexoNome && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2">
                    Comprovante / Anexo
                  </h4>
                  <button
                    onClick={() => toast.info(`Abrindo "${pedidoSelecionado.anexoNome}" (visual — sem arquivo real ainda).`)}
                    className="w-full flex items-center gap-2.5 p-3 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <div className="bg-white p-2 rounded-lg border border-red-200">
                      <Paperclip className="w-4 h-4 text-[#c51d1f]" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-xs font-bold text-gray-900 truncate">{pedidoSelecionado.anexoNome}</p>
                      <p className="text-[11px] text-gray-500">Enviado pela COOPERCARNE</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              )}

              {/* Ações */}
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast.success("Comprovante gerado em PDF com sucesso!");
                    }}
                    className="text-xs font-semibold"
                  >
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Baixar PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicarPedido(pedidoSelecionado)}
                    className="text-xs font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Duplicar Pedido
                  </Button>
                </div>

                {["rascunho", "enviado"].includes(pedidoSelecionado.status) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelarPedido(pedidoSelecionado.id)}
                    className="w-full border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold mt-1"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1.5" />
                    Cancelar Este Pedido
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}