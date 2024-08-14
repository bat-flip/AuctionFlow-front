import React, { useState } from 'react';
import './talk.css';

function TalkPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]); // State for chat messages
  const [newMessage, setNewMessage] = useState(''); // State for new message input

  const users = [
    { id: 1, name: '으뱌뱌', profilePic: 'https://i.pinimg.com/564x/49/83/87/49838777cfffa05a18681a83b1f80a71.jpg' },
    { id: 2, name: 'dodhddl', profilePic: 'https://i.pinimg.com/564x/eb/be/7b/ebbe7b2ced789865d237dfce9d67f03d.jpg' },
    { id: 3, name: 'user3', profilePic: 'profile3.jpg' },
    { id: 1, name: '으뱌뱌', profilePic: 'https://i.pinimg.com/564x/49/83/87/49838777cfffa05a18681a83b1f80a71.jpg' },
    { id: 2, name: 'dodhddl', profilePic: 'https://i.pinimg.com/564x/eb/be/7b/ebbe7b2ced789865d237dfce9d67f03d.jpg' },
    { id: 3, name: 'user3', profilePic: 'profile3.jpg' },
    { id: 1, name: '으뱌뱌', profilePic: 'https://i.pinimg.com/564x/49/83/87/49838777cfffa05a18681a83b1f80a71.jpg' },
    { id: 2, name: 'dodhddl', profilePic: 'https://i.pinimg.com/564x/eb/be/7b/ebbe7b2ced789865d237dfce9d67f03d.jpg' },
    { id: 3, name: 'user3', profilePic: 'profile3.jpg' },
    { id: 1, name: '으뱌뱌', profilePic: 'https://i.pinimg.com/564x/49/83/87/49838777cfffa05a18681a83b1f80a71.jpg' },
    { id: 2, name: 'dodhddl', profilePic: 'https://i.pinimg.com/564x/eb/be/7b/ebbe7b2ced789865d237dfce9d67f03d.jpg' },
    { id: 3, name: 'user3', profilePic: 'profile3.jpg' }
    // Add more users here if needed
  ];

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return; // Avoid sending empty messages
    setMessages([...messages, { user: selectedUser, text: newMessage }]);
    setNewMessage(''); // Clear the input field
  };

  return (
    <div className="talk">
      <div className="talk-sidebar">
        <div className="talk-sidebar-header">dlwnajr님의 채팅방</div>
        <div className="talk-user-list">
          {users.map(user => (
            <div 
              key={user.id} 
              className="talk-user-item" 
              onClick={() => handleUserClick(user)}
            >
              <img src={user.profilePic} alt={user.name} className="talk-user-pic" />
              <div className="talk-user-name">{user.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="talk-main">
        {selectedUser ? (
          <>
            <div className="talk-profile">
              <img src={selectedUser.profilePic} alt={selectedUser.name} className="talk-profile-pic" />
              <div className="talk-profile-name">{selectedUser.name}</div>
            </div>
            <div className="talk-chat">
              <div className="talk-chat-messages">
                {messages.map((message, index) => (
                  <div key={index} className="talk-chat-message">
                    <b>{message.user.name}:</b> {message.text}
                  </div>
                ))}
              </div>
              <div className="talk-chat-footer">
                <input 
                  type="text" 
                  className="talk-input" 
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder="메시지를 입력하세요." 
                />
                <button 
                  className="talk-send-button" 
                  onClick={handleSendMessage}
                >
                  전송
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="talk-placeholder">사용자를 선택해주세요.</div>
        )}
      </div>
    </div>
  );
}

export default TalkPage;
