import  { useEffect, useRef, useState } from 'react';
import { useGetLiveStreamsQuery } from '../../store/slices/postApiSlice';
import Peer from 'simple-peer';
import io from 'socket.io-client';

const LiveWatch = () => {
  const { data: liveStreams, isLoading, isError } = useGetLiveStreamsQuery({});
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreamEnded, setIsStreamEnded] = useState(false);
  const socketRef = useRef<any>(null);
  const peerRef = useRef<Peer.Instance | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3004');
    socketRef.current.on('connect', () => console.log('Viewer socket connected:', socketRef.current.id));
    socketRef.current.on('signal', ({ signal, from }: { signal: Peer.SignalData; from: string }) => {
      console.log('Viewer received signal from:', from, signal);
      if (peerRef.current) peerRef.current.signal(signal);
    });
    socketRef.current.on('user-left', (userId: string) => {
      console.log('User left:', userId);
      setStream(null);
      setIsStreamEnded(true);
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
      if (peerRef.current) peerRef.current.destroy();
    };
  }, []);

  const joinStream = (roomId: string) => {
    console.log('Joining stream for room:', roomId);
    setSelectedStream(roomId);
    setIsStreamEnded(false); // Reset stream ended state

    if (!socketRef.current) {
      console.error('Socket is not initialized');
      return;
    }

    const peer = new Peer({
      initiator: false,
      trickle: false,
    });
    console.log('Peer instance created:', peer);
    peerRef.current = peer;

    peer.on('signal', (signal: Peer.SignalData) => {
      console.log('Viewer sending signal:', signal);
      socketRef.current.emit('signal', {
        roomId,
        signal,
        from: socketRef.current.id,
        to: null,
      });
    });

    peer.on('stream', (incomingStream: MediaStream) => {
      console.log('Viewer received stream:', incomingStream);
      setStream(incomingStream);
      setIsStreamEnded(false); // Ensure stream is marked as active
      if (videoRef.current) {
        videoRef.current.srcObject = incomingStream;
        videoRef.current.play().catch((err) => console.error('Video play failed:', err));
      }
    });

    peer.on('connect', () => console.log('Viewer connected to broadcaster'));
    peer.on('error', (err: Error) => console.error('Viewer peer error:', err));

    socketRef.current.emit('join-room', roomId, true);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar for Live Streams */}
      <div className="w-1/4 p-6 bg-white shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Live Streams</h2>
        {isLoading ? (
          <div className="text-gray-500">Loading live streams...</div>
        ) : isError ? (
          <div className="text-red-500">Error fetching live streams</div>
        ) : liveStreams && liveStreams.length > 0 ? (
          <ul className="space-y-2">
            {liveStreams.map((stream: any) => (
              <li
                key={stream.roomId}
                onClick={() => joinStream(stream.roomId)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedStream === stream.roomId
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Channel {stream.channelId}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No active live streams</p>
        )}
      </div>

      {/* Video Player Section */}
      <div className="w-3/4 flex items-center justify-center p-6">
        {selectedStream ? (
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
            {stream ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
              />
            ) : isStreamEnded ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                <p className="text-2xl font-semibold">Stream Has Ended</p>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
                <p className="text-lg">Connecting to stream...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-600 text-lg">Select a stream to watch</div>
        )}
      </div>
    </div>
  );
};

export default LiveWatch;