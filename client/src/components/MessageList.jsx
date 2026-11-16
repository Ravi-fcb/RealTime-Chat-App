import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import './MessageList.css';

export default function MessageList({ messages = [], onLike }) {
  const bottomAnchorRef = useRef(null);

  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main className="message-list-container">
      <div className="message-list-inner">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            onLike={onLike}
          />
        ))}
        <div ref={bottomAnchorRef} className="scroll-anchor" />
      </div>
    </main>
  );
}
