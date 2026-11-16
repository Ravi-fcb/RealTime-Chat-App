import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import MessageInput from './components/MessageInput';
import { useSocket } from './hooks/useSocket';
import './App.css';

export default function App() {
  const [activeChannel, setActiveChannel] = useState('introductions');
  const {
    channelMessages,
    isConnected,
    sendMessage,
    likeMessage,
    activeIdentity,
    setActiveIdentity,
    autoReplyEnabled,
    setAutoReplyEnabled
  } = useSocket();

  const currentMessages = channelMessages[activeChannel] || [];

  return (
    <div className="chat-app-root">
      <div className="chat-main-card">
        {/* Left Sidebar matching mockup with isolated channels */}
        <Sidebar
          activeChannel={activeChannel}
          onSelectChannel={setActiveChannel}
          activeIdentity={activeIdentity}
          onSelectIdentity={setActiveIdentity}
          autoReplyEnabled={autoReplyEnabled}
          onToggleAutoReply={setAutoReplyEnabled}
        />

        {/* Main Chat Conversation Pane */}
        <div className="chat-conversation-pane">
          <ChatHeader
            isConnected={isConnected}
            channelId={activeChannel}
          />
          <MessageList
            messages={currentMessages}
            onLike={(msgId) => likeMessage(msgId, activeChannel)}
          />
          <MessageInput
            onSendMessage={(text) => sendMessage(text, activeChannel)}
            activeChannel={activeChannel}
          />
        </div>
      </div>
    </div>
  );
}
