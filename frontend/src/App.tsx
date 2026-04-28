import { useEffect } from 'react'
import Sidebar from '@/components/Sidebar/Sidebar'
import ChatPanel from '@/components/Chat/ChatPanel'
import NotesPanel from '@/components/Notes/NotesPanel'
import { useSpaceStore } from '@/store/spaceStore'

export default function App() {
  const { spaces, fetchSpaces, activeSpaceId } = useSpaceStore()

  useEffect(() => {
    fetchSpaces()
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-[#0f0f0f]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex flex-1 overflow-hidden">
        <ChatPanel />
        <NotesPanel />
      </main>
    </div>
  )
}
