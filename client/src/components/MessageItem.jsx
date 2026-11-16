import React, { useState } from 'react';
import { getInitials, getUserColor } from '../constants/userList';
import './MessageItem.css';

export default function MessageItem({ message, onLike }) {
  const { id, user = 'Anonymous', text = '', timestamp = '', likes = 0 } = message;
  const [isLikedAnim, setIsLikedAnim] = useState(false);

  const avatarColor = getUserColor(user);
  const initials = getInitials(user);

  const handleLikeClick = () => {
    setIsLikedAnim(true);
    setTimeout(() => setIsLikedAnim(false), 300);
    if (onLike) {
      onLike(id);
    }
  };

  // Helper to highlight @mentions in bold blue text
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;
    const parts = rawText.split(/(@\w+)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('@')) {
        return (
          <span key={idx} className="mention-highlight">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="message-row">
      <div
        className="message-avatar"
        style={{ backgroundColor: avatarColor }}
        title={user}
      >
        {initials}
      </div>

      <div className="message-content-container">
        <div className="message-header-line">
          <span className="message-username">{user}</span>
          <span className="message-timestamp">{timestamp}</span>
        </div>

        <div className="message-bubble-row">
          <div className="message-bubble">
            <div className="message-text">
              {renderFormattedText(text)}
            </div>
            
            <button
              type="button"
              className={`like-button ${likes > 0 ? 'has-likes' : ''} ${isLikedAnim ? 'liked-bounce' : ''}`}
              onClick={handleLikeClick}
              title="Like message"
              aria-label={`Like message, current count ${likes}`}
            >
              <svg
                className="like-icon"
                viewBox="0 0 24 24"
                fill={likes > 0 ? '#ef4444' : 'none'}
                stroke={likes > 0 ? '#ef4444' : '#94a3b8'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span className="like-count">{likes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
