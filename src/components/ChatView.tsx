import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Phone, Video, Send, Smile, Paperclip, ArrowLeft, Check, CheckCheck, MessageSquare, Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '../types';

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
  { id: '3', name: 'TechCorp Africa', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&q=80', lastMessage: 'Your interview is scheduled.', lastMessageTime: 'Monday', unreadCount: 1, online: true },
];

const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  '1': [
    { id: 'm1', text: 'Hey John, are we still on for the site visit?', senderId: 'me', timestamp: '10:30 AM', status: 'read' },
    { id: 'm2', text: 'Yes, definitely. I will be there by 9 AM.', senderId: '1', timestamp: '10:35 AM', status: 'read' },
    { id: 'm3', text: 'Perfect. See you tomorrow at the site.', senderId: '1', timestamp: '10:42 AM', status: 'read' },
  ],
};

export function ChatView({ onAddMediaToGallery, onCloseChat }: ChatViewProps) {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedContact = MOCK_CONTACTS.find(c => c.id === selectedContactId);
  const currentMessages = selectedContactId ? messages[selectedContactId] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !selectedContactId) return;

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
    <div className="h-[calc(100vh-100px)] md:h-[calc(100vh-130px)] -mx-4 -mt-4 glass-panel flex overflow-hidden rounded-t-2xl md:rounded-2xl shadow-2xl border border-white/20 relative z-10">
      {/* Contact List Pane */}
      <div className={`w-full md:w-[350px] lg:w-[400px] border-r border-white/10 flex flex-col bg-slate-900/40 backdrop-blur-xl ${selectedContactId ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 bg-slate-900/60 backdrop-blur-md flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <button onClick={onCloseChat} className="text-zinc-300 hover:text-green-400 transition-colors p-2 rounded-full hover:bg-white/10 cursor-pointer">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-extrabold tracking-tight text-white">Messages</h2>
          </div>
          <button className="text-zinc-300 hover:text-green-400 transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer">
            <MoreVertical size={20} />
          </button>
        </div>
        
        {/* Search */}
        <div className="p-3 border-b border-white/10 bg-slate-900/20">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-green-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full bg-white/5 text-white rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none border border-white/10 focus:bg-white/10 transition-all font-semibold"
            />
          </div>
        </div>

        {/* Contacts Lists */}
        <div className="flex-grow overflow-y-auto bg-slate-950/20 no-scrollbar">
          {MOCK_CONTACTS.map(contact => (
            <div 
              key={contact.id} 
              onClick={() => setSelectedContactId(contact.id)}
              className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors border-b border-white/[0.05]
                ${selectedContactId === contact.id ? 'bg-green-500/15 border-l-4 border-l-emerald-500 text-white font-bold' : 'hover:bg-white/5 text-zinc-300'}
              `}
            >
              <div className="relative shrink-0">
                <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
                )}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="font-bold text-white truncate">{contact.name}</h4>
                  <span className={`text-[11px] ${contact.unreadCount > 0 ? 'text-emerald-400 font-bold' : 'text-zinc-400 font-medium'}`}>
                    {contact.lastMessageTime}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-zinc-400 truncate">{contact.lastMessage}</p>
                  {contact.unreadCount > 0 && (
                    <span className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full min-w-[18px] text-center shadow-xs">
                      {contact.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Pane */}
      <div className={`flex-grow flex flex-col bg-slate-950/25 backdrop-blur-md relative ${!selectedContactId ? 'hidden md:flex md:items-center md:justify-center' : 'flex'}`}>
        
        {!selectedContactId ? (
          <div className="text-center p-8 z-10 glass-panel rounded-3xl max-w-sm border border-white/10 m-4 bg-slate-900/60 shadow-xl">
            <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 text-emerald-400 shadow-inner">
              <MessageSquare size={36} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">TimeGig Chat</h2>
            <p className="text-zinc-350 text-sm leading-relaxed">Connect and collaborate safely with candidates. Select a thread on the left to start messaging.</p>
          </div>
        ) : (
          <>
            {/* Ambient glass background pattern */}
            <div className="absolute inset-0 bg-radial-gradient from-emerald-550/5 to-transparent pointer-events-none opacity-30"></div>

            {/* Chat Header */}
            <div className="bg-slate-900/70 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-white/10 shadow-xs z-10 sticky top-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedContactId(null)}
                  className="md:hidden text-zinc-300 hover:text-green-400 transition-colors mr-1 p-1 cursor-pointer"
                >
                  <ArrowLeft size={24} />
                </button>
                <div className="relative">
                  <img src={selectedContact?.avatar} alt={selectedContact?.name} className="w-10 h-10 rounded-full object-cover border border-white/15" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-[15px] leading-tight">{selectedContact?.name}</h3>
                  <p className="text-[10px] font-bold text-emerald-455">{selectedContact?.online ? 'Online' : 'Offline'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <button className="hover:text-green-400 transition-colors p-2 hover:bg-white/5 rounded-full cursor-pointer"><Video size={18} /></button>
                <button className="hover:text-green-400 transition-colors p-2 hover:bg-white/5 rounded-full cursor-pointer"><Phone size={18} /></button>
                <div className="w-px h-5 bg-white/10 hidden md:block"></div>
                <button className="hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full hidden md:block cursor-pointer"><MoreVertical size={18} /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 z-10 flex flex-col no-scrollbar">
              <div className="flex justify-center mb-6 sticky top-2 z-20">
                <span className="bg-slate-900/90 border border-white/10 text-zinc-300 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Today
                </span>
              </div>
              
              {currentMessages.map((msg, index) => {
                const isMe = msg.senderId === 'me';
                const showTail = index === currentMessages.length - 1 || currentMessages[index + 1].senderId !== msg.senderId;

                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[85%] md:max-w-[70%] px-4 py-2.5 relative shadow-soft border ${
                        isMe 
                          ? 'bg-emerald-500/20 text-white border-emerald-500/30 rounded-2xl rounded-tr-none' 
                          : 'bg-slate-900/60 text-zinc-100 border-white/10 rounded-2xl rounded-tl-none'
                      }`}
                    >
                      {msg.mediaUrl && msg.mediaType === 'image' && (
                        <div className="mb-2 -mx-1 mt-1 rounded-xl overflow-hidden shadow-md cursor-pointer border border-white/10 group bg-slate-950">
                          <img src={msg.mediaUrl} alt="attachment" className="max-w-full max-h-64 object-contain transition-transform group-hover:scale-102" referrerPolicy="no-referrer" />
                        </div>
                      )}
                      
                      {msg.mediaUrl && msg.mediaType === 'video' && (
                        <div className="mb-2 -mx-1 mt-1 rounded-xl overflow-hidden shadow-md border border-white/10 bg-slate-950">
                          <video src={msg.mediaUrl} controls className="max-w-full max-h-64 object-contain" />
                        </div>
                      )}

                      {msg.text && <p className="text-[14px] leading-relaxed break-words font-medium">{msg.text}</p>}
                      <div className="flex justify-end items-center gap-1 mt-1 text-[10px] text-zinc-400 font-bold">
                        <span>{msg.timestamp}</span>
                        {isMe && (
                          msg.status === 'read' ? <CheckCheck size={13} className="text-emerald-400" /> :
                          msg.status === 'delivered' ? <CheckCheck size={13} /> :
                          <Check size={13} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-slate-900/60 backdrop-blur-md p-3 md:p-4 flex flex-col shrink-0 z-10 border-t border-white/10 relative">
              {showEmojiPicker && (
                <div className="absolute bottom-full left-4 mb-2 bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-4 w-64 flex flex-wrap gap-2 z-50">
                   {['👍', '😂', '❤️', '🔥', '👏', '🙌', '🎉', '😢', '😍', '🤔', '😎', '✅', '❌', '👌', '🙏', '💯'].map(emoji => (
                     <button key={emoji} onClick={() => addEmoji(emoji)} className="text-2xl hover:bg-white/10 p-1.5 rounded-xl transition-colors cursor-pointer">{emoji}</button>
                   ))}
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-zinc-400 hover:text-white p-2 transition-colors hidden md:block rounded-full hover:bg-white/5 cursor-pointer">
                  <Smile size={22} className={showEmojiPicker ? 'text-green-400' : ''} />
                </button>
                <div>
                  <button onClick={() => fileInputRef.current?.click()} className="text-zinc-400 hover:text-white p-2 transition-colors rounded-full hover:bg-white/5 cursor-pointer">
                    <Paperclip size={22} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,video/*" className="hidden" />
                </div>
                
                <form onSubmit={handleSend} className="flex-grow bg-white/5 border border-white/10 rounded-full flex items-center px-4 py-1.5 focus-within:bg-white/10 focus-within:border-green-400/40 transition-all">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-transparent outline-none border-none text-zinc-100 text-sm placeholder-zinc-400"
                  />
                </form>
                <button 
                  onClick={() => handleSend()}
                  disabled={!inputText.trim()}
                  className={`p-3 rounded-full flex items-center justify-center shadow-md transition-all shrink-0 cursor-pointer
                    ${inputText.trim() 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500 scale-100' 
                      : 'bg-white/5 text-zinc-550 border border-white/5 cursor-not-allowed'}
                  `}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
