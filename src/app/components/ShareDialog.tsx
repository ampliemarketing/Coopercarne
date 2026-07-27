import { useState } from "react";
import { Share2, Mail, FileDown, MessageCircle, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";

interface ShareDialogProps {
  title: string;
  content: string;
  trigger?: React.ReactNode;
}

export function ShareDialog({ title, content, trigger }: ShareDialogProps) {
  const [open, setOpen] = useState(false);

  const handleShare = async (method: string) => {
    // In a real app, this would trigger actual sharing
    switch (method) {
      case "whatsapp":
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
          `${title}\n\n${content}`
        )}`;
        window.open(whatsappUrl, "_blank");
        break;
      case "email":
        const emailUrl = `mailto:?subject=${encodeURIComponent(
          title
        )}&body=${encodeURIComponent(content)}`;
        window.location.href = emailUrl;
        break;
      case "copy":
        navigator.clipboard.writeText(`${title}\n\n${content}`);
        toast.success("Copiado para área de transferência!");
        setOpen(false);
        break;
      case "pdf":
        // Mock PDF export
        toast.success("PDF gerado com sucesso!");
        setOpen(false);
        break;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartilhar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={() => handleShare("whatsapp")}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <MessageCircle className="w-6 h-6 text-green-600" />
            <span className="text-sm font-medium text-gray-900">
              WhatsApp
            </span>
          </button>

          <button
            onClick={() => handleShare("email")}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Mail className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-900">
              E-mail
            </span>
          </button>

          <button
            onClick={() => handleShare("pdf")}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <FileDown className="w-6 h-6 text-red-600" />
            <span className="text-sm font-medium text-gray-900">
              PDF
            </span>
          </button>

          <button
            onClick={() => handleShare("copy")}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Check className="w-6 h-6 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">
              Copiar
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
