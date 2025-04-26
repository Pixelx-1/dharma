
import React, { useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mic, MicOff, Pause, Play, Download, Save, Edit, Loader2, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TranscriptionPage = () => {
  const { toast } = useToast();
  const [recording, setRecording] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<string>("00:00");
  const [recordingLanguage, setRecordingLanguage] = useState<string>("en-US");
  const [transcriptionText, setTranscriptionText] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  const handleStartRecording = () => {
    // In a real implementation, this would use the Web Audio API
    setRecording(true);
    setPaused(false);
    
    // Simulate recording time counter
    let seconds = 0;
    const interval = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = (seconds % 60).toString().padStart(2, '0');
      setRecordingTime(`${mins}:${secs}`);
    }, 1000);
    
    // Save interval ID to component state
    // @ts-ignore - we're just simulating
    window.recordingInterval = interval;
    
    toast({
      title: "Recording started",
      description: "Audio recording has begun. Speak clearly for best results."
    });
  };
  
  const handleStopRecording = () => {
    setRecording(false);
    setPaused(false);
    
    // Clear the interval
    // @ts-ignore - we're just simulating
    clearInterval(window.recordingInterval);
    
    // Simulate processing
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setTranscriptionText(
        "Officer: Today is May 15th, 2023. The time is approximately 2:30 PM. I am Officer John Doe, badge number 42857. I'm here with Mr. James Smith regarding the incident that occurred on May 14th at approximately 10:20 PM at 1234 Main Street.\n\n" +
        "Mr. Smith: Yes, that's correct. I was returning home from work when I noticed the front door was slightly open.\n\n" +
        "Officer: And what did you do when you noticed the door was open?\n\n" +
        "Mr. Smith: I was cautious. I called out to see if anyone was home, thinking maybe my wife had returned early from her business trip. When nobody answered, I called 911 immediately and waited outside until officers arrived."
      );
      toast({
        title: "Transcription complete",
        description: "Your recording has been successfully transcribed."
      });
    }, 3000);
  };
  
  const handlePauseRecording = () => {
    setPaused(!paused);
    
    if (!paused) {
      // @ts-ignore - we're just simulating
      clearInterval(window.recordingInterval);
      toast({
        title: "Recording paused",
        description: "Resume when ready to continue."
      });
    } else {
      // Restart the timer
      let [mins, secs] = recordingTime.split(':').map(Number);
      let seconds = mins * 60 + secs;
      
      const interval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        setRecordingTime(`${mins}:${secs}`);
      }, 1000);
      
      // @ts-ignore - we're just simulating
      window.recordingInterval = interval;
      toast({
        title: "Recording resumed",
        description: "Audio capture is continuing."
      });
    }
  };
  
  const handleSaveTranscription = () => {
    toast({
      title: "Transcription saved",
      description: "Your transcription has been saved successfully."
    });
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Audio Transcription</h1>
            <p className="text-muted-foreground">Record and transcribe interviews and statements</p>
          </div>
        </div>
        
        <Tabs defaultValue="record">
          <TabsList>
            <TabsTrigger value="record">Record</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="record" className="space-y-4 pt-4">
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Recording Controls */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Recording Controls</CardTitle>
                  <CardDescription>
                    Configure and control audio recording
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="case-number">Case Number</Label>
                    <Input 
                      id="case-number" 
                      placeholder="Enter case number" 
                      disabled={recording} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="recording-type">Recording Type</Label>
                    <Select disabled={recording}>
                      <SelectTrigger id="recording-type">
                        <SelectValue placeholder="Select recording type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="witness">Witness Statement</SelectItem>
                        <SelectItem value="suspect">Suspect Interview</SelectItem>
                        <SelectItem value="victim">Victim Statement</SelectItem>
                        <SelectItem value="field-notes">Field Notes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      disabled={recording} 
                      value={recordingLanguage} 
                      onValueChange={setRecordingLanguage}
                    >
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
                    <Label>Audio Mode</Label>
                    <div className="flex items-center justify-between rounded-md border p-2">
                      <div className="text-sm">
                        <div className="font-medium">Offline Mode</div>
                        <div className="text-muted-foreground">Using local transcription engine</div>
                      </div>
                      <Badge variant="outline" className="text-law-accent-amber border-law-accent-amber">
                        <Globe className="h-3.5 w-3.5 mr-1" />
                        Offline
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-center py-3">
                    <div className="text-3xl font-mono font-bold">{recordingTime}</div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                  {!recording && !isProcessing ? (
                    <Button className="w-full" onClick={handleStartRecording}>
                      <Mic className="mr-2 h-4 w-4" />
                      Start Recording
                    </Button>
                  ) : recording ? (
                    <>
                      <Button
                        className="w-full"
                        variant={paused ? "default" : "outline"}
                        onClick={handlePauseRecording}
                      >
                        {paused ? (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Resume Recording
                          </>
                        ) : (
                          <>
                            <Pause className="mr-2 h-4 w-4" />
                            Pause Recording
                          </>
                        )}
                      </Button>
                      <Button
                        className="w-full"
                        variant="destructive"
                        onClick={handleStopRecording}
                      >
                        <MicOff className="mr-2 h-4 w-4" />
                        Stop Recording
                      </Button>
                    </>
                  ) : (
                    <Button disabled className="w-full">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </Button>
                  )}
                </CardFooter>
              </Card>
              
              {/* Transcription Output */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Transcription</CardTitle>
                    <CardDescription>
                      {isProcessing ? 
                        "Processing audio, please wait..." : 
                        recording ? 
                        "Recording in progress, transcription will appear here..." :
                        transcriptionText ? 
                        "Review and edit the transcription below" :
                        "Start recording to generate a transcript"
                      }
                    </CardDescription>
                  </div>
                  {recording && !paused && (
                    <div className="recording-waveform">
                      {[...Array(6)].map((_, i) => (
                        <span key={i} style={{ height: `${20 + Math.random() * 60}%` }}></span>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px] rounded-md border p-4">
                    {isProcessing ? (
                      <div className="flex h-full items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <Textarea 
                        value={transcriptionText} 
                        onChange={(e) => setTranscriptionText(e.target.value)} 
                        placeholder="Transcription will appear here once recording is complete..."
                        className="min-h-[380px] resize-none border-none focus-visible:ring-0 p-0"
                      />
                    )}
                  </ScrollArea>
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    disabled={!transcriptionText || recording || isProcessing}
                    onClick={() => {
                      toast({
                        title: "Editing enabled",
                        description: "You can now edit the transcription."
                      });
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Transcription
                  </Button>
                  <Button
                    variant="outline"
                    disabled={!transcriptionText || recording || isProcessing}
                    onClick={() => {
                      toast({
                        title: "Downloading transcription",
                        description: "Your transcription is being downloaded."
                      });
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    disabled={!transcriptionText || recording || isProcessing}
                    onClick={handleSaveTranscription}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save to Case
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recording History</CardTitle>
                <CardDescription>
                  Your recent recordings and transcriptions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-md border">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="h-12 px-4 text-left font-medium">Date</th>
                          <th className="h-12 px-4 text-left font-medium">Title</th>
                          <th className="h-12 px-4 text-left font-medium">Case #</th>
                          <th className="h-12 px-4 text-left font-medium">Duration</th>
                          <th className="h-12 px-4 text-left font-medium">Status</th>
                          <th className="h-12 px-4 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { date: 'Today', title: 'Witness Statement', case: '2023-05-428', duration: '07:24', status: 'Complete' },
                          { date: 'Yesterday', title: 'Suspect Interview', case: '2023-04-219', duration: '28:15', status: 'Processing' },
                          { date: 'May 10, 2023', title: 'Victim Statement', case: '2023-05-102', duration: '15:43', status: 'Complete' },
                          { date: 'May 5, 2023', title: 'Field Notes', case: '2023-03-871', duration: '04:50', status: 'Complete' },
                          { date: 'April 27, 2023', title: 'Witness Statement', case: '2023-04-219', duration: '12:37', status: 'Complete' },
                        ].map((item, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-4 align-middle">{item.date}</td>
                            <td className="p-4 align-middle font-medium">{item.title}</td>
                            <td className="p-4 align-middle text-law-blue">{item.case}</td>
                            <td className="p-4 align-middle">{item.duration}</td>
                            <td className="p-4 align-middle">
                              <Badge variant={item.status === 'Complete' ? 'default' : 'outline'}>
                                {item.status}
                              </Badge>
                            </td>
                            <td className="p-4 align-middle">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
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

export default TranscriptionPage;
