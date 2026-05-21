export interface Gig {
  id: string;
  creatorName: string;
  title: string;
  description: string;
  price: string;
  location: string;
  imageUrl: string;
  postedDate: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  rate: string;
  type: string;
  category: string;
  postedDate: string;
  coinsCost: number;
}

export interface Transaction {
  id: string;
  type: 'incoming' | 'outgoing';
  amount: number;
  description: string;
  date: string;
}

export interface Tender {
  id: string;
  title: string;
  department: string;
  value: string;
  description: string;
  closingDate: string;
  status: 'Open' | 'Closed' | 'Awarded';
  coinsCost: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'other';
  text: string;
  time: string;
}

export interface ChatThread {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: boolean;
  messages: ChatMessage[];
  status: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: string;
  likes: number;
}
