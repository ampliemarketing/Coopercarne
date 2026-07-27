import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";

export interface FilterConfig {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "number";
  options?: { value: string; label: string }[];
}

interface FilterPanelProps {
  filters: FilterConfig[];
  onApply: (filters: Record<string, any>) => void;
  trigger?: React.ReactNode;
}

export function FilterPanel({ filters, onApply, trigger }: FilterPanelProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, any>>({});

  const handleApply = () => {
    onApply(values);
    setOpen(false);
  };

  const handleReset = () => {
    setValues({});
    onApply({});
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filtrar Resultados</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {filters.map((filter) => (
            <div key={filter.key}>
              <Label>{filter.label}</Label>
              
              {filter.type === "text" && (
                <Input
                  value={values[filter.key] || ""}
                  onChange={(e) =>
                    setValues({ ...values, [filter.key]: e.target.value })
                  }
                  placeholder={`Digite ${filter.label.toLowerCase()}`}
                  className="bg-white border-gray-300"
                />
              )}

              {filter.type === "select" && filter.options && (
                <Select
                  value={values[filter.key] || ""}
                  onValueChange={(value) =>
                    setValues({ ...values, [filter.key]: value })
                  }
                >
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder={`Selecione ${filter.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {filter.type === "date" && (
                <Input
                  type="date"
                  value={values[filter.key] || ""}
                  onChange={(e) =>
                    setValues({ ...values, [filter.key]: e.target.value })
                  }
                  className="bg-white border-gray-300"
                />
              )}

              {filter.type === "number" && (
                <Input
                  type="number"
                  value={values[filter.key] || ""}
                  onChange={(e) =>
                    setValues({ ...values, [filter.key]: e.target.value })
                  }
                  placeholder={`Digite ${filter.label.toLowerCase()}`}
                  className="bg-white border-gray-300"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 border-gray-300"
          >
            <X className="w-4 h-4 mr-2" />
            Limpar
          </Button>
          <Button
            onClick={handleApply}
            className="flex-1 bg-[#c51d1f] hover:bg-[#a01718] text-white"
          >
            <Filter className="w-4 h-4 mr-2" />
            Aplicar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
