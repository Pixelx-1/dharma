
import React from 'react';
import { 
  Search, 
  Bell, 
  CloudOff,
  CheckCircle,
  ArrowDownCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

interface AppHeaderProps {
  isOffline: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ isOffline }) => {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  
  // Function to get user initials
  const getUserInitials = (): string => {
    if (!currentUser?.displayName) {
      return currentUser?.email?.substring(0, 2).toUpperCase() || "U";
    }
    
    const nameParts = currentUser.displayName.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };
  
  const handleSyncClick = () => {
    toast({
      title: "Sync initiated",
      description: "Attempting to synchronize offline data...",
    });
  };
  
  return (
    <header className="border-b bg-police-light px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center md:w-72">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-police-dark" />
            <Input
              placeholder={t("Search cases...")}
              className="w-full bg-white pl-8 md:w-80 border-police-border focus:ring-police-mustard"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <LanguageSelector size="sm" />
          
          {isOffline && (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5 border-police-border text-police-dark hover:bg-police-light"
              onClick={handleSyncClick}
            >
              <ArrowDownCircle className="h-4 w-4" />
              <span className="hidden sm:inline">{t("Sync when online")}</span>
            </Button>
          )}
          
          {/* Offline indicator */}
          {isOffline ? (
            <Badge variant="outline" className="gap-1 text-police-accent border-police-accent">
              <CloudOff className="h-3.5 w-3.5" />
              <span>{t("Offline")}</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>{t("Online")}</span>
            </Badge>
          )}
          
          {/* Notifications dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-police-accent text-[10px] font-medium text-white flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>{t("Notifications")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                <DropdownMenuItem className="cursor-pointer flex flex-col items-start gap-1">
                  <div className="font-medium">{t("New case assigned")}</div>
                  <div className="text-xs text-muted-foreground">Case #2023-05-428 has been assigned to you</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex flex-col items-start gap-1">
                  <div className="font-medium">{t("FIR approval required")}</div>
                  <div className="text-xs text-muted-foreground">Case #2023-04-219 requires your approval</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex flex-col items-start gap-1">
                  <div className="font-medium">{t("Video processing complete")}</div>
                  <div className="text-xs text-muted-foreground">Video for Case #2023-03-871 is ready for review</div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-center justify-center font-medium text-primary">
                {t("View all notifications")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-police-mustard text-black">{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="flex flex-col">
                <span>{currentUser?.displayName || currentUser?.email}</span>
                <span className="text-xs font-normal text-muted-foreground">{t("Officer")} ID: 42857</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{t("Profile")}</DropdownMenuItem>
              <DropdownMenuItem>{t("Preferences")}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>{t("Log out")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
