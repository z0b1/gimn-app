"use client";

import { useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { UploadDropzone } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import Image from "next/image";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  onUploadError?: (error: string) => void;
  onClear?: () => void;
  defaultValue?: string;
}

export function ImageUpload({ onUploadComplete, onUploadError, onClear, defaultValue }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(defaultValue || null);
  const [mediaType, setMediaType] = useState<string | null>(null);

  const clearFile = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setUploadedUrl(null);
    setMediaType(null);
    onClear?.();
  };

  return (
    <div className="space-y-4">
      <div className="relative group min-h-[200px] rounded-3xl border-2 border-dashed border-slate-200 transition-all overflow-hidden bg-slate-50 flex flex-col items-center justify-center">
        {uploadedUrl ? (
          <div className="w-full h-full relative min-h-[200px]">
            {mediaType === "VIDEO" || uploadedUrl.includes("video") ? (
              <video 
                src={uploadedUrl} 
                className="w-full h-full object-cover max-h-[300px]" 
              />
            ) : (
              <div className="relative w-full h-[200px]">
                <Image 
                  src={uploadedUrl} 
                  alt="Uploaded" 
                  fill
                  className="object-cover" 
                />
              </div>
            )}
            
            <button
              onClick={clearFile}
              className="absolute top-4 right-4 p-2 bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md rounded-full text-white transition-all shadow-xl z-10"
            >
              <X size={20} />
            </button>

            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-bold shadow-lg animate-in slide-in-from-bottom-2">
              <CheckCircle2 size={14} />
              SPREMNO
            </div>
          </div>
        ) : (
          <UploadDropzone<OurFileRouter, "mediaUploader">
            endpoint="mediaUploader"
            onUploadBegin={() => setIsUploading(true)}
            onClientUploadComplete={(res) => {
              setIsUploading(false);
              const url = res[0].url;
              setUploadedUrl(url);
              setMediaType(res[0].type.startsWith("video") ? "VIDEO" : "IMAGE");
              onUploadComplete(url);
            }}
            onUploadError={(error: Error) => {
              setIsUploading(false);
              onUploadError?.(error.message);
            }}
            config={{ mode: "manual" }}
            className="ut-label:text-indigo-600 ut-button:bg-indigo-600 ut-button:ut-readying:bg-indigo-400 ut-allowed-content:text-slate-400 border-none w-full h-full flex flex-col items-center justify-center p-8 bg-transparent"
            content={{
              label: "Klikni ili prevuci sliku/video",
              allowedContent: "Slike (4MB) ili Video (16MB)",
            }}
          />
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-20">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-bold text-slate-900 text-center">Otpremanje u toku...</p>
          </div>
        )}
      </div>
      
      <input type="hidden" name="mediaUrl" value={uploadedUrl || ""} />
      <input type="hidden" name="mediaType" value={mediaType || ""} />
    </div>
  );
}
