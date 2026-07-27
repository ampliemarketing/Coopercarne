import { useRef, useState } from "react";
import { Camera, Upload, X, File } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { toast } from "sonner";

interface FileUploadProps {
  onUpload: (file: File) => void;
  accept?: string;
  maxSize?: number; // in MB
  allowCamera?: boolean;
}

export function FileUpload({
  onUpload,
  accept = "image/*,application/pdf",
  maxSize = 5,
  allowCamera = true,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`Arquivo muito grande. Máximo: ${maxSize}MB`);
      return;
    }

    setUploadedFile(file);

    // Generate preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    onUpload(file);
    toast.success("Arquivo carregado com sucesso!");
  };

  const handleRemove = () => {
    setPreview(null);
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      {!uploadedFile ? (
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="border-gray-300"
          >
            <Upload className="w-4 h-4 mr-2" />
            Arquivo
          </Button>

          {allowCamera && (
            <Button
              type="button"
              variant="outline"
              onClick={() => cameraInputRef.current?.click()}
              className="border-gray-300"
            >
              <Camera className="w-4 h-4 mr-2" />
              Câmera
            </Button>
          )}
        </div>
      ) : (
        <div className="relative border border-gray-200 rounded-lg p-4 bg-gray-50">
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
          >
            <X className="w-4 h-4 text-red-600" />
          </button>

          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <div className="flex items-center gap-3">
              <File className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {uploadedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {allowCamera && (
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      )}

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Tamanho máximo: {maxSize}MB. Formatos aceitos: {accept}
      </p>
    </div>
  );
}
