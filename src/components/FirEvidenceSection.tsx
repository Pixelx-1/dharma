
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import FileUploader from '@/components/FileUploader';
import MediaViewer from '@/components/MediaViewer';
import { getFileMetadata } from '@/services/mediaService';
import { uploadEvidenceFiles } from '@/services/firService';
import { FileUp, Download, File, FileAudio, FileVideo, Image } from 'lucide-react';
import { toast } from 'sonner';

interface FirEvidenceSectionProps {
  firId: string;
  userId: string;
  evidenceFiles?: string[];
  onFilesUploaded: () => void;
}

const FirEvidenceSection = ({
  firId,
  userId,
  evidenceFiles = [],
  onFilesUploaded
}: FirEvidenceSectionProps) => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ url: string; name: string } | null>(null);
  
  const handleFileUpload = async (files: File[]) => {
    try {
      await uploadEvidenceFiles(firId, files, userId);
      setIsUploadDialogOpen(false);
      onFilesUploaded();
    } catch (error) {
      toast.error(`Failed to upload: ${(error as Error).message}`);
    }
  };
  
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
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Evidence Files</CardTitle>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <FileUp className="h-3.5 w-3.5" />
                <span>Upload Evidence</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Evidence Files</DialogTitle>
              </DialogHeader>
              <FileUploader 
                onUpload={handleFileUpload}
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xlsx,.xls,.txt"
                multiple={true}
              />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {evidenceFiles && evidenceFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {evidenceFiles.map((fileUrl, index) => {
                const fileName = getFileName(fileUrl);
                return (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted transition-colors cursor-pointer"
                    onClick={() => setSelectedFile({ url: fileUrl, name: fileName })}
                  >
                    {getFileIcon(fileUrl)}
                    <span className="flex-1 truncate text-sm">{fileName}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle download
                      }}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No evidence files have been uploaded for this FIR</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 gap-1.5"
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <FileUp className="h-3.5 w-3.5" />
                <span>Upload Evidence Files</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedFile && (
        <MediaViewer 
          fileUrl={selectedFile.url}
          fileName={selectedFile.name}
          isOpen={!!selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </>
  );
};

export default FirEvidenceSection;
