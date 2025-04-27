
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileUp } from 'lucide-react';
import FileUploader from '@/components/FileUploader';

interface UploadEvidenceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (files: File[]) => Promise<void>;
}

const UploadEvidenceDialog = ({ isOpen, onOpenChange, onUpload }: UploadEvidenceDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          onUpload={onUpload}
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xlsx,.xls,.txt"
          multiple={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UploadEvidenceDialog;
