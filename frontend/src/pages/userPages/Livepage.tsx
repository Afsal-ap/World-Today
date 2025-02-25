import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Peer from 'simple-peer';
import io from 'socket.io-client';

const LiveWatch = () => {
  const { channelId } = useParams();
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<any[]>([]);
  const socketRef = useRef<any>();
  const userVideo = useRef<HTMLVideoElement>(null);
  const peersRef = useRef<any[]>([]);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:3004');

    // Get user media
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(currentStream => {
        setStream(currentStream);
        if (userVideo.current) {
          userVideo.current.srcObject = currentStream;
        }

        // Join the room
        socketRef.current.emit('join-room', channelId);

        // Handle user joined event
        socketRef.current.on('user-joined', (userId: string) => {
          const peer = createPeer(userId, socketRef.current.id, currentStream);
          peersRef.current.push({
            peerId: userId,
            peer
          });
          setPeers(users => [...users, { userId, stream: null }]);
        });

        // Handle receiving signal
        socketRef.current.on('receiving-returned-signal', (payload: any) => {
          const item = peersRef.current.find(p => p.peerId === payload.id);
          if (item) {
            item.peer.signal(payload.signal);
          }
        });

        // Handle user left
        socketRef.current.on('user-left', (userId: string) => {
          const peerObj = peersRef.current.find(p => p.peerId === userId);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          const peers = peersRef.current.filter(p => p.peerId !== userId);
          peersRef.current = peers;
          setPeers(peers);
        });
      })
      .catch(err => {
        console.error('Error accessing media devices:', err);
      });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [channelId]);

  const createPeer = (userId: string, callerId: string, stream: MediaStream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream
    });

    peer.on('signal', signal => {
      socketRef.current.emit('sending-signal', { 
        userToSignal: userId, 
        callerId, 
        signal 
      });
    });

    peer.on('stream', userStream => {
      const updatedPeers = peersRef.current.map(p => {
        if (p.peerId === userId) {
          return { ...p, stream: userStream };
        }
        return p;
      });
      setPeers(updatedPeers);
    });

    return peer;
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Live Stream</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
        {/* Local Video */}
        <div className="bg-black rounded-lg overflow-hidden">
          <video
            ref={userVideo}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>

        {/* Remote Videos */}
        {peers.map((peer, index) => (
          <div key={index} className="bg-black rounded-lg overflow-hidden">
            {peer.stream && (
              <video
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                ref={video => {
                  if (video && peer.stream) {
                    video.srcObject = peer.stream;
                  }
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveWatch;
