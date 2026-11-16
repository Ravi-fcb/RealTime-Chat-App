import React, { useState, useRef } from 'react';
import EmojiPicker from './EmojiPicker';
import MentionList from './MentionList';
import { getChannelMembers } from '../constants/userList';
import './MessageInput.css';

export default function MessageInput({ onSendMessage, activeChannel = 'introductions' }) {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);

  const inputRef = useRef(null);

  // Filter members specifically belonging to the active channel
  const channelMembers = getChannelMembers(activeChannel);
  const filteredUsers = channelMembers.filter((u) =>
    u.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  // Check for @ trigger when text or cursor changes
  const handleInputChange = (e) => {
    const newText = e.target.value;
    const cursor = e.target.selectionStart;
    setText(newText);

    const textBeforeCursor = newText.slice(0, cursor);
    const match = textBeforeCursor.match(/(?:^|\s)@([a-zA-Z0-9]*)$/);

    if (match) {
      const query = match[1];
      const atSymbolIndex = textBeforeCursor.lastIndexOf('@');
      setMentionQuery(query);
      setMentionStartIndex(atSymbolIndex);
      setSelectedMentionIndex(0);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  // Insert selected mention
  const handleSelectMention = (username) => {
    if (mentionStartIndex === -1) return;

    const cursor = inputRef.current ? inputRef.current.selectionStart : text.length;
    const beforeMention = text.slice(0, mentionStartIndex);
    const afterMention = text.slice(cursor);
    const inserted = `@${username} `;
    const updated = beforeMention + inserted + afterMention;

    setText(updated);
    setShowMentions(false);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const nextPos = beforeMention.length + inserted.length;
        inputRef.current.setSelectionRange(nextPos, nextPos);
      }
    }, 0);
  };

  // Insert emoji at cursor position
  const handleSelectEmoji = (emoji) => {
    const cursor = inputRef.current ? inputRef.current.selectionStart : text.length;
    const before = text.slice(0, cursor);
    const after = text.slice(cursor);
    const updated = before + emoji + after;

    setText(updated);

    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const nextPos = cursor + emoji.length;
        inputRef.current.setSelectionRange(nextPos, nextPos);
      }
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (showMentions && filteredUsers.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedMentionIndex((prev) => (prev + 1) % filteredUsers.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedMentionIndex((prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        handleSelectMention(filteredUsers[selectedMentionIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowMentions(false);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    onSendMessage(trimmed, activeChannel);

    setText('');
    setShowMentions(false);
    setShowEmojiPicker(false);
  };

  return (
    <div className="chat-input-wrapper">
      {/* Mentions autocomplete dropdown for this channel */}
      {showMentions && (
        <MentionList
          users={filteredUsers}
          selectedIndex={selectedMentionIndex}
          onSelect={handleSelectMention}
        />
      )}

      {/* Emoji picker popover */}
      {showEmojiPicker && (
        <EmojiPicker
          onSelectEmoji={handleSelectEmoji}
          onClose={() => setShowEmojiPicker(false)}
        />
      )}

      <form className="chat-input-pill" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className="chat-text-input"
          placeholder={`Type message in #${activeChannel}`}
          value={text}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {/* Smiley emoji trigger button */}
        <button
          type="button"
          className={`input-action-btn emoji-trigger ${showEmojiPicker ? 'active' : ''}`}
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          title="Insert Emoji"
          aria-label="Insert Emoji"
        >
          <svg
            className="smiley-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.8" />
            <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.8" />
          </svg>
        </button>

        {/* Send message button */}
        <button
          type="submit"
          className={`send-button ${text.trim() ? 'can-send' : ''}`}
          disabled={!text.trim()}
          title="Send message (Enter)"
          aria-label="Send message"
        >
          <svg
            className="send-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </form>
    </div>
  );
}
