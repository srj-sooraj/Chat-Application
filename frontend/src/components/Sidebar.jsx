import React, { useState } from 'react';
import { Search, MoreVertical, MessageSquare, Filter, UserPlus, LogOut } from 'lucide-react';
import * as api from '../api';
import './Sidebar.css';

const Sidebar = ({ user, contacts, onSelectContact, activeContactId, onAddContact }) => {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newAppID, setNewAppID] = useState('');
  const [addError, setAddError] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddError('');
    try {
      const { data } = await api.getUserByAppID(newAppID);
      onAddContact(data);
      setIsAdding(false);
      setNewAppID('');
    } catch (err) {
      setAddError('User not found');
    }
  };

  const logout = () => {
    localStorage.removeItem('profile');
    window.location.reload();
  };

  return (
    <div className="sidebar">
      <header className="sidebar-header">
        <div className="header-profile">
          <img src={user.avatar} alt="Profile" className="avatar" />
          <div className="my-info">
             <span className="my-name">{user.name}</span>
             <span className="my-id">ID: {user.appID}</span>
          </div>
        </div>
        <div className="header-actions">
          <UserPlus size={20} className="icon-btn" onClick={() => setIsAdding(!isAdding)} />
          <LogOut size={20} className="icon-btn" onClick={logout} title="Logout" />
        </div>
      </header>

      {isAdding && (
        <form className="add-contact-form" onSubmit={handleAddSubmit}>
          <input 
            type="text" 
            placeholder="Enter App ID to add contact" 
            value={newAppID}
            onChange={(e) => setNewAppID(e.target.value)}
            autoFocus
          />
          {addError && <span className="error">{addError}</span>}
          <button type="submit">Add</button>
        </form>
      )}

      <div className="search-container">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search contacts" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Filter size={18} className="filter-icon" />
      </div>

      <div className="contact-list">
        {filteredContacts.length === 0 && !isAdding && (
          <div className="no-contacts">
            <p>No contacts yet. Add someone using their App ID!</p>
          </div>
        )}
        {filteredContacts.map(contact => (
          <div 
            key={contact._id} 
            className={`contact-item ${activeContactId === contact._id ? 'active' : ''}`}
            onClick={() => onSelectContact(contact)}
          >
            <div className="avatar-container">
              <img src={contact.avatar} alt={contact.name} className="avatar" />
              {contact.online && <span className="online-badge"></span>}
            </div>
            <div className="contact-info">
              <div className="contact-name-row">
                <span className="contact-name">{contact.name}</span>
                <span className="last-message-time">{contact.time || ''}</span>
              </div>
              <div className="contact-message-row">
                <p className="last-message">{contact.lastMessage || 'No messages yet'}</p>
                {contact.unread > 0 && <span className="unread-count">{contact.unread}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

