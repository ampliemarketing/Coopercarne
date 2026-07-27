import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface LimiteAbate {
  bovino: number;
  suino: number;
  ovino: number;
}

export interface PendenciaFinanceira {
  temPendencia: boolean;
  valorTotal: number;
  boletos: Array<{ numero: string; valor: number; vencimento: string; status: "vencido" | "proximo" }>;
  bloqueado: boolean;
}

interface User {
  id: string;
  nome: string;
  email: string;
  cnpj: string;
  razaoSocial: string;
  perfil: "comprador" | "financeiro" | "gerente" | "admin" | "nao_cooperado";
  dataNascimento?: string;
  limiteAbate: LimiteAbate;
  abatesRealizadosMes: LimiteAbate;
  pendenciaFinanceira: PendenciaFinanceira;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  pagarPendenciaFinanceira: () => void;
  alternarPendenciaFinanceira: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("coopercarne_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Default initial mock user with financial hold available for testing
      const defaultUser: User = {
        id: "1",
        nome: "João Silva",
        email: "joao.silva@coopercarne.com.br",
        cnpj: "12.345.678/0001-90",
        razaoSocial: "Supermercado Silva Ltda",
        perfil: "gerente",
        dataNascimento: "1985-03-15",
        limiteAbate: {
          bovino: 30,
          suino: 60,
          ovino: 20,
        },
        abatesRealizadosMes: {
          bovino: 18,
          suino: 45,
          ovino: 8,
        },
        pendenciaFinanceira: {
          temPendencia: true,
          valorTotal: 21000.00,
          boletos: [
            { numero: "1232", valor: 6500.00, vencimento: "2026-01-20", status: "vencido" },
            { numero: "1234", valor: 14500.00, vencimento: "2026-02-05", status: "proximo" },
          ],
          bloqueado: true,
        },
      };
      setUser(defaultUser);
      localStorage.setItem("coopercarne_user", JSON.stringify(defaultUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const hasPendencia = email.includes("bloqueado") || email.includes("vencido");

    const mockUser: User = {
      id: "1",
      nome: "João Silva",
      email: email,
      cnpj: "12.345.678/0001-90",
      razaoSocial: "Supermercado Silva Ltda",
      perfil: "gerente",
      dataNascimento: "1985-03-15",
      limiteAbate: {
        bovino: 30,
        suino: 60,
        ovino: 20,
      },
      abatesRealizadosMes: {
        bovino: 18,
        suino: 45,
        ovino: 8,
      },
      pendenciaFinanceira: {
        temPendencia: hasPendencia,
        valorTotal: hasPendencia ? 21000.00 : 0,
        boletos: hasPendencia
          ? [
              { numero: "1232", valor: 6500.00, vencimento: "2026-01-20", status: "vencido" },
              { numero: "1234", valor: 14500.00, vencimento: "2026-02-05", status: "proximo" },
            ]
          : [],
        bloqueado: hasPendencia,
      },
    };

    setUser(mockUser);
    localStorage.setItem("coopercarne_user", JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const pagarPendenciaFinanceira = () => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      pendenciaFinanceira: {
        temPendencia: false,
        valorTotal: 0,
        boletos: [],
        bloqueado: false,
      },
    };
    setUser(updatedUser);
    localStorage.setItem("coopercarne_user", JSON.stringify(updatedUser));
  };

  const alternarPendenciaFinanceira = () => {
    if (!user) return;
    const novoStatus = !user.pendenciaFinanceira.bloqueado;
    const updatedUser: User = {
      ...user,
      pendenciaFinanceira: {
        temPendencia: novoStatus,
        valorTotal: novoStatus ? 21000.00 : 0,
        boletos: novoStatus
          ? [
              { numero: "1232", valor: 6500.00, vencimento: "2026-01-20", status: "vencido" },
              { numero: "1234", valor: 14500.00, vencimento: "2026-02-05", status: "proximo" },
            ]
          : [],
        bloqueado: novoStatus,
      },
    };
    setUser(updatedUser);
    localStorage.setItem("coopercarne_user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("coopercarne_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoading,
        pagarPendenciaFinanceira,
        alternarPendenciaFinanceira,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
