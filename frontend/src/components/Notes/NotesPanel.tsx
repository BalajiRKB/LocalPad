import { useState, useEffect } from 'react'
import { useSpaceStore } from '@/store/spaceStore'
import { getNotes, createNote, updateNote, deleteNote } from '@/lib/api'

interface Note {
  id: number
  title: string
  content: string
}

export default function NotesPanel() {
  const { activeSpaceId } = useSpaceStore()
  const [notes, setNotes] = useState<Note[]>([])
  const [selected, setSelected] = useState<Note | null>(null)
  const [search, setSearch] = useState('')

  const fetchNotes = async () => {
    if (!activeSpaceId) return
    const { data } = await getNotes(activeSpaceId, search || undefined)
    setNotes(data)
  }

  useEffect(() => { fetchNotes() }, [activeSpaceId, search])

  const handleNew = async () => {
    if (!activeSpaceId) return
    const { data } = await createNote(activeSpaceId, 'Untitled', '')
    setNotes((n) => [data, ...n])
    setSelected(data)
  }

  const handleUpdate = async (field: 'title' | 'content', value: string) => {
    if (!selected) return
    const updated = { ...selected, [field]: value }
    setSelected(updated)
    setNotes((ns) => ns.map((n) => (n.id === updated.id ? updated : n)))
    await updateNote(selected.id, { [field]: value })
  }

  const handleDelete = async (id: number) => {
    await deleteNote(id)
    setNotes((ns) => ns.filter((n) => n.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <aside className="w-80 flex flex-col bg-[#131313] border-l border-white/8 h-screen">
      <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
        <span className="text-sm font-medium text-white/70">📝 Notes</span>
        <button onClick={handleNew} className="text-xs text-teal-400 hover:text-teal-300 transition-colors">+ New</button>
      </div>

      {/* Search */}
      <div className="px-3 pt-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="w-full bg-white/6 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/30 outline-none"
        />
      </div>

      {/* Note list */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 space-y-1">
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => setSelected(note)}
            className={`px-3 py-2 rounded-lg cursor-pointer group flex items-center justify-between transition-colors ${
              selected?.id === note.id ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
          >
            <span className="text-sm text-white/70 truncate">{note.title || 'Untitled'}</span>
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(note.id) }}
              className="text-white/20 hover:text-red-400 text-xs opacity-0 group-hover:opacity-100 transition-all"
            >
              ✕
            </button>
          </div>
        ))}
        {notes.length === 0 && (
          <p className="text-xs text-white/20 px-2 pt-4">No notes yet. Click + New to create one.</p>
        )}
      </div>

      {/* Note editor */}
      {selected && (
        <div className="border-t border-white/8 flex flex-col" style={{ height: '50%' }}>
          <input
            value={selected.title}
            onChange={(e) => handleUpdate('title', e.target.value)}
            className="px-4 pt-3 pb-1 text-sm font-medium bg-transparent text-white outline-none border-b border-white/8"
            placeholder="Note title"
          />
          <textarea
            value={selected.content}
            onChange={(e) => handleUpdate('content', e.target.value)}
            className="flex-1 px-4 py-3 bg-transparent text-sm text-white/70 outline-none resize-none placeholder-white/20"
            placeholder="Write your note in Markdown..."
          />
        </div>
      )}
    </aside>
  )
}
