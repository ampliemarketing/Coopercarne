import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, FileText, Calendar, DollarSign, Bell, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { useSearch } from "@/app/contexts/SearchContext";
import { cn } from "@/app/components/ui/utils";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  path: string;
  icon: any;
}

export function GlobalSearch() {
  const { searchQuery, setSearchQuery, isSearchOpen, setIsSearchOpen } = useSearch();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  // Mock search data
  const searchData: SearchResult[] = [
    { id: "1", title: "Pedido #1234", description: "Pedido de 500kg de bovino", category: "Pedidos", path: "/pedidos", icon: FileText },
    { id: "2", title: "Pedido #1235", description: "Pedido de 300kg de suíno", category: "Pedidos", path: "/pedidos", icon: FileText },
    { id: "3", title: "Abate 15/02/2026", description: "Agendamento para próxima semana", category: "Agenda", path: "/agenda-abate", icon: Calendar },
    { id: "4", title: "Preço Bovino", description: "R$ 325,00 - Atualizado hoje", category: "Preços", path: "/precos", icon: DollarSign },
    { id: "5", title: "Comunicado: Nova Política", description: "Mudanças nos prazos de entrega", category: "Comunicação", path: "/comunicacao", icon: Bell },
  ];

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = searchData.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  const handleSelect = (result: SearchResult) => {
    navigate(result.path);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="px-4 pt-4 pb-0">
          <DialogTitle className="sr-only">Buscar</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pedidos, comunicados, preços..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="w-full pl-10 pr-10 py-3 bg-gray-50 border-none rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#c51d1f]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </DialogHeader>

        {results.length > 0 && (
          <div className="max-h-[400px] overflow-y-auto border-t border-gray-200">
            {results.map((result, index) => {
              const Icon = result.icon;
              return (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className={cn(
                    "w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0",
                    index === selectedIndex && "bg-gray-50"
                  )}
                >
                  <div className="bg-gray-100 p-2 rounded-lg mt-0.5">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">{result.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{result.description}</p>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    {result.category}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {searchQuery && results.length === 0 && (
          <div className="px-4 py-12 text-center border-t border-gray-200">
            <p className="text-sm text-gray-500">Nenhum resultado encontrado</p>
          </div>
        )}

        {!searchQuery && (
          <div className="px-4 py-8 text-center border-t border-gray-200">
            <p className="text-xs text-gray-400">
              Digite para buscar em pedidos, comunicados, preços e mais...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
