import { useEffect, useState } from 'react';
import { useSpaceStore } from '@/store/spaceStore';
import './NotesPanel.css';

interface Note {
  id: number;
  title: string;
  content: string;
}

const API = 'http://localhost:8000/api';

export default function NotesPanel() {
  const { activeSpaceId } = useSpaceStore();
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const fetchNotes = async () => {
    if (!activeSpaceId) return;
    const res = await fetch(`${API}/notes/space/${activeSpaceId}`);
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => { fetchNotes(); }, [activeSpaceId]);

  const saveNote = async () => {
    if (!activeSpaceId || !title.trim()) return;
    if (activeNote) {
      await fetch(`${API}/notes/${activeNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });
    } else {
      await fetch(`${API}/notes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ space_id: activeSpaceId, title, content }),
      });
    }
    fetchNotes();
  };

  const selectNote = (note: Note) => {
    setActiveNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const newNote = () => {
    setActiveNote(null);
    setTitle('');
    setContent('');
  };

  return (
    <div className="notes-panel">
      <div className="notes-list">
        <div className="notes-list-header">
          <span>Notes</span>
          <button onClick={newNote}>+</button>
        </div>
        {notes.map(n => (
          <div key={n.id}
            className={`note-item ${activeNote?.id === n.id ? 'active' : ''}`}
            onClick={() => selectNote(n)}>
            {n.title || 'Untitled'}
          </div>
        ))}
      </div>

      <div className="notes-editor">
        <input
          className="note-title-input"
          placeholder="Note title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="note-content-input"
          placeholder="Write your note here…"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button className="note-save-btn" onClick={saveNote}>Save</button>
      </div>
    </div>
  );
}
