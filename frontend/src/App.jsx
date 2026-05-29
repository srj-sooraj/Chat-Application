import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import Auth from './components/Auth';
import './App.css';

import * as api from './api';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const socket = useRef();

  // Load contacts
  useEffect(() => {
    if (user) {
      const fetchContacts = async () => {
        try {
          const { data } = await api.getContacts(user._id);
          setContacts(data);
        } catch (err) {
          console.error("Error fetching contacts:", err);
        }
      };
      fetchContacts();
    }
  }, [user]);

  // Load messages for active contact
  useEffect(() => {
    if (user && activeContact) {
      const fetchMessages = async () => {
        try {
          const { data } = await api.getMessages(user._id, activeContact._id);
          // Convert stored messages to frontend format
          const formatted = data.map(m => ({
            ...m,
            senderId: m.sender === user._id ? 'me' : m.sender,
            time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));
          setChatMessages(prev => ({
            ...prev,
            [activeContact._id]: formatted
          }));
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      };
      fetchMessages();
    }
  }, [user, activeContact]);

  useEffect(() => {
    if (user) {
      socket.current = io('http://localhost:5000');
      socket.current.emit('join', user._id);

      socket.current.on('receive_message', (data) => {
        setChatMessages(prev => {
          const formattedMsg = { 
            ...data, 
            senderId: data.sender,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          return {
            ...prev,
            [data.sender]: [...(prev[data.sender] || []), formattedMsg]
          };
        });
        
        // Update contact list or refresh if new user
        setContacts(prev => {
           const exists = prev.find(c => c._id === data.sender);
           if (!exists) {
             // In a real app we'd fetch user info here, but for now we wait for manual add or refresh
             return prev; 
           }
           return prev.map(c => 
            c._id === data.sender ? { ...c, lastMessage: data.text, time: 'Just now' } : c
          );
        });
      });

      return () => socket.current.disconnect();
    }
  }, [user]);


  const handleAuthSuccess = (userData) => {
    setUser(userData);
  };

  const handleSelectContact = (contact) => {
    setActiveContact(contact);
  };

  const handleAddContact = (newContact) => {
    setContacts(prev => {
      if (prev.find(c => c.appID === newContact.appID)) return prev;
      return [newContact, ...prev];
    });
  };

  const handleSendMessage = (text) => {
    if (!activeContact || !user) return;

    const messageData = {
      sender: user._id,
      receiver: activeContact._id,
      text,
    };

    socket.current.emit('send_message', messageData);

    // Update local state immediately for the sender
    const newMessage = {
      ...messageData,
      id: Date.now(),
      senderId: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setChatMessages(prev => ({
      ...prev,
      [activeContact._id]: [...(prev[activeContact._id] || []), newMessage]
    }));

    setContacts(prev => prev.map(c => 
      c._id === activeContact._id ? { ...c, lastMessage: text, time: 'Just now' } : c
    ));
  };

  if (!user) return <Auth onAuthSuccess={handleAuthSuccess} />;

  const currentMessages = activeContact ? chatMessages[activeContact._id] || [] : [];

  return (
    <div className="app-container">
      <Sidebar 
        user={user}
        contacts={contacts} 
        onSelectContact={handleSelectContact} 
        activeContactId={activeContact?._id}
        onAddContact={handleAddContact}
      />
      <ChatArea 
        activeContact={activeContact} 
        messages={currentMessages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}

export default App;


