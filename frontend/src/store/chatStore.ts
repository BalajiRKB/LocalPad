import { create } from 'zustand'
import { getConversations, createConversation, sendMessage, getMessages, getModels } from '@/lib/api'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

interface Conversation {
  id: number
  title: string
  model: string
  created_at: string
}

interface ChatStore {
  conversations: Conversation[]
  activeConversationId: number | null
  messages: Message[]
  models: string[]
  isLoading: boolean
  fetchConversations: (spaceId: number) => Promise<void>
  fetchMessages: (convId: number) => Promise<void>
  fetchModels: () => Promise<void>
  startConversation: (spaceId: number, model: string) => Promise<void>
  send: (content: string) => Promise<void>
  setActiveConversation: (id: number) => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  models: [],
  isLoading: false,

  fetchConversations: async (spaceId: number) => {
    const { data } = await getConversations(spaceId)
    set({ conversations: data, activeConversationId: data[0]?.id ?? null })
    if (data[0]) await get().fetchMessages(data[0].id)
  },

  fetchMessages: async (convId: number) => {
    const { data } = await getMessages(convId)
    set({ messages: data, activeConversationId: convId })
  },

  fetchModels: async () => {
    const { data } = await getModels()
    set({ models: data })
  },

  startConversation: async (spaceId: number, model: string) => {
    const { data } = await createConversation(spaceId, model)
    set((s) => ({ conversations: [data, ...s.conversations], activeConversationId: data.id, messages: [] }))
  },

  send: async (content: string) => {
    const { activeConversationId } = get()
    if (!activeConversationId) return
    set({ isLoading: true })
    // Optimistic user message
    const tempMsg: Message = { id: Date.now(), role: 'user', content, created_at: new Date().toISOString() }
    set((s) => ({ messages: [...s.messages, tempMsg] }))
    try {
      const { data } = await sendMessage(activeConversationId, content)
      set((s) => ({ messages: [...s.messages, data] }))
    } finally {
      set({ isLoading: false })
    }
  },

  setActiveConversation: (id: number) => {
    get().fetchMessages(id)
  },
}))
