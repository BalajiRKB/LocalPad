import Sidebar from '@/components/Sidebar/Sidebar';
import ChatPanel from '@/components/Chat/ChatPanel';
import NotesPanel from '@/components/Notes/NotesPanel';
import './App.css';

export default function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <ChatPanel />
      </main>
      <aside className="app-notes">
        <NotesPanel />
      </aside>
    </div>
  );
}
