import { useEffect, useRef, useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import ReactMarkdown from 'react-markdown';
import './ChatPanel.css';

export default function ChatPanel() {
  const { messages, isLoading, activeConvId, fetchMessages, sendMessage } = useChatStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeConvId) fetchMessages(activeConvId);
  }, [activeConvId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !activeConvId) return;
    const text = input;
    setInput('');
    await sendMessage(activeConvId, text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleSend();
  };

  if (!activeConvId) return (
    <div className="chat-empty">
      <p>Select or create a conversation to get started.</p>
    </div>
  );

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role}`}>
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        ))}
        {isLoading && <div className="chat-bubble assistant loading">Thinking…</div>}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <textarea
          className="chat-input"
          rows={3}
          placeholder="Type a message… (Ctrl+Enter to send)"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <button className="chat-send" onClick={handleSend} disabled={isLoading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}
