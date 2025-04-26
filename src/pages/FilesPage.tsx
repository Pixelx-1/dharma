
import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUp, FolderPlus, Search, Filter, FolderOpen, FileText, FileImage, FileVideo, FileAudio } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const FilesPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Files</h1>
            <p className="text-muted-foreground">Manage case files and recordings</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2">
              <FolderPlus className="h-4 w-4" />
              <span>New Folder</span>
            </Button>
            <Button className="gap-2">
              <FileUp className="h-4 w-4" />
              <span>Upload Files</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Filters</CardTitle>
              <CardDescription>
                Browse files by category
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search-files">Search Files</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search-files"
                    placeholder="Search by name, case #..."
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>File Types</Label>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Documents</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileAudio className="h-4 w-4" />
                    <span>Audio Recordings</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileVideo className="h-4 w-4" />
                    <span>Video Files</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileImage className="h-4 w-4" />
                    <span>Images</span>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Cases</Label>
                <ScrollArea className="h-60 rounded-md border p-2">
                  <div className="space-y-1 pr-3">
                    {['#2023-05-428', '#2023-04-219', '#2023-05-102', '#2023-03-871', '#2022-11-509', '#2023-02-125'].map((item, i) => (
                      <Button 
                        key={i} 
                        variant="ghost" 
                        className="w-full justify-start text-left font-normal"
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>File Browser</CardTitle>
                  <CardDescription>
                    Current location: /cases/2023-05-428/
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Button variant="ghost" size="sm" className="h-7 px-2">Root</Button>
                <span>/</span>
                <Button variant="ghost" size="sm" className="h-7 px-2">cases</Button>
                <span>/</span>
                <Button variant="ghost" size="sm" className="h-7 px-2 font-medium text-foreground">2023-05-428</Button>
              </div>
              
              <Tabs defaultValue="grid">
                <div className="flex justify-between">
                  <TabsList>
                    <TabsTrigger value="grid">Grid</TabsTrigger>
                    <TabsTrigger value="list">List</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="grid" className="pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { name: 'Recordings', type: 'folder', count: 6 },
                      { name: 'Transcripts', type: 'folder', count: 4 },
                      { name: 'Evidence Photos', type: 'folder', count: 12 },
                      { name: 'Witness Statement - John Smith.mp3', type: 'audio', date: 'May 15, 2023' },
                      { name: 'Incident Report.pdf', type: 'document', date: 'May 15, 2023' },
                      { name: 'Crime Scene Photo 1.jpg', type: 'image', date: 'May 14, 2023' },
                      { name: 'Interview Transcript.docx', type: 'document', date: 'May 15, 2023' },
                      { name: 'Surveillance Footage.mp4', type: 'video', date: 'May 14, 2023' },
                    ].map((item, i) => (
                      <Card key={i} className="cursor-pointer hover:border-primary transition-colors">
                        <CardContent className="p-4 flex items-start gap-3">
                          <div className="file-icon">
                            {item.type === 'folder' ? (
                              <FolderOpen className="h-5 w-5" />
                            ) : item.type === 'audio' ? (
                              <FileAudio className="h-5 w-5" />
                            ) : item.type === 'document' ? (
                              <FileText className="h-5 w-5" />
                            ) : item.type === 'image' ? (
                              <FileImage className="h-5 w-5" />
                            ) : (
                              <FileVideo className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium truncate" title={item.name}>{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.type === 'folder' ? `${item.count} items` : item.date}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="list" className="pt-4">
                  <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                      <table className="w-full caption-bottom text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="h-12 px-4 text-left font-medium">Name</th>
                            <th className="h-12 px-4 text-left font-medium">Type</th>
                            <th className="h-12 px-4 text-left font-medium">Size</th>
                            <th className="h-12 px-4 text-left font-medium">Date Modified</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: 'Recordings', type: 'folder', size: '-', date: 'May 16, 2023' },
                            { name: 'Transcripts', type: 'folder', size: '-', date: 'May 15, 2023' },
                            { name: 'Evidence Photos', type: 'folder', size: '-', date: 'May 14, 2023' },
                            { name: 'Witness Statement - John Smith.mp3', type: 'Audio', size: '12.5 MB', date: 'May 15, 2023' },
                            { name: 'Incident Report.pdf', type: 'PDF', size: '1.8 MB', date: 'May 15, 2023' },
                            { name: 'Crime Scene Photo 1.jpg', type: 'Image', size: '3.2 MB', date: 'May 14, 2023' },
                            { name: 'Interview Transcript.docx', type: 'Document', size: '245 KB', date: 'May 15, 2023' },
                            { name: 'Surveillance Footage.mp4', type: 'Video', size: '145 MB', date: 'May 14, 2023' },
                          ].map((item, i) => (
                            <tr key={i} className="border-b hover:bg-muted/50">
                              <td className="p-4 align-middle flex items-center gap-2">
                                <div className="file-icon w-8 h-8">
                                  {item.type === 'folder' ? (
                                    <FolderOpen className="h-4 w-4" />
                                  ) : item.type === 'Audio' ? (
                                    <FileAudio className="h-4 w-4" />
                                  ) : item.type === 'PDF' || item.type === 'Document' ? (
                                    <FileText className="h-4 w-4" />
                                  ) : item.type === 'Image' ? (
                                    <FileImage className="h-4 w-4" />
                                  ) : (
                                    <FileVideo className="h-4 w-4" />
                                  )}
                                </div>
                                {item.name}
                              </td>
                              <td className="p-4 align-middle">
                                <Badge variant="outline">
                                  {item.type}
                                </Badge>
                              </td>
                              <td className="p-4 align-middle">{item.size}</td>
                              <td className="p-4 align-middle">{item.date}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FilesPage;
