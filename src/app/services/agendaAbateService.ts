import { supabase, ANIMAL_TYPE_TO_DB, ANIMAL_TYPE_FROM_DB } from "@/app/lib/supabase";

export type AgendamentoStatus = "reservado" | "confirmado" | "nao_confirmado" | "em_processo" | "finalizado";

export interface Agendamento {
  id: string;
  dataAbate: string;
  tipo: string; // "Bovino" | "Suino" | "Ovino"
  quantidade: number;
  machos?: number;
  femeas?: number;
  quantidadeRecebida?: number;
  quantidadeProcessada?: number;
  status: AgendamentoStatus;
  observacoes?: string;
}

export interface CriarAgendamentoInput {
  userId: string;
  isTerceiro: boolean;
  tipoAnimal: string; // "Bovino" | "Suino" | "Ovino"
  quantidade: number;
  machos?: number;
  femeas?: number;
  dataAbate: string;
  observacoes?: string;
}

function parseAgendamentoRow(row: any): Agendamento {
  const obs: string = row.observacoes || "";
  let machos: number | undefined;
  let femeas: number | undefined;

  if (obs.includes("MACHOS:") && obs.includes("FEMEAS:")) {
    const matchMachos = obs.match(/MACHOS:\s*(\d+)/i);
    const matchFemeas = obs.match(/FEMEAS:\s*(\d+)/i);
    if (matchMachos?.[1]) machos = Number(matchMachos[1]);
    if (matchFemeas?.[1]) femeas = Number(matchFemeas[1]);
  }

  return {
    id: row.id,
    dataAbate: row.data_abate,
    tipo: ANIMAL_TYPE_FROM_DB[(row.tipo_animal || "").toLowerCase()] || row.tipo_animal,
    quantidade: row.quantidade,
    machos,
    femeas,
    quantidadeRecebida: row.quantidade_recebida ?? undefined,
    quantidadeProcessada: row.quantidade_processada ?? undefined,
    status: (row.status_operacional || "reservado") as AgendamentoStatus,
    observacoes: obs.includes("OBS:") ? obs.match(/OBS:\s*(.+)$/i)?.[1] : undefined,
  };
}

async function getCapacidadeDoDia(dataAbate: string, tipoAnimalDb: string) {
  const { data } = await supabase
    .from("capacidade_diaria_abate")
    .select("*")
    .eq("data", dataAbate)
    .eq("tipo_animal", tipoAnimalDb)
    .maybeSingle();
  return data;
}

export const agendaAbateService = {
  async getMeusAgendamentos(userId: string): Promise<Agendamento[]> {
    const { data, error } = await supabase
      .from("agendamentos_abate")
      .select("*")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("data_abate", { ascending: false });

    if (error) {
      console.error("[agendaAbateService] Erro ao buscar agendamentos:", error.message);
      throw error;
    }

    return (data || []).map(parseAgendamentoRow);
  },

  async criarAgendamento(input: CriarAgendamentoInput): Promise<Agendamento> {
    const tipoAnimalDb = ANIMAL_TYPE_TO_DB[input.tipoAnimal] || input.tipoAnimal.toLowerCase();

    // Valida capacidade diária, se houver registro configurado para a data/espécie
    const capacidade = await getCapacidadeDoDia(input.dataAbate, tipoAnimalDb);
    if (capacidade) {
      const ocupado = capacidade.ocupado || 0;
      const total = capacidade.capacidade_total || 0;
      if (ocupado + input.quantidade > total) {
        throw new Error(
          `Capacidade diária excedida para ${input.tipoAnimal} em ${input.dataAbate} (${ocupado}/${total} ocupadas).`
        );
      }
    }

    let obsText = "";
    if (input.machos !== undefined && input.femeas !== undefined) {
      obsText += `MACHOS: ${input.machos} FEMEAS: ${input.femeas} `;
    }
    if (input.observacoes) {
      obsText += `OBS: ${input.observacoes}`;
    }

    const generatedId = crypto.randomUUID();
    const statusAprovacao = input.isTerceiro ? "pendente" : "aprovado";

    const { error: insertError } = await supabase.from("agendamentos_abate").insert({
      id: generatedId,
      user_id: input.userId,
      tipo_animal: tipoAnimalDb,
      quantidade: input.quantidade,
      data_abate: input.dataAbate,
      status: statusAprovacao,
      requer_aprovacao: input.isTerceiro,
      observacoes: obsText.trim() || null,
    });

    if (insertError) {
      console.error("[agendaAbateService] Erro ao criar agendamento:", insertError.message);
      throw insertError;
    }

    if (capacidade) {
      await supabase
        .from("capacidade_diaria_abate")
        .update({
          ocupado: (capacidade.ocupado || 0) + input.quantidade,
          updated_at: new Date().toISOString(),
        })
        .eq("id", capacidade.id);
    }

    return {
      id: generatedId,
      dataAbate: input.dataAbate,
      tipo: input.tipoAnimal,
      quantidade: input.quantidade,
      machos: input.machos,
      femeas: input.femeas,
      status: "reservado",
      observacoes: input.observacoes,
    };
  },

  /**
   * Confirmação da véspera pelo cooperado/terceiro: reservado -> confirmado | nao_confirmado.
   * Se não confirmado, libera a vaga em capacidade_diaria_abate.
   */
  async confirmarPresenca(agendamento: Agendamento, confirmado: boolean): Promise<void> {
    const novoStatus: AgendamentoStatus = confirmado ? "confirmado" : "nao_confirmado";

    const { error } = await supabase
      .from("agendamentos_abate")
      .update({
        status_operacional: novoStatus,
        quantidade_confirmada: confirmado ? agendamento.quantidade : null,
        confirmado_em: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", agendamento.id);

    if (error) {
      console.error("[agendaAbateService] Erro ao confirmar presença:", error.message);
      throw error;
    }

    if (!confirmado) {
      const tipoAnimalDb = ANIMAL_TYPE_TO_DB[agendamento.tipo] || agendamento.tipo.toLowerCase();
      const capacidade = await getCapacidadeDoDia(agendamento.dataAbate, tipoAnimalDb);
      if (capacidade) {
        await supabase
          .from("capacidade_diaria_abate")
          .update({
            ocupado: Math.max(0, (capacidade.ocupado || 0) - agendamento.quantidade),
            updated_at: new Date().toISOString(),
          })
          .eq("id", capacidade.id);
      }
    }
  },
};
