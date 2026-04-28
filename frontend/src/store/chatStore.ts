import { create } from 'zustand';

const API = 'http://localhost:8000/api';

interface Message { role: 'user' | 'assistant'; content: string; }
interface Conversation { id: number; title: string; model: string; }

interface ChatStore {
  conversations: Conversation[];
  activeConvId: number | null;
  messages: Message[];
  isLoading: boolean;
  fetchConversations: (spaceId: number) => Promise<void>;
  createConversation: (spaceId: number) => Promise<void>;
  setActiveConv: (id: number) => void;
  fetchMessages: (convId: number) => Promise<void>;
  sendMessage: (convId: number, content: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  activeConvId: null,
  messages: [],
  isLoading: false,

  fetchConversations: async (spaceId) => {
    const res = await fetch(`${API}/conversations/space/${spaceId}`);
    const conversations = await res.json();
    set({ conversations, activeConvId: conversations[0]?.id ?? null });
    if (conversations[0]) get().fetchMessages(conversations[0].id);
  },

  createConversation: async (spaceId) => {
    await fetch(`${API}/conversations/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ space_id: spaceId, title: 'New Conversation', model: 'llama3' }),
    });
    get().fetchConversations(spaceId);
  },

  setActiveConv: (id) => {
    set({ activeConvId: id });
    get().fetchMessages(id);
  },

  fetchMessages: async (convId) => {
    const res = await fetch(`${API}/messages/conversation/${convId}`);
    const messages = await res.json();
    set({ messages });
  },

  sendMessage: async (convId, content) => {
    set(s => ({ messages: [...s.messages, { role: 'user', content }], isLoading: true }));
    const res = await fetch(`${API}/messages/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversation_id: convId, content }),
    });
    const data = await res.json();
    set(s => ({ messages: [...s.messages, { role: 'assistant', content: data.content }], isLoading: false }));
  },
}));
