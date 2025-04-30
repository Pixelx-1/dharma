
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  Home,
  FileText,
  Mic,
  FolderOpen,
  Settings,
  FileVideo,
  Shield,
  LogOut,
  LogIn,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export function AppSidebar() {
  const location = useLocation();
  const { currentUser, isAdmin, logout } = useAuth();
  const { t } = useLanguage();
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { title: t('Dashboard'), path: '/', icon: Home },
    { title: t('Transcription'), path: '/transcription', icon: Mic },
    { title: t('Files'), path: '/files', icon: FolderOpen },
    { title: t('FIR Management'), path: '/fir', icon: FileText },
    { title: t('Video Processing'), path: '/videos', icon: FileVideo },
  ];

  const systemItems = [
    { title: t('Settings'), path: '/settings', icon: Settings },
    ...(isAdmin ? [{ title: t('Administration'), path: '/admin', icon: Shield }] : []),
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar className="bg-police-khaki border-r border-police-border text-police-dark">
      <SidebarHeader className="flex items-center p-4">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/3b3a145e-9db0-4610-9d97-5846716e2007.png" 
            alt="Dharma Dashboard Logo" 
            className="h-12 w-12 rounded-md bg-white p-1 scale-90" 
          />
          <span className="font-bold text-black">Dharma</span>
        </div>
        <SidebarTrigger className="ml-auto text-black" />
      </SidebarHeader>
      
      <SidebarContent>
        {currentUser ? (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="text-black">{t('Main Navigation')}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton 
                        asChild 
                        className={`text-black hover:bg-police-mustard hover:text-black ${isActive(item.path) ? 'bg-police-mustard text-black' : ''}`}
                      >
                        <Link to={item.path}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            {systemItems.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel className="text-black">{t('System')}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {systemItems.map((item) => (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton 
                          asChild 
                          className={`text-black hover:bg-police-mustard hover:text-black ${isActive(item.path) ? 'bg-police-mustard text-black' : ''}`}
                        >
                          <Link to={item.path}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            )}
          </>
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel className="text-black">{t('Authentication')}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    asChild 
                    className={`text-black hover:bg-police-mustard hover:text-black ${isActive('/auth') ? 'bg-police-mustard text-black' : ''}`}
                  >
                    <Link to="/auth">
                      <LogIn className="h-4 w-4" />
                      <span>{t('Login / Signup')}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-3 py-2">
          {currentUser ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-2 text-xs text-black/70">
                <User className="h-3 w-3" />
                <span className="truncate">{currentUser.displayName || currentUser.email}</span>
              </div>
              <SidebarMenuButton asChild className="w-full justify-start bg-police-accent hover:bg-police-accent/80 text-black">
                <button onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  <span>{t('Logout')}</span>
                </button>
              </SidebarMenuButton>
            </div>
          ) : null}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
