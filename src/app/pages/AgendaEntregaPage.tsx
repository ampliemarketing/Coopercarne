import { useState } from "react";
import { Calendar as CalendarIcon, Plus, ChevronRight, Package } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Checkbox } from "@/app/components/ui/checkbox";
import { toast } from "sonner";
import { Calendar } from "@/app/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type EntregaStatus = "agendado" | "em_transito" | "entregue" | "cancelado";

interface AgendamentoEntrega {
  id: string;
  dataEntrega: string;
  tipoAnimal: string;
  itens: string[];
  unidades: number;
  enderecoEntrega: string;
  status: EntregaStatus;
  observacoes?: string;
}

const statusConfig: Record<EntregaStatus, { label: string; color: string }> = {
  agendado: { label: "Agendado", color: "bg-blue-100 text-blue-800 border border-blue-300 font-semibold" },
  em_transito: { label: "Em Trânsito", color: "bg-amber-100 text-amber-800 border border-amber-300 font-semibold" },
  entregue: { label: "Entregue", color: "bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800 border border-red-300 font-semibold" },
};

const itensDisponiveisMap: Record<string, Array<{ id: string; label: string; desc: string }>> = {
  Bovino: [
    { id: "carcaca", label: "Carcaça Bovino", desc: "Meia carcaça ou quartos" },
    { id: "figado", label: "Fígado (Miúdo)", desc: "Fígado bovino resfriado" },
    { id: "coracao", label: "Coração (Miúdo)", desc: "Coração bovino" },
    { id: "outros_miudos", label: "Outros Miúdos", desc: "Língua, rins, moela, bucho e mocotó" },
    { id: "couro", label: "Couro", desc: "Couro bovino verde" },
    { id: "ossos_gordura", label: "Ossos & Sebo", desc: "Ossos, gordura e aparas" },
  ],
  Suino: [
    { id: "carcaca", label: "Carcaça Suína", desc: "Carcaça suína inteira ou dividida" },
    { id: "figado", label: "Fígado (Miúdo)", desc: "Fígado suíno" },
    { id: "coracao", label: "Coração (Miúdo)", desc: "Coração suíno" },
    { id: "outros_miudos", label: "Outros Miúdos", desc: "Pulmão, mocotó, orelha e língua" },
    { id: "toucinho", label: "Toucinho / Banha", desc: "Toucinho fresco com pele" },
  ],
  Ovino: [
    { id: "carcaca", label: "Carcaça Ovina / Cordeiro", desc: "Carcaça inteira" },
    { id: "figado", label: "Fígado (Miúdo)", desc: "Fígado ovino" },
    { id: "coracao", label: "Coração (Miúdo)", desc: "Coração ovino" },
    { id: "outros_miudos", label: "Outros Miúdos", desc: "Rins e miúdos finos" },
    { id: "pele", label: "Pele / Lã", desc: "Pele com lã" },
  ],
};

const initialEntregas: AgendamentoEntrega[] = [
  {
    id: "1",
    dataEntrega: "2026-02-06",
    tipoAnimal: "Bovino",
    itens: ["Carcaça", "Miúdos (fígado, coração, língua, rins)"],
    unidades: 2,
    enderecoEntrega: "Av. Brasil, 1500 - Supermercado Silva",
    status: "agendado",
  },
];

export function AgendaEntregaPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tipoAnimal, setTipoAnimal] = useState("");
  const [itensSelecionados, setItensSelecionados] = useState<string[]>([]);
  const [unidades, setUnidades] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [enderecoEntrega, setEnderecoEntrega] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [entregas, setEntregas] = useState<AgendamentoEntrega[]>(initialEntregas);

  const itensDisponiveis = tipoAnimal ? itensDisponiveisMap[tipoAnimal] || [] : [];

  const toggleItem = (item: string) => {
    setItensSelecionados(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleAgendar = () => {
    if (!tipoAnimal || !dataEntrega || itensSelecionados.length === 0 || !enderecoEntrega) {
      toast.error("Preencha todos os campos obrigatórios e selecione ao menos um item");
      return;
    }

    const novaEntrega: AgendamentoEntrega = {
      id: String(Date.now()),
      dataEntrega,
      tipoAnimal,
      itens: itensSelecionados,
      unidades: parseInt(unidades) || 1,
      enderecoEntrega,
      status: "agendado",
      observacoes,
    };

    setEntregas(prev => [novaEntrega, ...prev]);
    toast.success("Entrega agendada com sucesso! A COOPERCARNE foi notificada.");
    setTipoAnimal("");
    setItensSelecionados([]);
    setUnidades("");
    setDataEntrega("");
    setEnderecoEntrega("");
    setObservacoes("");
    setDialogOpen(false);
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Agenda de Entrega</h1>
          <p className="text-xs text-gray-500 mt-1">Carcaças, miúdos e subprodutos</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-[#c51d1f] hover:bg-[#a01517] shadow-lg h-12 text-base font-semibold">
              <Plus className="mr-2 h-5 w-5" />
              Agendar Nova Entrega
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold uppercase tracking-wide text-[#c51d1f]">
                Nova Entrega
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Tipo de Animal *</Label>
                <Select value={tipoAnimal} onValueChange={(v) => { setTipoAnimal(v); setItensSelecionados([]); }}>
                  <SelectTrigger className="mt-2 border-gray-300">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bovino">Bovino</SelectItem>
                    <SelectItem value="Suino">Suíno</SelectItem>
                    <SelectItem value="Ovino">Ovino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {tipoAnimal && (
                <div>
                  <Label className="text-xs text-gray-600 uppercase tracking-wide font-semibold mb-2 block">
                    Flegar Itens para Entrega *
                  </Label>
                  <div className="space-y-2 border border-gray-200 rounded-xl p-3 bg-gray-50">
                    {itensDisponiveis.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleItem(item.label)}
                        className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all cursor-pointer ${
                          itensSelecionados.includes(item.label)
                            ? "bg-red-50/70 border-red-200 text-gray-900"
                            : "bg-white border-gray-200 hover:bg-gray-100/80"
                        }`}
                      >
                        <Checkbox
                          id={item.id}
                          checked={itensSelecionados.includes(item.label)}
                          onCheckedChange={() => toggleItem(item.label)}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={item.id}
                            className="text-xs font-bold text-gray-900 block cursor-pointer"
                          >
                            {item.label}
                          </label>
                          <span className="text-[11px] text-gray-500 block leading-tight">
                            {item.desc}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Unidades *</Label>
                <Input
                  type="number"
                  placeholder="Ex: 5"
                  value={unidades}
                  onChange={(e) => setUnidades(e.target.value)}
                  className="mt-2 border-gray-300"
                  min="1"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Data de Entrega *</Label>
                <Input
                  type="date"
                  value={dataEntrega}
                  onChange={(e) => setDataEntrega(e.target.value)}
                  className="mt-2 border-gray-300"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Endereço de Entrega *</Label>
                <Input
                  type="text"
                  placeholder="Endereço completo do estabelecimento"
                  value={enderecoEntrega}
                  onChange={(e) => setEnderecoEntrega(e.target.value)}
                  className="mt-2 border-gray-300"
                />
              </div>

              <div>
                <Label className="text-xs text-gray-600 uppercase tracking-wide font-semibold">Observações</Label>
                <Textarea
                  placeholder="Instruções para entrega, horário preferencial..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="mt-2 border-gray-300"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleAgendar}
                className="w-full bg-[#c51d1f] hover:bg-[#a01517] shadow-md h-11 font-semibold"
              >
                Confirmar Agendamento
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Lista de entregas */}
        <section>
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-4">Minhas Entregas</h3>
          {entregas.length === 0 ? (
            <Card className="border-gray-200 p-8 text-center">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Nenhuma entrega agendada</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {entregas.map((entrega) => {
                const cfg = statusConfig[entrega.status];
                return (
                  <Card key={entrega.id} className="border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-gray-900">{entrega.tipoAnimal}</p>
                          <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wide">
                            Entrega: {new Date(entrega.dataEntrega + "T00:00:00").toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <Badge className={`text-xs uppercase tracking-wide ${cfg.color}`}>
                          {cfg.label}
                        </Badge>
                      </div>

                      <div className="space-y-1.5 mb-3">
                        {entrega.itens.map(item => (
                          <p key={item} className="text-xs text-gray-600 flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-gray-400 rounded-full flex-shrink-0" />
                            {item}
                          </p>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Unidades</p>
                          <p className="text-sm font-medium text-gray-900 mt-0.5">{entrega.unidades} un.</p>
                        </div>
                        <button className="text-gray-400 hover:text-[#c51d1f] transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
