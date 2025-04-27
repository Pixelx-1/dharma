
import { collection, doc, setDoc, deleteDoc, DocumentData } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { toast } from "sonner";

// Define interfaces
export interface PendingOperation {
  id: string;
  collection: string;
  operation: 'create' | 'update' | 'delete';
  data?: DocumentData;
  timestamp: number;
  attempts: number;
}

// Constants
const SYNC_INTERVAL = 30000; // Try to sync every 30 seconds
const MAX_RETRY_ATTEMPTS = 5;
const OFFLINE_STORAGE_KEY = 'fir_offline_queue';

// Main offline service
export class OfflineService {
  private syncInterval: number | null = null;
  private isOnline = navigator.onLine;

  constructor() {
    this.setupEventListeners();
    this.attemptSync();
  }

  // Set up online/offline event listeners
  private setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      toast.success("You're back online. Syncing pending changes...");
      this.attemptSync();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      toast.warning("You're offline. Changes will sync when connection returns.");
    });
  }

  // Start the sync interval
  public startSyncInterval() {
    if (!this.syncInterval) {
      this.syncInterval = window.setInterval(() => this.attemptSync(), SYNC_INTERVAL);
    }
  }

  // Stop the sync interval
  public stopSyncInterval() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Queue an operation for offline processing
  public queueOperation(
    collectionName: string,
    operation: 'create' | 'update' | 'delete',
    id: string,
    data?: DocumentData
  ): void {
    const pendingOperations = this.getPendingOperations();
    
    // Check if we already have a pending operation for this document
    const existingIndex = pendingOperations.findIndex(
      op => op.collection === collectionName && op.id === id
    );

    const newOperation: PendingOperation = {
      id,
      collection: collectionName,
      operation,
      data,
      timestamp: Date.now(),
      attempts: 0
    };

    if (existingIndex >= 0) {
      // Replace the existing operation
      pendingOperations[existingIndex] = newOperation;
    } else {
      // Add new operation
      pendingOperations.push(newOperation);
    }

    this.savePendingOperations(pendingOperations);
    
    // Try to sync immediately if online
    if (this.isOnline) {
      this.attemptSync();
    }
  }

  // Get all pending operations
  public getPendingOperations(): PendingOperation[] {
    const storedData = localStorage.getItem(OFFLINE_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  }

  // Save pending operations to local storage
  private savePendingOperations(operations: PendingOperation[]): void {
    localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(operations));
  }

  // Attempt to process all pending operations
  public async attemptSync(): Promise<void> {
    if (!this.isOnline) return;

    const pendingOperations = this.getPendingOperations();
    if (pendingOperations.length === 0) return;

    const operationsToRetry: PendingOperation[] = [];

    for (const operation of pendingOperations) {
      try {
        const collectionRef = collection(firestore, operation.collection);
        const docRef = doc(collectionRef, operation.id);

        switch (operation.operation) {
          case 'create':
          case 'update':
            await setDoc(docRef, {
              ...operation.data,
              updatedAt: new Date()
            }, { merge: true });
            break;
          case 'delete':
            await deleteDoc(docRef);
            break;
        }
      } catch (error) {
        // Handle failed operations
        operation.attempts += 1;
        
        // If we haven't reached max retries, queue it up again
        if (operation.attempts < MAX_RETRY_ATTEMPTS) {
          operationsToRetry.push(operation);
        } else {
          // Log persistent failures somewhere
          console.error(`Failed to sync operation after ${MAX_RETRY_ATTEMPTS} attempts:`, operation);
          toast.error(`Failed to sync operation for document ${operation.id}`);
        }
      }
    }

    // Update the pending operations
    this.savePendingOperations(operationsToRetry);
    
    // Notify if all synced successfully
    if (operationsToRetry.length === 0 && pendingOperations.length > 0) {
      toast.success("All changes synced successfully!");
    }
  }

  // Get the count of pending operations
  public getPendingCount(): number {
    return this.getPendingOperations().length;
  }

  // Check if a document has pending operations
  public hasPendingOperations(collectionName: string, id: string): boolean {
    const pendingOperations = this.getPendingOperations();
    return pendingOperations.some(op => op.collection === collectionName && op.id === id);
  }
}

// Create a singleton instance
const offlineService = new OfflineService();
export default offlineService;
