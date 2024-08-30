import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs'; // Named export
import './talk.css';

function TalkPage() {
  const [selectedUser, setSelectedUser] = useState(null);  // 선택된 사용자
  const [messages, setMessages] = useState([]);  // 채팅 메시지 상태
  const [newMessage, setNewMessage] = useState('');  // 새 메시지 입력 상태
  const [chatRooms, setChatRooms] = useState([]);  // 채팅방 목록 상태
  const [loading, setLoading] = useState(true);  // 로딩 상태
  const [error, setError] = useState(null);  // 오류 상태
  const [stompClient, setStompClient] = useState(null);  // STOMP 클라이언트

  const messageEndRef = useRef(null);

  useEffect(() => {
    fetchChatRooms();

    const socket = new SockJS('http://localhost:8080/ws');
    const client = Stomp.over(socket);
    
    client.connect({}, (frame) => {
      console.log('Connected: ' + frame);

      // 채팅 메시지 구독
      client.subscribe('/topic/messages', (message) => {
        const receivedMessage = JSON.parse(message.body);
        console.log('새 메시지:', receivedMessage);
        setMessages(prevMessages => [...prevMessages, receivedMessage]);
        scrollToBottom();
    });
    }, (error) => {
      console.error('STOMP 연결 오류:', error);
    });

    setStompClient(client);

    return () => {
      if (client) {
        client.disconnect();
      }
    };
}, []);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const fetchChatRooms = async () => {
    try {
      const response = await fetch('http://localhost:8080/chat/myroomlist', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('채팅방 목록을 가져오는 데 실패했습니다.');
      }

      const data = await response.json();
      console.log('채팅방 목록:', data);
      setChatRooms(data);
      setLoading(false);
    } catch (error) {
      console.error('오류 발생:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !selectedUser) return;

    if (stompClient) {
        const message = {
            user: selectedUser,
            text: newMessage,
            chatRoomId: selectedUser.chatRoomId
        };

        stompClient.send('/app/chat/sendMessage', {}, JSON.stringify(message));
        setNewMessage('');
    }
};

const scrollToBottom = () => {
  messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
};

  return (
    <div className="talk">
      <div className="talk-sidebar">
        <div className="talk-sidebar-header">dlwnajr님의 채팅방</div>
        <div className="talk-user-list">
          {loading ? (
            <div>로딩 중...</div>
          ) : error ? (
            <div>오류: {error}</div>
          ) : (
            chatRooms.map((room, index) => (
              <div 
                key={index} 
                className="talk-user-item" 
                onClick={() => handleUserClick(room.buyer)}
              >
                <img src={room.buyer.profileImageUrl} alt={room.buyer.nickname} className="talk-user-pic" />
                <div className="talk-user-name">{room.buyer.nickname}</div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="talk-main">
        {selectedUser ? (
          <>
            <div className="talk-profile">
              <img src={selectedUser.profileImageUrl} alt={selectedUser.nickname} className="talk-profile-pic" />
              <div className="talk-profile-name">{selectedUser.nickname}</div>
            </div>
            <div className="talk-chat">
            <div className="talk-chat-messages">
                {messages.map((message, index) => (
                    <div key={index} className="talk-chat-message">
                        <b>{message.user.nickname}:</b> {message.text}
                    </div>
                ))}
                <div ref={messageEndRef} />
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
