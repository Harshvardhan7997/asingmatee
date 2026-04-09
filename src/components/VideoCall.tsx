import { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, VideoOff, Mic, MicOff, Monitor, Phone, Users, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VideoCall = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const mockParticipants = [
    { name: 'Sarah_K', initials: 'SK', active: true },
    { name: 'Mike_T', initials: 'MT', active: true },
    { name: 'Emma_R', initials: 'ER', active: false },
    { name: 'John_D', initials: 'JD', active: true },
  ];

  if (!isInCall) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full gradient-cyber flex items-center justify-center mx-auto mb-6">
            <Video className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">Live Video Call</h2>
          <p className="text-muted-foreground text-sm mb-6">Start a live session with your students for real-time teaching and collaboration.</p>
          <Button onClick={() => setIsInCall(true)} className="bg-neon-green/20 text-neon-green border border-neon-green/30 hover:bg-neon-green/30">
            <Video className="w-4 h-4 mr-2" /> Start Call
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
      {/* Video grid */}
      <div className="flex-1 p-4 grid grid-cols-2 gap-4">
        {/* Main video (self) */}
        <div className="col-span-2 md:col-span-1 bg-card border border-border rounded-lg overflow-hidden relative cyber-border aspect-video flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full gradient-cyber flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-primary-foreground">You</span>
            </div>
            {!isVideoOn && <p className="text-xs text-muted-foreground">Camera off</p>}
          </div>
          <span className="absolute bottom-3 left-3 text-xs bg-secondary/80 px-2 py-1 rounded">Admin (You)</span>
          {isMuted && <MicOff className="absolute top-3 right-3 w-4 h-4 text-neon-red" />}
        </div>

        {/* Participants */}
        {mockParticipants.map(p => (
          <div key={p.name} className="bg-card border border-border rounded-lg overflow-hidden relative cyber-border aspect-video flex items-center justify-center">
            <div className="text-center">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 ${p.active ? 'gradient-cyber' : 'bg-secondary'}`}>
                <span className="text-lg font-bold text-primary-foreground">{p.initials}</span>
              </div>
            </div>
            <span className="absolute bottom-3 left-3 text-xs bg-secondary/80 px-2 py-1 rounded">{p.name}</span>
            {!p.active && <span className="absolute top-3 right-3 text-[10px] bg-neon-red/20 text-neon-red px-1.5 py-0.5 rounded">Away</span>}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-border bg-card flex items-center justify-center gap-3">
        <Button
          onClick={() => setIsMuted(!isMuted)}
          size="sm"
          className={`rounded-full w-12 h-12 ${isMuted ? 'bg-neon-red/20 text-neon-red' : 'bg-secondary text-foreground'}`}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>
        <Button
          onClick={() => setIsVideoOn(!isVideoOn)}
          size="sm"
          className={`rounded-full w-12 h-12 ${!isVideoOn ? 'bg-neon-red/20 text-neon-red' : 'bg-secondary text-foreground'}`}
        >
          {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </Button>
        <Button
          onClick={() => setIsScreenSharing(!isScreenSharing)}
          size="sm"
          className={`rounded-full w-12 h-12 ${isScreenSharing ? 'bg-primary/20 text-primary' : 'bg-secondary text-foreground'}`}
        >
          <Monitor className="w-5 h-5" />
        </Button>
        <Button
          size="sm"
          className="rounded-full w-12 h-12 bg-secondary text-foreground"
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
        <Button
          size="sm"
          className="rounded-full w-12 h-12 bg-secondary text-foreground"
        >
          <Users className="w-5 h-5" />
        </Button>
        <Button
          onClick={() => setIsInCall(false)}
          size="sm"
          className="rounded-full w-12 h-12 bg-destructive text-destructive-foreground"
        >
          <Phone className="w-5 h-5 rotate-[135deg]" />
        </Button>
      </div>
    </motion.div>
  );
};

export default VideoCall;
