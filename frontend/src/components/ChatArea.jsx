import React, { useState, useEffect, useRef } from 'react';
import { Phone, Video, Search, MoreVertical, Smile, Paperclip, Mic, Send } from 'lucide-react';
import './ChatArea.css';

const ChatArea = ({ activeContact, messages, onSendMessage }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  if (!activeContact) {
    return (
      <div className="chat-placeholder">
        <div className="placeholder-content">
          <img src="https://api.dicebear.com/7.x/initials/svg?seed=WA" alt="WhatsApp" className="placeholder-logo" />
          <h1>WhatsApp Web</h1>
          <p>Send and receive messages without keeping your phone online.<br/>Use WhatsApp on up to 4 linked devices and 1 phone at the same time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-area">
      <header className="chat-header">
        <div className="chat-header-info">
          <img src={activeContact.avatar} alt={activeContact.name} className="avatar" />
          <div className="header-text">
            <h3>{activeContact.name}</h3>
            <p className="status">{activeContact.online ? 'Online' : 'Last seen today at 9:00 AM'}</p>
          </div>
        </div>
        <div className="header-actions">
          <Video size={20} className="icon-btn" />
          <Phone size={20} className="icon-btn" />
          <div className="divider"></div>
          <Search size={20} className="icon-btn" />
          <MoreVertical size={20} className="icon-btn" />
        </div>
      </header>

      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-bubble ${msg.senderId === 'me' ? 'me' : 'them'}`}>
            <span className="message-text">{msg.text}</span>
            <span className="message-time">
              {msg.time}
              {msg.senderId === 'me' && (
                <span className={`status-ticks ${msg.status}`}>
                  {msg.status === 'read' ? '✓✓' : msg.status === 'delivered' ? '✓✓' : '✓'}
                </span>
              )}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <footer className="chat-input-area">
        <div className="input-options">
          <Smile size={24} className="icon-btn" />
          <Paperclip size={24} className="icon-btn" />
        </div>
        <div className="input-wrapper">
          <input 
            type="text" 
            placeholder="Type a message" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
        </div>
        <div className="input-actions">
          {inputText.trim() ? (
            <Send size={24} className="send-icon" onClick={handleSend} />
          ) : (
            <Mic size={24} className="icon-btn" />
          )}
        </div>
      </footer>
    </div>
  );
};

export default ChatArea;
