
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { downloadFile, getFileMetadata } from '@/services/mediaService';
import { toast } from 'sonner';

interface MediaViewerProps {
  fileUrl: string;
  fileName?: string;
  isOpen: boolean;
  onClose: () => void;
}

const MediaViewer = ({ fileUrl, fileName = 'file', isOpen, onClose }: MediaViewerProps) => {
  const { type, extension } = getFileMetadata(fileUrl);
  
  const handleDownload = async () => {
    try {
      await downloadFile(fileUrl, fileName);
      toast.success("File downloaded successfully");
    } catch (error) {
      toast.error(`Failed to download file: ${(error as Error).message}`);
    }
  };
  
  const renderMedia = () => {
    switch (type) {
      case 'audio':
        return (
          <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-md">
            <audio controls className="w-full max-w-md">
              <source src={fileUrl} type={`audio/${extension}`} />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      case 'video':
        return (
          <div className="flex flex-col items-center justify-center">
            <video 
              controls 
              className="w-full max-h-[60vh] rounded-md"
              poster="/placeholder.svg"
            >
              <source src={fileUrl} type={`video/${extension}`} />
              Your browser does not support the video element.
            </video>
          </div>
        );
      case 'image':
        return (
          <div className="flex items-center justify-center">
            <img 
              src={fileUrl} 
              alt={fileName} 
              className="max-w-full max-h-[60vh] object-contain rounded-md" 
            />
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8 bg-muted rounded-md">
            <p className="text-lg mb-4">This file type cannot be previewed</p>
            <Button onClick={handleDownload} className="gap-2">
              <Download size={16} />
              Download to view
            </Button>
          </div>
        );
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-lg truncate max-w-[80%]">
            {fileName || 'Media Preview'}
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleDownload} title="Download">
              <Download size={16} />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} title="Close">
              <X size={16} />
            </Button>
          </div>
        </DialogHeader>
        <div className="mt-4">
          {renderMedia()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaViewer;
