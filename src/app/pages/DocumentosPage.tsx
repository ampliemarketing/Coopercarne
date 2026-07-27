import { useState } from "react";
import { FileText, Download, Search, ChevronRight } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { toast } from "sonner";

import { useSearch } from "@/app/contexts/SearchContext";

const mockDocumentos = [
  { id: "1", tipo: "Documento sanitário", nome: "Certificado Sanitário - Jan/2026", data: "2026-01-25", status: "disponível" },
  { id: "2", tipo: "Relatório de abate", nome: "Relatório Abate - PED002", data: "2026-01-23", status: "disponível" },
  { id: "3", tipo: "Declaração", nome: "Declaração de Conformidade", data: "2026-01-20", status: "em análise" },
  { id: "4", tipo: "Comprovante", nome: "Comprovante Entrega - PED001", data: "2026-01-18", status: "solicitado" },
];

const statusColors: Record<string, string> = {
  "solicitado": "bg-gray-300 text-gray-800",
  "em análise": "bg-gray-400 text-gray-900",
  "disponível": "bg-gray-600 text-white",
  "entregue": "bg-gray-700 text-white",
};

export function DocumentosPage() {
  const { searchQuery } = useSearch();

  const filteredDocumentos = mockDocumentos.filter(doc => {
    if (!searchQuery) return true;
    return doc.nome.toLowerCase().includes(searchQuery.toLowerCase()) || doc.tipo.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wide">Documentos</h1>
          <span className="text-xs text-gray-500">{filteredDocumentos.length} doc(s)</span>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <Button className="w-full bg-[#c51d1f] hover:bg-[#a01517] shadow-md">
          Solicitar Novo Documento
        </Button>

        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Meus Documentos</h3>
          
          {filteredDocumentos.map((doc) => (
            <Card key={doc.id} className="border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">{doc.nome}</h3>
                        <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wide">{doc.tipo}</p>
                      </div>
                      <Badge className={`${statusColors[doc.status]} text-xs uppercase tracking-wide`}>
                        {doc.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">
                      {new Date(doc.data).toLocaleDateString("pt-BR")}
                    </p>
                    
                    {doc.status === "disponível" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-gray-300"
                        onClick={() => toast.success("Download iniciado")}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar Documento
                      </Button>
                    )}
                    
                    {doc.status !== "disponível" && (
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500">Aguardando processamento</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}