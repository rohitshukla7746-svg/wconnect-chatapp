import React, { useEffect, useRef, useState, useContext } from "react";
import { AppContent } from "../context/AppContext";

const MicOnIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
    <path d="M19 10v2a7 7 0 01-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);
const MicOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23"/>
    <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6"/>
    <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);
const VideoOnIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
  </svg>
);
const VideoOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 0H14a2 2 0 012 2v3.34l1 1L23 7v10"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const EndCallIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7a2 2 0 011.72 2v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.42 19.42 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91"/>
    <line x1="23" y1="1" x2="1" y2="23"/>
  </svg>
);
const PhoneAcceptIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

const VideoCall = () => {
  const { socket, userData, callState, setCallState, incomingCall, setIncomingCall } = useContext(AppContent);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);  // video only
  const remoteAudioRef = useRef(null);  // audio only
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef(null);

  const isVideoCall = callState?.type === "video" || incomingCall?.type === "video";

  useEffect(() => {
    if (callState?.status === "connected") {
      timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [callState?.status]);

  const formatDuration = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const getLocalStream = async (video = true) => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video });
    localStreamRef.current = stream;
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
    return stream;
  };

  const createPeer = (stream, targetId) => {
    const peer = new RTCPeerConnection(ICE_SERVERS);

    // Add all local tracks to peer
    stream.getTracks().forEach(track => peer.addTrack(track, stream));

    // When remote tracks arrive, attach to correct element
    peer.ontrack = (e) => {
      const remoteStream = e.streams[0];
      if (isVideoCall && remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream;
      }
    };

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        socket.current?.emit("ice_candidate", { targetId, candidate: e.candidate });
      }
    };

    peer.onconnectionstatechange = () => {
      if (peer.connectionState === "connected") {
        setCallState(prev => ({ ...prev, status: "connected" }));
      }
    };

    peerRef.current = peer;
    return peer;
  };

  // Caller: get stream → create peer → create offer → send
  useEffect(() => {
    if (callState?.status !== "calling") return;

    (async () => {
      try {
        const stream = await getLocalStream(isVideoCall);
        const peer = createPeer(stream, callState.targetId);
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket.current?.emit("call_offer", {
          targetId: callState.targetId,
          offer,
          callerId: userData.id,
          callerName: userData.name,
          type: callState.type,
        });
      } catch (err) {
        console.error("Failed to start call:", err);
        endCall();
      }
    })();
  }, [callState?.status]);

  // Callee: get stream → create peer → set remote → create answer → send
  const acceptCall = async () => {
    try {
      const stream = await getLocalStream(isVideoCall);
      const peer = createPeer(stream, incomingCall.callerId);
      await peer.setRemoteDescription(new RTCSessionDescription(incomingCall.offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.current?.emit("call_answer", { targetId: incomingCall.callerId, answer });
      setCallState({ status: "connected", targetId: incomingCall.callerId, targetName: incomingCall.callerName, type: incomingCall.type });
      setIncomingCall(null);
    } catch (err) {
      console.error("Failed to accept call:", err);
      endCall();
    }
  };

  // Socket listeners
  useEffect(() => {
    if (!socket.current) return;

    const handleAnswer = async ({ answer }) => {
      if (peerRef.current) {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        setCallState(prev => ({ ...prev, status: "connected" }));
      }
    };

    const handleIce = async ({ candidate }) => {
      if (peerRef.current && candidate) {
        try { await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate)); } catch (e) {}
      }
    };

    const handleCallEnded = () => endCall(false);

    socket.current.on("call_answered", handleAnswer);
    socket.current.on("ice_candidate", handleIce);
    socket.current.on("call_ended", handleCallEnded);

    return () => {
      socket.current?.off("call_answered", handleAnswer);
      socket.current?.off("ice_candidate", handleIce);
      socket.current?.off("call_ended", handleCallEnded);
    };
  }, [socket.current]);

  const endCall = (notify = true) => {
    if (notify) {
      const targetId = callState?.targetId || incomingCall?.callerId;
      if (targetId) socket.current?.emit("call_end", { targetId });
    }
    peerRef.current?.close();
    peerRef.current = null;
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    localStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
    clearInterval(timerRef.current);
    setCallDuration(0);
    setCallState(null);
    setIncomingCall(null);
  };

  const declineCall = () => {
    socket.current?.emit("call_reject", { targetId: incomingCall.callerId });
    setIncomingCall(null);
  };

  const toggleMic = () => {
    localStreamRef.current?.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
    setMicOn(prev => !prev);
  };

  const toggleCam = () => {
    localStreamRef.current?.getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
    setCamOn(prev => !prev);
  };

  // ── Incoming call UI ──────────────────────────────────────────────────────
  if (incomingCall && !callState) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
        <div className="bg-white rounded-2xl shadow-2xl p-6 w-72 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold mx-auto mb-3">
            {incomingCall.callerName?.[0]?.toUpperCase()}
          </div>
          <p className="text-xs text-gray-400 mb-0.5">Incoming {incomingCall.type} call</p>
          <h3 className="text-gray-900 font-semibold text-base mb-5">{incomingCall.callerName}</h3>
          <div className="flex gap-3 justify-center">
            <button onClick={declineCall}
              className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-colors">
              <EndCallIcon />
            </button>
            <button onClick={acceptCall}
              className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg transition-colors">
              <PhoneAcceptIcon />
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-4">Decline · Accept</p>
        </div>
      </div>
    );
  }

  // ── Active call UI ────────────────────────────────────────────────────────
  if (callState) {
    const isCalling = callState.status === "calling";
    const targetName = callState.targetName;

    return (
      <div className="fixed inset-0 bg-[#0f0f1a] z-[100] flex flex-col">

        {/* Always render audio element for remote audio */}
        <audio ref={remoteAudioRef} autoPlay />

        {/* Remote video (full screen) */}
        {isVideoCall && (
          <video ref={remoteVideoRef} autoPlay playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Audio-only background */}
        {!isVideoCall && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-2xl">
              {targetName?.[0]?.toUpperCase()}
            </div>
            <h2 className="text-white text-xl font-semibold">{targetName}</h2>
            <p className="text-gray-400 text-sm mt-1">
              {isCalling ? "Calling..." : formatDuration(callDuration)}
            </p>
          </div>
        )}

        {/* Video call overlay info */}
        {isVideoCall && (
          <div className="absolute top-6 left-0 right-0 flex flex-col items-center z-10 pointer-events-none">
            <h2 className="text-white text-lg font-semibold drop-shadow-lg">{targetName}</h2>
            <p className="text-gray-300 text-sm">
              {isCalling ? "Calling..." : formatDuration(callDuration)}
            </p>
          </div>
        )}

        {/* Local video (picture-in-picture) */}
        {isVideoCall && (
          <div className="absolute bottom-28 right-4 w-32 h-44 rounded-xl overflow-hidden border-2 border-white/20 shadow-xl z-10">
            <video ref={localVideoRef} autoPlay playsInline muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
          </div>
        )}

        {/* Controls */}
        <div className="absolute bottom-0 left-0 right-0 pb-8 pt-4 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-5 z-10">
          <button onClick={toggleMic}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-lg ${micOn ? "bg-white/20 hover:bg-white/30 text-white" : "bg-red-500 hover:bg-red-600 text-white"}`}>
            {micOn ? <MicOnIcon /> : <MicOffIcon />}
          </button>
          {isVideoCall && (
            <button onClick={toggleCam}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-lg ${camOn ? "bg-white/20 hover:bg-white/30 text-white" : "bg-red-500 hover:bg-red-600 text-white"}`}>
              {camOn ? <VideoOnIcon /> : <VideoOffIcon />}
            </button>
          )}
          <button onClick={() => endCall()}
            className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-xl transition-colors">
            <EndCallIcon />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default VideoCall;
