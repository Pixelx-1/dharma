
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
}

// Get all FIRs
export const getAllFIRs = async () => {
  const q = query(collection(firestore, 'firs'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as FIR[];
};

// Get FIRs by officer ID
export const getOfficerFIRs = async (officerId: string) => {
  const q = query(
    collection(firestore, 'firs'), 
    where('officerId', '==', officerId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as FIR[];
};

// Get a single FIR by ID
export const getFIR = async (id: string) => {
  const docRef = doc(firestore, 'firs', id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as FIR;
  }
  
  return null;
};

// Create a new FIR
export const createFIR = async (fir: Omit<FIR, 'id' | 'createdAt' | 'updatedAt'>) => {
  const docRef = await addDoc(collection(firestore, 'firs'), {
    ...fir,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    status: 'Pending Review'
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
};

// Update an existing FIR
export const updateFIR = async (id: string, fir: Partial<FIR>, userId: string, userName: string) => {
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
};

// Delete an FIR
export const deleteFIR = async (id: string, userId: string, userName: string) => {
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
};

// Upload evidence files for an FIR
export const uploadEvidenceFiles = async (
  firId: string, 
  files: File[], 
  userId: string
) => {
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
};
