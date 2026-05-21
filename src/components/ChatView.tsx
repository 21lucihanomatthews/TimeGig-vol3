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
    
    // Simulate reply
    setTimeout(simulateReply, 1500);
  };

  const simulateReply = () => {
    if (!selectedContactId) return;
    const replyMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: 'Awe, got it! 👍',
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
        
        // Add to Gallery
        const newGalleryItem: GalleryItem = {
          id: `chat_media_${Date.now()}`,
          url: url,
          title: file.name,
          category: 'Chat Uploads',
          likes: 0
        };
        onAddMediaToGallery(newGalleryItem);

        // Simulate reply to image
        setTimeout(simulateReply, 1500);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const addEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
  };

  return (
    <div className="h-[calc(100vh-90px)] md:h-[calc(100vh-120px)] -mx-4 -mt-4 bg-gray-50 flex overflow-hidden rounded-t-2xl md:rounded-2xl shadow-xl border border-gray-200">
      {/* Contact List Pane */}
      <div className={`w-full md:w-[350px] lg:w-[400px] border-r border-gray-200 flex flex-col bg-white ${selectedContactId ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 bg-gray-50 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button onClick={onCloseChat} className="text-gray-500 hover:text-green-600 transition-colors p-2 rounded-full hover:bg-gray-200">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">Messages</h2>
          </div>
          <button className="text-gray-500 hover:text-green-600 transition-colors p-2 rounded-full hover:bg-gray-200">
            <MoreVertical size={20} />
          </button>
        </div>
        
        {/* Search */}
        <div className="p-3 border-b border-gray-200 bg-white">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search chats" 
              className="w-full bg-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-green-400 focus:shadow-sm transition-all placeholder-gray-500 font-medium"
            />
          </div>
        </div>

        {/* Contacts Lists */}
        <div className="flex-1 overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-200">
          {MOCK_CONTACTS.map(contact => (
            <div 
              key={contact.id} 
              onClick={() => setSelectedContactId(contact.id)}
              className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors border-b border-gray-50
                ${selectedContactId === contact.id ? 'bg-green-50/50' : 'hover:bg-gray-50'}
              `}
            >
              <div className="relative shrink-0">
                <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
                {contact.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="font-bold text-gray-900 truncate">{contact.name}</h4>
                  <span className={`text-xs ${contact.unreadCount > 0 ? 'text-green-600 font-bold' : 'text-gray-400 font-medium'}`}>
                    {contact.lastMessageTime}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
                  {contact.unreadCount > 0 && (
                    <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
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
      <div className={`flex-1 flex flex-col bg-[#e5ddd5] relative ${!selectedContactId ? 'hidden md:flex md:items-center md:justify-center' : 'flex'}`}>
        
        {!selectedContactId ? (
          <div className="text-center p-8 z-10 bg-white/80 backdrop-blur rounded-3xl shadow-xs border border-white max-w-sm">
            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-green-600 shadow-inner">
              <MessageSquare size={36} />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-2">TimeGig Chat</h2>
            <p className="text-gray-500 text-sm leading-relaxed">Connect and collaborate safely. Select a contact to start messaging.</p>
          </div>
        ) : (
          <>
            {/* Background Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")',
                pointerEvents: 'none'
              }}
            ></div>

            {/* Chat Header */}
            <div className="bg-white/95 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-b border-gray-200 shadow-sm z-10 sticky top-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setSelectedContactId(null)}
                  className="md:hidden text-gray-500 hover:text-green-600 transition-colors mr-1 p-1"
                >
                  <ArrowLeft size={24} />
                </button>
                <div className="relative">
                  <img src={selectedContact?.avatar} alt={selectedContact?.name} className="w-10 h-10 rounded-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">{selectedContact?.name}</h3>
                  <p className="text-[11px] font-semibold text-green-600">{selectedContact?.online ? 'Online' : 'Offline'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4 text-gray-500">
                <button className="hover:text-green-600 transition-colors p-2 hover:bg-gray-100 rounded-full"><Video size={20} /></button>
                <button className="hover:text-green-600 transition-colors p-2 hover:bg-gray-100 rounded-full"><Phone size={20} /></button>
                <div className="w-px h-6 bg-gray-200 hidden md:block"></div>
                <button className="hover:text-gray-800 transition-colors p-2 hover:bg-gray-100 rounded-full hidden md:block"><MoreVertical size={20} /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 z-10 flex flex-col">
              <div className="flex justify-center mb-6 sticky top-2 z-20">
                <span className="bg-white/90 backdrop-blur text-gray-600 text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm border border-gray-100 uppercase tracking-widest">
                  Today
                </span>
              </div>
              
              {currentMessages.map((msg, index) => {
                const isMe = msg.senderId === 'me';
                const showTail = index === currentMessages.length - 1 || currentMessages[index + 1].senderId !== msg.senderId;

                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[85%] md:max-w-[70%] px-4 py-2 relative shadow-sm
                        ${isMe ? 'bg-[#dcf8c6] text-gray-900' : 'bg-white text-gray-900'}
                        ${showTail && isMe ? 'rounded-2xl rounded-br-sm' : ''}
                        ${showTail && !isMe ? 'rounded-2xl rounded-bl-sm' : ''}
                        ${!showTail ? 'rounded-2xl' : ''}
                      `}
                    >
                      {/* Tail svg for WhatsApp look */}
                      {showTail && isMe && (
                        <svg viewBox="0 0 8 13" width="8" height="13" className="absolute top-0 -right-[7px] text-[#dcf8c6] fill-current">
                          <path d="M5.188 1H0v11.196l4.467-5.583a4.004 4.004 0 00.72-2.434V1z" />
                        </svg>
                      )}
                      {showTail && !isMe && (
                        <svg viewBox="0 0 8 13" width="8" height="13" className="absolute top-0 -left-[7px] text-white fill-current">
                          <path d="M2.812 1H8v11.196L3.533 6.613a4.004 4.004 0 01-.72-2.434V1z" />
                        </svg>
                      )}

                      {msg.mediaUrl && msg.mediaType === 'image' && (
                        <div className="mb-2 -mx-1 mt-1 rounded-xl overflow-hidden shadow-xs cursor-pointer">
                          <img src={msg.mediaUrl} alt="attachment" className="max-w-full max-h-64 object-contain" />
                        </div>
                      )}
                      
                      {msg.mediaUrl && msg.mediaType === 'video' && (
                        <div className="mb-2 -mx-1 mt-1 rounded-xl overflow-hidden shadow-xs">
                          <video src={msg.mediaUrl} controls className="max-w-full max-h-64 object-contain" />
                        </div>
                      )}

                      {msg.text && <p className="text-[15px] leading-relaxed break-words">{msg.text}</p>}
                      <div className={`flex justify-end items-center gap-1.5 mt-1 -mb-1 ${isMe ? 'text-green-800/60' : 'text-gray-400'}`}>
                        <span className="text-[10px] font-medium">{msg.timestamp}</span>
                        {isMe && (
                          msg.status === 'read' ? <CheckCheck size={14} className="text-blue-500" /> :
                          msg.status === 'delivered' ? <CheckCheck size={14} /> :
                          <Check size={14} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-[#f0f2f5] p-3 md:p-4 flex flex-col shrink-0 z-10 border-t border-gray-200 relative">
              {showEmojiPicker && (
                <div className="absolute bottom-full left-4 mb-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 w-64 flex flex-wrap gap-2 z-50">
                   {['👍', '😂', '❤️', '🔥', '👏', '🙌', '🎉', '😢', '😍', '🤔', '😎', '✅', '❌', '👌', '🙏', '💯'].map(emoji => (
                     <button key={emoji} onClick={() => addEmoji(emoji)} className="text-2xl hover:bg-gray-100 p-2 rounded-xl transition-colors">{emoji}</button>
                   ))}
                </div>
              )}
              
              <div className="flex items-end gap-2">
                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-gray-500 hover:text-gray-800 p-2.5 transition-colors hidden md:block rounded-full hover:bg-gray-200/50">
                  <Smile size={24} className={showEmojiPicker ? 'text-green-600' : ''} />
                </button>
                <div className="relative group">
                  <button onClick={() => fileInputRef.current?.click()} className="text-gray-500 hover:text-gray-800 p-2.5 transition-colors rounded-full hover:bg-gray-200/50">
                    <Paperclip size={24} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,video/*" className="hidden" />
                </div>
                
                <form onSubmit={handleSend} className="flex-1 relative bg-white rounded-3xl shadow-sm border border-gray-100 flex items-end">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Type a message..."
                    className="w-full bg-transparent py-3 px-5 max-h-32 outline-none resize-none border-none text-[15px]"
                    rows={1}
                  />
                </form>
                <button 
                  onClick={() => handleSend()}
                  disabled={!inputText.trim()}
                  className={`p-3 md:p-3.5 rounded-full flex items-center justify-center shadow-md transition-all shrink-0
                    ${inputText.trim() 
                      ? 'bg-green-600 text-white hover:bg-green-700 pointer-events-auto transform hover:scale-105 active:scale-95' 
                      : 'bg-green-600/50 text-white pointer-events-none'}
                  `}
                >
                  <Send size={20} className="ml-0.5 md:ml-1" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
