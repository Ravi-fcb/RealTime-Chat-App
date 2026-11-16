import React, { useState } from 'react';
import { CHANNEL_MEMBERS } from '../constants/userList';
import './Sidebar.css';

const CHANNELS = [
  {
    id: 'poland',
    name: 'Poland Office',
    team: 'Mateusz, Karolina, Jakub...',
    membersCount: 42
  },
  {
    id: 'introductions',
    name: 'Introductions',
    team: 'Alan, Bob, Carol, Dean, Elin',
    membersCount: 100
  },
  {
    id: 'india',
    name: 'India Office',
    team: 'Priya, Rohan, Aarav, Ananya...',
    membersCount: 65
  }
];

export default function Sidebar({
  activeChannel = 'introductions',
  onSelectChannel,
  activeIdentity,
  onSelectIdentity,
  autoReplyEnabled,
  onToggleAutoReply
}) {
  const [showIdentityMenu, setShowIdentityMenu] = useState(false);

  // Available identities for current channel + defaults
  const currentChannelUsers = CHANNEL_MEMBERS[activeChannel] || [];

  return (
    <aside className="chat-sidebar">
      {/* User Profile Header (matching screenshot) */}
      <div
        className="sidebar-profile"
        onClick={() => setShowIdentityMenu(!showIdentityMenu)}
        title="Click to change your chatting persona"
      >
        <div className="profile-avatar-container">
          <div className="profile-avatar">RR</div>
          <span className="profile-online-badge"></span>
        </div>
        <div className="profile-info">
          <span className="profile-name">Rolande Raimondi</span>
          <span className="profile-role">
            {activeIdentity === 'random' ? 'Chatting as: 🎲 Random' : `Chatting as: ${activeIdentity}`}
          </span>
        </div>
        <span className="profile-dropdown-arrow">{showIdentityMenu ? '▲' : '▼'}</span>
      </div>

      {/* Identity Selector Menu */}
      {showIdentityMenu && (
        <div className="identity-popup">
          <div className="identity-header">Chat As:</div>
          <button
            className={`identity-option ${activeIdentity === 'random' ? 'active' : ''}`}
            onClick={() => {
              onSelectIdentity('random');
              setShowIdentityMenu(false);
            }}
          >
            🎲 Random Member ({activeChannel} group)
          </button>
          <button
            className={`identity-option ${activeIdentity === 'Rolande Raimondi' ? 'active' : ''}`}
            onClick={() => {
              onSelectIdentity('Rolande Raimondi');
              setShowIdentityMenu(false);
            }}
          >
            Rolande Raimondi (Profile)
          </button>

          <div className="identity-divider">Team in this channel:</div>
          {currentChannelUsers.map((name) => (
            <button
              key={name}
              className={`identity-option ${activeIdentity === name ? 'active' : ''}`}
              onClick={() => {
                onSelectIdentity(name);
                setShowIdentityMenu(false);
              }}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {/* Conversations Section */}
      <div className="conversations-header">
        <span className="conversations-title">Conversations</span>
        <button
          className="add-conversation-btn"
          title="Add conversation"
          onClick={() => alert('New channels can be added!')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      {/* Channel List */}
      <nav className="channel-list">
        {CHANNELS.map((channel) => {
          const isActive = activeChannel === channel.id;
          return (
            <button
              key={channel.id}
              className={`channel-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectChannel && onSelectChannel(channel.id)}
            >
              <span className="channel-hash">#</span>
              <div className="channel-item-text">
                <span className="channel-name">{channel.name}</span>
                <span className="channel-team-snippet">{channel.team}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Multi-user helper / Group chat simulator */}
      <div className="sidebar-footer">
        <div className="footer-card">
          <div className="footer-card-header">
            <span className="footer-card-title">🤖 Teammate Replies</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={autoReplyEnabled}
                onChange={(e) => onToggleAutoReply(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
          <p className="footer-card-desc">
            When enabled, teammates specific to the active channel will reply back to your messages & @mentions!
          </p>
        </div>
      </div>
    </aside>
  );
}
