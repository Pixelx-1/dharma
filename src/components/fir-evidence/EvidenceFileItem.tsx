
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { getFileMetadata } from '@/services/mediaService';
import { FileAudio, FileVideo, Image, File } from 'lucide-react';

interface EvidenceFileItemProps {
  fileUrl: string;
  onClick: () => void;
}

const EvidenceFileItem = ({ fileUrl, onClick }: EvidenceFileItemProps) => {
  const getFileIcon = (fileUrl: string) => {
    const { type } = getFileMetadata(fileUrl);
    switch (type) {
      case 'audio':
        return <FileAudio className="h-5 w-5" />;
      case 'video':
        return <FileVideo className="h-5 w-5" />;
      case 'image':
        return <Image className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  const getFileName = (fileUrl: string) => {
    try {
      const decodedUrl = decodeURIComponent(fileUrl);
      const fileName = decodedUrl.split('/').pop()?.split('_').slice(1).join('_') || 'Unknown File';
      return fileName;
    } catch {
      return 'Unknown File';
    }
  };

  return (
    <div 
      className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted transition-colors cursor-pointer"
      onClick={onClick}
    >
      {getFileIcon(fileUrl)}
      <span className="flex-1 truncate text-sm">{getFileName(fileUrl)}</span>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-7 w-7" 
        onClick={(e) => {
          e.stopPropagation();
          // Handle download will be implemented in the parent
        }}
      >
        <Download className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default EvidenceFileItem;
