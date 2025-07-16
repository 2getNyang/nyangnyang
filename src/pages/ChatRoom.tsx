import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Phone, Video, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatUser {
  id: string;
  name: string;
}

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 현재 로그인된 사용자 정보 (실제로는 auth context에서 가져와야 함)
  const currentUser: ChatUser = { id: '7', name: '로그인한사용자' };
  const otherUser: ChatUser = { id: 'other', name: '상대방' };

  // WebSocket 연결 설정
  useEffect(() => {
    if (!roomId) return;

    const socket = new SockJS('http://localhost:8080/ws-stomp');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);
        
        // 채팅방 구독
        client.subscribe(`/sub/chat/${roomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages(prev => [...prev, {
            id: receivedMessage.id || Date.now().toString(),
            content: receivedMessage.content,
            senderId: receivedMessage.senderId,
            senderName: receivedMessage.senderName,
            timestamp: new Date(receivedMessage.timestamp || Date.now()),
            isRead: false
          }]);
        });
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket');
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('WebSocket error:', frame);
        setIsConnected(false);
      }
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [roomId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const shouldShowDate = (currentMsg: Message, prevMsg?: Message) => {
    if (!prevMsg) return true;
    const currentDate = new Date(currentMsg.timestamp).toDateString();
    const prevDate = new Date(prevMsg.timestamp).toDateString();
    return currentDate !== prevDate;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !isConnected || !stompClientRef.current) return;

    const message = {
      roomId: roomId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    // WebSocket으로 메시지 전송
    stompClientRef.current.publish({
      destination: '/pub/api/v1/chat/message',
      body: JSON.stringify(message)
    });

    setNewMessage('');
    adjustTextareaHeight();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [newMessage]);

  if (!roomId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">잘못된 채팅방입니다</h1>
          <Button onClick={() => navigate('/board?category=missing')} variant="outline">
            돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-semibold">
                {otherUser.name.charAt(0)}
              </span>
            </div>
            <div>
              <h1 className="font-semibold text-foreground">{otherUser.name}</h1>
              <p className="text-sm text-muted-foreground">
                {isConnected ? '온라인' : '연결 중...'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* 연결 상태 표시 */}
      {!isConnected && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <p className="text-sm text-yellow-800 text-center">
            채팅 서버에 연결 중입니다...
          </p>
        </div>
      )}

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary font-semibold">
                  {otherUser.name.charAt(0)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {otherUser.name}님과의 채팅
              </h3>
              <p className="text-muted-foreground">
                첫 메시지를 보내서 대화를 시작해보세요!
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const prevMessage = index > 0 ? messages[index - 1] : undefined;
            const isMyMessage = message.senderId.toString() === currentUser.id;
            
            return (
              <div key={message.id}>
                {/* 날짜 구분선 */}
                {shouldShowDate(message, prevMessage) && (
                  <div className="flex items-center justify-center my-4">
                    <div className="bg-muted px-3 py-1 rounded-full">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* 메시지 */}
                <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isMyMessage ? 'order-2' : 'order-1'}`}>
                    {!isMyMessage && (
                      <p className="text-sm text-muted-foreground mb-1 px-3">
                        {message.senderName}
                      </p>
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isMyMessage
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    </div>
                    <div className={`flex items-center mt-1 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-xs text-muted-foreground px-3">
                        {formatTime(message.timestamp)}
                      </span>
                      {isMyMessage && (
                        <span className="text-xs text-muted-foreground">
                          {message.isRead ? '읽음' : '1'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 영역 */}
      <div className="border-t border-border bg-background p-4">
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="w-full px-4 py-3 bg-muted border border-input rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={!isConnected}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || !isConnected}
            size="sm"
            className="h-12 w-12 rounded-xl p-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        {!isConnected && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            연결이 끊어졌습니다. 다시 연결을 시도하고 있습니다...
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;