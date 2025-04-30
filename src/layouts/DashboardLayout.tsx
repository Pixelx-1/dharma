
import React, { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { AppHeader } from '@/components/AppHeader';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff } from 'lucide-react';
import { toast } from "sonner";
import { getPendingSyncCount } from '@/services/firService';
import { useLanguage } from '@/contexts/LanguageContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(0);
  const { t } = useLanguage();
  
  // Monitor online/offline status
  useEffect(() => {
    const handleOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOffline(!online);
      
      if (online) {
        toast.success(t("You're back online. Changes will sync automatically."));
      } else {
        toast.warning(t("You're offline. Changes will be saved locally."));
      }
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Set initial status
    setIsOffline(!navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [t]);
  
  // Check for pending changes periodically
  useEffect(() => {
    const checkPendingChanges = () => {
      setPendingChanges(getPendingSyncCount());
    };
    
    // Check immediately
    checkPendingChanges();
    
    // Set up interval to check periodically
    const interval = setInterval(checkPendingChanges, 10000);
    
    return () => clearInterval(interval);
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
          <footer className="px-4 py-2 border-t flex items-center justify-between text-xs text-muted-foreground border-police-border">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isOffline ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <span className="flex items-center gap-1 font-medium">
                {isOffline ? (
                  <>
                    <WifiOff className="h-3 w-3" />
                    {t("Offline")} {t("Mode")}
                  </>
                ) : (
                  <>
                    <Wifi className="h-3 w-3" />
                    {t("Online")}
                  </>
                )}
              </span>
              
              {pendingChanges > 0 && (
                <Badge variant="outline" className="text-xs">
                  {pendingChanges} {t("pending")} {pendingChanges === 1 ? t('change') : t('changes')}
                </Badge>
              )}
            </div>
            <div className="font-medium">{t("Echo Case Scribe")} v1.0.0</div>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
