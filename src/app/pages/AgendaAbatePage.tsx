import { useState, useEffect } from "react";
import { ChevronRight, Plus, CheckCircle2, XCircle, Truck, AlertTriangle, Bell, Download, Loader2 } from "lucide-react";
import { exportToPDFPrint } from "@/app/utils/exportUtils";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/app/contexts/AuthContext";
import { useNavigate } from "react-router";
import { agendaAbateService, type Agendamento, type AgendamentoStatus } from "@/app/services/agendaAbateService";

const statusConfig: Record<AgendamentoStatus, { label: string; color: string }> = {
  reservado: { label: "Reservado", color: "bg-blue-100 text-blue-800 border border-blue-300 font-semibold" },
  confirmado: { label: "Confirmado", color: "bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold" },
  nao_confirmado: { label: "Não Confirmado", color: "bg-red-100 text-red-800 border border-red-300 font-semibold" },
  em_processo: { label: "Em Processo", color: "bg-amber-100 text-amber-800 border border-amber-300 font-semibold" },
  finalizado: { label: "Finalizado", color: "bg-gray-100 text-gray-700 border border-gray-300 font-semibold" },
};

const getDateStr = (daysFromToday: number) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().split("T")[0];
};

export function AgendaAbatePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tipoAnimal, setTipoAnimal] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [machos, setMachos] = useState("");
  const [femeas, setFemeas] = useState("");
  const [dataAbate, setDataAbate] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Bovino e suíno exigem a quebra por sexo; demais espécies mantêm a quantidade única.
  const requiresSexBreakdown = tipoAnimal === "Bovino" || tipoAnimal === "Suino";

  const limiteAbate = user?.limiteAbate;
  const abatesRealizadosMes = user?.abatesRealizadosMes;

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    agendaAbateService
      .getMeusAgendamentos(user.id)
      .then(setAgendamentos)
      .catch((err) => {
        console.error(err);
        toast.error("Não foi possível carregar seus agendamentos.");
      })
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  // Agendamentos "reservados" com abate amanhã aguardando confirmação do cooperado.
  const amanha = getDateStr(1);
  const agendamentosParaConfirmar = agendamentos.filter(
    (a) => a.status === "reservado" && a.dataAbate === amanha
  );

  const handleSolicitar = async () => {
    if (!user) return;

    const quantidadeTotal = requiresSexBreakdown
      ? (parseInt(machos) || 0) + (parseInt(femeas) || 0)
      : parseInt(quantidade) || 0;

    if (!tipoAnimal || !dataAbate || quantidadeTotal <= 0 || (requiresSexBreakdown ? (!machos && !femeas) : !quantidade)) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (limiteAbate && abatesRealizadosMes) {
      const limiteKey = tipoAnimal.toLowerCase() as keyof typeof limiteAbate;
      const limite = limiteAbate[limiteKey];
      const realizados = abatesRealizadosMes[limiteKey];
      const saldo = limite - realizados;

      if (quantidadeTotal > saldo) {
        toast.error(`Limite mensal excedido. Saldo disponível: ${saldo} cabeças de ${tipoAnimal}`);
        return;
      }

      const percentualUsado = ((realizados + quantidadeTotal) / limite) * 100;
      if (percentualUsado >= 80) {
        toast.warning(`Atenção: você atingirá ${percentualUsado.toFixed(0)}% do seu limite mensal de ${tipoAnimal}`);
      }
    }

    setSubmitting(true);
    try {
      const novoAgendamento = await agendaAbateService.criarAgendamento({
        userId: user.id,
        isTerceiro: user.perfil === "terceiro",
        tipoAnimal,
        quantidade: quantidadeTotal,
        machos: requiresSexBreakdown ? (parseInt(machos) || 0) : undefined,
        femeas: requiresSexBreakdown ? (parseInt(femeas) || 0) : undefined,
        dataAbate,
        observacoes: observacoes.trim() || undefined,
      });

      setAgendamentos((prev) => [novoAgendamento, ...prev]);
      toast.success("Agendamento de abate reservado! Você precisará confirmar a presença na véspera.");
      setTipoAnimal("");
      setQuantidade("");
      setMachos("");
      setFemeas("");
      setDataAbate("");
      setObservacoes("");
      setDialogOpen(false);
    } catch (err: any) {
      toast.error(err?.message || "Falha ao criar agendamento.");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmarPresenca = async (agendamento: Agendamento, confirmado: boolean) => {
    setConfirmingId(agendamento.id);
    try {
      await agendaAbateService.confirmarPresenca(agendamento, confirmado);
      setAgendamentos((prev) =>
        prev.map((a) => (a.id === agendamento.id ? { ...a, status: confirmado ? "confirmado" : "nao_confirmado" } : a))
      );
      if (confirmado) {
        toast.success("Presença confirmada! A COOPERCARNE foi notificada.");
      } else {
        toast.warning("Agendamento não confirmado. O horário foi liberado na agenda.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Falha ao registrar confirmação.");
    } finally {
      setConfirmingId(null);
    }
  };

  const getLimiteDisplay = (tipo: string) => {
    if (!limiteAbate || !abatesRealizadosMes) return null;
    const key = tipo.toLowerCase() as keyof typeof limiteAbate;
    const limite = limiteAbate[key];
    const realizados = abatesRealizadosMes[key];
    const saldo = limite - realizados;
    const percentual = (realizados / limite) * 100;
    return { limite, realizados, saldo, percentual };
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Content */}

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">

        {/* Confirmação da véspera */}
        {agendamentosParaConfirmar.map((agendamento) => (
          <section key={agendamento.id}>
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-amber-900">Confirme seu abate de amanhã</p>
                  <p className="text-xs text-amber-700 mt-1">
                    {agendamento.quantidade} cabeças de {agendamento.tipo} agendadas para{" "}
                    {new Date(agendamento.dataAbate + "T00:00:00").toLocaleDateString("pt-BR")}.
                    Confirme se realmente vai levar essa quantidade.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      disabled={confirmingId === agendamento.id}
                      onClick={() => confirmarPresenca(agendamento, true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 flex-1"
                    >
                      {confirmingId === agendamento.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      Confirmar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={confirmingId === agendamento.id}
                      onClick={() => confirmarPresenca(agendamento, false)}
                      className="border-red-300 text-red-700 hover:bg-red-50 text-xs gap-1.5 flex-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Não Confirmar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Limite Mensal do Cooperado */}
        {limiteAbate && abatesRealizadosMes && (
          <section>
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Meu Limite Mensal de Abate</h3>
            <div className="grid grid-cols-3 gap-2">
              {(["bovino", "suino", "ovino"] as const).map((tipo) => {
                const info = getLimiteDisplay(tipo);
                if (!info) return null;
                const isWarning = info.percentual >= 80;
                const isCritical = info.percentual >= 95;
                const radius = 24;
                const strokeWidth = 10;
                const circumference = 2 * Math.PI * radius;
                const strokeDashoffset = circumference - (info.percentual / 100) * circumference;
                const colorClass = isCritical ? "#c51d1f" : isWarning ? "#f59e0b" : "#c51d1f";

                return (
                  <Card
                    key={tipo}
                    className={`border p-2 aspect-square gap-0 flex flex-col items-center justify-between text-center transition-all bg-white ${
                      isCritical
                        ? "border-red-300 bg-red-50/40"
                        : isWarning
                        ? "border-amber-300 bg-amber-50/40"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-0.5 w-full">
                      {(isCritical || isWarning) && (
                        <AlertTriangle className={`w-3 h-3 flex-shrink-0 ${isCritical ? "text-[#c51d1f]" : "text-amber-500"}`} />
                      )}
                      <span className="text-[11px] font-bold capitalize text-gray-900 uppercase tracking-wide truncate">
                        {tipo}
                      </span>
                    </div>

                    {/* Donut Pie Chart */}
                    <div className="relative w-11 h-11 sm:w-13 sm:h-13 flex items-center justify-center flex-shrink-0 my-auto">
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
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[10px] sm:text-[11px] font-extrabold text-gray-900">
                          {Math.round(info.percentual)}%
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="w-full space-y-0 text-[10px] leading-tight">
                      <p className="text-gray-600 truncate">
                        <span className="font-bold text-gray-900">{info.realizados}</span>/{info.limite} cab.
                      </p>
                      <p className="text-emerald-600 font-semibold truncate">
                        Saldo: {info.saldo}
                      </p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {/* Botão Novo Agendamento */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gradient-brand hover:opacity-95 btn-interactive text-white font-bold h-12 rounded-xl shadow-md text-base">
              <Plus className="mr-2 h-5 w-5" />
              Novo Agendamento de Abate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold uppercase tracking-wide text-[#c51d1f]">
                Agendar Abate
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Tipo de Animal</Label>
                <Select value={tipoAnimal} onValueChange={setTipoAnimal}>
                  <SelectTrigger className="mt-2 border-gray-300">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bovino">Bovino</SelectItem>
                    <SelectItem value="Suino">Suíno</SelectItem>
                    <SelectItem value="Ovino">Ovino</SelectItem>
                  </SelectContent>
                </Select>
                {tipoAnimal && (() => {
                  const info = getLimiteDisplay(tipoAnimal);
                  if (!info) return null;
                  return (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Bell className="w-3 h-3" />
                      Saldo mensal: <span className="font-semibold text-gray-800">{info.saldo} cabeças</span>
                    </p>
                  );
                })()}
              </div>

              {requiresSexBreakdown ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Machos</Label>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={machos}
                      onChange={(e) => setMachos(e.target.value)}
                      className="mt-2 border-gray-300"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Fêmeas</Label>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0"
                      value={femeas}
                      onChange={(e) => setFemeas(e.target.value)}
                      className="mt-2 border-gray-300"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <Label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Quantidade</Label>
                  <Input
                    type="number"
                    placeholder="Número de animais"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    className="mt-2 border-gray-300"
                  />
                </div>
              )}

              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Data do Abate *</Label>
                <Input
                  type="date"
                  value={dataAbate}
                  onChange={(e) => setDataAbate(e.target.value)}
                  className="mt-2 border-gray-300"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Observações</Label>
                <Textarea
                  placeholder="Informações adicionais..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="mt-2 border-gray-300"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleSolicitar}
                disabled={submitting}
                className="w-full bg-[#c51d1f] hover:bg-[#a01517] shadow-md h-11 font-semibold gap-2"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {submitting ? "Enviando..." : "Solicitar Agendamento"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Meus Agendamentos */}
        <section>
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-4">Meus Agendamentos</h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-gray-400 text-sm gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Carregando agendamentos...
            </div>
          ) : agendamentos.length === 0 ? (
            <p className="text-center py-10 text-gray-400 text-sm">Nenhum agendamento ainda.</p>
          ) : (
            <div className="space-y-3">
              {agendamentos.map((agendamento) => {
                const cfg = statusConfig[agendamento.status];
                return (
                  <Card key={agendamento.id} className="border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-900">{agendamento.tipo}</p>
                          <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wide">
                            Abate: {new Date(agendamento.dataAbate + "T00:00:00").toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <Badge className={`text-xs uppercase tracking-wide ${cfg.color}`}>
                          {cfg.label}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Quantidade</p>
                          <p className="text-sm font-medium text-gray-900 mt-0.5">{agendamento.quantidade} cabeças</p>
                          {agendamento.machos !== undefined && agendamento.femeas !== undefined && (
                            <p className="text-[11px] text-gray-500 mt-0.5">{agendamento.machos} machos · {agendamento.femeas} fêmeas</p>
                          )}
                          {agendamento.status === "finalizado" && agendamento.quantidadeProcessada !== undefined && (
                            <p className="text-[11px] text-gray-500 mt-0.5">Processado: {agendamento.quantidadeProcessada} cab.</p>
                          )}
                        </div>
                        {agendamento.status === "finalizado" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              exportToPDFPrint(
                                `Romaneio Oficial de Abate #${agendamento.id}`,
                                ["Cód.", "Data Abate", "Espécie", "Cabeças", "Rendimento Médio Estimado", "Status Final"],
                                [[agendamento.id, new Date(agendamento.dataAbate + "T00:00:00").toLocaleDateString("pt-BR"), agendamento.tipo, `${agendamento.quantidade} cab.`, "54.5%", "Finalizado / Processado"]]
                              );
                              toast.success("Romaneio oficial baixado em PDF!");
                            }}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Baixar Romaneio (PDF)
                          </Button>
                        )}
                        {agendamento.status !== "finalizado" && (
                          <button className="text-gray-400 hover:text-[#c51d1f] transition-colors">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        {/* Agenda de Entrega */}
        <section>
          <Card
            className="border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate("/agenda-entrega")}
          >
            <div className="p-4 flex items-center gap-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Truck className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">Agenda de Entrega</p>
                <p className="text-xs text-gray-500 mt-0.5">Agendar entrega de carcaças e miúdos</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
