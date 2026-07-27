import { useState } from "react";
import { FileText, Download, Copy, Search, DollarSign, AlertOctagon, CheckCircle2, ShieldCheck } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/app/contexts/AuthContext";
import { useSearch } from "@/app/contexts/SearchContext";
import { exportToCSV, exportToPDFPrint } from "@/app/utils/exportUtils";

const mockNFe = [
  { id: "1", numero: "12345", valor: 12500.00, data: "2026-01-28", chave: "35260112345678901234567890123456789012345678" },
  { id: "2", numero: "12344", valor: 8200.00, data: "2026-01-25", chave: "35260112345678901234567890123456789012345677" },
  { id: "3", numero: "12343", valor: 15300.00, data: "2026-01-20", chave: "35260112345678901234567890123456789012345676" },
];

const mockBoletos = [
  { id: "1", numero: "1234", vencimento: "2026-02-05", valor: 12500.00, status: "aberto", linha: "34191.09008 01234.567890 12345.678901 1 98760000012500" },
  { id: "2", numero: "1235", vencimento: "2026-02-10", valor: 8200.00, status: "aberto", linha: "34191.09008 01234.567890 12345.678901 1 98760000008200" },
  { id: "3", numero: "1233", vencimento: "2026-01-25", valor: 15300.00, status: "pago", linha: "34191.09008 01234.567890 12345.678901 1 98760000015300" },
  { id: "4", numero: "1232", vencimento: "2026-01-20", valor: 6500.00, status: "vencido", linha: "34191.09008 01234.567890 12345.678901 1 98760000006500" },
];

const statusColors: Record<string, string> = {
  "aberto": "bg-[#c51d1f] text-white",
  "pago": "bg-emerald-600 text-white",
  "vencido": "bg-red-700 text-white",
};

const statusLabels: Record<string, string> = {
  "aberto": "Em aberto",
  "pago": "Pago",
  "vencido": "Vencido",
};

export function FinanceiroPage() {
  const { searchQuery } = useSearch();
  const { user, pagarPendenciaFinanceira } = useAuth();
  const [tipoFiltro, setTipoFiltro] = useState<"boletos" | "nfe">("boletos");

  const isBloqueado = user?.pendenciaFinanceira?.bloqueado;

  const handleSimularPagamento = () => {
    pagarPendenciaFinanceira();
    toast.success("Pagamento confirmado! Acesso ao sistema e aos pedidos liberado com sucesso.");
  };

  const copiarLinha = (linha: string) => {
    navigator.clipboard.writeText(linha);
    toast.success("Linha digitável copiada!");
  };

  const filteredBoletos = mockBoletos.filter(boleto => 
    !searchQuery ||
    boleto.numero.toLowerCase().includes(searchQuery.toLowerCase()) || 
    boleto.valor.toString().includes(searchQuery)
  );

  const filteredNFe = mockNFe.filter(nfe => 
    !searchQuery ||
    nfe.numero.toLowerCase().includes(searchQuery.toLowerCase()) || 
    nfe.valor.toString().includes(searchQuery)
  );

  const boletosEmAberto = mockBoletos.filter(b => b.status === "aberto").length;
  const boletosVencidos = mockBoletos.filter(b => b.status === "vencido").length;

  return (
    <div className="min-h-full bg-slate-50/70 pb-12">
      {/* Header com Abas em Destaque */}
      <div className="glass-header border-b border-slate-200/70 sticky top-0 z-20 shadow-xs px-4 pt-4 pb-0">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Financeiro & Documentos</h1>
          </div>

          {/* Abas Principais em Botões Grandes */}
          <div className="flex border-b border-slate-200 gap-2">
            <button
              onClick={() => setTipoFiltro("boletos")}
              className={`flex-1 py-3 px-2 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                tipoFiltro === "boletos"
                  ? "border-[#c51d1f] text-[#c51d1f]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Boletos</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                tipoFiltro === "boletos" ? "bg-red-100 text-[#c51d1f]" : "bg-slate-100 text-slate-600"
              }`}>
                {mockBoletos.length}
              </span>
            </button>

            <button
              onClick={() => setTipoFiltro("nfe")}
              className={`flex-1 py-3 px-2 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-all ${
                tipoFiltro === "nfe"
                  ? "border-[#c51d1f] text-[#c51d1f]"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Notas Fiscais</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                tipoFiltro === "nfe" ? "bg-red-100 text-[#c51d1f]" : "bg-slate-100 text-slate-600"
              }`}>
                {mockNFe.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-5 space-y-4">

        {/* Card de Status de Bloqueio (Exibido apenas quando houver pendência) */}
        {isBloqueado && (
          <Card className="border p-4 shadow-sm transition-all rounded-xl border-amber-300 bg-amber-50/70">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl flex-shrink-0 bg-amber-500 text-white">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold tracking-wide text-amber-900">
                  Pendência Financeira Detectada
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Você tem faturas pendentes. Regularize agora para liberar o acesso total aos abates e pedidos.
                </p>

                <div className="mt-3">
                  <Button
                    onClick={handleSimularPagamento}
                    size="sm"
                    className="bg-[#c51d1f] hover:bg-[#a01517] text-white text-xs font-bold shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1.5" />
                    Pagar / Regularizar Agora
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Seção de Boletos */}
        {tipoFiltro === "boletos" && (
          <div className="space-y-3">
            <div className="space-y-3">
              {filteredBoletos.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
                  Nenhum boleto encontrado nesta categoria.
                </div>
              ) : (
                filteredBoletos.map((boleto) => (
                  <Card key={boleto.id} className="border-slate-200/90 shadow-sm rounded-xl overflow-hidden bg-white hover:border-slate-300 transition-all">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
                            <DollarSign className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm">Boleto #{boleto.numero}</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Vencimento: <strong className="text-slate-700">{new Date(boleto.vencimento).toLocaleDateString("pt-BR")}</strong>
                            </p>
                          </div>
                        </div>
                        <Badge className={`${statusColors[boleto.status]} text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5`}>
                          {statusLabels[boleto.status]}
                        </Badge>
                      </div>

                      <div className="my-3 bg-slate-50 p-3 rounded-lg flex items-center justify-between border border-slate-100">
                        <span className="text-xs text-slate-500 font-medium">Valor Total:</span>
                        <span className="text-lg font-extrabold text-slate-900">
                          {boleto.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                      </div>

                      {boleto.status === "aberto" && (
                        <div className="space-y-2.5">
                          <div className="p-2.5 bg-slate-100/70 rounded-lg text-[11px] font-mono break-all text-slate-700 border border-slate-200/60 flex items-center justify-between gap-2">
                            <span className="truncate">{boleto.linha}</span>
                            <button 
                              onClick={() => copiarLinha(boleto.linha)}
                              className="text-[#c51d1f] hover:underline font-bold text-[11px] flex-shrink-0 flex items-center gap-1"
                            >
                              <Copy className="w-3 h-3" />
                              Copiar
                            </button>
                          </div>
                          <div className="flex gap-2 pt-1">
                            <Button
                              onClick={() => copiarLinha(boleto.linha)}
                              variant="outline"
                              size="sm"
                              className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold"
                            >
                              <Copy className="w-3.5 h-3.5 mr-1.5" />
                              Copiar Linha
                            </Button>
                            <Button
                              onClick={() => toast.success("Download iniciado")}
                              size="sm"
                              className="flex-1 bg-[#c51d1f] hover:bg-[#a01517] text-white font-semibold shadow-sm"
                            >
                              <Download className="w-3.5 h-3.5 mr-1.5" />
                              Baixar PDF
                            </Button>
                          </div>
                        </div>
                      )}

                      {boleto.status !== "aberto" && (
                        <Button
                          onClick={() => toast.success("Download iniciado")}
                          variant="outline"
                          size="sm"
                          className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold mt-1"
                        >
                          <Download className="w-3.5 h-3.5 mr-2" />
                          Baixar Comprovante
                        </Button>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {/* Seção de Notas Fiscais (NF-e) */}
        {tipoFiltro === "nfe" && (
          <div className="space-y-3">
            {filteredNFe.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-xl border border-slate-200 text-slate-500 text-sm">
                Nenhuma nota fiscal encontrada.
              </div>
            ) : (
              filteredNFe.map((nfe) => (
                <Card key={nfe.id} className="border-slate-200/90 shadow-sm rounded-xl overflow-hidden bg-white hover:border-slate-300 transition-all">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-red-50 text-[#c51d1f] rounded-lg">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">Nota Fiscal Eletrônica #{nfe.numero}</h3>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Emissão: <strong className="text-slate-700">{new Date(nfe.data).toLocaleDateString("pt-BR")}</strong>
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase px-2 py-0.5">
                        Emitida
                      </Badge>
                    </div>

                    <div className="my-3 bg-slate-50 p-3 rounded-lg flex items-center justify-between border border-slate-100">
                      <span className="text-xs text-slate-500 font-medium">Valor Total da Nota:</span>
                      <span className="text-lg font-extrabold text-slate-900">
                        {nfe.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-100/70 rounded-lg text-[11px] font-mono break-all text-slate-600 border border-slate-200/60 mb-3 flex items-center justify-between gap-2">
                      <span className="truncate">Chave: {nfe.chave}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-100">
                      <Button
                        onClick={() => {
                          exportToPDFPrint(
                            `DANFE - Nota Fiscal Eletrônica #${nfe.numero}`,
                            ["Nº Nota", "Data Emissão", "Chave de Acesso", "Valor Total"],
                            [[nfe.numero, new Date(nfe.data).toLocaleDateString("pt-BR"), nfe.chave, nfe.valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })]]
                          );
                          toast.success("Documento PDF gerado para impressão!");
                        }}
                        variant="outline"
                        size="sm"
                        className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs"
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        DANFE (PDF)
                      </Button>
                      <Button
                        onClick={() => {
                          exportToCSV(
                            `NFe_${nfe.numero}`,
                            ["Numero", "Data", "Chave", "Valor"],
                            [[nfe.numero, nfe.data, nfe.chave, nfe.valor]]
                          );
                          toast.success("Arquivo Excel/CSV exportado!");
                        }}
                        variant="outline"
                        size="sm"
                        className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs"
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        Excel / CSV
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
