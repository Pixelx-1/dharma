
import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus, FileUp, FileCheck, Search } from 'lucide-react';

const FirPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">FIR Management</h1>
            <p className="text-muted-foreground">Create and manage First Information Reports</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              <span>New FIR</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="create">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create">Create FIR</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New FIR</CardTitle>
                <CardDescription>
                  Fill out the form below to create a new First Information Report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="case-number">Case Number</Label>
                    <Input id="case-number" placeholder="Enter case number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="incident-date">Incident Date & Time</Label>
                    <Input id="incident-date" type="datetime-local" />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="incident-type">Incident Type</Label>
                    <Select>
                      <SelectTrigger id="incident-type">
                        <SelectValue placeholder="Select incident type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="theft">Theft</SelectItem>
                        <SelectItem value="assault">Assault</SelectItem>
                        <SelectItem value="burglary">Burglary</SelectItem>
                        <SelectItem value="vandalism">Vandalism</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Incident Location</Label>
                    <Input id="location" placeholder="Enter incident location" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="transcription">Associate Transcription</Label>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <FileUp className="h-3.5 w-3.5" />
                      <span>Browse</span>
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="transcription"
                      placeholder="Search for a transcription..."
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="complainant-name">Complainant Name</Label>
                    <Input id="complainant-name" placeholder="Enter complainant name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complainant-contact">Complainant Contact</Label>
                    <Input id="complainant-contact" placeholder="Enter contact number" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="incident-details">Incident Details</Label>
                  <Textarea
                    id="incident-details"
                    placeholder="Describe the incident in detail..."
                    className="min-h-32"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="evidences">Evidence Description</Label>
                  <Textarea
                    id="evidences"
                    placeholder="List any evidence collected..."
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Save as Draft</Button>
                <Button>Create FIR</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>
                  FIRs awaiting review and approval
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-12 px-4 text-left font-medium">FIR ID</th>
                          <th className="h-12 px-4 text-left font-medium">Case #</th>
                          <th className="h-12 px-4 text-left font-medium">Incident Type</th>
                          <th className="h-12 px-4 text-left font-medium">Submitted By</th>
                          <th className="h-12 px-4 text-left font-medium">Date</th>
                          <th className="h-12 px-4 text-left font-medium">Status</th>
                          <th className="h-12 px-4 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'FIR-2023-0428', case: '2023-05-428', type: 'Theft', officer: 'John Doe', date: 'May 15, 2023', status: 'Pending Review' },
                          { id: 'FIR-2023-0219', case: '2023-04-219', type: 'Assault', officer: 'John Doe', date: 'May 14, 2023', status: 'Awaiting Approval' },
                          { id: 'FIR-2023-0102', case: '2023-05-102', type: 'Burglary', officer: 'Jane Smith', date: 'May 12, 2023', status: 'Pending Review' },
                        ].map((item, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-4 align-middle font-medium">{item.id}</td>
                            <td className="p-4 align-middle text-law-blue">{item.case}</td>
                            <td className="p-4 align-middle">{item.type}</td>
                            <td className="p-4 align-middle">{item.officer}</td>
                            <td className="p-4 align-middle">{item.date}</td>
                            <td className="p-4 align-middle">
                              <Badge variant={item.status === 'Awaiting Approval' ? 'default' : 'outline'}>
                                {item.status}
                              </Badge>
                            </td>
                            <td className="p-4 align-middle">
                              <Button variant="ghost" size="sm" className="gap-1.5">
                                <FileCheck className="h-4 w-4" />
                                <span>Review</span>
                              </Button>
                            </td>
                          </tr>
                        ))}
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
                <CardTitle>FIR History</CardTitle>
                <CardDescription>
                  Previously filed and approved FIRs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search FIRs by ID, case number, or details..."
                    className="pl-8 w-full md:max-w-sm"
                  />
                </div>
                
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-12 px-4 text-left font-medium">FIR ID</th>
                          <th className="h-12 px-4 text-left font-medium">Case #</th>
                          <th className="h-12 px-4 text-left font-medium">Incident Type</th>
                          <th className="h-12 px-4 text-left font-medium">Submitted By</th>
                          <th className="h-12 px-4 text-left font-medium">Filed Date</th>
                          <th className="h-12 px-4 text-left font-medium">Status</th>
                          <th className="h-12 px-4 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'FIR-2023-0187', case: '2023-03-871', type: 'Vandalism', officer: 'John Doe', date: 'Apr 28, 2023', status: 'Approved' },
                          { id: 'FIR-2023-0125', case: '2023-02-125', type: 'Theft', officer: 'Jane Smith', date: 'Apr 15, 2023', status: 'Approved' },
                          { id: 'FIR-2023-0091', case: '2023-02-091', type: 'Burglary', officer: 'John Doe', date: 'Mar 22, 2023', status: 'Approved' },
                          { id: 'FIR-2022-0509', case: '2022-11-509', type: 'Assault', officer: 'Mike Johnson', date: 'Feb 18, 2023', status: 'Approved' },
                          { id: 'FIR-2023-0053', case: '2023-01-053', type: 'Theft', officer: 'Jane Smith', date: 'Feb 10, 2023', status: 'Approved' },
                        ].map((item, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-4 align-middle font-medium">{item.id}</td>
                            <td className="p-4 align-middle text-law-blue">{item.case}</td>
                            <td className="p-4 align-middle">{item.type}</td>
                            <td className="p-4 align-middle">{item.officer}</td>
                            <td className="p-4 align-middle">{item.date}</td>
                            <td className="p-4 align-middle">
                              <Badge variant="secondary">
                                {item.status}
                              </Badge>
                            </td>
                            <td className="p-4 align-middle">
                              <Button variant="ghost" size="sm" className="gap-1.5">
                                <FileText className="h-4 w-4" />
                                <span>View</span>
                              </Button>
                            </td>
                          </tr>
                        ))}
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
