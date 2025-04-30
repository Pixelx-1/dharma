
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; 
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, FileUp, FileCheck, Search, Wifi, WifiOff, Loader, Check, Eye } from 'lucide-react';
import { createFIR, getOfficerFIRs, getPendingSyncCount, forceSyncFIRs, FIR } from '@/services/firService';
import { toast } from "sonner";
import { Timestamp } from 'firebase/firestore';
import { useLanguage } from '@/contexts/LanguageContext';

// Helper function to format dates consistently
const formatDate = (dateValue: any): string => {
  if (!dateValue) return 'Pending...';
  
  if (dateValue instanceof Timestamp) {
    return new Date(dateValue.seconds * 1000).toLocaleDateString();
  } else if (dateValue instanceof Date) {
    return dateValue.toLocaleDateString();
  } else if (typeof dateValue === 'string') {
    return new Date(dateValue).toLocaleDateString();
  } else {
    return 'Invalid date';
  }
};

const FirPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [officerFIRs, setOfficerFIRs] = useState<FIR[]>([]);
  const { t } = useLanguage();

  // Form state
  const [caseNumber, setCaseNumber] = useState<string>('');
  const [incidentDate, setIncidentDate] = useState<string>('');
  const [incidentType, setIncidentType] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [complainantName, setComplainantName] = useState<string>('');
  const [complainantContact, setComplainantContact] = useState<string>('');
  const [incidentDetails, setIncidentDetails] = useState<string>('');
  const [evidenceDescription, setEvidenceDescription] = useState<string>('');

  // Handle online/offline status
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        toast.success(t("You're back online. Changes will sync automatically."));
      } else {
        toast.warning(t("You're offline. Changes will be saved locally."));
      }
    };
    
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [t]);

  // Check for pending operations periodically
  useEffect(() => {
    const updatePendingCount = () => {
      const count = getPendingSyncCount();
      setPendingSyncCount(count);
    };
    
    // Check immediately
    updatePendingCount();
    
    // Set up interval to check periodically
    const interval = setInterval(updatePendingCount, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Load officer FIRs
  useEffect(() => {
    const loadOfficerFIRs = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      try {
        const firs = await getOfficerFIRs(currentUser.uid);
        setOfficerFIRs(firs);
      } catch (error) {
        console.error("Error loading FIRs:", error);
        toast.error(t("Failed to load your FIRs"));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOfficerFIRs();
  }, [currentUser, t]);

  // View FIR details
  const viewFirDetails = (firId: string) => {
    navigate(`/fir/${firId}`);
  };

  // Handle force sync
  const handleForceSync = async () => {
    if (!isOnline) {
      toast.error(t("You're offline. Please connect to the internet to sync changes."));
      return;
    }
    
    setIsSyncing(true);
    try {
      await forceSyncFIRs();
      
      // Refresh the FIR list
      if (currentUser) {
        const firs = await getOfficerFIRs(currentUser.uid);
        setOfficerFIRs(firs);
      }
      
      // Update pending count
      setPendingSyncCount(getPendingSyncCount());
      
      toast.success(t("Sync completed successfully!"));
    } catch (error) {
      console.error("Error syncing:", error);
      toast.error(t("Failed to sync changes"));
    } finally {
      setIsSyncing(false);
    }
  };

  // Handle FIR creation
  const handleCreateFIR = async () => {
    if (!currentUser) {
      toast.error(t("You must be logged in to create an FIR"));
      return;
    }
    
    // Validate form fields
    if (!caseNumber || !incidentDate || !incidentType || !location || !complainantName) {
      toast.error(t("Please fill in all required fields"));
      return;
    }
    
    setIsLoading(true);
    try {
      const firData = {
        caseNumber,
        incidentDate,
        incidentType,
        location,
        complainantName,
        complainantContact,
        incidentDetails,
        evidenceDescription,
        officerId: currentUser.uid,
        officerName: currentUser.displayName || t('Unknown Officer'),
        status: 'Pending Review' as const
      };
      
      await createFIR(firData);
      
      toast.success(t("FIR created successfully") + (!isOnline ? " (" + t("will sync when online") + ")" : ""));
      
      // Clear form
      setCaseNumber('');
      setIncidentDate('');
      setIncidentType('');
      setLocation('');
      setComplainantName('');
      setComplainantContact('');
      setIncidentDetails('');
      setEvidenceDescription('');
      
      // Refresh the FIR list
      const firs = await getOfficerFIRs(currentUser.uid);
      setOfficerFIRs(firs);
    } catch (error) {
      console.error("Error creating FIR:", error);
      toast.error(t("Failed to create FIR") + ": " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Display network status indicator
  const NetworkStatus = () => (
    <div className="flex items-center gap-2 text-sm">
      {isOnline ? (
        <Badge variant="default" className="flex items-center gap-1">
          <Wifi className="h-3.5 w-3.5" />
          <span>{t('Online')}</span>
        </Badge>
      ) : (
        <Badge variant="destructive" className="flex items-center gap-1">
          <WifiOff className="h-3.5 w-3.5" />
          <span>{t('Offline')}</span>
        </Badge>
      )}
      
      {pendingSyncCount > 0 && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Loader className="h-3.5 w-3.5 animate-spin" />
          <span>{pendingSyncCount} {t('pending')} {pendingSyncCount === 1 ? t('change') : t('changes')}</span>
        </Badge>
      )}
      
      {pendingSyncCount > 0 && isOnline && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleForceSync} 
          disabled={isSyncing}
          className="ml-2"
        >
          {isSyncing ? (
            <>
              <Loader className="mr-1 h-3.5 w-3.5 animate-spin" />
              <span>{t('Syncing...')}</span>
            </>
          ) : (
            <>
              <Check className="mr-1 h-3.5 w-3.5" />
              <span>{t('Force Sync')}</span>
            </>
          )}
        </Button>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('FIR Management')}</h1>
            <p className="text-muted-foreground">{t('Create and manage First Information Reports')}</p>
          </div>
          <NetworkStatus />
        </div>

        <Tabs defaultValue="create">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">{t('Create FIR')}</TabsTrigger>
            <TabsTrigger value="pending">{t('Pending Approval')}</TabsTrigger>
            <TabsTrigger value="history">{t('History')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('Create New FIR')}</CardTitle>
                <CardDescription>
                  {t('Fill out the form below to create a new First Information Report')}
                  {!isOnline && " (" + t("will be saved offline and synced when connection is restored") + ")"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="case-number">{t('Case Number')}</Label>
                    <Input 
                      id="case-number" 
                      placeholder={t("Enter case number")}
                      value={caseNumber}
                      onChange={(e) => setCaseNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="incident-date">{t('Incident Date & Time')}</Label>
                    <Input 
                      id="incident-date" 
                      type="datetime-local" 
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="incident-type">{t('Incident Type')}</Label>
                    <Select value={incidentType} onValueChange={setIncidentType}>
                      <SelectTrigger id="incident-type">
                        <SelectValue placeholder={t("Select incident type")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="theft">{t('Theft')}</SelectItem>
                        <SelectItem value="assault">{t('Assault')}</SelectItem>
                        <SelectItem value="burglary">{t('Burglary')}</SelectItem>
                        <SelectItem value="vandalism">{t('Vandalism')}</SelectItem>
                        <SelectItem value="other">{t('Other')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">{t('Incident Location')}</Label>
                    <Input 
                      id="location" 
                      placeholder={t("Enter incident location")}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="transcription">{t('Associate Transcription')}</Label>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1.5" 
                      disabled={!isOnline}
                      title={!isOnline ? t("Not available in offline mode") : t("Browse transcriptions")}
                    >
                      <FileUp className="h-3.5 w-3.5" />
                      <span>{t('Browse')}</span>
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="transcription"
                      placeholder={t("Search for a transcription...")}
                      className="pl-8"
                      disabled={!isOnline}
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="complainant-name">{t('Complainant Name')}</Label>
                    <Input 
                      id="complainant-name" 
                      placeholder={t("Enter complainant name")}
                      value={complainantName}
                      onChange={(e) => setComplainantName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complainant-contact">{t('Complainant Contact')}</Label>
                    <Input 
                      id="complainant-contact" 
                      placeholder={t("Enter contact number")}
                      value={complainantContact}
                      onChange={(e) => setComplainantContact(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="incident-details">{t('Incident Details')}</Label>
                  <Textarea
                    id="incident-details"
                    placeholder={t("Describe the incident in detail...")}
                    className="min-h-32"
                    value={incidentDetails}
                    onChange={(e) => setIncidentDetails(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="evidences">{t('Evidence Description')}</Label>
                  <Textarea
                    id="evidences"
                    placeholder={t("List any evidence collected...")}
                    value={evidenceDescription}
                    onChange={(e) => setEvidenceDescription(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  disabled={isLoading}
                >
                  {t('Save as Draft')}
                </Button>
                <Button 
                  onClick={handleCreateFIR}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="mr-1 h-4 w-4 animate-spin" />
                      <span>{t('Creating...')}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="mr-1 h-4 w-4" />
                      <span>{t('Create FIR')}</span>
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('Pending Approvals')}</CardTitle>
                <CardDescription>
                  {t('FIRs awaiting review and approval')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-12 px-4 text-left font-medium">{t('FIR ID')}</th>
                          <th className="h-12 px-4 text-left font-medium">{t('Case #')}</th>
                          <th className="h-12 px-4 text-left font-medium">{t('Incident Type')}</th>
                          <th className="h-12 px-4 text-left font-medium">{t('Submitted By')}</th>
                          <th className="h-12 px-4 text-left font-medium">{t('Date')}</th>
                          <th className="h-12 px-4 text-left font-medium">{t('Status')}</th>
                          <th className="h-12 px-4 text-left font-medium">{t('Actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td colSpan={7} className="py-6 text-center">
                              <Loader className="mx-auto h-6 w-6 animate-spin" />
                              <p className="mt-2 text-sm text-muted-foreground">{t('Loading FIRs...')}</p>
                            </td>
                          </tr>
                        ) : officerFIRs.filter(fir => fir.status === 'Pending Review' || fir.status === 'Awaiting Approval').length > 0 ? (
                          officerFIRs
                            .filter(fir => fir.status === 'Pending Review' || fir.status === 'Awaiting Approval')
                            .map((fir) => (
                              <tr key={fir.id} className="border-b">
                                <td className="p-4 align-middle font-medium">
                                  {fir.id?.startsWith('temp_') ? t('Pending...') : fir.id}
                                  {fir.isSyncing && (
                                    <Loader className="ml-1 inline h-3 w-3 animate-spin" />
                                  )}
                                </td>
                                <td className="p-4 align-middle text-law-blue">{fir.caseNumber}</td>
                                <td className="p-4 align-middle">{t(fir.incidentType)}</td>
                                <td className="p-4 align-middle">{fir.officerName}</td>
                                <td className="p-4 align-middle">
                                  {formatDate(fir.createdAt)}
                                </td>
                                <td className="p-4 align-middle">
                                  <Badge variant={fir.status === 'Awaiting Approval' ? 'default' : 'outline'}>
                                    {t(fir.status)}
                                    {fir.isSyncing && (
                                      <Loader className="ml-1 inline h-3 w-3 animate-spin" />
                                    )}
                                  </Badge>
                                </td>
                                <td className="p-4 align-middle">
                                  <div className="flex items-center gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="gap-1.5"
                                      onClick={() => viewFirDetails(fir.id || '')}
                                    >
                                      <Eye className="h-4 w-4" />
                                      <span>{t('View')}</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="gap-1.5">
                                      <FileCheck className="h-4 w-4" />
                                      <span>{t('Review')}</span>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="py-6 text-center">
                              <p className="text-sm text-muted-foreground">{t('No pending FIRs found')}</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('FIR History')}</CardTitle>
                <CardDescription>
                  {t('Previously filed and approved FIRs')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("Search FIRs by ID, case number, or details...")}
                    className="pl-8 w-full md:max-w-sm"
                  />
                </div>
                
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-12 px-4 text-left font-medium">{t('FIR ID')}</th>
                          <th className="h-12 px-4 text-left font-medium">{t('Case #')}</th>
                          <th className="h-12 px-4 text-left font-medium">{t('Incident Type')}</th>
                          <th className="h-12 px-4 text-left font-medium">{t('Submitted By')}</th>
                          <th className="h-12 px-4 text-left font-medium">{t('Filed Date')}</th>
                          <th className="h-12 px-4 text-left font-medium">{t('Status')}</th>
                          <th className="h-12 px-4 text-left font-medium">{t('Actions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading ? (
                          <tr>
                            <td colSpan={7} className="py-6 text-center">
                              <Loader className="mx-auto h-6 w-6 animate-spin" />
                              <p className="mt-2 text-sm text-muted-foreground">{t('Loading FIRs...')}</p>
                            </td>
                          </tr>
                        ) : officerFIRs.filter(fir => fir.status === 'Approved' || fir.status === 'Rejected').length > 0 ? (
                          officerFIRs
                            .filter(fir => fir.status === 'Approved' || fir.status === 'Rejected')
                            .map((fir) => (
                              <tr key={fir.id} className="border-b">
                                <td className="p-4 align-middle font-medium">
                                  {fir.id}
                                  {fir.isSyncing && (
                                    <Loader className="ml-1 inline h-3 w-3 animate-spin" />
                                  )}
                                </td>
                                <td className="p-4 align-middle text-law-blue">{fir.caseNumber}</td>
                                <td className="p-4 align-middle">{t(fir.incidentType)}</td>
                                <td className="p-4 align-middle">{fir.officerName}</td>
                                <td className="p-4 align-middle">
                                  {formatDate(fir.createdAt)}
                                </td>
                                <td className="p-4 align-middle">
                                  <Badge variant="secondary">
                                    {t(fir.status)}
                                  </Badge>
                                </td>
                                <td className="p-4 align-middle">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="gap-1.5"
                                    onClick={() => viewFirDetails(fir.id || '')}
                                  >
                                    <Eye className="h-4 w-4" />
                                    <span>{t('View')}</span>
                                  </Button>
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="py-6 text-center">
                              <p className="text-sm text-muted-foreground">{t('No approved or rejected FIRs found')}</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FirPage;
