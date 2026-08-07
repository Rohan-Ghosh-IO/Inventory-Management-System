import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '../ui/Button';

interface ImageUploaderProps {
  currentImageUrl?: string | null;
  onImageSelected: (file: File | null) => void;
  onImageRemoved: () => void;
  isUploading?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onImageSelected,
  onImageRemoved,
  isUploading = false,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(currentImageUrl || null);
  }, [currentImageUrl]);

  const validateAndProcessFile = (file: File) => {
    const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validMimeTypes.includes(file.type.toLowerCase())) {
      toast.error('Invalid file format. Only JPG, JPEG, PNG, and WEBP are accepted.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5 MB limit.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    onImageSelected(file);
    toast.success('Image selected for upload.');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageSelected(null);
    onImageRemoved();
    toast.success('Image marked for removal.');
  };

  return (
    <div className="space-y-3 w-full font-sans">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
        Product Image <span className="text-slate-400 font-normal">(JPG, PNG, WEBP max 5MB)</span>
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
        id="product-image-input"
      />

      {previewUrl ? (
        <div className="relative group w-full h-44 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#18181B] overflow-hidden flex items-center justify-center p-2 shadow-inner">
          <img
            src={previewUrl}
            alt="Product Preview"
            loading="lazy"
            className="w-full h-full object-contain rounded-xl"
          />

          {isUploading && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white space-y-2 z-10">
              <Loader2 className="h-7 w-7 animate-spin text-sky-400" />
              <span className="text-xs font-semibold">Uploading image to Cloudinary...</span>
            </div>
          )}

          {!isUploading && (
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs flex items-center justify-center gap-3 z-10">
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={RefreshCw}
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/90 text-slate-900 hover:bg-white border-none shadow-lg text-xs"
              >
                Replace
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                icon={Trash2}
                onClick={handleRemove}
                className="shadow-lg text-xs"
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full h-40 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-4 text-center ${
            isDragOver
              ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/30 scale-[1.01]'
              : 'border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-[#161619] hover:border-sky-400 hover:bg-slate-100/50 dark:hover:bg-slate-900/40'
          }`}
        >
          <div className="h-12 w-12 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-500 flex items-center justify-center border border-sky-200/50 dark:border-sky-800/40 mb-2">
            <UploadCloud className="h-6 w-6" />
          </div>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Drag & Drop product image here, or <span className="text-sky-500 underline">browse</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Supports JPG, JPEG, PNG, WEBP (Max 5MB)
          </p>
        </div>
      )}
    </div>
  );
};
