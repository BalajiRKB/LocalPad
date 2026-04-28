import { useSpaceStore } from '@/store/spaceStore';
import { useChatStore } from '@/store/chatStore';
import { useEffect } from 'react';
import './Sidebar.css';

export default function Sidebar() {
  const { spaces, activeSpaceId, fetchSpaces, createSpace, setActiveSpace } = useSpaceStore();
  const { conversations, activeConvId, fetchConversations, createConversation, setActiveConv } = useChatStore();

  useEffect(() => { fetchSpaces(); }, []);
  useEffect(() => { if (activeSpaceId) fetchConversations(activeSpaceId); }, [activeSpaceId]);

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-header">
          <span>Spaces</span>
          <button onClick={() => createSpace('New Space')} title="New Space">+</button>
        </div>
        <ul className="sidebar-list">
          {spaces.map(s => (
            <li key={s.id}
              className={s.id === activeSpaceId ? 'active' : ''}
              onClick={() => setActiveSpace(s.id)}>
              {s.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-header">
          <span>Conversations</span>
          <button onClick={() => activeSpaceId && createConversation(activeSpaceId)} title="New Conversation">+</button>
        </div>
        <ul className="sidebar-list">
          {conversations.map(c => (
            <li key={c.id}
              className={c.id === activeConvId ? 'active' : ''}
              onClick={() => setActiveConv(c.id)}>
              {c.title || 'Untitled'}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
