import React from 'react';
import { getInitials, getUserColor } from '../constants/userList';
import './MentionList.css';

export default function MentionList({ users = [], selectedIndex = 0, onSelect }) {
  if (!users || users.length === 0) {
    return (
      <div className="mention-dropdown">
        <div className="mention-empty">No matching users</div>
      </div>
    );
  }

  return (
    <div className="mention-dropdown" role="listbox" aria-label="Suggested Users">
      <div className="mention-header">Mention user</div>
      <div className="mention-items">
        {users.map((name, index) => {
          const color = getUserColor(name);
          const initials = getInitials(name);
          const isSelected = index === selectedIndex;

          return (
            <div
              key={name}
              role="option"
              aria-selected={isSelected}
              className={`mention-item ${isSelected ? 'selected' : ''}`}
              onMouseDown={(e) => {
                // Prevent input blur before selection
                e.preventDefault();
                onSelect(name);
              }}
            >
              <div
                className="mention-avatar"
                style={{ backgroundColor: color }}
              >
                {initials}
              </div>
              <span className="mention-name">@{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
