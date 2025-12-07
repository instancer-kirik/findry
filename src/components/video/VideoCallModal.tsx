import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Monitor, 
  MessageSquare,
  Users,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  isMuted?: boolean;
  isVideoOff?: boolean;
}

interface VideoCallModalProps {
  open: boolean;
  onClose: () => void;
  participants?: Participant[];
  callType?: 'audio' | 'video';
  roomName?: string;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({
  open,
  onClose,
  participants = [],
  callType = 'video',
  roomName = 'Video Call'
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === 'audio');
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start local video stream
  useEffect(() => {
    if (open && !isVideoOff) {
      startLocalStream();
    }
    return () => {
      stopLocalStream();
    };
  }, [open, isVideoOff]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (open) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
      setCallDuration(0);
    };
  }, [open]);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error('Could not access camera/microphone');
    }
  };

  const stopLocalStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const toggleMute = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
    }
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff;
      });
    }
    setIsVideoOff(!isVideoOff);
  };

  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        if (videoRef.current) {
          videoRef.current.srcObject = screenStream;
        }
        setIsScreenSharing(true);
        
        screenStream.getVideoTracks()[0].onended = () => {
          if (streamRef.current && videoRef.current) {
            videoRef.current.srcObject = streamRef.current;
          }
          setIsScreenSharing(false);
        };
      } catch (error) {
        console.error('Error sharing screen:', error);
        toast.error('Could not share screen');
      }
    } else {
      if (streamRef.current && videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
      }
      setIsScreenSharing(false);
    }
  };

  const handleEndCall = () => {
    stopLocalStream();
    onClose();
    toast.success('Call ended');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Mock participants for demo
  const displayParticipants: Participant[] = participants.length > 0 ? participants : [
    { id: '1', name: 'You', isMuted, isVideoOff },
    { id: '2', name: 'Connecting...', isMuted: true, isVideoOff: true }
  ];

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleEndCall()}>
      <DialogContent className={cn(
        "p-0 gap-0 overflow-hidden",
        isFullscreen ? "max-w-full w-full h-full rounded-none" : "max-w-4xl w-[90vw] h-[80vh]"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-medium">{roomName}</span>
            <span className="text-sm text-muted-foreground">{formatDuration(callDuration)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Video Area */}
        <div className="flex-1 bg-muted/20 relative grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
          {/* Local Video */}
          <div className="relative rounded-lg overflow-hidden bg-muted aspect-video">
            {!isVideoOff ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-3xl">You</AvatarFallback>
                </Avatar>
              </div>
            )}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-background/80 backdrop-blur px-2 py-1 rounded">
              <span className="text-sm font-medium">You</span>
              {isMuted && <MicOff className="h-3 w-3 text-destructive" />}
            </div>
            {isScreenSharing && (
              <div className="absolute top-3 left-3 bg-primary px-2 py-1 rounded text-xs text-primary-foreground">
                Sharing Screen
              </div>
            )}
          </div>

          {/* Remote Participants */}
          {displayParticipants.slice(1).map((participant) => (
            <div key={participant.id} className="relative rounded-lg overflow-hidden bg-muted aspect-video">
              <div className="w-full h-full flex items-center justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={participant.avatar} />
                  <AvatarFallback className="text-3xl">
                    {participant.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-background/80 backdrop-blur px-2 py-1 rounded">
                <span className="text-sm font-medium">{participant.name}</span>
                {participant.isMuted && <MicOff className="h-3 w-3 text-destructive" />}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="p-4 border-t bg-background/95 backdrop-blur">
          <div className="flex items-center justify-center gap-3">
            <Button
              variant={isMuted ? "destructive" : "secondary"}
              size="lg"
              className="rounded-full h-12 w-12"
              onClick={toggleMute}
            >
              {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            
            <Button
              variant={isVideoOff ? "destructive" : "secondary"}
              size="lg"
              className="rounded-full h-12 w-12"
              onClick={toggleVideo}
            >
              {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>
            
            <Button
              variant={isScreenSharing ? "default" : "secondary"}
              size="lg"
              className="rounded-full h-12 w-12"
              onClick={toggleScreenShare}
            >
              <Monitor className="h-5 w-5" />
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full h-12 w-12"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full h-12 w-12"
            >
              <Users className="h-5 w-5" />
            </Button>
            
            <Button
              variant="destructive"
              size="lg"
              className="rounded-full h-12 w-12"
              onClick={handleEndCall}
            >
              <PhoneOff className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoCallModal;
