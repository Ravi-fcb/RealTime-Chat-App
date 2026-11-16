import React, { useEffect, useRef, useState } from 'react';
import './EmojiPicker.css';

const EMOJI_CATEGORIES = {
  Smileys: [
    '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
    '😊', '😇', '🙂', '😉', '😌', '😍', '🥰', '😘',
    '😋', '😛', '😜', '🤪', '😎', '🥳', '🤩', '🤔',
    '🤫', '🤭', '🥱', '😴', '🙄', '🥺', '😭', '🤯'
  ],
  Gestures: [
    '👏', '🙌', '👍', '👎', '👊', '✊', '🤛', '🤜',
    '🤞', '✌️', '🤟', '🤘', '👌', '🤏', '👈', '👉',
    '👆', '👇', '☝️', '✋', '👋', '🤙', '🤝', '🙏'
  ],
  Reactions: [
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
    '💔', '❣️', '💕', '🔥', '✨', '💯', '⭐', '🌟',
    '💥', '🎉', '🎊', '🎈', '🎁', '🏆', '💡', '⬇️'
  ]
};

export default function EmojiPicker({ onSelectEmoji, onClose }) {
  const [activeCategory, setActiveCategory] = useState('Smileys');
  const pickerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="emoji-picker-popover" ref={pickerRef} role="dialog" aria-label="Emoji Picker">
      <div className="emoji-categories">
        {Object.keys(EMOJI_CATEGORIES).map((cat) => (
          <button
            key={cat}
            type="button"
            className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="emoji-grid">
        {EMOJI_CATEGORIES[activeCategory].map((emoji, index) => (
          <button
            key={`${emoji}-${index}`}
            type="button"
            className="emoji-btn"
            onClick={() => onSelectEmoji(emoji)}
            title={emoji}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
