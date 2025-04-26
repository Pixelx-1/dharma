
import React from 'react';
import { 
  Search, 
  Bell, 
  User,
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface AppHeaderProps {
  isOffline: boolean;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ isOffline }) => {
  const { toast } = useToast();
  
  const handleSyncClick = () => {
    toast({
      title: "Sync initiated",
      description: "Attempting to synchronize offline data...",
    });
  };
  
  return (
    <header className="border-b bg-dharma-muted px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center md:w-72">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-dharma-dark" />
            <Input
              placeholder="Search cases..."
              className="w-full bg-white pl-8 md:w-80 border-dharma-light focus:ring-dharma-accent"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {isOffline && (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5 border-dharma-light text-dharma-dark hover:bg-dharma-muted"
              onClick={handleSyncClick}
            >
              <ArrowDownCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Sync when online</span>
            </Button>
          )}
          
          {/* Offline indicator */}
          {isOffline ? (
            <Badge variant="outline" className="gap-1 text-dharma-accent border-dharma-accent">
              <CloudOff className="h-3.5 w-3.5" />
              <span>Offline</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Online</span>
            </Badge>
          )}
          
          {/* Notifications dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-law-accent-red text-[10px] font-medium text-white flex items-center justify-center">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                <DropdownMenuItem className="cursor-pointer flex flex-col items-start gap-1">
                  <div className="font-medium">New case assigned</div>
                  <div className="text-xs text-muted-foreground">Case #2023-05-428 has been assigned to you</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex flex-col items-start gap-1">
                  <div className="font-medium">FIR approval required</div>
                  <div className="text-xs text-muted-foreground">Case #2023-04-219 requires your approval</div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex flex-col items-start gap-1">
                  <div className="font-medium">Video processing complete</div>
                  <div className="text-xs text-muted-foreground">Video for Case #2023-03-871 is ready for review</div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-center justify-center font-medium text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-law-blue text-white">JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="flex flex-col">
                <span>John Doe</span>
                <span className="text-xs font-normal text-muted-foreground">Officer ID: 42857</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
