import React, { useState, useRef } from 'react';
import { uploadImage } from '../../firebase/storage';
import { Upload, X, Loader2, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

export default function ImageUploader({ section, value, onChange, placeholder = "svg:social-1" }) {
  const [dragActive, setDragActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [inputMode, setInputMode] = useState('upload'); // 'upload' or 'text'
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed.');
      return;
    }

    setIsUploading(true);
    setProgress(0);

    try {
      const downloadUrl = await uploadImage(section, file, (percent) => {
        setProgress(percent);
      });
      onChange(downloadUrl);
    } catch (error) {
      console.error(error);
      alert('Failed to upload image to Firebase Storage.');
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  const isSvgPlaceholder = value && value.startsWith('svg:');

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold uppercase tracking-wider text-[#a1a1aa]">
          Media / Thumbnail Asset
        </label>
        
        {/* Toggle between File Upload and SVG Placeholder Key */}
        <div className="flex gap-2">
          <button
            type="button"
            className={`text-xs px-2.5 py-1 rounded border transition-colors ${inputMode === 'upload' ? 'bg-[#4f46e5]/10 border-[#4f46e5]/40 text-[#6366f1]' : 'bg-transparent border-[#27272a] text-[#71717a]'}`}
            onClick={() => setInputMode('upload')}
          >
            Upload File
          </button>
          <button
            type="button"
            className={`text-xs px-2.5 py-1 rounded border transition-colors ${inputMode === 'text' ? 'bg-[#4f46e5]/10 border-[#4f46e5]/40 text-[#6366f1]' : 'bg-transparent border-[#27272a] text-[#71717a]'}`}
            onClick={() => setInputMode('text')}
          >
            SVG Key / URL
          </button>
        </div>
      </div>

      {inputMode === 'upload' ? (
        value && !isSvgPlaceholder ? (
          // Image Preview Card
          <div className="relative border border-[#27272a] bg-[#09090b] rounded p-2 flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded overflow-hidden border border-[#27272a] bg-[#18181b] flex items-center justify-center">
                <img src={value} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="text-xs">
                <p className="text-white font-medium truncate max-w-[200px]">Uploaded Asset</p>
                <a href={value} target="_blank" rel="noreferrer" className="text-[#6366f1] hover:underline">
                  View full image
                </a>
              </div>
            </div>
            <button
              type="button"
              className="w-8 h-8 rounded-full border border-red-800/40 text-red-400 hover:bg-red-950/20 flex items-center justify-center transition-colors"
              onClick={handleRemove}
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          // Drag & Drop Area
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileInput}
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
              dragActive ? 'border-[#6366f1] bg-[#6366f1]/5' : 'border-[#27272a] hover:border-[#3f3f46] bg-[#09090b]/40'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />

            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-[#6366f1]" size={32} />
                <p className="text-xs font-semibold text-[#a1a1aa] tracking-wide">
                  UPLOADING IMAGE ({progress}%)
                </p>
                <div className="w-48 h-1 bg-[#27272a] rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-[#6366f1] transition-all duration-150" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ) : (
              <>
                <Upload className="text-[#71717a] mb-2 group-hover:text-white" size={32} />
                <p className="text-xs font-medium text-white">Drag & drop image here or click to browse</p>
                <p className="text-[10px] text-[#71717a] mt-1">Supports PNG, JPG, JPEG, WebP</p>
              </>
            )}
          </div>
        )
      ) : (
        // Raw Text Entry Mode (for svg placeholder keys like svg:social-1 or external URL paths)
        <div className="relative">
          <input
            type="text"
            className="w-full bg-[#09090b] border border-[#27272a] rounded pl-10 pr-4 py-3 text-sm text-white placeholder-[#52525b] focus:outline-none focus:border-[#6366f1] transition-colors"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]">
            {isSvgPlaceholder ? <ImageIcon size={18} /> : <LinkIcon size={18} />}
          </div>
        </div>
      )}
    </div>
  );
}
