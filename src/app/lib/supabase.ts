import { createClient } from "@supabase/supabase-js";

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isPlaceholder = (val?: string) => {
  if (!val || typeof val !== "string") return true;
  const trimmed = val.trim();
  return (
    trimmed === "" ||
    trimmed.includes("sua-url-supabase") ||
    trimmed.includes("sua-anon-key") ||
    trimmed.includes("placeholder")
  );
};

const supabaseUrl = !isPlaceholder(rawUrl) ? rawUrl! : "https://placeholder-coopercarne.supabase.co";
const supabaseAnonKey = !isPlaceholder(rawAnonKey)
  ? rawAnonKey!
  : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder";

// Checado em cima de supabaseUrl/supabaseAnonKey (não de rawUrl/rawAnonKey):
// no build via Docker essas variáveis não existem em build-time (o entrypoint.sh
// injeta os valores reais depois, via substituição de string em runtime), então
// checar os valores "raw" ficaria sempre travado em `false` mesmo depois da
// substituição rodar com sucesso.
export const isConfigured = !isPlaceholder(supabaseUrl) && !isPlaceholder(supabaseAnonKey);

if (!isConfigured) {
  console.warn(
    "[COOPERCARNE App] Credenciais do Supabase não configuradas. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env."
  );
}

// Mesmo projeto Supabase usado pelo painel administrativo (coopercarne-sistema).
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "coopercarne-app-auth",
  },
});

export const isSupabaseReady = (): boolean => isConfigured;

// Tradução entre a nomenclatura de espécie usada neste app (Bovino/Suino/Ovino)
// e o vocabulário real do banco (bovino/suino/cordeiro/leitao). "Ovino" mapeia
// para "cordeiro", que é o tipo mais próximo já existente no schema do painel.
export const ANIMAL_TYPE_TO_DB: Record<string, string> = {
  Bovino: "bovino",
  Suino: "suino",
  Ovino: "cordeiro",
};

export const ANIMAL_TYPE_FROM_DB: Record<string, string> = {
  bovino: "Bovino",
  suino: "Suino",
  cordeiro: "Ovino",
  leitao: "Ovino",
};
