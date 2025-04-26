
import React, { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { AppHeader } from '@/components/AppHeader';
import { SidebarProvider } from '@/components/ui/sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);
  
  // Monitor online/offline status
  React.useEffect(() => {
    const handleOnlineStatus = () => setIsOffline(!navigator.onLine);
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Set initial status
    setIsOffline(!navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <AppHeader isOffline={isOffline} />
          <main className="flex-1 p-4 md:p-6 overflow-y-auto">
            {children}
          </main>
          <footer className="px-4 py-2 border-t flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className={`status-indicator ${isOffline ? 'status-offline' : 'status-online'}`}></div>
              <span>{isOffline ? 'Offline Mode' : 'Online'}</span>
            </div>
            <div>Echo Case Scribe v1.0.0</div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
