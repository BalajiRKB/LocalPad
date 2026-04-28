import { useState, useEffect } from 'react'
import { useSpaceStore } from '@/store/spaceStore'
import { getMemoryCards } from '@/lib/api'

export default function ContextPreview() {
  const { activeSpaceId } = useSpaceStore()
  const [cards, setCards] = useState<{ id: number; title: string; content: string; is_active: boolean }[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!activeSpaceId) return
    getMemoryCards(activeSpaceId).then(({ data }) => setCards(data.filter((c: any) => c.is_active)))
  }, [activeSpaceId])

  const activeCards = cards.filter((c) => c.is_active)
  if (activeCards.length === 0) return null

  return (
    <div className="px-4 pb-1">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs text-teal-400/70 hover:text-teal-300 transition-colors flex items-center gap-1"
      >
        ⚡ {activeCards.length} memory card{activeCards.length > 1 ? 's' : ''} active
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="mt-2 bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white/60 space-y-2">
          {activeCards.map((card) => (
            <div key={card.id}>
              <span className="text-white/80 font-medium">{card.title}:</span> {card.content}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
