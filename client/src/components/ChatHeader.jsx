import React, { useState } from 'react';
import './ChatHeader.css';

const CHANNEL_METADATA = {
  introductions: {
    title: 'Introductions',
    subtitle: 'This Channel Is For Company Wide Chatter',
    online: 3,
    total: 100
  },
  poland: {
    title: 'Poland Office',
    subtitle: 'Warsaw & Krakow Team Discussions',
    online: 5,
    total: 42
  },
  india: {
    title: 'India Office',
    subtitle: 'Bangalore & Hyderabad Team Discussions',
    online: 8,
    total: 65
  }
};

export default function ChatHeader({ isConnected = false, channelId = 'introductions' }) {
  const [copied, setCopied] = useState(false);
  const channel = CHANNEL_METADATA[channelId] || CHANNEL_METADATA.introductions;

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleOpenSecondWindow = () => {
    window.open(window.location.href, '_blank', 'width=550,height=750');
  };

  return (
    <header className="chat-header">
      <div className="header-left">
        <h1 className="channel-title">{channel.title}</h1>
        <p className="channel-subtitle">{channel.subtitle}</p>
      </div>

      <div className="header-right">
        {/* Multi-user Invite Link Button */}
        <div className="share-btn-group">
          <button
            className="invite-btn"
            onClick={handleCopyLink}
            title="Copy shareable link for others on your network to join"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            <span>{copied ? 'Copied Link!' : 'Share Link'}</span>
          </button>

          <button
            className="multiwindow-btn"
            onClick={handleOpenSecondWindow}
            title="Open a 2nd chat window to test chatting as two people side-by-side"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            <span>2nd Window</span>
          </button>
        </div>

        {/* Live Status Badge */}
        <div
          className={`connection-badge ${isConnected ? 'online' : 'offline'}`}
          title={isConnected ? 'Connected to Socket.io Server (Real-time active)' : 'Running in local fallback mode'}
        >
          <span className="status-dot"></span>
          <span className="status-text">{isConnected ? 'Live' : 'Local'}</span>
        </div>

        {/* Member Count (Matching screenshot "3 | 100") */}
        <div className="member-count-container" title={`${channel.online} online out of ${channel.total} members`}>
          <span className="member-numbers">{channel.online} | {channel.total}</span>
          <svg
            className="users-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
      </div>
    </header>
  );
}
