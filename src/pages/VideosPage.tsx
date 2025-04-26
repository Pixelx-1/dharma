
import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileVideo, Upload, Play, FileText, Loader2, Search, Eye, Edit, Download } from 'lucide-react';

const VideosPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Video Processing</h1>
            <p className="text-muted-foreground">Upload and process video evidence</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              <span>Upload Video</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="upload">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload Video</TabsTrigger>
            <TabsTrigger value="processing">Processing Queue</TabsTrigger>
            <TabsTrigger value="library">Video Library</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="pt-6">
            <div className="grid gap-6 md:grid-cols-5">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Video Upload</CardTitle>
                  <CardDescription>
                    Upload a video file for processing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="case-number">Case Number</Label>
                    <Input id="case-number" placeholder="Enter case number" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="video-type">Video Type</Label>
                    <Select>
                      <SelectTrigger id="video-type">
                        <SelectValue placeholder="Select video type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="body-cam">Body Camera Footage</SelectItem>
                        <SelectItem value="surveillance">Surveillance Footage</SelectItem>
                        <SelectItem value="interview">Interview Recording</SelectItem>
                        <SelectItem value="dashcam">Dash Cam Video</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="video-date">Recording Date</Label>
                    <Input id="video-date" type="date" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Primary Language</Label>
                    <Select defaultValue="en-US">
                      <SelectTrigger id="language">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="es-ES">Spanish</SelectItem>
                        <SelectItem value="fr-FR">French</SelectItem>
                        <SelectItem value="de-DE">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Upload Video File</Label>
                    <div className="border-2 border-dashed border-muted rounded-md p-6 flex flex-col items-center justify-center space-y-2">
                      <FileVideo className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground text-center">
                        Drag & drop your video file here, or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Supported formats: MP4, AVI, MOV, WEBM (Max: 4 hours / 2GB)
                      </p>
                      <Button size="sm" variant="outline">Browse Files</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Upload & Process Video</Button>
                </CardFooter>
              </Card>
              
              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Processing Options</CardTitle>
                  <CardDescription>
                    Configure video processing settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="processing-type">Processing Type</Label>
                      <Badge variant="outline">Offline Mode Available</Badge>
                    </div>
                    <Select defaultValue="standard">
                      <SelectTrigger id="processing-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard Transcription</SelectItem>
                        <SelectItem value="enhanced">Enhanced Transcription</SelectItem>
                        <SelectItem value="redaction">Auto-Redaction + Transcription</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Standard processing extracts audio and generates a basic transcript
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Additional Options</Label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Card className="cursor-pointer hover:border-primary transition-colors">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Speaker Identification</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Attempt to identify and label different speakers in the transcript
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer hover:border-primary transition-colors">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Auto-Generate FIR</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Extract information to pre-populate a First Information Report
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer hover:border-primary transition-colors">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Evidence Tagging</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Flag and timestamp potential evidence mentioned in the video
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer hover:border-primary transition-colors">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">Face Blurring</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            Automatically detect and blur faces in the video footage
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Input id="notes" placeholder="Add notes about this video (optional)" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="processing" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Processing Queue</CardTitle>
                <CardDescription>
                  Videos currently being processed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-md border p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Body Camera Footage - Case #2023-05-428</p>
                      <p className="text-sm text-muted-foreground">Uploaded 5 minutes ago</p>
                    </div>
                    <Badge>Processing</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Extracting audio...</span>
                      <span>35%</span>
                    </div>
                    <Progress value={35} />
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">Cancel</Button>
                  </div>
                </div>
                
                <div className="rounded-md border p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Surveillance Footage - Case #2023-04-219</p>
                      <p className="text-sm text-muted-foreground">Uploaded 25 minutes ago</p>
                    </div>
                    <Badge>Processing</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Transcribing audio...</span>
                      <span>68%</span>
                    </div>
                    <Progress value={68} />
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">Cancel</Button>
                  </div>
                </div>
                
                <div className="rounded-md border p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Interview Recording - Case #2023-05-102</p>
                      <p className="text-sm text-muted-foreground">Uploaded 1 hour ago</p>
                    </div>
                    <Badge variant="outline">Queued</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Waiting in queue...</span>
                      <span>0%</span>
                    </div>
                    <Progress value={0} />
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">Cancel</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="library" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Video Library</CardTitle>
                <CardDescription>
                  Processed video evidence
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative w-full md:max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search videos by case number, title..."
                    className="pl-8 w-full"
                  />
                </div>
                
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-12 px-4 text-left font-medium">Title</th>
                          <th className="h-12 px-4 text-left font-medium">Case #</th>
                          <th className="h-12 px-4 text-left font-medium">Date</th>
                          <th className="h-12 px-4 text-left font-medium">Duration</th>
                          <th className="h-12 px-4 text-left font-medium">Status</th>
                          <th className="h-12 px-4 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { title: 'Body Camera Footage', case: '2023-03-871', date: 'Apr 28, 2023', duration: '01:24:15', status: 'Complete' },
                          { title: 'Surveillance Camera - Main St', case: '2023-02-125', date: 'Apr 15, 2023', duration: '04:10:32', status: 'Complete' },
                          { title: 'Suspect Interview - James Brown', case: '2023-05-102', date: 'May 10, 2023', duration: '00:45:28', status: 'Complete' },
                          { title: 'Dashboard Camera Footage', case: '2022-11-509', date: 'Feb 18, 2023', duration: '00:32:15', status: 'Complete' },
                          { title: 'Witness Interview - Jane Smith', case: '2023-01-053', date: 'Feb 10, 2023', duration: '00:58:42', status: 'Complete' },
                        ].map((item, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-4 align-middle font-medium">{item.title}</td>
                            <td className="p-4 align-middle text-law-blue">{item.case}</td>
                            <td className="p-4 align-middle">{item.date}</td>
                            <td className="p-4 align-middle">{item.duration}</td>
                            <td className="p-4 align-middle">
                              <Badge variant="secondary">
                                {item.status}
                              </Badge>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon">
                                  <Play className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <FileText className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
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

export default VideosPage;
