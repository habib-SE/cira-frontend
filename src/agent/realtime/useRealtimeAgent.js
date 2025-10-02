// import { useCallback, useEffect, useRef, useState } from "react";

// export default function useRealtimeAgent({
//   model = "gpt-realtime",
//   tokenUrl = "/api/realtime/token",
//   iceServers = [{ urls: "stun:stun.l.google.com:19302" }],
// } = {}) {
//   const pcRef = useRef(null);
//   const micStreamRef = useRef(null);
//   const remoteStreamRef = useRef(null);
//   const audioElRef = useRef(null);
//   const dataChannelRef = useRef(null);

//   const [status, setStatus] = useState("idle"); // idle | connecting | connected | error
//   const [isMicOn, setIsMicOn] = useState(false);
//   const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
//   const [lastEvent, setLastEvent] = useState(null);
//   const [isAssistantTalking, setIsAssistantTalking] = useState(false);

//   // ---- helpers ----
//   const fetchTokenJson = async (url) => {
//     const res = await fetch(url, { headers: { Accept: "application/json" } });
//     const body = await res.text();
//     if (!res.ok) throw new Error(`Token endpoint ${res.status} → ${body.slice(0, 200)}`);
//     return JSON.parse(body);
//   };

//   const extractClientSecret = (j) => {
//     if (j.client_secret?.value) return j.client_secret.value;
//     if (typeof j.client_secret === "string") return j.client_secret;
//     if (j.value) return j.value;
//     if (j.data) return extractClientSecret(j.data);
//     return null;
//   };

//   // ---- disconnect FIRST (so it exists when connect is defined) ----
//   const disconnect = useCallback(() => {
//     try { dataChannelRef.current?.close(); } catch { }
//     dataChannelRef.current = null;

//     try {
//       pcRef.current?.getSenders().forEach((s) => s.track && s.track.stop());
//       pcRef.current?.close();
//     } catch { }
//     pcRef.current = null;

//     try { micStreamRef.current?.getTracks().forEach((t) => t.stop()); } catch { }
//     micStreamRef.current = null;

//     if (audioElRef.current) {
//       try {
//         audioElRef.current.pause();
//         audioElRef.current.srcObject = null;
//       } catch { }
//     }

//     setIsMicOn(false);
//     setIsAssistantTalking(false);
//     setStatus("idle");
//   }, []);

//   useEffect(() => () => disconnect(), [disconnect]);

//   // ---- connect AFTER disconnect is declared ----
//   const connect = useCallback(async () => {
//     if (status === "connected" || status === "connecting") return;
//     setStatus("connecting");

//     try {
//       // 1) ephemeral client secret
//       const tokenJson = await fetchTokenJson(tokenUrl);
//       const clientSecret = extractClientSecret(tokenJson);
//       if (!clientSecret) throw new Error("No client secret in response");

//       // 2) mic
//       micStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
//       setIsMicOn(true);

//       // 3) peer connection
//       pcRef.current = new RTCPeerConnection({ iceServers });
//       remoteStreamRef.current = new MediaStream();

//       // 4) send mic
//       for (const track of micStreamRef.current.getAudioTracks()) {
//         pcRef.current.addTrack(track, micStreamRef.current);
//       }

//       // 5) receive model audio
//       pcRef.current.ontrack = (e) => {
//         for (const t of e.streams[0].getAudioTracks()) {
//           remoteStreamRef.current.addTrack(t);
//         }
//         if (audioElRef.current) {
//           const el = audioElRef.current;
//           el.srcObject = remoteStreamRef.current;
//           el.play().catch(() => { });
//           const onPlay = () => setIsAssistantTalking(true);
//           const onPause = () => setIsAssistantTalking(false);
//           el.addEventListener("playing", onPlay);
//           el.addEventListener("pause", onPause);
//           el.addEventListener("ended", onPause);
//         }
//       };

//       // 6) data channel
//       dataChannelRef.current = pcRef.current.createDataChannel("oai-events");
//       dataChannelRef.current.onmessage = (m) => setLastEvent(m.data);

//       // 7) offer/answer with Realtime API
//       const offer = await pcRef.current.createOffer({ offerToReceiveAudio: true });
//       await pcRef.current.setLocalDescription(offer);

//       const resp = await fetch(
//         `https://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}`,

//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${clientSecret}`,
//             "Content-Type": "application/sdp",
//           },
//           body: offer.sdp,
//         }
//       );
//       if (!resp.ok) {
//         const txt = await resp.text().catch(() => "");
//         throw new Error(`Realtime call failed: ${txt || resp.status}`);
//       }
//       const answerSdp = await resp.text();
//       await pcRef.current.setRemoteDescription({ type: "answer", sdp: answerSdp });

//       setStatus("connected");
//     } catch (err) {
//       console.error(err);
//       setLastEvent(String(err));
//       setStatus("error");
//       disconnect();
//     }
//   }, [iceServers, model, status, tokenUrl, disconnect]);

//   const toggleMic = useCallback(() => {
//     const tracks = micStreamRef.current?.getAudioTracks?.() || [];
//     if (tracks.length) {
//       const enabled = !tracks[0].enabled;
//       tracks.forEach((t) => (t.enabled = enabled));
//       setIsMicOn(enabled);
//     }
//   }, []);

//   const toggleSpeaker = useCallback(() => {
//     if (audioElRef.current) {
//       const next = !audioElRef.current.muted;
//       audioElRef.current.muted = next;
//       setIsSpeakerMuted(next);
//     }
//   }, []);

//   return {
//     status,
//     isMicOn,
//     isSpeakerMuted,
//     isAssistantTalking,
//     lastEvent,
//     connect,
//     disconnect,
//     toggleMic,
//     toggleSpeaker,
//     audioElRef,
//   };
// }
import { useCallback, useEffect, useRef, useState } from "react";

export default function useRealtimeAgent({
  model = "gpt-realtime", // ✅ fixed default
  tokenUrl = "/api/realtime/token",
  iceServers = [{ urls: "stun:stun.l.google.com:19302" }],
} = {}) {
  const pcRef = useRef(null);
  const micStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const audioElRef = useRef(null);
  const dataChannelRef = useRef(null);

  const [status, setStatus] = useState("idle"); // idle | connecting | connected | error
  const [isMicOn, setIsMicOn] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  const [isAssistantTalking, setIsAssistantTalking] = useState(false);

  const [userPhrases, setUserPhrases] = useState([]);
  const [assistantPhrases, setAssistantPhrases] = useState([]);

  // ---- helpers ----
  const fetchTokenJson = async (url) => {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    const body = await res.text();
    if (!res.ok) throw new Error(`Token endpoint ${res.status} → ${body.slice(0, 200)}`);
    return JSON.parse(body);
  };

  const extractClientSecret = (j) => {
    if (j.client_secret?.value) return j.client_secret.value;
    if (typeof j.client_secret === "string") return j.client_secret;
    if (j.value) return j.value;
    if (j.data) return extractClientSecret(j.data);
    return null;
  };

  // ---- disconnect ----
  const disconnect = useCallback(() => {
    try { dataChannelRef.current?.close(); } catch { }
    dataChannelRef.current = null;

    try {
      pcRef.current?.getSenders().forEach((s) => s.track && s.track.stop());
      pcRef.current?.close();
    } catch { }
    pcRef.current = null;

    try { micStreamRef.current?.getTracks().forEach((t) => t.stop()); } catch { }
    micStreamRef.current = null;

    if (audioElRef.current) {
      try {
        audioElRef.current.pause();
        audioElRef.current.srcObject = null;
      } catch { }
    }

    setIsMicOn(false);
    setIsAssistantTalking(false);
    setStatus("idle");
  }, []);

  useEffect(() => () => disconnect(), [disconnect]);

  // ---- connect ----
  const connect = useCallback(async () => {
    if (status === "connected" || status === "connecting") return;
    setStatus("connecting");

    try {
      const tokenJson = await fetchTokenJson(tokenUrl);
      const clientSecret = extractClientSecret(tokenJson);
      if (!clientSecret) throw new Error("No client secret in response");

      // mic
      micStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsMicOn(true);

      // peer
      pcRef.current = new RTCPeerConnection({ iceServers });
      remoteStreamRef.current = new MediaStream();

      // send mic
      for (const track of micStreamRef.current.getAudioTracks()) {
        pcRef.current.addTrack(track, micStreamRef.current);
      }

      // receive model audio
      pcRef.current.ontrack = (e) => {
        for (const t of e.streams[0].getAudioTracks()) {
          remoteStreamRef.current.addTrack(t);
        }
        if (audioElRef.current) {
          const el = audioElRef.current;
          el.srcObject = remoteStreamRef.current;
          el.play().catch(() => { });
          const onPlay = () => setIsAssistantTalking(true);
          const onPause = () => setIsAssistantTalking(false);
          el.addEventListener("playing", onPlay);
          el.addEventListener("pause", onPause);
          el.addEventListener("ended", onPause);
        }
      };

      // data channel
      dataChannelRef.current = pcRef.current.createDataChannel("oai-events");
      dataChannelRef.current.onopen = () => console.log("📡 Data channel opened");
      dataChannelRef.current.onclose = () => console.log("❌ Data channel closed");
      dataChannelRef.current.onmessage = (m) => {
        console.log("📨 Raw event:", m.data);
        try {
          const evt = JSON.parse(m.data);
          setLastEvent(evt);

          // === USER SPEECH ===
          if (evt.type === "conversation.item.created" && evt.item?.role === "user") {
            const transcript = evt.item?.content?.[0]?.transcript || null;
            if (transcript) {
              console.log("👤 User (final):", transcript);
              setUserPhrases((prev) => [...prev, transcript]);
            }
            setIsAssistantTalking(false); // lips stop, user is speaking
          }

          // inside dataChannelRef.current.onmessage

          // USER speech transcript (final)
          if (
            evt.type === "conversation.item.created" &&
            evt.item?.role === "user"
          ) {
            const transcript =
              evt.item?.content?.[0]?.transcript || evt.item?.content?.[0]?.text || null;
            if (transcript) {
              console.log("👤 User (final):", transcript);
              setUserPhrases((prev) =>
                prev.includes(transcript) ? prev : [...prev, transcript]
              );
            }
            setIsAssistantTalking(false);
          }

       // Start lips only when audio starts
if (evt.type === "output_audio_buffer.started") {
  console.log("🎤 Audio started → Speaking");
  setIsAssistantTalking(true);
}

// Keep lips moving during transcript streaming too
if (evt.type === "response.audio_transcript.delta") {
  setIsAssistantTalking(true);
  setAssistantPhrases((prev) => {
    const copy = [...prev];
    if (!copy.length) copy.push(evt.delta);
    else copy[copy.length - 1] += evt.delta;
    return copy;
  });
}

// Ignore response.completed and response.done for lips
if (evt.type === "response.completed" || evt.type === "response.done") {
  console.log("✅ Text done, but still speaking… (ignore for lips)");
}

// Stop lips only when audio playback really ends
if (evt.type === "output_audio_buffer.stopped") {
  console.log("🎵 Audio stopped → Listening");
  setIsAssistantTalking(false);
}

        } catch (e) {
          console.warn("Non-JSON event:", m.data);
          setLastEvent(m.data);
        }
      };

      // offer/answer
      const offer = await pcRef.current.createOffer({ offerToReceiveAudio: true });
      await pcRef.current.setLocalDescription(offer);

      const resp = await fetch(
        `https://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${clientSecret}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp,
        }
      );
      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        throw new Error(`Realtime call failed: ${txt || resp.status}`);
      }
      const answerSdp = await resp.text();
      await pcRef.current.setRemoteDescription({ type: "answer", sdp: answerSdp });

      setStatus("connected");
    } catch (err) {
      console.error("❌ Connection failed", err);
      setLastEvent(String(err));
      setStatus("error");
      disconnect();
    }
  }, [iceServers, model, status, tokenUrl, disconnect]);

  const toggleMic = useCallback(() => {
    const tracks = micStreamRef.current?.getAudioTracks?.() || [];
    if (tracks.length) {
      const enabled = !tracks[0].enabled;
      tracks.forEach((t) => (t.enabled = enabled));
      setIsMicOn(enabled);
    }
  }, []);

  const toggleSpeaker = useCallback(() => {
    if (audioElRef.current) {
      const next = !audioElRef.current.muted;
      audioElRef.current.muted = next;
      setIsSpeakerMuted(next);
    }
  }, []);

  return {
    status,
    isMicOn,
    isSpeakerMuted,
    isAssistantTalking,
    lastEvent,
    userPhrases,
    assistantPhrases,
    connect,
    disconnect,
    toggleMic,
    toggleSpeaker,
    audioElRef,
  };
}
