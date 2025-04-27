
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, FileText, Loader, Pencil } from 'lucide-react';
import { getFIR, FIR } from '@/services/firService';
import { toast } from 'sonner';
import FirEvidenceSection from '@/components/FirEvidenceSection';

const FirViewPage = () => {
  const { firId } = useParams<{ firId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [fir, setFir] = useState<FIR | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const loadFir = async () => {
      if (!firId) return;
      
      setIsLoading(true);
      try {
        const firData = await getFIR(firId);
        if (firData) {
          setFir(firData);
        } else {
          toast.error("FIR not found");
          navigate('/fir');
        }
      } catch (error) {
        console.error("Error loading FIR:", error);
        toast.error("Failed to load FIR details");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFir();
  }, [firId, navigate]);
  
  const handleRefreshData = async () => {
    if (!firId) return;
    
    try {
      const firData = await getFIR(firId);
      if (firData) {
        setFir(firData);
        toast.success("FIR details updated");
      }
    } catch (error) {
      console.error("Error refreshing FIR:", error);
      toast.error("Failed to refresh FIR details");
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full py-16">
          <Loader className="h-8 w-8 animate-spin mb-4" />
          <p className="text-muted-foreground">Loading FIR details...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!fir) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full py-16">
          <FileText className="h-16 w-16 mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">FIR Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested FIR could not be found</p>
          <Button onClick={() => navigate('/fir')}>
            Back to FIR Management
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/fir')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">FIR Details</h1>
              <p className="text-muted-foreground">Case Number: {fir.caseNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="capitalize">{fir.status}</Badge>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="pt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Incident Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Incident Date & Time</p>
                    <p>{formatDate(fir.incidentDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Incident Type</p>
                    <p className="capitalize">{fir.incidentType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p>{fir.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Filed By</p>
                    <p>{fir.officerName}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Incident Details</p>
                  <p className="whitespace-pre-line">{fir.incidentDetails || "No details provided"}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Complainant Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Name</p>
                    <p>{fir.complainantName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact</p>
                    <p>{fir.complainantContact || "Not provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="evidence" className="pt-6">
            <FirEvidenceSection 
              firId={fir.id || ''}
              userId={currentUser?.uid || ''}
              evidenceFiles={fir.evidenceFiles}
              onFilesUploaded={handleRefreshData}
            />
          </TabsContent>
          
          <TabsContent value="activity" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>Records of actions taken on this FIR</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Activity log feature coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FirViewPage;
