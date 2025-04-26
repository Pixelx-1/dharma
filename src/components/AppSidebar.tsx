
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  LogOut
} from 'lucide-react';

export function AppSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { title: 'Dashboard', path: '/', icon: Home },
    { title: 'Transcription', path: '/transcription', icon: Mic },
    { title: 'Files', path: '/files', icon: FolderOpen },
    { title: 'FIR Management', path: '/fir', icon: FileText },
    { title: 'Video Processing', path: '/videos', icon: FileVideo },
  ];

  const systemItems = [
    { title: 'Settings', path: '/settings', icon: Settings },
    { title: 'Administration', path: '/admin', icon: Shield },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex items-center p-4">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/3b3a145e-9db0-4610-9d97-5846716e2007.png" 
            alt="Dharma Dashboard Logo" 
            className="h-12 w-12 rounded-md bg-white p-1 scale-90" 
          />
          <span className="font-bold text-sidebar-foreground">Dharma</span>
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild className={isActive(item.path) ? 'bg-sidebar-accent' : ''}>
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
        
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild className={isActive(item.path) ? 'bg-sidebar-accent' : ''}>
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
      </SidebarContent>
      
      <SidebarFooter>
        <div className="px-3 py-2">
          <SidebarMenuButton asChild className="w-full justify-start bg-sidebar-accent hover:bg-sidebar-accent/80">
            <button>
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
