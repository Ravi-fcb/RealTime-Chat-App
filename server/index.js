import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));

app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Channel-specific messages with distinct conversations & team members
let channelMessages = {
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

// Health check endpoint
app.get('/health', (req, res) => {
  const totalMsgs = Object.values(channelMessages).reduce((acc, msgs) => acc + msgs.length, 0);
  res.json({
    status: 'ok',
    activeConnections: io.engine.clientsCount,
    totalMessages: totalMsgs,
    channels: Object.keys(channelMessages)
  });
});

// REST endpoint to get messages by channel or all
app.get('/api/messages', (req, res) => {
  res.json(channelMessages);
});

app.get('/api/messages/:channel', (req, res) => {
  const ch = req.params.channel;
  res.json(channelMessages[ch] || []);
});

io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  // Send all channels' initial message history
  socket.emit('init_channel_messages', channelMessages);

  // Handle incoming message with channel isolation
  socket.on('send_message', (msg) => {
    if (!msg || !msg.text || !msg.text.trim()) return;

    const channel = msg.channel || 'introductions';
    if (!channelMessages[channel]) {
      channelMessages[channel] = [];
    }

    const newMessage = {
      id: msg.id || `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      channel,
      user: msg.user || 'Alan',
      text: msg.text.trim(),
      timestamp: msg.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      likes: typeof msg.likes === 'number' ? msg.likes : 0
    };

    channelMessages[channel].push(newMessage);
    io.emit('receive_message', newMessage);
    console.log(`[Message][#${channel}] ${newMessage.user}: ${newMessage.text}`);
  });

  // Handle like increment
  socket.on('like_message', (data) => {
    const { messageId, channel } = data || {};
    
    // Find in specified channel or search all channels
    let targetMsg = null;
    let foundChannel = channel;

    if (foundChannel && channelMessages[foundChannel]) {
      targetMsg = channelMessages[foundChannel].find((m) => m.id === messageId);
    }

    if (!targetMsg) {
      for (const [ch, msgs] of Object.entries(channelMessages)) {
        const m = msgs.find((item) => item.id === messageId);
        if (m) {
          targetMsg = m;
          foundChannel = ch;
          break;
        }
      }
    }

    if (targetMsg) {
      targetMsg.likes = (targetMsg.likes || 0) + 1;
      io.emit('update_like', { messageId: targetMsg.id, channel: foundChannel, likes: targetMsg.likes });
      console.log(`[Like][#${foundChannel}] Message ${messageId} count: ${targetMsg.likes}`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Chat server running on http://0.0.0.0:${PORT}`);
});
