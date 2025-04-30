
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Mic, File, FileCheck, Clock, Calendar, ArrowUpRight, Folder, FolderOpen, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const Index = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  
  const handleFirPlusClick = () => {
    navigate('/fir');
  };
  
  const getUserDisplayName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName;
    }
    return currentUser?.email?.split('@')[0] || 'User';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('Dashboard')}</h1>
            <p className="text-muted-foreground">{t('Welcome back')}, {t('Officer')} {getUserDisplayName()}</p>
          </div>
          <Button className="gap-2 bg-police-mustard text-black hover:bg-police-accent" onClick={handleFirPlusClick}>
            <PlusCircle className="h-4 w-4" />
            <span>FIR+</span>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-police-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('Active Cases')}</CardTitle>
              <File className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 {t('this week')}</p>
            </CardContent>
          </Card>
          <Card className="border-police-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('Pending Approvals')}</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">-1 {t('from yesterday')}</p>
            </CardContent>
          </Card>
          <Card className="border-police-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('Total Recordings')}</CardTitle>
              <Mic className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">145</div>
              <p className="text-xs text-muted-foreground">{t('Last recorded')} 2h {t('ago')}</p>
            </CardContent>
          </Card>
          <Card className="border-police-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{t('Storage Used')}</CardTitle>
              <Folder className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.2 GB</div>
              <p className="text-xs text-muted-foreground">{t('of')} 50 GB {t('total')}</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="recent">
          <div className="flex items-center justify-between">
            <TabsList className="bg-police-light">
              <TabsTrigger value="recent">{t('Recent Activity')}</TabsTrigger>
              <TabsTrigger value="cases">{t('My Cases')}</TabsTrigger>
            </TabsList>
            <Button variant="ghost" size="sm" className="gap-1 text-police-dark hover:bg-police-light">
              <span>{t('View All')}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          <TabsContent value="recent" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Recent Transcriptions */}
              <Card className="border-police-border">
                <CardHeader className="pb-3">
                  <CardTitle>{t('Recent Transcriptions')}</CardTitle>
                  <CardDescription>
                    {t('Your latest audio recordings and transcriptions')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  {['Witness Statement - Case #2023-05-428', 'Suspect Interview - Case #2023-04-219', 'Field Notes - Case #2023-05-102'].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="file-icon">
                          <Mic className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{item}</p>
                          <p className="text-xs text-muted-foreground">
                            {i === 0 ? '10 minutes ago' : i === 1 ? 'Yesterday' : '3 days ago'}
                          </p>
                        </div>
                      </div>
                      <Badge variant={i === 0 ? "default" : i === 1 ? "outline" : "secondary"} className={i === 0 ? "bg-police-mustard text-black hover:bg-police-mustard/90" : ""}>
                        {i === 0 ? t('New') : i === 1 ? t('Processing') : t('Complete')}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              {/* Pending Tasks */}
              <Card className="border-police-border">
                <CardHeader className="pb-3">
                  <CardTitle>{t('Pending Tasks')}</CardTitle>
                  <CardDescription>
                    {t('Tasks requiring your attention')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="file-icon">
                        <FileCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Review FIR - Case #2023-04-219</p>
                        <p className="text-xs text-muted-foreground">Due today</p>
                      </div>
                    </div>
                    <Badge variant="destructive">{t('Urgent')}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="file-icon">
                        <FolderOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Organize files - Case #2023-03-871</p>
                        <p className="text-xs text-muted-foreground">Due tomorrow</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{t('Medium')}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="file-icon">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">Court hearing - Case #2022-11-509</p>
                        <p className="text-xs text-muted-foreground">Next week</p>
                      </div>
                    </div>
                    <Badge variant="outline">{t('Scheduled')}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="cases" className="pt-4">
            <Card className="border-police-border">
              <CardHeader className="pb-3">
                <CardTitle>{t('My Active Cases')}</CardTitle>
                <CardDescription>
                  {t('Cases currently assigned to you')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                {[
                  { id: '#2023-05-428', title: 'Breaking & Entering at 1234 Main St', status: 'Active', date: 'May 12, 2023' },
                  { id: '#2023-04-219', title: 'Vehicle Theft - 2019 Honda Civic', status: 'In Progress', date: 'Apr 30, 2023' },
                  { id: '#2023-05-102', title: 'Assault at Downtown Metro Station', status: 'Active', date: 'May 1, 2023' },
                  { id: '#2023-03-871', title: 'Vandalism at City Park', status: 'Pending Review', date: 'Mar 22, 2023' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm text-police-dark">{item.id}</p>
                        <p className="font-medium">{item.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Opened: {item.date}
                      </p>
                    </div>
                    <Badge variant={
                      item.status === 'Active' ? "default" : 
                      item.status === 'In Progress' ? "outline" : 
                      "secondary"
                    } className={item.status === 'Active' ? "bg-police-mustard text-black hover:bg-police-mustard/90" : ""}>
                      {t(item.status)}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Index;
