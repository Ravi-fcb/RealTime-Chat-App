import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { getChannelMembers, getRandomUserForChannel } from '../constants/userList';

const serverHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const SOCKET_SERVER_URL = `http://${serverHost}:4000`;

const INITIAL_CHANNEL_MESSAGES = {
  introductions: [
    {
      id: 'seed-intro-1',
      channel: 'introductions',
      user: 'PubNub Bot',
      text: 'Welcome to Team Chat. 👏👏 Send a message now to start interacting with other users in the app. ⬇️',
      timestamp: '12:16',
      likes: 1
    },
    {
      id: 'seed-intro-2',
      channel: 'introductions',
      user: 'Gregory Goolsby',
      text: 'Hey everyone!',
      timestamp: '17:28',
      likes: 0
    },
    {
      id: 'seed-intro-3',
      channel: 'introductions',
      user: 'Elin Emmanuel',
      text: 'Oh hi, Gregory! Rolande is around, too...',
      timestamp: '17:30',
      likes: 2
    }
  ],
  poland: [
    {
      id: 'seed-pol-1',
      channel: 'poland',
      user: 'Mateusz Kowalski',
      text: 'Dzień dobry team! 🇵🇱 The Warsaw office sprint sync starts at 10:30 CET today.',
      timestamp: '09:15',
      likes: 3
    },
    {
      id: 'seed-pol-2',
      channel: 'poland',
      user: 'Karolina Nowak',
      text: 'Thanks Mateusz! I have updated the Warsaw cloud sprint board and documentation. 📊',
      timestamp: '09:40',
      likes: 2
    },
    {
      id: 'seed-pol-3',
      channel: 'poland',
      user: 'Jakub Wisniewski',
      text: 'Looking forward to it! Fresh coffee brewed in the kitchen if anyone needs a cup ☕️',
      timestamp: '10:05',
      likes: 5
    }
  ],
  india: [
    {
      id: 'seed-ind-1',
      channel: 'india',
      user: 'Priya Patel',
      text: 'Namaste team! 🇮🇳 Deployment of the v2.4 service to Bangalore staging completed with zero downtime.',
      timestamp: '14:10',
      likes: 4
    },
    {
      id: 'seed-ind-2',
      channel: 'india',
      user: 'Rohan Mehta',
      text: 'Super work @Priya! All latency graphs across Mumbai & Hyderabad clusters look blazing fast 🚀',
      timestamp: '14:22',
      likes: 3
    },
    {
      id: 'seed-ind-3',
      channel: 'india',
      user: 'Ananya Iyer',
      text: 'Terrific job everyone! Celebrating with hot chai & samosas at the Bangalore office hub later today 🥟☕',
      timestamp: '14:35',
      likes: 6
    }
  ]
};

const CHANNEL_REPLIES = {
  poland: [
    "Dzięki! Checking this right now 👍",
    "Looks great for the Warsaw sprint! 🚀",
    "Added to our Krakow board agenda 📝",
    "Super! Let's sync about it over coffee ☕"
  ],
  india: [
    "Namaste! Looking into this right away 🙌",
    "Verified in Bangalore staging, all clear! 🚀",
    "Great point, discussing with the Hyderabad team! 💡",
    "Awesome update! See everyone at the tech demo 🥟☕"
  ],
  introductions: [
    "Hey there! Got your message! 👍",
    "Totally agree with that! 🚀",
    "Sounds like a great plan! 💡",
    "Count me in! 🎉"
  ]
};

export function useSocket() {
  const [channelMessages, setChannelMessages] = useState(INITIAL_CHANNEL_MESSAGES);
  const [isConnected, setIsConnected] = useState(false);
  const [activeIdentity, setActiveIdentity] = useState('random');
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 8,
      reconnectionDelay: 2000,
      timeout: 5000
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Connected to Socket.io server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('⚠️ Disconnected from Socket.io server (running in local mode)');
      setIsConnected(false);
    });

    socket.on('connect_error', () => {
      setIsConnected(false);
    });

    // Handle full initial channel messages map
    socket.on('init_channel_messages', (serverChannelMap) => {
      if (serverChannelMap && typeof serverChannelMap === 'object') {
        setChannelMessages(serverChannelMap);
      }
    });

    // Handle incoming message with channel routing
    socket.on('receive_message', (newMsg) => {
      const channel = newMsg.channel || 'introductions';
      setChannelMessages((prev) => {
        const list = prev[channel] || [];
        if (list.some((m) => m.id === newMsg.id)) return prev;
        return {
          ...prev,
          [channel]: [...list, newMsg]
        };
      });
    });

    // Handle like updates
    socket.on('update_like', ({ messageId, channel, likes }) => {
      setChannelMessages((prev) => {
        const updated = { ...prev };
        let found = false;

        // Try direct channel first
        if (channel && updated[channel]) {
          updated[channel] = updated[channel].map((m) => {
            if (m.id === messageId) {
              found = true;
              return { ...m, likes };
            }
            return m;
          });
        }

        // Fallback search all channels if not found
        if (!found) {
          for (const ch of Object.keys(updated)) {
            updated[ch] = updated[ch].map((m) =>
              m.id === messageId ? { ...m, likes } : m
            );
          }
        }

        return updated;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const dispatchMessage = useCallback((newMessage) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('send_message', newMessage);
    } else {
      // Local fallback
      const ch = newMessage.channel || 'introductions';
      setChannelMessages((prev) => ({
        ...prev,
        [ch]: [...(prev[ch] || []), newMessage]
      }));
    }
  }, []);

  // Send message to active channel
  const sendMessage = useCallback((text, currentChannel = 'introductions') => {
    if (!text || !text.trim()) return;

    // Pick appropriate user for this channel
    let sender;
    if (activeIdentity && activeIdentity !== 'random') {
      sender = activeIdentity;
    } else {
      sender = getRandomUserForChannel(currentChannel);
    }

    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const newMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      channel: currentChannel,
      user: sender,
      text: text.trim(),
      timestamp,
      likes: 0
    };

    dispatchMessage(newMessage);

    // Teammate auto-reply for this specific channel
    if (autoReplyEnabled) {
      const channelMembers = getChannelMembers(currentChannel);
      const mentionMatch = text.match(/@(\w+)/);
      let respondent = null;
      let replyText = "";

      if (mentionMatch) {
        const mentioned = mentionMatch[1].toLowerCase();
        const matched = channelMembers.find((u) => u.toLowerCase().includes(mentioned));
        if (matched && matched !== sender) {
          respondent = matched;
          replyText = `Hey @${sender}, got your mention in #${currentChannel}! On it. 👍`;
        }
      }

      if (!respondent && Math.random() > 0.4) {
        const availableTeammates = channelMembers.filter((u) => u !== sender);
        if (availableTeammates.length > 0) {
          respondent = availableTeammates[Math.floor(Math.random() * availableTeammates.length)];
          const replies = CHANNEL_REPLIES[currentChannel] || CHANNEL_REPLIES.introductions;
          replyText = replies[Math.floor(Math.random() * replies.length)];
        }
      }

      if (respondent) {
        setTimeout(() => {
          const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
          const replyMsg = {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            channel: currentChannel,
            user: respondent,
            text: replyText,
            timestamp: replyTime,
            likes: 0
          };
          dispatchMessage(replyMsg);
        }, 1200);
      }
    }
  }, [activeIdentity, autoReplyEnabled, dispatchMessage]);

  // Like message
  const likeMessage = useCallback((messageId, currentChannel = 'introductions') => {
    // Optimistic update
    setChannelMessages((prev) => {
      const updated = { ...prev };
      if (updated[currentChannel]) {
        updated[currentChannel] = updated[currentChannel].map((m) =>
          m.id === messageId ? { ...m, likes: (m.likes || 0) + 1 } : m
        );
      }
      return updated;
    });

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('like_message', { messageId, channel: currentChannel });
    }
  }, []);

  return {
    channelMessages,
    isConnected,
    sendMessage,
    likeMessage,
    activeIdentity,
    setActiveIdentity,
    autoReplyEnabled,
    setAutoReplyEnabled
  };
}
