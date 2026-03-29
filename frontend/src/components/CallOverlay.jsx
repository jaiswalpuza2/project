import React, { useEffect, useRef, useState } from "react";
import { PhoneOff, Mic, MicOff, Video, VideoOff, Maximize2, Minimize2, User } from "lucide-react";
import { useSocket } from "../context/SocketContext";

const CallOverlay = () => {
  const { 
    call, callAccepted, callEnded, stream, remoteStream, 
    leaveCall, answerCall, setReceivingCall, receivingCall 
  } = useSocket();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    if (stream && localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks()[0].enabled = isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream && stream.getVideoTracks().length > 0) {
      stream.getVideoTracks()[0].enabled = isVideoOff;
      setIsVideoOff(!isVideoOff);
    }
  };

  if (!call.isCalling && !receivingCall && !callAccepted) return null;

  if (receivingCall && !callAccepted) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
        <div className="bg-white rounded-[3rem] p-10 w-full max-w-md shadow-2xl flex flex-col items-center text-center animate-in zoom-in duration-500">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-200 animate-bounce">
            <User size={48} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-2">Incoming {call.callType === 'video' ? 'Video' : 'Audio'} Call</h3>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-10">{call.name} is calling you...</p>

          <div className="flex gap-6 w-full">
            <button 
              onClick={() => {
                setReceivingCall(false);

              }}
              className="flex-1 py-4 bg-red-100 text-red-600 rounded-2xl font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <PhoneOff size={20} />
              Decline
            </button>
            <button 
              onClick={answerCall}
              className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-green-600 shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center justify-center gap-2 animate-pulse"
            >
              <Video size={20} />
              Answer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[1000] bg-gray-900 flex flex-col items-center justify-center animate-in fade-in duration-500">

      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {callAccepted && remoteStream ? (
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center">
             <div className="w-32 h-32 bg-gray-800 rounded-full flex items-center justify-center text-gray-500 mb-6 border border-gray-700">
              <User size={64} />
            </div>
            <p className="text-white font-black uppercase tracking-[0.2em] text-sm animate-pulse">
              {callAccepted ? "Connecting..." : `Calling ${call.to || call.name}...`}
            </p>
          </div>
        )}

        <div className="absolute top-8 right-8 w-48 h-64 bg-black rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl z-10 transition-transform hover:scale-105 cursor-pointer">
          <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            playsInline 
            className={`w-full h-full object-cover ${isVideoOff ? 'hidden' : ''}`}
          />
          {isVideoOff && (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
              <User size={32} />
            </div>
          )}
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6 px-10 py-6 bg-white/10 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl scale-110">
          <button 
            onClick={toggleMute}
            className={`p-5 rounded-full transition-all active:scale-95 ${
              isMuted ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          <button 
            onClick={toggleVideo}
            className={`p-5 rounded-full transition-all active:scale-95 ${
              isVideoOff ? "bg-red-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
          </button>

          <button 
            onClick={() => leaveCall()}
            className="p-5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all active:scale-75 shadow-xl shadow-red-900/50"
          >
            <PhoneOff size={24} />
          </button>
        </div>

        <div className="absolute top-10 left-10 flex flex-col gap-1">
          <h2 className="text-white font-black text-2xl tracking-tight">{call.name || "User"}</h2>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
            <p className="text-[10px] text-green-500 font-black uppercase tracking-widest">
              {callAccepted ? "Ongoing Call" : "Calling..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallOverlay;
