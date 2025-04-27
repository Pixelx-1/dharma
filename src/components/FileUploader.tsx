
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileUp, X } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  className?: string;
  disabled?: boolean;
}

const FileUploader = ({
  onUpload,
  accept = "*/*",
  multiple = true,
  maxSize = 20, // Default 20MB
  className = "",
  disabled = false
}: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    // Check file size
    const oversizedFiles = selectedFiles.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(`Some files exceed the ${maxSize}MB limit and were not added`);
      const validFiles = selectedFiles.filter(file => file.size <= maxSize * 1024 * 1024);
      setFiles(prev => [...prev, ...validFiles]);
      return;
    }
    
    setFiles(prev => [...prev, ...selectedFiles]);
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    setProgress(0);
    
    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 10;
          if (newProgress >= 90) {
            clearInterval(interval);
            return 90;
          }
          return newProgress;
        });
      }, 300);
      
      await onUpload(files);
      
      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => {
        setFiles([]);
        setProgress(0);
        setIsUploading(false);
        // Reset the file input
        if (fileInputRef.current) fileInputRef.current.value = '';
        toast.success("Files uploaded successfully");
      }, 500);
    } catch (error) {
      toast.error(`Upload failed: ${(error as Error).message}`);
      setIsUploading(false);
      setProgress(0);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className={`border-2 border-dashed rounded-lg p-4 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept={accept}
        multiple={multiple}
        disabled={disabled || isUploading}
      />
      
      <div className="text-center mb-4">
        <Button
          type="button"
          variant="outline"
          onClick={triggerFileInput}
          disabled={disabled || isUploading}
          className="gap-2"
        >
          <FileUp className="h-4 w-4" />
          Select Files
        </Button>
        <p className="mt-2 text-sm text-muted-foreground">
          Max file size: {maxSize}MB
        </p>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-2 mt-4">
          <p className="text-sm font-medium">Selected Files ({files.length})</p>
          <ul className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-muted px-3 py-2 rounded-md text-sm"
              >
                <span className="truncate max-w-[80%]">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                  className="h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
          
          {isUploading ? (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">
                Uploading... {progress}%
              </p>
            </div>
          ) : (
            <Button
              type="button"
              onClick={handleUpload}
              disabled={files.length === 0 || disabled}
              className="w-full mt-2"
            >
              Upload {files.length} {files.length === 1 ? 'file' : 'files'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
