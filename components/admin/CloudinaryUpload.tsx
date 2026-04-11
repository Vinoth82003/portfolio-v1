"use client";

import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
  currentImage?: string;
  folder?: string;
}

export default function CloudinaryUpload({ onUpload, currentImage, folder = "portfolio" }: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large (max 5MB)");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset", 
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "portfolio_unsigned"
    ); 
    formData.append("folder", folder);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) {
        throw new Error("Cloudinary cloud name missing in environment variables");
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || "Upload failed");
      }

      if (data.secure_url) {
        onUpload(data.secure_url);
        setPreview(data.secure_url);
        toast.success("Image uploaded successfully");
      }
    } catch (error: any) {
      console.error("Cloudinary Upload Error:", error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      // Clear input so same file can be selected again if needed
      e.target.value = "";
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video w-full rounded-xl border border-outline/10 bg-surface-low overflow-hidden group">
        {preview ? (() => {
          const isHtmlSnippet = preview.trim().startsWith('<');
          let isValidUrl = false;
          if (!isHtmlSnippet) {
            try {
              new URL(preview);
              isValidUrl = true;
            } catch {
              isValidUrl = preview.startsWith('/');
            }
          }

          if (!isValidUrl) {
            return (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <span className="text-[10px] text-red-400 text-center uppercase tracking-widest font-bold">Invalid Image format for Cloudinary upload mode. Clear to reset.</span>
                <button
                  type="button"
                  onClick={() => {
                    setPreview(undefined);
                    onUpload("");
                    toast.success("Image cleared");
                  }}
                  className="mt-4 px-4 py-2 bg-red-500/20 text-red-500 rounded-full text-xs hover:bg-red-500 hover:text-white transition-all"
                >
                  Clear Mismatched Icon
                </button>
              </div>
            );
          }

          return (
            <>
              <Image src={preview} alt="Preview" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              <button
                type="button"
                onClick={() => {
                  setPreview(undefined);
                  onUpload("");
                  toast.success("Image removed");
                }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
              >
                <X size={14} />
              </button>
            </>
          );
        })() : (
          <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-surface-high transition-colors">
            {isUploading ? (
              <Loader2 className="animate-spin text-primary" size={32} />
            ) : (
              <>
                <Upload className="text-foreground/30 mb-2" size={32} />
                <span className="text-xs font-display font-bold uppercase tracking-widest text-foreground/40 text-center px-4">
                  Drop image here or click to upload
                </span>
              </>
            )}
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              onChange={handleUpload} 
              disabled={isUploading} 
            />
          </label>
        )}
      </div>
      <p className="text-[10px] text-foreground/40 font-body uppercase tracking-wider text-center">
        Max 5MB. Recommended: 1920x1080px
      </p>
    </div>
  );
}
