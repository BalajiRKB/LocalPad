import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { useChatStore } from '@/store/chatStore'
import ContextPreview from '@/components/Chat/ContextPreview'

export default function ChatPanel() {
  const { messages, send, isLoading } = useChatStore()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || isLoading) return
    setInput('')
    await send(text)
  }

  return (
    <section className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-white/20 text-sm gap-2">
            <span className="text-4xl">🧠</span>
            <p>Start a conversation with your local model.</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${ msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-teal-700/60 text-white'
                  : 'bg-white/8 text-white/90'
              }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/8 px-4 py-3 rounded-xl text-white/40 text-sm animate-pulse">
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Context preview */}
      <ContextPreview />

      {/* Input */}
      <div className="px-4 pb-5 pt-2">
        <div className="flex items-end gap-2 bg-white/6 border border-white/10 rounded-xl px-4 py-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
            }}
            placeholder="Message your local model... (Enter to send)"
            rows={1}
            className="flex-1 bg-transparent resize-none text-sm text-white placeholder-white/30 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-sm disabled:opacity-40 hover:bg-teal-500 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </section>
  )
}
