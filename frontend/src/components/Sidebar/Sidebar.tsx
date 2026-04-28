import { useEffect } from 'react'
import { useSpaceStore } from '@/store/spaceStore'
import { useChatStore } from '@/store/chatStore'

export default function Sidebar() {
  const { spaces, activeSpaceId, setActiveSpace, addSpace } = useSpaceStore()
  const { conversations, fetchConversations, startConversation, setActiveConversation, activeConversationId, fetchModels, models } = useChatStore()

  useEffect(() => {
    if (activeSpaceId) fetchConversations(activeSpaceId)
  }, [activeSpaceId])

  useEffect(() => { fetchModels() }, [])

  const handleNewChat = async () => {
    if (!activeSpaceId) return
    const model = models[0] ?? 'llama3'
    await startConversation(activeSpaceId, model)
  }

  return (
    <aside className="w-64 flex flex-col bg-[#141414] border-r border-white/8 h-screen">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/8">
        <span className="text-white font-semibold text-base tracking-tight">🧠 LocalPad</span>
      </div>

      {/* Spaces */}
      <div className="px-3 pt-4 pb-2">
        <p className="text-xs text-white/40 uppercase tracking-wider mb-2 px-1">Spaces</p>
        <div className="flex flex-col gap-1">
          {spaces.map((sp) => (
            <button
              key={sp.id}
              onClick={() => setActiveSpace(sp.id)}
              className={`text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                activeSpaceId === sp.id ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              {sp.name}
            </button>
          ))}
          <button
            onClick={() => {
              const name = prompt('Space name:')
              if (name) addSpace(name)
            }}
            className="text-left px-3 py-1.5 rounded-md text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            + New Space
          </button>
        </div>
      </div>

      <div className="px-3 py-2 border-t border-white/8 mt-1">
        <button
          onClick={handleNewChat}
          className="w-full px-3 py-2 rounded-md bg-teal-700/80 text-white text-sm hover:bg-teal-600 transition-colors"
        >
          + New Chat
        </button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <p className="text-xs text-white/40 uppercase tracking-wider mb-2 px-1">Chats</p>
        <div className="flex flex-col gap-0.5">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={`text-left px-3 py-2 rounded-md text-sm truncate transition-colors ${
                activeConversationId === conv.id ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              {conv.title}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
