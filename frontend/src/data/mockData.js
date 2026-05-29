export const contacts = [
  {
    id: 1,
    name: "John Doe",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    lastMessage: "See you later!",
    time: "10:30 AM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
    lastMessage: "Did you check the report?",
    time: "9:45 AM",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Family Group",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=FG",
    lastMessage: "Mom: Dinner is ready!",
    time: "Yesterday",
    unread: 5,
    online: false,
  },
  {
    id: 4,
    name: "Alice Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    lastMessage: "That was funny 😂",
    time: "Monday",
    unread: 0,
    online: true,
  },
  {
    id: 5,
    name: "Bob Wilson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    lastMessage: "I'll be there in 5 mins",
    time: "Sunday",
    unread: 0,
    online: false,
  }
];

export const messages = {
  1: [
    { id: 101, text: "Hey! How's it going?", senderId: 1, time: "10:25 AM", status: "read" },
    { id: 102, text: "I'm doing great, how about you?", senderId: "me", time: "10:26 AM", status: "read" },
    { id: 103, text: "Just finished the layout for the new project.", senderId: 1, time: "10:27 AM", status: "read" },
    { id: 104, text: "Awesome! Can't wait to see it.", senderId: "me", time: "10:28 AM", status: "read" },
    { id: 105, text: "See you later!", senderId: 1, time: "10:30 AM", status: "read" },
  ],
  2: [
    { id: 201, text: "Hi, did you get the email?", senderId: 2, time: "9:00 AM", status: "read" },
    { id: 202, text: "Yes, reviewing it now.", senderId: "me", time: "9:05 AM", status: "read" },
    { id: 203, text: "Did you check the report?", senderId: 2, time: "9:45 AM", status: "read" },
  ],
  // ... more messages if needed
};
