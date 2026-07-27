import { useState } from "react";
import { Calendar, ChevronRight, Newspaper, Tag } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";

type NoticiaTipo = "comunicado" | "mercado" | "cooperativa" | "legislacao";

interface Noticia {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  data: string;
  tipo: NoticiaTipo;
  destaque: boolean;
  imagem?: string;
}

const tipoConfig: Record<NoticiaTipo, { label: string; color: string }> = {
  comunicado: { label: "Comunicado", color: "bg-[#c51d1f] text-white" },
  mercado: { label: "Mercado", color: "bg-gray-800 text-white" },
  cooperativa: { label: "Cooperativa", color: "bg-gray-700 text-white" },
  legislacao: { label: "Legislação", color: "bg-gray-600 text-white" },
};

const mockNoticias: Noticia[] = [
  {
    id: "1",
    titulo: "Alteração no Horário de Abate a partir de Fevereiro",
    resumo: "A COOPERCARNE informa que a partir de 1º de fevereiro de 2026, o horário de início das operações de abate será alterado para as 5h.",
    conteudo: `A COOPERCARNE informa a todos os associados que, a partir de 1º de fevereiro de 2026, o horário de início das operações de abate será alterado para as 5h (anteriormente 6h).

Essa mudança visa otimizar o processo de distribuição e garantir que os produtos cheguem com maior frescor aos estabelecimentos dos cooperados.

**Novos horários:**
• Início do abate: 05h00
• Término previsto: 14h00
• Expedição: 15h00 – 18h00

Os agendamentos já realizados serão mantidos, porém a entrega das carcaças será antecipada em 1 hora.

Em caso de dúvidas, entre em contato pelo canal de chamados.`,
    data: "2026-01-20",
    tipo: "comunicado",
    destaque: true,
    imagem: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "2",
    titulo: "Cotação do Boi Gordo Atinge Nova Máxima",
    resumo: "A arroba do boi gordo atingiu R$ 325,00 na semana, o maior valor registrado nos últimos 12 meses.",
    conteudo: `O mercado de gado bovino registrou nova máxima histórica nesta semana. A arroba do boi gordo atingiu R$ 325,00, impulsionada pela alta demanda interna e redução da oferta de animais terminados.

**Fatores que influenciaram:**
• Aumento das exportações para China e Estados Unidos
• Redução de chuvas no Centro-Oeste impactando pastagens
• Maior demanda no período de festas

A COOPERCARNE monitora diariamente essas oscilações e trabalha para garantir preços competitivos aos associados. As cotações são atualizadas semanalmente no aplicativo.`,
    data: "2026-01-18",
    tipo: "mercado",
    destaque: false,
    imagem: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "3",
    titulo: "Assembleia Geral Ordinária — Fevereiro 2026",
    resumo: "A AGO está convocada para o dia 15 de fevereiro de 2026, às 14h, na sede da COOPERCARNE.",
    conteudo: `Prezados cooperados,

Convocamos todos os membros para a Assembleia Geral Ordinária da COOPERCARNE, que se realizará no dia 15 de fevereiro de 2026, às 14h, na sede da cooperativa.

**Pauta:**
1. Leitura e aprovação da ata da assembleia anterior
2. Apresentação do balanço financeiro de 2025
3. Eleição do Conselho de Administração
4. Aprovação do plano de investimentos 2026
5. Assuntos gerais

A participação de todos os cooperados é fundamental. O quórum mínimo para deliberação é de 1/3 dos associados.`,
    data: "2026-01-15",
    tipo: "cooperativa",
    destaque: true,
    imagem: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "4",
    titulo: "Nova Resolução do MAPA sobre Rastreabilidade Bovina",
    resumo: "O Ministério da Agricultura publicou nova norma sobre rastreabilidade obrigatória para bovinos destinados ao abate.",
    conteudo: `O Ministério da Agricultura, Pecuária e Abastecimento (MAPA) publicou a Resolução nº 45/2026 que atualiza as exigências de rastreabilidade bovina.

**Principais mudanças:**
• Obrigatoriedade de chip eletrônico (RFID) para todos os bovinos acima de 6 meses
• Prazo de adequação: 180 dias a partir da publicação
• Multas de R$ 500 a R$ 5.000 por animal sem identificação

A COOPERCARNE já está adaptando seus processos internos. Em breve divulgaremos um guia completo para os associados sobre as adequações necessárias.`,
    data: "2026-01-10",
    tipo: "legislacao",
    destaque: false,
    imagem: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "5",
    titulo: "Taxa de Abate: Reajuste Anual para 2026",
    resumo: "A COOPERCARNE comunica o reajuste anual da taxa de abate, vigente a partir de 1º de janeiro de 2026.",
    conteudo: `A COOPERCARNE comunica o reajuste anual das taxas de abate, vigente a partir de 1º de janeiro de 2026.

**Novas taxas:**
• Bovino: R$ 105,00/cabeça (era R$ 100,00)
• Suíno: R$ 36,00/cabeça (era R$ 35,00)
• Ovino: R$ 50,00/cabeça (era R$ 48,00)

O reajuste segue o índice IPCA acumulado de 2025 e foi aprovado em assembleia em dezembro de 2025.

As taxas incluem: inspeção sanitária, certificação, mão de obra e disposição de resíduos.`,
    data: "2026-01-02",
    tipo: "comunicado",
    destaque: false,
    imagem: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
  },
];

import { useSearch } from "@/app/contexts/SearchContext";

export function NoticiasPage() {
  const [noticiaAberta, setNoticiaAberta] = useState<Noticia | null>(null);
  const { searchQuery } = useSearch();

  const noticiasFiltradas = mockNoticias.filter((n) => {
    if (!searchQuery) return true;
    return (
      n.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.resumo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  const destaques = noticiasFiltradas.filter(n => n.destaque);

  return (
    <div className="min-h-full bg-gray-50">
      {/* Content */}

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">

        {/* Destaques */}
        {destaques.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Em Destaque</h3>
            <div className="space-y-3">
              {destaques.map(noticia => (
                <Card
                  key={noticia.id}
                  className="overflow-hidden border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setNoticiaAberta(noticia)}
                >
                  {noticia.imagem && (
                    <div className="w-full h-40 overflow-hidden bg-gray-100">
                      <img
                        src={noticia.imagem}
                        alt={noticia.titulo}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <Badge className={`text-[10px] uppercase tracking-wide flex-shrink-0 ${tipoConfig[noticia.tipo].color}`}>
                        {tipoConfig[noticia.tipo].label}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(noticia.data).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-1">{noticia.titulo}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2">{noticia.resumo}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Lista */}
        <section>
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">Todas as Notícias</h3>
          <div className="space-y-3">
            {noticiasFiltradas.map(noticia => (
              <Card
                key={noticia.id}
                className="overflow-hidden border-gray-200 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setNoticiaAberta(noticia)}
              >
                <div className="p-3.5 flex items-center gap-3">
                  {noticia.imagem && (
                    <img
                      src={noticia.imagem}
                      alt={noticia.titulo}
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`w-28 justify-center text-center text-[10px] uppercase tracking-wide flex-shrink-0 ${tipoConfig[noticia.tipo].color}`}>
                        {tipoConfig[noticia.tipo].label}
                      </Badge>
                      <span className="text-[10px] text-gray-400">
                        {new Date(noticia.data).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-xs leading-tight mb-1 line-clamp-2">{noticia.titulo}</h4>
                    <p className="text-[11px] text-gray-500 line-clamp-1">{noticia.resumo}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Modal de leitura */}
      <Dialog open={!!noticiaAberta} onOpenChange={() => setNoticiaAberta(null)}>
        {noticiaAberta && (
          <DialogContent className="max-w-md mx-auto max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              {noticiaAberta.imagem && (
                <div className="w-full h-44 rounded-lg overflow-hidden mb-3 -mt-1 bg-gray-100">
                  <img
                    src={noticiaAberta.imagem}
                    alt={noticiaAberta.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`text-[10px] uppercase tracking-wide ${tipoConfig[noticiaAberta.tipo].color}`}>
                  {tipoConfig[noticiaAberta.tipo].label}
                </Badge>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(noticiaAberta.data).toLocaleDateString("pt-BR")}
                </span>
              </div>
              <DialogTitle className="text-base font-bold text-gray-900 leading-tight">
                {noticiaAberta.titulo}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {noticiaAberta.conteudo}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
