
import { ref, uploadBytes, getDownloadURL, getBlob } from 'firebase/storage';
import { storage } from '@/lib/firebase';

// Upload any media file (audio, video, or document)
export const uploadMedia = async (
  folder: string,
  file: File,
  userId: string
): Promise<string> => {
  try {
    // If offline, reject with error
    if (!navigator.onLine) {
      throw new Error("Cannot upload files while offline");
    }
    
    const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
    
    // Set metadata for the file to include owner information
    const metadata = {
      customMetadata: {
        ownerEmail: userId,
        contentType: file.type,
        size: file.size.toString(),
        uploadDate: new Date().toISOString()
      }
    };
    
    // Upload the file
    await uploadBytes(fileRef, file, metadata);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(fileRef);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading media:", error);
    throw error;
  }
};

// Download a file using its URL
export const downloadFile = async (fileUrl: string, fileName: string): Promise<void> => {
  try {
    // Extract the reference from the download URL
    const fileRef = ref(storage, fileUrl);
    
    // Get the blob
    const blob = await getBlob(fileRef);
    
    // Create an anchor element and trigger download
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName || 'downloaded-file';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
};

// Get file metadata from URL
export const getFileMetadata = (fileUrl: string): { 
  type: 'audio' | 'video' | 'image' | 'document' | 'unknown',
  extension: string 
} => {
  try {
    const extension = fileUrl.split('.').pop()?.toLowerCase() || '';
    
    // Check file type based on extension
    if (['mp3', 'wav', 'ogg', 'aac'].includes(extension)) {
      return { type: 'audio', extension };
    } else if (['mp4', 'webm', 'mov', 'avi'].includes(extension)) {
      return { type: 'video', extension };
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return { type: 'image', extension };
    } else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'].includes(extension)) {
      return { type: 'document', extension };
    } else {
      return { type: 'unknown', extension };
    }
  } catch {
    return { type: 'unknown', extension: '' };
  }
};

// Check if file is viewable in browser
export const isViewableInBrowser = (fileUrl: string): boolean => {
  const { type } = getFileMetadata(fileUrl);
  return ['audio', 'video', 'image'].includes(type);
};
