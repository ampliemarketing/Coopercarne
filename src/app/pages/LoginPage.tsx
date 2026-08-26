import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { toast } from "sonner";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !senha) {
      toast.error("Preencha todos os campos");
      return;
    }

    setIsLoading(true);
    try {
      await login(email, senha);
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error: any) {
      let msg = "Erro ao fazer login. Verifique suas credenciais.";
      if (error?.message?.includes("Invalid login credentials")) {
        msg = "E-mail ou senha incorretos.";
      } else if (error?.message) {
        msg = error.message;
      }
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="bg-[#c51d1f] w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-wide">COOPERCARNE</h1>
          <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest">Portal do Associado</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-xs text-gray-600 uppercase tracking-wide">E-mail Corporativo</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 border-gray-300 focus:border-[#c51d1f] focus:ring-[#c51d1f]"
              />
            </div>

            <div>
              <Label htmlFor="senha" className="text-xs text-gray-600 uppercase tracking-wide">Senha de Acesso</Label>
              <Input
                id="senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="mt-2 border-gray-300 focus:border-[#c51d1f] focus:ring-[#c51d1f]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#c51d1f] hover:bg-[#a01517] text-white mt-6 shadow-md"
              disabled={isLoading}
            >
              {isLoading ? "Autenticando..." : "Acessar Sistema"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <button className="text-xs text-gray-500 hover:text-[#c51d1f] uppercase tracking-wide">
              Recuperar Senha
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 mb-3">Ainda não é associado?</p>
          <button
            onClick={() => navigate("/cadastro")}
            className="text-sm font-semibold text-[#c51d1f] hover:text-[#a01517] uppercase tracking-wide border border-[#c51d1f] hover:border-[#a01517] rounded-lg px-6 py-2.5 transition-colors w-full"
          >
            Solicitar Cadastro
          </button>
        </div>

        <p className="text-center text-gray-400 text-xs mt-8 uppercase tracking-widest">
          © 2026 COOPERCARNE - Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}