import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft, CheckCircle, AlertCircle, Phone } from "lucide-react";

type Etapa = "dados" | "empresa" | "sucesso";

// Mock temporário só para demonstrar visualmente os dois cenários (CNPJ encontrado / não encontrado).
// Será substituído pela consulta real ao Supabase na etapa de integração.
const CNPJS_CADASTRADOS_MOCK = ["03044201003285", "12345678000190"];

const SUPORTE_TELEFONE = "(00) 00000-0000";

export function CadastroPage() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState<Etapa>("dados");

  // Dados pessoais
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  // Vínculo com empresa
  const [cnpj, setCnpj] = useState("");
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [empresaNaoEncontrada, setEmpresaNaoEncontrada] = useState(false);

  const formatCpf = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 11);
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatCnpj = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 14);
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
  };

  const formatTelefone = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 10) return digits.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  // CNPJ é comparado e armazenado só com dígitos, sem pontuação.
  const somenteDigitos = (v: string) => v.replace(/\D/g, "");

  const handleProximaEtapa = () => {
    if (!nome || !email || !cpf || !telefone || !senha || !confirmarSenha) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem");
      return;
    }
    if (senha.length < 8) {
      toast.error("A senha deve ter no mínimo 8 caracteres");
      return;
    }
    setEtapa("empresa");
  };

  const handleEnviarComCnpj = () => {
    if (!cnpj) {
      toast.error("Digite o CNPJ da sua empresa");
      return;
    }
    if (!aceitaTermos) {
      toast.error("Você precisa aceitar os termos para continuar");
      return;
    }

    // Checagem feita só neste clique de envio (não em tempo real por digitação),
    // para não expor um "existe/não existe" consultável em massa.
    const encontrada = CNPJS_CADASTRADOS_MOCK.includes(somenteDigitos(cnpj));

    if (encontrada) {
      setEtapa("sucesso");
    } else {
      setEmpresaNaoEncontrada(true);
    }
  };

  const handleAcessoPorCpf = () => {
    if (!aceitaTermos) {
      toast.error("Você precisa aceitar os termos para continuar");
      return;
    }
    setEtapa("sucesso");
  };

  if (etapa === "sucesso") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Cadastro Enviado!</h2>
          <p className="text-gray-600 text-sm mb-2">
            Sua solicitação foi recebida com sucesso.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            A equipe da COOPERCARNE analisará seu cadastro e entrará em contato em até <strong>3 dias úteis</strong> para validação e liberação do acesso.
          </p>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-left mb-8">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-semibold">Próximos passos</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-[#c51d1f] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
                Análise do cadastro pela equipe comercial
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-[#c51d1f] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
                Contato via e-mail ou telefone para validação
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-[#c51d1f] text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
                Liberação do acesso ao portal do associado
              </li>
            </ul>
          </div>
          <Button
            onClick={() => navigate("/login")}
            className="w-full bg-[#c51d1f] hover:bg-[#a01517] text-white shadow-md"
          >
            Voltar ao Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-start p-6 py-10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => {
              if (etapa === "empresa") {
                if (empresaNaoEncontrada) {
                  setEmpresaNaoEncontrada(false);
                } else {
                  setEtapa("dados");
                }
              } else {
                navigate("/login");
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-wide">Criar Conta</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {etapa === "dados" ? "Etapa 1 de 2 — Dados pessoais" : "Etapa 2 de 2 — Vínculo com a empresa"}
            </p>
          </div>
        </div>

        {/* Progresso */}
        <div className="flex gap-2 mb-8">
          <div className="flex-1 h-1 bg-[#c51d1f] rounded-full" />
          <div className={`flex-1 h-1 rounded-full ${etapa === "empresa" ? "bg-[#c51d1f]" : "bg-gray-200"}`} />
        </div>

        {/* Etapa 1: Dados pessoais */}
        {etapa === "dados" && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 space-y-5">
            <div>
              <Label className="text-xs text-gray-600 uppercase tracking-wide">Nome Completo *</Label>
              <Input
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="mt-2 border-gray-300"
              />
            </div>

            <div>
              <Label className="text-xs text-gray-600 uppercase tracking-wide">E-mail *</Label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 border-gray-300"
              />
            </div>

            <div>
              <Label className="text-xs text-gray-600 uppercase tracking-wide">CPF *</Label>
              <Input
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
                className="mt-2 border-gray-300"
              />
            </div>

            <div>
              <Label className="text-xs text-gray-600 uppercase tracking-wide">Telefone / WhatsApp *</Label>
              <Input
                placeholder="(00) 00000-0000"
                value={telefone}
                onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                className="mt-2 border-gray-300"
              />
            </div>

            <div>
              <Label className="text-xs text-gray-600 uppercase tracking-wide">Senha *</Label>
              <Input
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="mt-2 border-gray-300"
              />
            </div>

            <div>
              <Label className="text-xs text-gray-600 uppercase tracking-wide">Confirmar Senha *</Label>
              <Input
                type="password"
                placeholder="Repita a senha"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="mt-2 border-gray-300"
              />
            </div>

            <Button
              onClick={handleProximaEtapa}
              className="w-full bg-[#c51d1f] hover:bg-[#a01517] text-white shadow-md mt-2"
            >
              Próxima Etapa
            </Button>
          </div>
        )}

        {/* Etapa 2: Vínculo por CNPJ (ou acesso direto por CPF) */}
        {etapa === "empresa" && !empresaNaoEncontrada && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 space-y-5">
            <div>
              <Label className="text-xs text-gray-600 uppercase tracking-wide">CNPJ da Empresa</Label>
              <Input
                placeholder="00.000.000/0000-00"
                value={cnpj}
                onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                className="mt-2 border-gray-300"
              />
              <p className="text-xs text-gray-400 mt-1.5">
                Informe o CNPJ da empresa já cadastrada na cooperativa para vincular seu acesso a ela.
              </p>
            </div>

            <div className="flex items-start gap-3 pt-1">
              <Checkbox
                id="termos"
                checked={aceitaTermos}
                onCheckedChange={(v) => setAceitaTermos(!!v)}
              />
              <label htmlFor="termos" className="text-xs text-gray-600 leading-relaxed cursor-pointer">
                Li e aceito os <span className="text-[#c51d1f] font-semibold">Termos de Uso</span> e a{" "}
                <span className="text-[#c51d1f] font-semibold">Política de Privacidade</span> da COOPERCARNE.
                Entendo que o acesso está sujeito à análise e aprovação pela cooperativa.
              </label>
            </div>

            <Button
              onClick={handleEnviarComCnpj}
              className="w-full bg-[#c51d1f] hover:bg-[#a01517] text-white shadow-md mt-2"
            >
              Enviar Solicitação
            </Button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-[11px] text-gray-400 uppercase tracking-wide">ou</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleAcessoPorCpf}
              className="w-full border-gray-300 text-gray-700"
            >
              Sou pessoa física, sem empresa
            </Button>
          </div>
        )}

        {/* Empresa não encontrada */}
        {etapa === "empresa" && empresaNaoEncontrada && (
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 space-y-5 text-center">
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Empresa não disponível</h3>
              <p className="text-sm text-gray-600">
                Não encontramos esse CNPJ cadastrado na cooperativa. Entre em contato com o suporte para verificar ou solicitar o cadastro da sua empresa.
              </p>
            </div>
            <a
              href={`tel:${SUPORTE_TELEFONE.replace(/\D/g, "")}`}
              className="flex items-center justify-center gap-2 text-sm font-semibold text-[#c51d1f] py-2"
            >
              <Phone className="w-4 h-4" />
              {SUPORTE_TELEFONE}
            </a>

            <div className="border-t border-gray-200 pt-5">
              <p className="text-xs text-gray-500 mb-3">Enquanto isso, você ainda pode solicitar acesso individual:</p>
              <Button
                onClick={handleAcessoPorCpf}
                className="w-full bg-[#c51d1f] hover:bg-[#a01517] text-white shadow-md"
              >
                Continuar acesso por CPF
              </Button>
            </div>
          </div>
        )}

        <p className="text-center text-gray-400 text-xs mt-6 uppercase tracking-widest">
          © 2026 COOPERCARNE
        </p>
      </div>
    </div>
  );
}
