import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Phone, Video, Send, Smile, Paperclip, ArrowLeft, Check, CheckCheck, MessageSquare, Image as ImageIcon } from 'lucide-react';
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

export function ChatView({ onAddMediaToGallery, onCloseChat, initialContactId, onSelectContact, isGuest, onSignUp }: ChatViewProps) {
  const { translateText, t } = useLanguage();
  const [selectedContactId, setSelectedContactId] = useState<string | null>(initialContactId || null);

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
      {/* Contact List Pane */}
      <div className={`w-full md:w-[350px] lg:w-[400px] border-r border-gray-200/80 flex flex-col bg-white/75 backdrop-blur-md ${selectedContactId ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 bg-white/90 backdrop-blur-md flex items-center justify-between border-b border-gray-200/80">
          <div className="flex items-center gap-2">
            <button onClick={onCloseChat} className="text-gray-500 hover:text-green-600 transition-colors p-2 rounded-full hover:bg-gray-100 cursor-pointer">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-extrabold tracking-tight text-gray-900"><T>Messages</T></h2>
          </div>
          <button className="text-gray-500 hover:text-green-600 transition-colors p-1.5 rounded-full hover:bg-gray-100 cursor-pointer">
            <MoreVertical size={20} />
          </button>
        </div>
        
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
        <div className="flex-grow overflow-y-auto bg-gray-50/20 no-scrollbar">
          {MOCK_CONTACTS.map(contact => (
            <div 
              key={contact.id} 
              onClick={() => handleSelectContact(contact.id)}
              className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors border-b border-gray-100/40
                ${selectedContactId === contact.id ? 'bg-green-50/80 border-l-4 border-l-green-600 text-gray-950 font-bold' : 'hover:bg-gray-100/40 text-gray-700'}
              `}
            >
              <div className="relative shrink-0">
                <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" referrerPolicy="no-referrer" />
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-grow min-w-0">
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
            </div>
          ))}
        </div>
      </div>

      {/* Chat Pane */}
      <div className={`flex-grow flex flex-col bg-gray-50/30 backdrop-blur-md relative ${!selectedContactId ? 'hidden md:flex md:items-center md:justify-center' : 'flex'}`}>
        
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
            <div className="bg-white/85 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-200/80 shadow-xs z-10 sticky top-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleSelectContact(null)}
                  className="md:hidden text-gray-500 hover:text-green-600 transition-colors mr-1 p-1 cursor-pointer"
                >
                  <ArrowLeft size={24} />
                </button>
                <div className="relative">
                  <img src={selectedContact?.avatar} alt={selectedContact?.name} className="w-10 h-10 rounded-full object-cover border border-gray-200" referrerPolicy="no-referrer" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-950 text-[15px] leading-tight">{selectedContact?.name}</h3>
                  <p className="text-[10px] font-bold text-green-600">{selectedContact?.online ? <T>Online</T> : <T>Offline</T>}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <button className="hover:text-green-600 transition-colors p-2 hover:bg-gray-100/65 rounded-full cursor-pointer"><Video size={18} /></button>
                <button className="hover:text-green-600 transition-colors p-2 hover:bg-gray-100/65 rounded-full cursor-pointer"><Phone size={18} /></button>
                <div className="w-px h-5 bg-gray-200 hidden md:block"></div>
                <button className="hover:text-gray-900 transition-colors p-2 hover:bg-gray-100/65 rounded-full hidden md:block cursor-pointer"><MoreVertical size={18} /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 z-10 flex flex-col no-scrollbar">
              <div className="flex justify-center mb-6 sticky top-2 z-20">
                <span className="bg-white/95 border border-gray-200/80 text-gray-600 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-xs">
                  <T>Today</T>
                </span>
              </div>
              
              {currentMessages.map((msg, index) => {
                const isMe = msg.senderId === 'me';
                const showTail = index === currentMessages.length - 1 || currentMessages[index + 1].senderId !== msg.senderId;

                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[85%] md:max-w-[70%] px-4 py-2.5 relative shadow-sm border ${
                        isMe 
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

                      {msg.text && <p className="text-[14px] leading-relaxed break-words font-medium">{msg.text}</p>}
                      <div className={`flex justify-end items-center gap-1 mt-1 text-[10px] font-bold ${isMe ? 'text-green-100' : 'text-gray-400'}`}>
                        <span>{msg.timestamp}</span>
                        {isMe && (
                          msg.status === 'read' ? <CheckCheck size={13} className="text-white font-black" /> :
                          msg.status === 'delivered' ? <CheckCheck size={13} className="text-green-100/90" /> :
                          <Check size={13} className="text-green-100/80" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white/85 backdrop-blur-md p-2 md:p-3 flex flex-col shrink-0 z-10 border-t border-gray-200/80 relative">
              {showEmojiPicker && (
                <div className="absolute bottom-full left-2 md:left-4 mb-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 w-64 max-w-[calc(100vw-32px)] flex flex-wrap gap-2 z-50">
                   {['👍', '😂', '❤️', '🔥', '👏', '🙌', '🎉', '😢', '😍', '🤔', '😎', '✅', '❌', '👌', '🙏', '💯'].map(emoji => (
                     <button key={emoji} onClick={() => addEmoji(emoji)} className="text-2xl hover:bg-gray-100 p-1.5 rounded-xl transition-colors cursor-pointer">{emoji}</button>
                   ))}
                </div>
              )}
              
              {/* Quick Emojis Row for ultra fast replies */}
              <div className="flex gap-2 mb-2 px-1 text-sm justify-start md:justify-center overflow-x-auto no-scrollbar py-0.5 border-b border-gray-150/40">
                {['👍', '😂', '❤️', '🔥', '👏', '🙏', '🎉', '💡', '✅'].map(emoji => (
                  <button 
                    key={emoji} 
                    type="button" 
                    onClick={() => addEmoji(emoji)} 
                    className="bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200/40 px-2.5 py-1 rounded-full text-base transition-transform hover:scale-110 active:scale-95 cursor-pointer text-center flex items-center justify-center min-w-[34px] h-[32px] shrink-0 font-medium"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-2">
                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-gray-550 hover:text-green-600 p-2 transition-colors rounded-full hover:bg-gray-100/60 cursor-pointer" aria-label="Add Emoji">
                  <Smile size={22} className={showEmojiPicker ? 'text-green-600 font-bold' : ''} />
                </button>
                <div>
                  <button onClick={() => fileInputRef.current?.click()} className="text-gray-550 hover:text-green-600 p-2 transition-colors rounded-full hover:bg-gray-100/60 cursor-pointer">
                    <Paperclip size={22} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,video/*" className="hidden" />
                </div>
                
                <form onSubmit={handleSend} className="flex-grow bg-gray-50 border border-gray-200/80 rounded-full flex items-center px-4 py-1.5 focus-within:bg-white focus-within:border-green-600/70 transition-all shadow-xs">
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
          </>
        )}
      </div>
    </div>
  );
}
