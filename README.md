# Real-time Team Chat Application

A modern single-page React team chat application matching the "Introductions" channel specification and UI reference. Built with **React 18**, **Vite**, **Socket.io**, and **Node.js/Express**.

---

## ✨ Features & Requirements

### 1. Visual & Channel Layout
- **Header**: Channel title **"Introductions"**, subtitle *"This Channel Is For Company Wide Chatter"*, live connection status badge, and member count indicator (`3 | 100`) with team icon.
- **Message Area**: Scrollable thread, automatically scrolling to the latest message.
- **Message Bubbles**: Clean white bubbles (`#ffffff`) with subtle drop shadow, asymmetric rounded corners, user name in bold, and 24h timestamp (`HH:mm`).
- **Avatars**: Circular avatars displaying 1–2 uppercase user initials with consistent, personalized background colors per user matching the screenshot reference.
- **Input Bar**: Rounded pill input bar fixed at the bottom with placeholder *"Type Message"*, smiley emoji trigger button, and send action button.

### 2. Core Behavior
- **Message Sending**: Type message and click **Send** (or press `Enter`).
- **Random User Assignment**: For each message sent, automatically and randomly assigns a user from:
  ```javascript
  const user_list = ["Alan", "Bob", "Carol", "Dean", "Elin"];
  ```
- **Validation**: Whitespace-only or empty messages are ignored; input is cleared immediately upon sending.
- **Like Count Button**: Each message has an interactive heart button at the right end. Clicking it increases the message's like count reactively and animates the icon.

### 3. Stretch Goals (All Implemented)
1. **Emoji Picker**:
   - Built-in emoji picker popover with categorized emojis (Smileys, Gestures, Reactions).
   - Inserts selected emoji directly at the current cursor position in the input textbox.
   - Closes automatically on outside click or `Escape` key.
2. **@mentions Autocomplete**:
   - Typing `@` triggers a suggestion dropdown listing members from `user_list`.
   - Filters in real-time as you continue typing (e.g. `@Al` filters to `Alan`).
   - Arrow keys (`Up` / `Down`) navigate suggestions; `Enter`, `Tab`, or mouse click inserts `@Username `.
   - Sent messages automatically format `@mentions` in bold royal blue text.
3. **Real-time Sync with Socket.io (Node.js + Express backend)**:
   - Dedicated Express server (`/server`) running Socket.io on port 4000.
   - Pub/sub real-time broadcast of newly sent messages to all connected clients.
   - Real-time broadcast and synchronization of like counts across all clients.
   - **Local Fallback**: The client works seamlessly offline even if the Socket.io server is stopped.

---

## 🚀 Quick Start

### 1. Install Dependencies
Run from the root directory to install dependencies for root, client, and server:
```bash
npm run install:all
```
*(Or install individually: `npm install`, `cd client && npm install`, `cd server && npm install`)*

### 2. Start Development Servers
To run both the backend Socket.io server (port 4000) and the React frontend (port 5173) concurrently:
```bash
npm run dev
```

### 3. Run Individually (Optional)
- **Start Backend Server**:
  ```bash
  npm run dev:server
  # Server runs on http://localhost:4000
  ```
- **Start Frontend Client**:
  ```bash
  npm run dev:client
  # Vite dev server runs on http://localhost:5173
  ```

---

## 📁 Project Structure

```
react-chat-app/
├── client/                     # Vite + React Frontend
│   ├── index.html              # HTML entry point with Inter font
│   ├── vite.config.js          # Vite config
│   ├── package.json
│   └── src/
│       ├── main.jsx            # React root
│       ├── App.jsx             # Main chat application layout
│       ├── App.css
│       ├── constants/
│       │   └── userList.js     # user_list, color mapping, initials helper
│       ├── hooks/
│       │   └── useSocket.js    # Socket.io connection hook & local fallback
│       └── components/
│           ├── ChatHeader.jsx  # Channel header and online badge
│           ├── ChatHeader.css
│           ├── MessageList.jsx # Auto-scrolling message thread
│           ├── MessageList.css
│           ├── MessageItem.jsx # Message bubble, avatar, like button & @tagging
│           ├── MessageItem.css
│           ├── MessageInput.jsx# Rounded pill input with @mentions & emoji trigger
│           ├── MessageInput.css
│           ├── EmojiPicker.jsx # Zero-dependency categorized emoji popover
│           ├── EmojiPicker.css
│           ├── MentionList.jsx # Autocomplete popup for @mentions
│           └── MentionList.css
├── server/                     # Node.js + Express + Socket.io Server
│   ├── index.js                # Socket.io pub/sub server (port 4000)
│   └── package.json
├── package.json                # Root scripts and concurrently runner
└── README.md
```

---

## 🧪 Testing Real-Time Functionality
1. Run `npm run dev`.
2. Open `http://localhost:5173` in two different browser windows side by side.
3. Send a message from Window A: observe it instantly appears in Window B with a random user name.
4. Click the like button on Window B: observe the like count instantly increments in Window A.
5. Try typing `@` to verify the mention autocomplete popover.
6. Click the smiley face button to insert emojis into your message.
