import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Phone, Video, Send, Smile, Paperclip, ArrowLeft, Check, CheckCheck, MessageSquare, Image as ImageIcon, Mic, MicOff, VideoOff, PhoneOff, RefreshCw, Camera, Volume2, Shield, Trash } from 'lucide-react';
import { GalleryItem } from '../types';

import { T, useLanguage } from './TranslationProvider';
import { playNotificationSound } from '../utils/sound';

interface ChatMessage {
  id: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  senderId: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatViewProps {
  onAddMediaToGallery: (item: GalleryItem) => void;
  onCloseChat: () => void;
  initialContactId?: string | null;
  onSelectContact?: (contactId: string | null) => void;
  isGuest?: boolean;
  onSignUp?: () => void;
}

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
}

const MOCK_CONTACTS: ChatContact[] = [
  { id: '1', name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80', lastMessage: 'See you tomorrow at the site.', lastMessageTime: '10:42 AM', unreadCount: 2, online: true },
  { id: '2', name: 'Nhlanhla Ndlovu', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80', lastMessage: 'Thanks for the payment.', lastMessageTime: 'Yesterday', unreadCount: 0, online: false },
  { id: '3', name: 'Tshepo Mokwena', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', lastMessage: 'Let us link up on the solar task.', lastMessageTime: 'Monday', unreadCount: 1, online: true },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  '1': [
    { id: 'm1', text: 'Hey John, are we still on for the site visit?', senderId: 'me', timestamp: '10:30 AM', status: 'read' },
    { id: 'm2', text: 'Yes, definitely. I will be there by 9 AM.', senderId: '1', timestamp: '10:35 AM', status: 'read' },
    { id: 'm3', text: 'Perfect. See you tomorrow at the site.', senderId: '1', timestamp: '10:42 AM', status: 'read' },
  ],
  '2': [
    { id: 'm4', text: 'Hi Nhlanhla! Have you completed the living room coat?', senderId: 'me', timestamp: '03:15 PM', status: 'read' },
    { id: 'm5', text: 'Almost there! Doing the second textured layer now.', senderId: '2', timestamp: '03:18 PM', status: 'read' },
    { id: 'm6', text: 'Excellent, thanks for the update.', senderId: 'me', timestamp: '03:20 PM', status: 'read' },
  ],
  '3': [
    { id: 'm7', text: 'Tshepo, the solar system inverter looks outstanding!', senderId: 'me', timestamp: '09:00 AM', status: 'read' },
    { id: 'm8', text: 'Awe my friend! Let us test load-shedding override tests tomorrow.', senderId: '3', timestamp: '09:05 AM', status: 'read' },
  ]
};

interface ContactProfile {
  bio: string;
  skills: string[];
  rate: string;
  location: string;
  rating: number;
}

const MOCK_PROFILES: Record<string, ContactProfile> = {
  '1': {
    bio: 'General Contractor & Site Supervisor with over 8 years experience managing premium construction and renovation tasks. Passionate about safety and robust local engineering.',
    skills: ['Bricklaying', 'Project Management', 'Roofing', 'Plumbing'],
    rate: 'R350 / hr',
    location: 'Johannesburg, GP',
    rating: 4.9
  },
  '2': {
    bio: 'Professional Painter specializing in textured finishes, exterior protective coatings, and high-quality spray painting.',
    skills: ['Interior Painting', 'Wall Texturing', 'Plastering', 'Drywall Repair'],
    rate: 'R220 / hr',
    location: 'Soweto, GP',
    rating: 4.8
  },
  '3': {
    bio: 'Certified Solar Systems & Inverter Installer. Trusted expert for solar PV setups, battery calibration and commercial wiring backup solutions.',
    skills: ['Solar PV Design', 'Backup Inverters', 'Battery Calibration', 'Electrical Wiring'],
    rate: 'R400 / hr',
    location: 'Pretoria, GP',
    rating: 5.0
  }
};

export function ChatView({ onAddMediaToGallery, onCloseChat, initialContactId, onSelectContact, isGuest, onSignUp }: ChatViewProps) {
  const { translateText, t } = useLanguage();
  const [selectedContactId, setSelectedContactId] = useState<string | null>(initialContactId || null);
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);
  const [blockedContacts, setBlockedContacts] = useState<string[]>([]);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showMessagesListDropdown, setShowMessagesListDropdown] = useState(false);
  const [isDeleteSelectionMode, setIsDeleteSelectionMode] = useState(false);
  const [selectedContactsToDelete, setSelectedContactsToDelete] = useState<string[]>([]);
  const [securityAlert, setSecurityAlert] = useState<{ isOpen: boolean; trigger: string } | null>(null);

  const toggleSelectContactToDelete = (id: string) => {
    setSelectedContactsToDelete(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (initialContactId !== undefined) {
      setSelectedContactId(initialContactId);
    }
  }, [initialContactId]);

  if (isGuest) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-gray-50/50">
        <div className="bg-white rounded-3xl max-w-sm w-full p-8 text-center shadow-xl border border-gray-100">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3"><T>Sign in to Message</T></h3>
          <p className="text-gray-600 text-sm mb-8">
            <T>You must register as a member to communicate with other users, send media, and track messages.</T>
          </p>
          <div className="space-y-3">
             <button 
               onClick={onSignUp}
               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-md"
             >
               <T>Sign Up Now</T>
             </button>
             <button 
               onClick={onCloseChat}
               className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-xl transition-colors"
             >
               <T>Go Back</T>
             </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSelectContact = (id: string | null) => {
    setSelectedContactId(id);
    if (onSelectContact) {
      onSelectContact(id);
    }
  };

  // Call State Management
  const [callType, setCallType] = useState<'video' | 'audio' | null>(null);
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<boolean | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const ringtoneTeardownRef = useRef<(() => void) | null>(null);

  // Synth RingTone Generator
  const playRingTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      
      const playToneNode = () => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc1.frequency.setValueAtTime(450, ctx.currentTime);
        osc2.frequency.setValueAtTime(400, ctx.currentTime);
        
        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime + 1.2);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.6);
        
        osc1.start();
        osc2.start();
        
        osc1.stop(ctx.currentTime + 1.8);
        osc2.stop(ctx.currentTime + 1.8);
      };

      playToneNode();
      const interval = setInterval(() => {
        playToneNode();
      }, 2000);
      
      return () => {
        clearInterval(interval);
        ctx.close().catch(() => {});
      };
    } catch (err) {
      console.warn("Web Audio ringtone error:", err);
      return () => {};
    }
  };

  const playConnectTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.frequency.setValueAtTime(550, ctx.currentTime);
      osc.frequency.setValueAtTime(750, ctx.currentTime + 0.1);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
      setTimeout(() => {
        ctx.close().catch(() => {});
      }, 500);
    } catch (err) {
      console.warn("Connect voice tone error:", err);
    }
  };

  const playDisconnectTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.setValueAtTime(280, ctx.currentTime + 0.1);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
      setTimeout(() => {
        ctx.close().catch(() => {});
      }, 500);
    } catch (err) {
      console.warn("Disconnect voice tone error:", err);
    }
  };

  // Live Audio Frequency Visualizer Canvas Thread Setup
  useEffect(() => {
    if (callState === 'connected' && localStream && canvasRef.current) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioCtx();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const source = audioContext.createMediaStreamSource(localStream);
        source.connect(analyser);
        
        audioCtxRef.current = audioContext;
        analyserRef.current = analyser;
        sourceRef.current = source;
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const draw = () => {
          if (!canvasRef.current) return;
          animationFrameId.current = requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw a real responsive wave visualizer
          const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
          grad.addColorStop(0, '#10b981'); // Emerald 500
          grad.addColorStop(0.5, '#6366f1'); // Indigo 500
          grad.addColorStop(1, '#10b981'); // Emerald 500
          
          ctx.strokeStyle = grad;
          ctx.lineWidth = 3;
          ctx.beginPath();
          
          const sliceWidth = canvas.width / bufferLength;
          let x = 0;
          
          for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0; 
            const y = (v * canvas.height) / 2;
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
            
            x += sliceWidth;
          }
          
          ctx.lineTo(canvas.width, canvas.height / 2);
          ctx.stroke();
        };
        
        draw();
      } catch (err) {
        console.warn("Visualizer Context initiation error:", err);
      }
    }
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [callState, localStream]);

  // Sync Video srcObject safely
  useEffect(() => {
    if (callType === 'video' && localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, callType, callState]);

  // Handle Call Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState]);

  // Gracefully clean up stream on unmount
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (ringtoneTeardownRef.current) {
        ringtoneTeardownRef.current();
      }
    };
  }, []);

  const startLocalStream = async (type: 'video' | 'audio', cameraMode: 'user' | 'environment') => {
    try {
      // Clean up previous tracks first
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }

      console.log(`Requesting media: type=${type}, mode=${cameraMode}`);
      // Request audio constraints, and video constraints only if it's a video call
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: type === 'video' ? { 
          facingMode: cameraMode,
          width: { ideal: 640 },
          height: { ideal: 480 }
        } : false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setLocalStream(stream);
      setCameraPermissionGranted(true);
      setCameraError(null);

      // Bind to local video element if it's a video call
      if (type === 'video') {
        setTimeout(() => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }, 100);
      }
    } catch (err: any) {
      console.error("Camera/Mic Permission error:", err);
      setCameraPermissionGranted(false);
      setCameraError(err.message || 'Could not access camera or microphone.');
    }
  };

  const startCall = async (type: 'video' | 'audio') => {
    if (selectedContactId && blockedContacts.includes(selectedContactId)) {
      // Gracefully prevent calling a blocked contact
      return;
    }
    setCallType(type);
    setCallState('calling');
    setCallDuration(0);
    setFacingMode('user');
    setIsMuted(false);
    setIsCameraOff(false);
    setCameraError(null);

    // Play ringing synthesizer sound
    const stopRing = playRingTone();
    ringtoneTeardownRef.current = stopRing;

    // Request stream (asks permission for front/user camera)
    await startLocalStream(type, 'user');

    // Automatically transition to connected to simulate answered status after ring delay
    setTimeout(() => {
      if (ringtoneTeardownRef.current) {
        ringtoneTeardownRef.current();
        ringtoneTeardownRef.current = null;
      }
      playConnectTone();
      setCallState('connected');
    }, 2800);
  };

  const endCall = () => {
    setCallState('ended');
    playDisconnectTone();
    if (ringtoneTeardownRef.current) {
      ringtoneTeardownRef.current();
      ringtoneTeardownRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    setLocalStream(null);
    setTimeout(() => {
      setCallType(null);
      setCallState('idle');
    }, 1500);
  };

  const toggleCameraFacing = async () => {
    if (callType !== 'video') return;
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    await startLocalStream('video', nextMode);
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !nextMuted;
      });
    }
  };

  const toggleCameraOn = () => {
    const nextCameraOff = !isCameraOff;
    setIsCameraOff(nextCameraOff);
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !nextCameraOff;
      });
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isOnlyEmojis = (str?: string) => {
    if (!str) return false;
    const emojiRegex = /^[\s\p{Emoji}\u200d\uFE0F]+$/u;
    const clean = str.replace(/\s/g, '');
    if (!clean) return false;
    if (/^\d+$/.test(clean)) return false;
    return emojiRegex.test(clean);
  };

  const renderEmojiText = (text: string) => {
    const array = Array.from(text);
    const dances = ['emoji-dance', 'emoji-bounce-dance', 'emoji-spin-float'];
    return (
      <span className="flex items-center gap-2 py-1 flex-wrap">
        {array.map((char, i) => {
          const danceClass = dances[i % dances.length];
          return (
            <span 
              key={i} 
              className={`${danceClass} text-5xl leading-none inline-block filter drop-shadow-md select-none hover:scale-130 transition-transform`}
            >
              {char}
            </span>
          );
        })}
      </span>
    );
  };

  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [contacts, setContacts] = useState<ChatContact[]>(MOCK_CONTACTS);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedContact = contacts.find(c => c.id === selectedContactId);
  const currentMessages = selectedContactId ? messages[selectedContactId] || [] : [];

  // Synchronize contacts' last messages with actual message history state
  useEffect(() => {
    setContacts(prevContacts => {
      let changed = false;
      const nextContacts = prevContacts.map(contact => {
        const chatMsgs = messages[contact.id] || [];
        if (chatMsgs.length > 0) {
          const lastMsg = chatMsgs[chatMsgs.length - 1];
          const calculatedText = lastMsg.text || (lastMsg.mediaType === 'image' ? t('Photo') : t('Video'));
          if (contact.lastMessage !== calculatedText || contact.lastMessageTime !== lastMsg.timestamp) {
            changed = true;
            return {
              ...contact,
              lastMessage: calculatedText,
              lastMessageTime: lastMsg.timestamp
            };
          }
        } else {
          if (contact.lastMessage !== t('No messages yet') || contact.lastMessageTime !== '') {
            changed = true;
            return {
              ...contact,
              lastMessage: t('No messages yet'),
              lastMessageTime: ''
            };
          }
        }
        return contact;
      });
      return changed ? nextContacts : prevContacts;
    });
  }, [messages, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleDeleteContact = (contactId: string) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
    if (selectedContactId === contactId) {
      setSelectedContactId(null);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!selectedContactId) return;
    setMessages(prev => {
      const chatMsgs = prev[selectedContactId] || [];
      const updated = chatMsgs.filter(m => m.id !== messageId);
      return {
        ...prev,
        [selectedContactId]: updated
      };
    });
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedContactId) return;

    // TimeGig Anti-Fraud and Scam Abuse Shield Check
    const illegalKeywords = [
      "upfront payment", "upfront fee", "deposit upfront", 
      "western union", "moneygram", "bribe", "buy review", 
      "fake rating", "fake account", "whatsapp outside", "pay outside", 
      "crypto investment", "forex double", "account password", "send pin", 
      "pay deposit", "send deposit", "pay first"
    ];
    
    const textLower = inputText.toLowerCase();
    const matchedKeyword = illegalKeywords.find(word => textLower.includes(word));
    if (matchedKeyword) {
      setSecurityAlert({ isOpen: true, trigger: matchedKeyword });
      return;
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText,
      senderId: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessages(prev => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] || []), newMessage]
    }));
    setInputText('');
    setShowEmojiPicker(false);
    
    // Simulate smart South African response
    setTimeout(simulateReply, 1500);
  };

  const simulateReply = () => {
    if (!selectedContactId) return;
    playNotificationSound();
    const replyMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: 'Awe, got it! 👍 Let us link up later.',
      senderId: selectedContactId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read'
    };
    setMessages(prev => ({
      ...prev,
      [selectedContactId]: [...(prev[selectedContactId] || []), replyMessage]
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && selectedContactId) {
      const file = e.target.files[0];
      const isVideo = file.type.startsWith('video/');
      const reader = new FileReader();

      reader.onload = (event) => {
        const url = event.target?.result as string;
        
        // Add to Chat Messages
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          mediaUrl: url,
          mediaType: isVideo ? 'video' : 'image',
          senderId: 'me',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'sent'
        };
        
        setMessages(prev => ({
          ...prev,
          [selectedContactId]: [...(prev[selectedContactId] || []), newMessage]
        }));
        
        // Add robustly to the system gallery
        const newGalleryItem: GalleryItem = {
          id: `chat_media_${Date.now()}`,
          url: url,
          title: file.name,
          category: 'Chat Attachments',
          likes: 0
        };
        onAddMediaToGallery(newGalleryItem);

        // Simulate fast reply to media
        setTimeout(simulateReply, 1500);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const addEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  return (
    <div className="h-full w-full flex overflow-hidden relative z-10 bg-gray-50/30">
      {/* CSS stylesheet inline injection for dancing emojis */}
      <style>{`
        @keyframes danceLeftRight {
          0% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(4deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(-3px) rotate(-4deg); }
          100% { transform: translateY(0) rotate(0deg); }
        }

        @keyframes bounceDance {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.15) translateY(-8px) rotate(5deg); }
        }

        @keyframes spinFloat {
          0% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(180deg); }
          100% { transform: translateY(0) rotate(360deg); }
        }

        .emoji-dance {
          display: inline-block;
          animation: danceLeftRight 0.8s infinite ease-in-out;
        }

        .emoji-bounce-dance {
          display: inline-block;
          animation: bounceDance 1s infinite ease-in-out;
        }

        .emoji-spin-float {
          display: inline-block;
          animation: spinFloat 1.8s infinite ease-in-out;
        }

        /* Continuous subtle dancing for all picker emojis */
        .emoji-alive {
          display: inline-block;
          transition: transform 0.2s;
        }
        .emoji-alive:hover {
          animation: bounceDance 0.5s infinite ease-in-out !important;
        }
      `}</style>

      {/* Contact List Pane */}
      <div className={`w-full md:w-[350px] lg:w-[400px] border-r border-gray-200/80 flex flex-col bg-white/75 backdrop-blur-md ${selectedContactId ? 'hidden md:flex' : 'flex'}`}>
        {isDeleteSelectionMode ? (
          <div className="p-4 bg-white/90 backdrop-blur-md flex items-center justify-between border-b border-gray-200/80 relative z-30 font-sans">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setIsDeleteSelectionMode(false);
                  setSelectedContactsToDelete([]);
                }} 
                className="text-gray-500 hover:text-gray-700 transition-colors px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-bold text-xs cursor-pointer"
              >
                <T>Cancel</T>
              </button>
              <span className="text-sm font-black text-gray-950">
                {selectedContactsToDelete.length} <T>Selected</T>
              </span>
            </div>
            <button
              disabled={selectedContactsToDelete.length === 0}
              onClick={() => {
                // Delete selected contacts
                setContacts(prev => prev.filter(c => !selectedContactsToDelete.includes(c.id)));
                setMessages(prev => {
                  const updated = { ...prev };
                  selectedContactsToDelete.forEach(cid => {
                    delete updated[cid];
                  });
                  return updated;
                });
                
                // If selectedContactId is in selectedContactsToDelete, set selectedContactId to null
                if (selectedContactId && selectedContactsToDelete.includes(selectedContactId)) {
                  setSelectedContactId(null);
                }
                
                setIsDeleteSelectionMode(false);
                setSelectedContactsToDelete([]);
              }}
              className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1 shadow-sm cursor-pointer ${
                selectedContactsToDelete.length > 0 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-gray-100 text-gray-450 border border-gray-200/50 cursor-not-allowed'
              }`}
            >
              <Trash size={13} />
              <span><T>Delete Selected</T></span>
            </button>
          </div>
        ) : (
          <div className="p-4 bg-white/90 backdrop-blur-md flex items-center justify-between border-b border-gray-200/80 relative z-30">
            <div className="flex items-center gap-2">
              <button onClick={onCloseChat} className="text-gray-500 hover:text-green-600 transition-colors p-2 rounded-full hover:bg-gray-100 cursor-pointer">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-extrabold tracking-tight text-gray-900"><T>Messages</T></h2>
            </div>
            <div className="relative">
              <button 
                onClick={() => setShowMessagesListDropdown(prev => !prev)}
                className="text-gray-500 hover:text-green-600 transition-colors p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
                title={t("Options")}
              >
                <MoreVertical size={20} />
              </button>
              {showMessagesListDropdown && (
                <>
                  <div className="fixed inset-0 z-45 bg-transparent" onClick={() => setShowMessagesListDropdown(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                    <button
                      onClick={() => {
                        setIsDeleteSelectionMode(true);
                        setSelectedContactsToDelete([]);
                        setShowMessagesListDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-sm font-bold flex items-center gap-2 hover:bg-red-50 text-red-650 transition-colors cursor-pointer"
                    >
                      <Trash size={16} className="text-red-500" />
                      <span><T>Select Users to Delete</T></span>
                    </button>
                    <button
                      onClick={() => {
                        setContacts([]);
                        setMessages({});
                        setSelectedContactId(null);
                        setShowMessagesListDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-sm font-bold flex items-center gap-2 hover:bg-red-50 text-red-650 transition-colors cursor-pointer border-t border-gray-100/60"
                    >
                      <Trash size={16} className="text-gray-450" />
                      <span><T>Delete All Messages & Users</T></span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Search */}
        <div className="p-3 border-b border-gray-200/60 bg-gray-50/70">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder={t("Search chats...")} 
              className="w-full bg-white text-gray-900 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none border border-gray-200/80 focus:border-green-600 focus:bg-white transition-all font-semibold shadow-xs"
            />
          </div>
        </div>

        {/* Contacts Lists */}
        <div className="flex-grow overflow-y-auto bg-gray-50/20 no-scrollbar font-sans">
          {contacts.length === 0 ? (
            <div className="text-center p-8 text-gray-400 text-sm font-medium">
              <T>No conversations available.</T>
            </div>
          ) : (
            contacts.map(contact => (
              <div 
                key={contact.id} 
                onClick={() => {
                  if (isDeleteSelectionMode) {
                    toggleSelectContactToDelete(contact.id);
                  } else {
                    handleSelectContact(contact.id);
                  }
                }}
                className={`flex items-center gap-3 p-3.5 cursor-pointer transition-all border-b border-gray-100/40 relative group/item
                  ${selectedContactId === contact.id && !isDeleteSelectionMode ? 'bg-green-50/80 border-l-4 border-l-green-600 text-gray-950 font-bold' : 'hover:bg-gray-100/40 text-gray-700'}
                  ${isDeleteSelectionMode && selectedContactsToDelete.includes(contact.id) ? 'bg-red-50/40' : ''}
                `}
              >
                {/* Custom circular selection checkbox for Select Users to Delete */}
                {isDeleteSelectionMode && (
                  <div className="shrink-0 flex items-center justify-center mr-0.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleSelectContactToDelete(contact.id)}
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                        selectedContactsToDelete.includes(contact.id)
                          ? 'border-red-500 bg-red-500 text-white'
                          : 'border-gray-300 bg-white hover:border-red-400'
                      }`}
                    >
                      {selectedContactsToDelete.includes(contact.id) && (
                        <span className="text-[10px] font-black leading-none">✓</span>
                      )}
                    </button>
                  </div>
                )}

                <div className="relative shrink-0">
                  <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" referrerPolicy="no-referrer" />
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-grow min-w-0 pr-6">
                  <div className="flex justify-between items-center mb-0.5">
                    <h4 className="font-bold text-gray-950 truncate">{contact.name}</h4>
                    <span className={`text-[11px] ${contact.unreadCount > 0 ? 'text-green-600 font-bold' : 'text-gray-400 font-medium'}`}>
                      {contact.lastMessageTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-gray-500 truncate font-medium">{contact.lastMessage}</p>
                    {contact.unreadCount > 0 && (
                      <span className="bg-green-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full min-w-[18px] text-center shadow-xs">
                        {contact.unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Immediate Delete Conversation Button (Hidden in selection mode to avoid visual clash) */}
                {!isDeleteSelectionMode && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteContact(contact.id);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover/item:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full transition-all z-20"
                    title={t("Delete Conversation")}
                  >
                    <Trash size={15} />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Pane */}
      <div className={`flex-grow min-w-0 w-full flex flex-col bg-gray-50/30 backdrop-blur-md relative ${!selectedContactId ? 'hidden md:flex md:items-center md:justify-center' : 'flex'}`}>
        
        {!selectedContactId ? (
          <div className="text-center p-8 z-10 rounded-3xl max-w-sm border border-gray-200 bg-white/90 shadow-lg m-4">
            <div className="w-20 h-20 bg-green-50 border border-green-200/60 rounded-2xl flex items-center justify-center mx-auto mb-5 text-green-600 shadow-xs">
              <MessageSquare size={36} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2"><T>TimeGig Chat</T></h2>
            <p className="text-gray-500 text-sm leading-relaxed font-medium"><T>Connect and collaborate safely with candidates. Select a thread on the left to start messaging.</T></p>
          </div>
        ) : (
          <>
            {/* Ambient glass background pattern */}
            <div className="absolute inset-0 bg-radial-gradient from-green-50/20 to-transparent pointer-events-none opacity-40"></div>

            {/* Chat Header */}
            <div className="bg-white/85 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-200/80 shadow-xs z-30 sticky top-0">
              {/* Click to view candidate full profile information */}
              <div 
                onClick={() => setShowProfileDrawer(prev => !prev)}
                className="flex items-center gap-3 cursor-pointer group"
                title={t("View profile and skills of this user")}
              >
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectContact(null);
                  }}
                  className="md:hidden text-gray-500 hover:text-green-600 transition-colors mr-1 p-1 cursor-pointer"
                >
                  <ArrowLeft size={24} />
                </button>
                <div className="relative group-hover:scale-105 transition-transform duration-200">
                  <img src={selectedContact?.avatar} alt={selectedContact?.name} className="w-10 h-10 rounded-full object-cover border-2 border-green-500/30" referrerPolicy="no-referrer" />
                  {selectedContact?.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-gray-950 text-[15px] leading-tight flex items-center gap-1.5 group-hover:text-green-700 transition-colors">
                    <span>{selectedContact?.name}</span>
                    <span className="text-[9px] font-black bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100/50 px-1.5 py-0.5 rounded uppercase tracking-wider scale-90">
                      <T>View Info</T>
                    </span>
                  </h3>
                  <p className="text-[10px] font-bold text-green-600">{selectedContact?.online ? <T>Online</T> : <T>Offline</T>}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-500">
                <button 
                  onClick={() => startCall('video')}
                  disabled={blockedContacts.includes(selectedContactId)}
                  className={`transition-colors p-2 hover:bg-gray-100/65 rounded-full cursor-pointer ${blockedContacts.includes(selectedContactId) ? 'opacity-30 cursor-not-allowed text-gray-300' : 'hover:text-green-600'}`}
                  title={blockedContacts.includes(selectedContactId) ? t("Unblock user to make video call") : t("Video Call")}
                >
                  <Video size={18} />
                </button>
                <button 
                  onClick={() => startCall('audio')}
                  disabled={blockedContacts.includes(selectedContactId)}
                  className={`transition-colors p-2 hover:bg-gray-100/65 rounded-full cursor-pointer ${blockedContacts.includes(selectedContactId) ? 'opacity-30 cursor-not-allowed text-gray-300' : 'hover:text-green-600'}`}
                  title={blockedContacts.includes(selectedContactId) ? t("Unblock user to call") : t("Voice Call")}
                >
                  <Phone size={18} />
                </button>
                <div className="w-px h-5 bg-gray-200 hidden md:block"></div>
                
                {/* 3 DotsDropdown layout showing context action Block User */}
                <div className="relative">
                  <button 
                    onClick={() => setShowMoreDropdown(prev => !prev)}
                    className="hover:text-gray-900 transition-colors p-2 hover:bg-gray-100/65 rounded-full cursor-pointer"
                    title={t("Options")}
                  >
                    <MoreVertical size={18} />
                  </button>
                  {showMoreDropdown && (
                    <>
                      <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setShowMoreDropdown(false)} />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                      <button
                        onClick={() => {
                          if (selectedContactId) {
                            if (blockedContacts.includes(selectedContactId)) {
                              setBlockedContacts(prev => prev.filter(id => id !== selectedContactId));
                            } else {
                              setBlockedContacts(prev => [...prev, selectedContactId]);
                            }
                          }
                          setShowMoreDropdown(false);
                        }}
                        className="w-full px-4 py-2.5 text-sm font-bold flex items-center gap-2 hover:bg-red-50 text-red-650 transition-colors"
                      >
                        <Shield size={16} />
                        {selectedContactId && blockedContacts.includes(selectedContactId) ? t("Unblock User") : t("Block User")}
                      </button>
                      <button
                        onClick={() => {
                          if (selectedContactId) {
                            setMessages(prev => ({ ...prev, [selectedContactId]: [] }));
                          }
                          setShowMoreDropdown(false);
                        }}
                        className="w-full px-4 py-2.5 text-sm font-semibold flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <T>Clear Chat</T>
                      </button>
                    </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 z-10 flex flex-col no-scrollbar font-sans">
              <div className="flex justify-center mb-6 sticky top-2 z-20">
                <span className="bg-white/95 border border-gray-200/80 text-gray-600 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
                  <T>Today</T>
                </span>
              </div>
              
              {currentMessages.map((msg, index) => {
                const isMe = msg.senderId === 'me';
                const showTail = index === currentMessages.length - 1 || currentMessages[index + 1].senderId !== msg.senderId;
                const onlyEmojis = isOnlyEmojis(msg.text);

                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group/msg relative items-center gap-1.5`}>
                    {!isMe && (
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="opacity-0 group-hover/msg:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full transition-all cursor-pointer shadow-xs bg-white border border-gray-100 shrink-0"
                        title={t("Delete Message")}
                      >
                        <Trash size={12} />
                      </button>
                    )}

                    <div 
                      className={`max-w-[85%] md:max-w-[70%] px-4 py-2.5 relative shadow-sm border ${
                        onlyEmojis
                          ? 'bg-transparent border-none shadow-none px-2 py-1'
                          : isMe 
                            ? 'bg-green-600 text-white border-green-600 rounded-2xl rounded-tr-none' 
                            : 'bg-white text-gray-900 border-gray-200/80 rounded-2xl rounded-tl-none'
                      }`}
                    >
                      {msg.mediaUrl && msg.mediaType === 'image' && (
                        <div className="mb-2 -mx-1 mt-1 rounded-xl overflow-hidden shadow-xs cursor-pointer border border-gray-155 group bg-gray-50">
                          <img src={msg.mediaUrl} alt="attachment" className="max-w-full max-h-64 object-contain transition-transform group-hover:scale-102" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      
                      {msg.mediaUrl && msg.mediaType === 'video' && (
                        <div className="mb-2 -mx-1 mt-1 rounded-xl overflow-hidden shadow-xs border border-gray-155 bg-gray-50">
                          <video src={msg.mediaUrl} controls className="max-w-full max-h-64 object-contain" />
                        </div>
                      )}

                      {msg.text && (
                        onlyEmojis ? (
                          renderEmojiText(msg.text)
                        ) : (
                          <p className="text-[14px] leading-relaxed break-words font-medium">{msg.text}</p>
                        )
                      )}

                      <div className={`flex justify-end items-center gap-1 mt-1 text-[10px] font-bold ${onlyEmojis ? 'text-gray-400' : isMe ? 'text-green-100' : 'text-gray-400'}`}>
                        <span>{msg.timestamp}</span>
                        {isMe && !onlyEmojis && (
                          msg.status === 'read' ? <CheckCheck size={13} className="text-white font-black" /> :
                          msg.status === 'delivered' ? <CheckCheck size={13} className="text-green-100/90" /> :
                          <Check size={13} className="text-green-100/80" />
                        )}
                      </div>
                    </div>

                    {isMe && (
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="opacity-0 group-hover/msg:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full transition-all cursor-pointer shadow-xs bg-white border border-gray-100 shrink-0"
                        title={t("Delete Message")}
                      >
                        <Trash size={12} />
                      </button>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {blockedContacts.includes(selectedContactId) ? (
              <div className="bg-red-50/90 border-t border-red-200/60 p-4 shrink-0 z-10 text-center flex flex-col items-center justify-center gap-2 font-sans">
                <p className="text-sm text-red-600 font-extrabold flex items-center gap-1.5 animate-pulse">
                  <Shield size={18} />
                  <span>You have blocked {selectedContact?.name}</span>
                </p>
                <button
                  onClick={() => setBlockedContacts(prev => prev.filter(id => id !== selectedContactId))}
                  className="bg-red-650 hover:bg-red-700 text-white font-black text-xs px-5 py-2 rounded-xl transition-all shadow-md hover:scale-102"
                >
                  <T>Unblock Contact</T>
                </button>
              </div>
            ) : (
              <div className="bg-white/85 backdrop-blur-md p-2.5 pb-2.5 sm:pb-3 md:p-3 flex flex-col shrink-0 z-10 border-t border-gray-200/80 relative font-sans">
                {showEmojiPicker && (
                  <div className="absolute bottom-full left-2 md:left-4 mb-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 w-64 max-w-[calc(100vw-32px)] flex flex-wrap gap-2.5 z-50">
                     {['👍', '😂', '❤️', '🔥', '👏', '🙌', '🎉', '😢', '😍', '🤔', '😎', '✅', '❌', '👌', '🙏', '💯'].map((emoji, idx) => (
                       <button 
                         key={emoji} 
                         onClick={() => addEmoji(emoji)} 
                         className="text-2xl hover:bg-gray-100 p-1.5 rounded-xl transition-colors cursor-pointer emoji-alive"
                         style={{ animation: `bounceDance ${0.8 + (idx * 0.1) % 0.5}s infinite ease-in-out` }}
                       >
                         {emoji}
                       </button>
                     ))}
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-gray-550 hover:text-green-600 p-2 transition-colors rounded-full hover:bg-gray-100/60 cursor-pointer" aria-label="Add Emoji">
                    <Smile size={22} className={showEmojiPicker ? 'text-green-600 font-bold' : ''} />
                  </button>
                  <div>
                    <button onClick={() => fileInputRef.current?.click()} className="text-gray-550 hover:text-green-600 p-2 transition-colors rounded-full hover:bg-gray-100/60 cursor-pointer text-gray-500">
                      <Paperclip size={22} />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,video/*" className="hidden" />
                  </div>
                  
                  <form onSubmit={handleSend} className="flex-grow min-w-0 bg-gray-50 border border-gray-200/80 rounded-full flex items-center px-4 py-1.5 focus-within:bg-white focus-within:border-green-600/70 transition-all shadow-xs">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={t("Type a message...")}
                      className="w-full bg-transparent outline-none border-none text-gray-900 text-sm placeholder-gray-400 font-medium"
                    />
                  </form>
                  <button 
                    onClick={() => handleSend()}
                    disabled={!inputText.trim()}
                    className={`p-3 rounded-full flex items-center justify-center shadow-xs transition-all shrink-0 cursor-pointer
                      ${inputText.trim() 
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:brightness-105 active:scale-95' 
                        : 'bg-gray-100 text-gray-400 border border-gray-200/30 cursor-not-allowed'}
                    `}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Right side drawer panel for candidate profile information */}
      {selectedContactId && showProfileDrawer && (
        <div className="w-full md:w-80 border-l border-gray-200/85 bg-white shrink-0 flex flex-col z-20 absolute md:relative right-0 top-0 bottom-0 h-full animate-in slide-in-from-right duration-250 shadow-2xl font-sans">
          <div className="p-4 border-b border-gray-200/80 flex justify-between items-center bg-white sticky top-0">
            <h3 className="font-extrabold text-gray-900 text-md uppercase tracking-tight"><T>Candidate Profile</T></h3>
            <button 
              onClick={() => setShowProfileDrawer(false)}
              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-black text-gray-600 transition-colors cursor-pointer"
            >
              <T>Close</T>
            </button>
          </div>
          
          <div className="flex-grow overflow-y-auto p-5 space-y-5 no-scrollbar">
            {/* Display profile avatar and presence */}
            <div className="text-center">
              <img 
                src={selectedContact?.avatar} 
                alt={selectedContact?.name} 
                className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-green-100 shadow-lg mb-3"
                referrerPolicy="no-referrer" 
              />
              <h2 className="text-lg font-black text-gray-950 leading-tight">{selectedContact?.name}</h2>
              <p className="text-[10px] text-green-600 font-extrabold uppercase tracking-widest mt-0.5">
                {selectedContact?.online ? t("Active Member") : t("Offline")}
              </p>
            </div>

            {/* Display core payment & rating info */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-gray-50/80 p-2.5 rounded-2xl border border-gray-100">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider"><T>Hourly Rate</T></p>
                <p className="text-sm font-extrabold text-gray-900 mt-0.5">{MOCK_PROFILES[selectedContactId]?.rate || 'R150 / hr'}</p>
              </div>
              <div className="bg-gray-50/80 p-2.5 rounded-2xl border border-gray-100">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider"><T>Member Rating</T></p>
                <p className="text-sm font-extrabold text-yellow-600 mt-0.5">★ {MOCK_PROFILES[selectedContactId]?.rating || '4.8'}</p>
              </div>
            </div>

            {/* Display detailed candidate biography */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2"><T>About Freelancer</T></p>
              <p className="text-xs text-gray-600 bg-gray-50/50 p-3.5 rounded-xl border border-gray-105 leading-relaxed font-semibold">
                {MOCK_PROFILES[selectedContactId]?.bio}
              </p>
            </div>

            {/* Display tag layout of key skills */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2"><T>Core Verified Skills</T></p>
              <div className="flex flex-wrap gap-1.5">
                {(MOCK_PROFILES[selectedContactId]?.skills || ['General Laborer']).map(skill => (
                  <span 
                    key={skill} 
                    className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Location context */}
            <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span className="text-gray-400"><T>Work Location</T></span>
              <span className="text-slate-900 font-extrabold">{MOCK_PROFILES[selectedContactId]?.location || 'South Africa'}</span>
            </div>

            <div className="bg-green-50 border border-green-200/50 p-3.5 rounded-2xl text-[11px] text-green-800 leading-relaxed font-semibold">
              🔒 <T>TimeGig guarantees secure payments held in digital escrow for all gig works contracted with this member.</T>
            </div>
          </div>
        </div>
      )}

      {/* Immersive Fullscreen Calling Overlay */}
      {callType && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-6 text-white animate-in fade-in zoom-in-95 duration-200 select-none">
          
          {/* Security Banner & Header */}
          <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center mt-4">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/15 border border-green-500/30 text-green-400 text-[11px] uppercase tracking-wider font-extrabold rounded-full mb-4">
              <Shield size={12} />
              <span>Secure End-To-End Encrypted</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">{selectedContact?.name}</h2>
            <p className="text-sm text-gray-400 font-medium mt-1">
              {callState === 'calling' && <T>Connecting Call...</T>}
              {callState === 'connected' && (
                <span className="flex items-center gap-2 bg-slate-900/40 px-3 py-1 rounded-full border border-gray-800 text-green-400 font-bold animate-in zoom-in-50 duration-200">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  {t("Active")} • {formatTime(callDuration)}
                </span>
              )}
              {callState === 'ended' && <span className="text-red-400 font-medium"><T>Call Ended</T></span>}
            </p>
          </div>

          {/* Central Call Surface: Camera/Audio Visualization */}
          <div className="flex-grow w-full max-w-lg mx-auto my-6 bg-slate-900/65 border border-gray-850/60 rounded-3xl overflow-hidden relative shadow-2xl flex flex-col items-center justify-center">
            
            {/* Permission status warning */}
            {cameraPermissionGranted === false && (
              <div className="absolute inset-0 z-40 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center text-red-500 mb-4 animate-bounce">
                  <VideoOff size={28} />
                </div>
                <h4 className="text-lg font-bold text-white mb-2"><T>Camera/Microphone Permission Required</T></h4>
                <p className="text-sm text-gray-400 max-w-xs mb-4 leading-relaxed font-semibold">
                  {cameraError || t("Access to camera/microphone is denied or not supported by your device configuration.")}
                </p>
                <div className="text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-xl font-medium max-w-xs">
                  <T>Please click the lock icon in your browser address bar to grant permission to camera and microphone, then try call again.</T>
                </div>
              </div>
            )}

            {/* Video Call Mode Render */}
            {callType === 'video' && (
              <div className="w-full h-full relative">
                
                {/* Simulated Remote Video Stream on Fullscreen */}
                {callState === 'connected' ? (
                  <div className="w-full h-full relative bg-slate-950 animate-in fade-in duration-300">
                    <img 
                      src={selectedContact?.avatar} 
                      alt={selectedContact?.name} 
                      className="w-full h-full object-cover opacity-60 filter blur-xl scale-110" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="relative">
                        <img 
                          src={selectedContact?.avatar} 
                          alt={selectedContact?.name} 
                          className="w-28 h-28 rounded-full border-4 border-green-500 object-cover shadow-2xl animate-pulse" 
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute bottom-1 right-2 bg-green-500 text-white p-1 rounded-full shadow-xs"><Phone size={14} /></span>
                      </div>
                      <p className="text-white font-bold text-lg mt-3">{selectedContact?.name}</p>
                      
                      {/* Floating glowing real-time sound visualizer wave graph directly onto the screen */}
                      <div className="w-full max-w-xs h-16 mt-6 relative">
                        <canvas ref={canvasRef} width={280} height={60} className="w-full h-full mx-auto" />
                        <span className="absolute -bottom-4 left-0 right-0 text-center text-[9px] text-green-400 font-extrabold uppercase tracking-widest"><T>Hardware Mic Streaming</T></span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950">
                    <img 
                      src={selectedContact?.avatar} 
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-700 animate-pulse" 
                      alt="avatar" 
                      referrerPolicy="no-referrer"
                    />
                    <p className="text-sm text-gray-400 font-bold mt-4 animate-bounce">
                      {t("Ringing")} {selectedContact?.name}...
                    </p>
                  </div>
                )}

                {/* Local Camera Display (As PIP modal or inside preview) */}
                <div className="absolute bottom-4 right-4 w-32 sm:w-40 aspect-video bg-black/85 rounded-2xl border border-white/20 overflow-hidden shadow-2xl z-30">
                  {isCameraOff ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 border border-white/10 text-gray-500">
                      <VideoOff size={18} />
                      <span className="text-[10px] font-bold mt-1 text-center"><T>Camera Off</T></span>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <video 
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform -scale-x-100"
                      />
                      <div className="absolute top-1 left-2 bg-black/50 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider text-green-400 border border-green-500/20 shadow-xs uppercase">
                        {facingMode === 'user' ? t('Front Cam') : t('Back Cam')}
                      </div>
                    </div>
                  )}
                </div>

                {/* Switch Camera Quick-HUD tooltip overlay */}
                <div className="absolute top-4 left-4 right-4 bg-slate-950/75 backdrop-blur-md px-3 py-2.5 rounded-xl text-center border border-white/5 text-[10px] sm:text-xs text-gray-300 font-medium z-10 leading-relaxed font-sans">
                  <span className="text-green-400 font-extrabold"><T>Camera hardware configured</T></span>: <T>Switch between your Front and Back Cameras anytime using the</T> <span className="underline font-bold text-white"><T>Switch Camera</T></span> <T>control below.</T>
                </div>
              </div>
            )}

            {/* Audio Call Mode Render */}
            {callType === 'audio' && (
              <div className="flex flex-col items-center justify-between p-8 text-center w-full h-full bg-gradient-to-b from-slate-900/95 to-slate-955/95 gap-4">
                <div className="my-auto flex flex-col items-center">
                  <div className="relative flex items-center justify-center w-36 h-36">
                    {/* Real visual responsive bouncing ring ripples */}
                    {callState === 'connected' && (
                      <>
                        <div className="absolute inset-0 bg-green-500/15 rounded-full border border-green-500/20 scale-125 animate-ping duration-1500 opacity-70"></div>
                        <div className="absolute inset-0 bg-indigo-500/10 rounded-full border border-indigo-500/20 scale-135 animate-ping duration-2000 opacity-50"></div>
                      </>
                    )}
                    <img 
                      src={selectedContact?.avatar} 
                      alt={selectedContact?.name} 
                      className="w-28 h-28 rounded-full object-cover border-4 border-green-500 relative z-10 shadow-xl" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h3 className="text-xl font-extrabold mt-6">{selectedContact?.name}</h3>
                  <p className="text-xs text-green-400 font-black uppercase mt-1 tracking-widest">
                    {callState === 'calling' ? t('DIALING RECIPIENT...') : t('STABLE CONNECTION')}
                  </p>
                </div>

                {/* Soundwave canvas positioned beautifully inside the container when active */}
                {callState === 'connected' && (
                  <div className="w-full max-w-sm h-24 mb-6 bg-slate-950/40 p-3 rounded-2xl border border-white/5 relative">
                    <canvas ref={canvasRef} width={340} height={80} className="w-full h-full mx-auto" />
                    <span className="absolute bottom-1 right-3 text-[9px] text-green-400 font-bold uppercase tracking-wider"><T>Mic Input Wave</T></span>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Controls Bar */}
          <div className="w-full max-w-lg mx-auto bg-slate-900/85 border border-gray-800/80 rounded-2xl p-4 sm:p-5 flex items-center justify-around mb-4 shadow-xl">
            
            {/* Toggle Mic Button */}
            <button 
              onClick={toggleMute}
              className={`p-3.5 rounded-full transition-all duration-200 cursor-pointer ${
                isMuted 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-gray-200'
              }`}
              title={isMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
            </button>

            {/* Toggle Video Camera Button */}
            {callType === 'video' && (
              <button 
                onClick={toggleCameraOn}
                className={`p-3.5 rounded-full transition-all duration-200 cursor-pointer ${
                  isCameraOff 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-white/10 hover:bg-white/20 text-gray-200'
                }`}
                title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
              >
                {isCameraOff ? <VideoOff size={22} /> : <Video size={22} />}
              </button>
            )}

            {/* Switch Camera Button (Front vs. Back Camera) */}
            {callType === 'video' && (
              <button 
                onClick={toggleCameraFacing}
                className="p-3.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-full transition-all duration-200 flex flex-col items-center justify-center cursor-pointer shadow-md group border border-indigo-500/20"
                title="Switch Front/Back Camera"
              >
                <RefreshCw size={22} className="group-hover:rotate-180 transition-transform duration-500" />
              </button>
            )}

            {/* End Call Button */}
            <button 
              onClick={endCall}
              className="p-3.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-150 transform hover:scale-105 active:scale-95 cursor-pointer shadow-lg animate-pulse"
              title="Hang Up"
            >
              <PhoneOff size={22} />
            </button>

          </div>

          {/* Bottom Device info indicator */}
          <div className="text-center text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wide flex justify-center items-center gap-1 font-mono">
            <Shield size={10} className="text-green-600" />
            <span>TimeGig WebRTC Core Sync v3.5 Live</span>
          </div>

        </div>
      )}

      {/* TimeGig Compliance Shield Scam/Illegal Intervention Alert */}
      {securityAlert?.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 font-sans select-none">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-red-50 text-red-650 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
              <Shield size={32} className="text-red-600 animate-pulse" />
            </div>
            <h3 className="text-md font-black text-gray-900 uppercase tracking-tight">🛑 SECURITY EXCEPTION</h3>
            <p className="text-[10px] text-red-600 font-extrabold uppercase tracking-widest mt-0.5">Scam/Illegal Pattern Intercepted</p>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-gray-100 text-left text-[11px] text-slate-600 font-medium leading-relaxed my-4.5 space-y-2.5">
              <p>
                Your message contained the flagged scam-risk trigger: <strong className="text-slate-900 bg-red-50 px-1 py-0.5 rounded font-mono font-bold select-all">"{securityAlert.trigger}"</strong>.
              </p>
              <p>
                Under South African labor protection guidelines and FICA rules, requesting upfront fees, deposits, or suggesting offline settlements is highly indicative of advance-fee schemes and is strictly forbidden.
              </p>
              <p className="border-t border-dashed border-gray-200 pt-2 text-[10px] font-semibold text-red-650">
                ⚠️ Policy Alert: Repeated off-platform settlements will bind a legal blacklist banner to your SA National ID profile registry.
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setSecurityAlert(null)}
                className="w-full bg-slate-950 hover:bg-slate-900 text-white font-extrabold py-3 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md active:scale-98"
              >
                I Understand, Reset Message
              </button>
              <button
                onClick={() => {
                  setSecurityAlert(null);
                  window.open("https://www.fic.gov.za/", "_blank");
                }}
                className="w-full text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-gray-200 bg-white font-bold py-2.5 text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Read FICA Anti-Fraud Directives
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
