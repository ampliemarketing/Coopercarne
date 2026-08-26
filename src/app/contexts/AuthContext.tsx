import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, isSupabaseReady } from "@/app/lib/supabase";

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
  perfil: "cooperado" | "terceiro";
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

// Busca o perfil completo (profiles + estabelecimento + limites de abate do mês) do usuário autenticado.
async function loadUserProfile(authUserId: string): Promise<User | null> {
  const { data: prof, error } = await supabase
    .from("profiles")
    .select(`
      id,
      nome,
      email,
      perfil,
      data_nascimento,
      estabelecimento_id,
      estabelecimentos ( id, razao_social, cnpj )
    `)
    .eq("id", authUserId)
    .single();

  if (error || !prof) {
    console.error("[AuthContext] Erro ao carregar profile:", error?.message);
    return null;
  }

  const estab: any = (prof as any).estabelecimentos;
  const isTerceiro = prof.perfil === "terceiro";

  // Limite de abate do mês corrente (mesma convenção de mes_referencia usada no painel: "YYYY-MM")
  const currentMonth = new Date().toISOString().substring(0, 7);
  const { data: limites } = await supabase
    .from("limites_abate")
    .select("tipo_animal, limite_mensal, abates_realizados")
    .eq("user_id", authUserId)
    .eq("mes_referencia", currentMonth);

  const defaultLimit = isTerceiro ? 10 : 20;
  const limiteAbate: LimiteAbate = { bovino: defaultLimit, suino: defaultLimit, ovino: defaultLimit };
  const abatesRealizadosMes: LimiteAbate = { bovino: 0, suino: 0, ovino: 0 };

  (limites || []).forEach((l: any) => {
    const tipo = (l.tipo_animal || "").toLowerCase();
    if (tipo === "bovino") {
      limiteAbate.bovino = l.limite_mensal;
      abatesRealizadosMes.bovino = l.abates_realizados;
    } else if (tipo === "suino") {
      limiteAbate.suino = l.limite_mensal;
      abatesRealizadosMes.suino = l.abates_realizados;
    } else if (tipo === "cordeiro" || tipo === "leitao") {
      // "Ovino" neste app corresponde a "cordeiro" no banco (ver src/app/lib/supabase.ts)
      limiteAbate.ovino = l.limite_mensal;
      abatesRealizadosMes.ovino = l.abates_realizados;
    }
  });

  return {
    id: prof.id,
    nome: prof.nome,
    email: prof.email,
    cnpj: estab?.cnpj || "",
    razaoSocial: estab?.razao_social || prof.nome,
    perfil: isTerceiro ? "terceiro" : "cooperado",
    dataNascimento: prof.data_nascimento || undefined,
    limiteAbate,
    abatesRealizadosMes,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseReady()) {
      console.warn("[AuthContext] Supabase não configurado. Verifique o .env do app.");
      setIsLoading(false);
      return;
    }

    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      if (data.session?.user) {
        const profile = await loadUserProfile(data.session.user.id);
        if (active) setUser(profile);
      }
      if (active) setIsLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        return;
      }
      if (session?.user) {
        const profile = await loadUserProfile(session.user.id);
        if (active) setUser(profile);
      }
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, senha: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error || !data.user) {
        throw new Error(error?.message || "Falha ao autenticar.");
      }

      const profile = await loadUserProfile(data.user.id);
      if (!profile) {
        await supabase.auth.signOut();
        throw new Error("Não foi possível carregar seu perfil. Contate o suporte.");
      }

      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    supabase.auth.signOut();
    setUser(null);
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
