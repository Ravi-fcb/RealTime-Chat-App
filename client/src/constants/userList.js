// Base required list of users for assignment specification (Introductions channel)
export const user_list = ["Alan", "Bob", "Carol", "Dean", "Elin"];

// Distinct team members assigned specifically to each office / group
export const CHANNEL_MEMBERS = {
  introductions: [
    "Alan",
    "Bob",
    "Carol",
    "Dean",
    "Elin"
  ],
  poland: [
    "Mateusz Kowalski",
    "Karolina Nowak",
    "Jakub Wisniewski",
    "Zofia Kaminska",
    "Piotr Zielinski"
  ],
  india: [
    "Aarav Sharma",
    "Priya Patel",
    "Rohan Mehta",
    "Ananya Iyer",
    "Vikram Reddy"
  ]
};

// Preset colors ensuring recognizable, consistent avatar colors per user
export const USER_COLORS = {
  // Introductions & screenshot reference users
  "PubNub Bot": "#d85a5a",       // Coral Red
  "Gregory Goolsby": "#b5c43d",   // Olive Lime
  "Elin Emmanuel": "#e57373",     // Salmon Pink
  "Rolande Raimondi": "#ea7a7a",  // Header / Profile avatar
  "Alan": "#3b82f6",             // Blue
  "Bob": "#f97316",              // Orange
  "Carol": "#10b981",            // Emerald
  "Dean": "#8b5cf6",             // Purple
  "Elin": "#ec4899",             // Pink

  // Poland Office team
  "Mateusz Kowalski": "#2563eb",  // Royal Blue
  "Karolina Nowak": "#7c3aed",    // Violet
  "Jakub Wisniewski": "#d97706",  // Amber
  "Zofia Kaminska": "#0d9488",    // Teal
  "Piotr Zielinski": "#059669",   // Forest Green

  // India Office team
  "Aarav Sharma": "#ea580c",      // Warm Orange
  "Priya Patel": "#db2777",       // Vibrant Magenta
  "Rohan Mehta": "#4f46e5",       // Indigo
  "Ananya Iyer": "#0891b2",       // Cyan
  "Vikram Reddy": "#e11d48"       // Crimson Red
};

// Returns 1-2 uppercase initials (e.g. "Priya Patel" -> "PP", "Alan" -> "AL")
export function getInitials(name = "") {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

// Consistent color generator fallback based on string hash
export function getUserColor(name = "") {
  if (USER_COLORS[name]) {
    return USER_COLORS[name];
  }
  const palette = [
    "#3b82f6", "#10b981", "#f97316", "#8b5cf6", "#ec4899",
    "#06b6d4", "#f59e0b", "#6366f1", "#14b8a6", "#ef4444"
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % palette.length;
  return palette[index];
}

// Get the member list for a given channel
export function getChannelMembers(channelId = 'introductions') {
  return CHANNEL_MEMBERS[channelId] || user_list;
}

// Randomly select a user specific to the current channel
export function getRandomUserForChannel(channelId = 'introductions') {
  const members = getChannelMembers(channelId);
  const index = Math.floor(Math.random() * members.length);
  return members[index];
}
