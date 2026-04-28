import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Spaces
export const getSpaces = () => api.get('/spaces/')
export const createSpace = (name: string) => api.post('/spaces/', { name })
export const deleteSpace = (id: number) => api.delete(`/spaces/${id}`)

// Conversations
export const getConversations = (spaceId: number) => api.get(`/conversations/space/${spaceId}`)
export const createConversation = (spaceId: number, model: string) =>
  api.post('/conversations/', { space_id: spaceId, model })
export const deleteConversation = (id: number) => api.delete(`/conversations/${id}`)
export const getModels = () => api.get('/conversations/models')

// Messages
export const getMessages = (convId: number) => api.get(`/messages/${convId}`)
export const sendMessage = (conversationId: number, content: string) =>
  api.post('/messages/send', { conversation_id: conversationId, content })

// Notes
export const getNotes = (spaceId: number, search?: string) =>
  api.get(`/notes/space/${spaceId}`, { params: search ? { search } : {} })
export const createNote = (spaceId: number, title: string, content: string) =>
  api.post('/notes/', { space_id: spaceId, title, content })
export const updateNote = (id: number, updates: { title?: string; content?: string }) =>
  api.patch(`/notes/${id}`, updates)
export const deleteNote = (id: number) => api.delete(`/notes/${id}`)

// Memory Cards
export const getMemoryCards = (spaceId: number) => api.get(`/memory/space/${spaceId}`)
export const createMemoryCard = (spaceId: number, title: string, content: string) =>
  api.post('/memory/', { space_id: spaceId, title, content })
export const updateMemoryCard = (id: number, updates: object) => api.patch(`/memory/${id}`, updates)
export const deleteMemoryCard = (id: number) => api.delete(`/memory/${id}`)
