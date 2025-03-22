import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import Peer from 'simple-peer';
import { jwtDecode } from 'jwt-decode';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Video, Mic, MicOff, VideoOff } from 'lucide-react';
import { useStartLiveStreamMutation, useStopLiveStreamMutation } from '../../store/slices/postApiSlice';

interface DecodedToken {
  channelId: string;
  [key: string]: any;
}

const Live = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef<Map<string, Peer.Instance>>(new Map());
  const videoRef = useRef<HTMLVideoElement>(null);
  const channelToken = localStorage.getItem('channelToken');
  const [startLiveStream] = useStartLiveStreamMutation();
  const [stopLiveStream] = useStopLiveStreamMutation();

  const cleanup = async () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    peersRef.current.forEach((peer) => peer.destroy());
    peersRef.current.clear();
    if (socketRef.current) socketRef.current.disconnect();
    if (roomId) {
      await stopLiveStream({ roomId }).unwrap();
      console.log('Stopped live stream for room:', roomId);
    }
    setIsLive(false);
    setIsMuted(false);
    setIsVideoOff(false);
    setRoomId(null);
  };

  useEffect(() => {
    return () => {
      cleanup().catch((err) => console.error('Cleanup failed:', err));
    };
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch((err) => console.error('Video play error:', err));
    }
  }, [stream]);

  const startStream = async (roomIdToUse: string) => {
    if (isLive) return;

    try {
      const currentStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log('Stream tracks:', currentStream.getTracks());
      setStream(currentStream);
      setIsLive(true);

      socketRef.current = io('http://localhost:3004');
      socketRef.current.on('connect', () => console.log('Broadcaster socket connected:', socketRef.current?.id));

      socketRef.current.emit('join-room', roomIdToUse, false);
      console.log('Broadcaster joined room:', roomIdToUse);

      socketRef.current.on('viewer-joined', (viewerId: string) => {
        console.log('Viewer joined:', viewerId);
        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: currentStream,
        });

        peer.on('signal', (signal) => {
          console.log('Broadcaster sending signal to:', viewerId, signal);
          socketRef.current?.emit('signal', {
            roomId: roomIdToUse,
            signal,
            from: socketRef.current?.id,
            to: viewerId,
          });
        });

        peer.on('connect', () => console.log('Connected to viewer:', viewerId));
        peer.on('error', (err) => console.error('Peer error:', err));
        peersRef.current.set(viewerId, peer);
      });

      socketRef.current.on('signal', ({ signal, from }) => {
        const peer = peersRef.current.get(from);
        if (peer) {
          console.log('Broadcaster received signal from:', from, signal);
          peer.signal(signal);
        } else {
          console.error('No peer found for viewer:', from);
        }
      });
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
      setIsVideoOff(!isVideoOff);
    }
  };

  const handleStartLiveStream = async () => {
    if (!channelToken) return;

    try {
      const decodedToken = jwtDecode<DecodedToken>(channelToken);
      const channelId = decodedToken.channelId;
      const postId = `live-${channelId}-${Date.now()}`;
      const response = await startLiveStream({ postId, channelId }).unwrap();

      if (response.roomId) {
        setRoomId(response.roomId); // Update state for cleanup
        console.log('Live stream started with roomId:', response.roomId);
        await startStream(response.roomId); // Pass roomId directly
      }
    } catch (error) {
      console.error('Error starting live stream:', error);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Live Streaming</h2>
            {isLive && (
              <div className="flex items-center">
                <span className="animate-pulse h-3 w-3 bg-red-500 rounded-full mr-2" />
                <span className="text-sm font-medium">Live</span>
              </div>
            )}
          </div>
          <div className="relative rounded-lg overflow-hidden bg-gray-900 aspect-video">
            {stream ? (
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400">Camera Off</p>
              </div>
            )}
          </div>
          <div className="flex justify-center space-x-4">
            {!isLive ? (
              <Button onClick={handleStartLiveStream} className="bg-red-500 hover:bg-red-600 text-white">
                Start Stream
              </Button>
            ) : (
              <>
                <Button onClick={toggleAudio} variant="outline" className="w-12 h-12 rounded-full p-0">
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
                <Button onClick={toggleVideo} variant="outline" className="w-12 h-12 rounded-full p-0">
                  {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </Button>
                <Button onClick={cleanup} className="bg-red-500 hover:bg-red-600 text-white">
                  End Stream
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Live;