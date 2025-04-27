
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '@/lib/firebase';
import offlineService from './offlineService';

export interface FIR {
  id?: string;
  caseNumber: string;
  incidentDate: string;
  incidentType: string;
  location: string;
  complainantName: string;
  complainantContact: string;
  incidentDetails: string;
  evidenceDescription: string;
  officerId: string;
  officerName: string;
  status: 'Pending Review' | 'Awaiting Approval' | 'Approved' | 'Rejected';
  evidenceFiles?: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  isSyncing?: boolean;
}

// Get all FIRs
export const getAllFIRs = async () => {
  try {
    const q = query(collection(firestore, 'firs'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const firs = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const id = doc.id;
      // Check if this FIR has pending operations
      const isSyncing = offlineService.hasPendingOperations('firs', id);
      
      return {
        id,
        ...data,
        isSyncing
      } as FIR;
    });
    
    return firs;
  } catch (error) {
    console.error("Error getting FIRs:", error);
    return [];
  }
};

// Get FIRs by officer ID
export const getOfficerFIRs = async (officerId: string) => {
  try {
    const q = query(
      collection(firestore, 'firs'), 
      where('officerId', '==', officerId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    const firs = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const id = doc.id;
      // Check if this FIR has pending operations
      const isSyncing = offlineService.hasPendingOperations('firs', id);
      
      return {
        id,
        ...data,
        isSyncing
      } as FIR;
    });
    
    return firs;
  } catch (error) {
    console.error("Error getting officer FIRs:", error);
    return [];
  }
};

// Get a single FIR by ID
export const getFIR = async (id: string) => {
  try {
    const docRef = doc(firestore, 'firs', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Check if this FIR has pending operations
      const isSyncing = offlineService.hasPendingOperations('firs', id);
      
      return {
        id: docSnap.id,
        ...data,
        isSyncing
      } as FIR;
    }
    
    return null;
  } catch (error) {
    console.error("Error getting FIR:", error);
    return null;
  }
};

// Create a new FIR
export const createFIR = async (fir: Omit<FIR, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    // Generate a temporary ID
    const tempId = `temp_${Date.now()}`;
    
    const firData = {
      ...fir,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'Pending Review'
    };
    
    // First try to create directly if online
    if (navigator.onLine) {
      try {
        const docRef = await addDoc(collection(firestore, 'firs'), {
          ...firData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        // Also create an audit log entry
        await addDoc(collection(firestore, 'auditLogs'), {
          firId: docRef.id,
          userId: fir.officerId,
          userName: fir.officerName,
          action: 'created',
          timestamp: serverTimestamp()
        });
        
        return docRef.id;
      } catch (error) {
        // If direct creation fails, queue it for offline processing
        offlineService.queueOperation('firs', 'create', tempId, firData);
        return tempId;
      }
    } else {
      // Queue for offline processing
      offlineService.queueOperation('firs', 'create', tempId, firData);
      return tempId;
    }
  } catch (error) {
    console.error("Error creating FIR:", error);
    throw error;
  }
};

// Update an existing FIR
export const updateFIR = async (id: string, fir: Partial<FIR>, userId: string, userName: string) => {
  try {
    const updateData = {
      ...fir,
      updatedAt: new Date()
    };
    
    // Queue operation for offline processing
    offlineService.queueOperation('firs', 'update', id, updateData);
    
    // Try to update directly if online
    if (navigator.onLine) {
      try {
        const firRef = doc(firestore, 'firs', id);
        
        await updateDoc(firRef, {
          ...fir,
          updatedAt: serverTimestamp()
        });
        
        // Create an audit log entry for the update
        await addDoc(collection(firestore, 'auditLogs'), {
          firId: id,
          userId,
          userName,
          action: 'updated',
          timestamp: serverTimestamp(),
          changes: Object.keys(fir).join(', ')
        });
      } catch (error) {
        console.error("Error updating FIR:", error);
        // Already queued for offline processing, so no need to handle error
      }
    }
  } catch (error) {
    console.error("Error updating FIR:", error);
    throw error;
  }
};

// Delete an FIR
export const deleteFIR = async (id: string, userId: string, userName: string) => {
  try {
    // Queue operation for offline processing
    offlineService.queueOperation('firs', 'delete', id);
    
    // Try to delete directly if online
    if (navigator.onLine) {
      try {
        const firRef = doc(firestore, 'firs', id);
        
        // Create an audit log entry before deletion
        await addDoc(collection(firestore, 'auditLogs'), {
          firId: id,
          userId,
          userName,
          action: 'deleted',
          timestamp: serverTimestamp()
        });
        
        await deleteDoc(firRef);
      } catch (error) {
        console.error("Error deleting FIR:", error);
        // Already queued for offline processing, so no need to handle error
      }
    }
  } catch (error) {
    console.error("Error deleting FIR:", error);
    throw error;
  }
};

// Upload evidence files for an FIR
export const uploadEvidenceFiles = async (
  firId: string, 
  files: File[], 
  userId: string
) => {
  try {
    // If offline, store file references for later upload
    if (!navigator.onLine) {
      // In a real implementation, we would store files in IndexedDB
      // For this demo, we'll just show a message
      throw new Error("Cannot upload files while offline. Files will be uploaded when connection is restored.");
    }
    
    const uploadPromises = files.map(async (file) => {
      const fileRef = ref(storage, `firs/${firId}/${file.name}`);
      
      // Set metadata for the file to include owner information
      const metadata = {
        customMetadata: {
          ownerEmail: userId
        }
      };
      
      // Upload the file
      await uploadBytes(fileRef, file, metadata);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(fileRef);
      
      return {
        name: file.name,
        url: downloadURL,
        type: file.type
      };
    });
    
    const uploadedFiles = await Promise.all(uploadPromises);
    
    // Update the FIR document with the new evidence URLs
    const firRef = doc(firestore, 'firs', firId);
    const firDoc = await getDoc(firRef);
    
    if (firDoc.exists()) {
      const currentEvidenceFiles = firDoc.data().evidenceFiles || [];
      
      await updateDoc(firRef, {
        evidenceFiles: [
          ...currentEvidenceFiles,
          ...uploadedFiles.map(file => file.url)
        ],
        updatedAt: serverTimestamp()
      });
    }
    
    return uploadedFiles;
  } catch (error) {
    console.error("Error uploading evidence files:", error);
    throw error;
  }
};

// Get pending operations count
export const getPendingSyncCount = () => {
  return offlineService.getPendingCount();
};

// Force a sync attempt
export const forceSyncFIRs = () => {
  return offlineService.attemptSync();
};
