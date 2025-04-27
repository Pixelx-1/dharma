import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { downloadFile } from '@/services/mediaService';
import { uploadEvidenceFiles } from '@/services/firService';
import { toast } from 'sonner';
import MediaViewer from '@/components/MediaViewer';
import EvidenceFileItem from './fir-evidence/EvidenceFileItem';
import UploadEvidenceDialog from './fir-evidence/UploadEvidenceDialog';
import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';

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

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      await downloadFile(fileUrl, fileName);
      toast.success("File downloaded successfully");
    } catch (error) {
      toast.error(`Failed to download file: ${(error as Error).message}`);
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Evidence Files</CardTitle>
          <UploadEvidenceDialog 
            isOpen={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
            onUpload={handleFileUpload}
          />
        </CardHeader>
        <CardContent>
          {evidenceFiles && evidenceFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {evidenceFiles.map((fileUrl, index) => (
                <EvidenceFileItem 
                  key={index}
                  fileUrl={fileUrl}
                  onClick={() => {
                    const fileName = fileUrl.split('/').pop()?.split('_').slice(1).join('_') || 'Unknown File';
                    setSelectedFile({ url: fileUrl, name: fileName });
                  }}
                />
              ))}
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
