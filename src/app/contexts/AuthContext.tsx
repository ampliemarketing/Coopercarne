import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface LimiteAbate {
  bovino: number;
  suino: number;
  ovino: number;
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
}

interface AuthContextType {
  user: User | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
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
      };
      setUser(defaultUser);
      localStorage.setItem("coopercarne_user", JSON.stringify(defaultUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

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
    };

    setUser(mockUser);
    localStorage.setItem("coopercarne_user", JSON.stringify(mockUser));
    setIsLoading(false);
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
