import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Paperclip } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Card } from "@/app/components/ui/card";
import { toast } from "sonner";

export function NovoChamadoPage() {
  const navigate = useNavigate();
  const [assunto, setAssunto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleSubmit = () => {
    if (!assunto || !categoria || !prioridade || !descricao) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    toast.success("Chamado aberto com sucesso!");
    navigate("/chamados");
  };

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-md mx-auto">
          <button onClick={() => navigate("/chamados")} className="flex items-center text-gray-600 mb-4">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Abrir Chamado</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <Label>Assunto *</Label>
              <Input
                placeholder="Descreva brevemente o assunto"
                value={assunto}
                onChange={(e) => setAssunto(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Categoria *</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pedidos">Pedidos</SelectItem>
                  <SelectItem value="Entrega">Entrega</SelectItem>
                  <SelectItem value="Qualidade">Qualidade</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="Documentos">Documentos</SelectItem>
                  <SelectItem value="Portal">Portal/App</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Prioridade *</Label>
              <Select value={prioridade} onValueChange={setPrioridade}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="média">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Descrição *</Label>
              <Textarea
                placeholder="Descreva detalhadamente sua solicitação ou problema..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="mt-2"
                rows={6}
              />
            </div>

            <div>
              <Label>Anexos (opcional)</Label>
              <Button variant="outline" className="w-full mt-2">
                <Paperclip className="w-4 h-4 mr-2" />
                Adicionar Arquivo
              </Button>
            </div>

            <Button onClick={handleSubmit} className="w-full bg-[#c51d1f] hover:bg-[#a01517]">
              Abrir Chamado
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
