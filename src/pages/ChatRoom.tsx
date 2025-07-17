import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, Phone, Video, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
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

interface ChatRoomInfo {
  id: string;
  user1Id: string;
  user2Id: string;
  user1Name: string;
  user2Name: string;
}

const ChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [chatRoomInfo, setChatRoomInfo] = useState<ChatRoomInfo | null>(null);
  const [otherUserName, setOtherUserName] = useState('상대방');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 현재 로그인된 사용자 정보
  const currentUserId = user?.id?.toString() || '7';

  // 채팅방 정보와 메시지 로드
  useEffect(() => {
    if (!roomId) {
      navigate('/chat');
      return;
    }

    const loadChatData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        
        // 채팅방 메시지 가져오기
        const response = await fetch(`http://localhost:8080/api/v1/chat/room/${roomId}/messages`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          if (response.status === 403) {
            toast({
              title: "오류",
              description: "채팅방에 접근할 권한이 없습니다.",
              variant: "destructive"
            });
            navigate('/board?category=missing');
            return;
          }
          throw new Error('채팅방 메시지를 불러오지 못했습니다.');
        }

        const result = await response.json();
        console.log('채팅방 API 응답:', result);

        // API 응답에서 메시지 데이터 추출
        const messagesData = result.data || [];
        
        if (Array.isArray(messagesData)) {
          // 메시지 데이터 변환 및 상대방 ID 찾기
          let otherUserId = '';
          const formattedMessages = messagesData.map((msg: any) => {
            const senderId = msg.senderId?.toString() || '';
            
            // 현재 사용자가 아닌 senderId를 상대방으로 설정
            if (senderId !== currentUserId && !otherUserId) {
              otherUserId = senderId;
            }
            
            return {
              id: msg.id?.toString() || Date.now().toString(),
              content: msg.content || '',
              senderId: senderId,
              senderName: senderId === currentUserId ? (user?.nickname || '나') : '상대방', // 임시로 설정
              timestamp: new Date(msg.craetedAt || msg.createdAt || Date.now()), // craetedAt 오타 대응
              isRead: msg.isRead || false
            };
          });
          
          setMessages(formattedMessages);
          
          // 상대방 정보 조회
          if (otherUserId) {
            try {
              const userResponse = await fetch(`http://localhost:8080/api/v1/user/${otherUserId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              });
              
              if (userResponse.ok) {
                const userData = await userResponse.json();
                console.log('상대방 사용자 정보:', userData);
                
                const otherUserNickname = userData.data?.nickname || userData.nickname || '상대방';
                setOtherUserName(otherUserNickname);
                
                // 메시지의 senderName도 업데이트
                setMessages(prev => prev.map(msg => ({
                  ...msg,
                  senderName: msg.senderId === currentUserId ? (user?.nickname || '나') : otherUserNickname
                })));
              } else {
                console.warn('상대방 정보 조회 실패');
                setOtherUserName('상대방');
              }
            } catch (error) {
              console.error('상대방 정보 조회 오류:', error);
              setOtherUserName('상대방');
            }
          }
        }

        setIsAuthorized(true);
        setLoading(false);

      } catch (error) {
        console.error('채팅 데이터 로드 실패:', error);
        toast({
          title: "오류",
          description: "채팅방을 불러오지 못했습니다.",
          variant: "destructive"
        });
        navigate('/board?category=missing');
      }
    };

    loadChatData();
  }, [roomId, currentUserId, navigate, toast, user]);

  // WebSocket 연결 설정
  useEffect(() => {
    if (!roomId || !isAuthorized) return;

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
  }, [roomId, isAuthorized]);

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
      senderId: currentUserId,
      senderName: user?.nickname || '사용자',
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-medium text-gray-800 mb-2">채팅방을 불러오고 있습니다...</h1>
        </div>
      </div>
    );
  }

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
            <div>
              <h1 className="font-semibold text-foreground">{otherUserName}님</h1>
            </div>
          </div>
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
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {otherUserName}님과의 채팅
              </h3>
              <p className="text-muted-foreground">
                첫 메시지를 보내서 대화를 시작해보세요!
              </p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => {
            const prevMessage = index > 0 ? messages[index - 1] : undefined;
            const isMyMessage = message.senderId.toString() === currentUserId;
            
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