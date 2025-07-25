import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, MessageCircle, X, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface ChatRoom {
  roomId: string;
  opponentNickname: string;
  lastMessageContent: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onClose }) => {
  const { isLoggedIn, user } = useAuth();
  const { toast } = useToast();
  
  // 채팅방 목록 상태
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 현재 뷰 상태 ('list' | 'chat')
  const [currentView, setCurrentView] = useState<'list' | 'chat'>('list');
  const [currentOpponentNickname, setCurrentOpponentNickname] = useState<string | null>(null);
  
  // 채팅방 상태
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [otherUserName, setOtherUserName] = useState('상대방');
  const [isMinimized, setIsMinimized] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const stompClientRef = useRef<Client | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const currentUserId = user?.id?.toString() || '7';

  // 채팅방 목록 가져오기
  const fetchChatRooms = async () => {
    if (!isLoggedIn) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch('/api/v1/chat/rooms', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setChatRooms(data);
        } else if (data && Array.isArray(data.data)) {
          setChatRooms(data.data);
        } else if (data && Array.isArray(data.content)) {
          setChatRooms(data.content);
        } else {
          setChatRooms([]);
        }
      } else {
        setChatRooms([]);
      }
    } catch (error) {
      console.error('채팅 목록 가져오기 실패:', error);
      setChatRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // 위젯이 열릴 때 채팅방 목록 가져오기
  useEffect(() => {
    if (isOpen && isLoggedIn) {
      fetchChatRooms();
    }
  }, [isOpen, isLoggedIn]);

  // 외부에서 채팅 위젯 열기 이벤트 리스너 
  useEffect(() => {
    const handleOpenChatWidget = (event: CustomEvent) => {
      console.log('채팅 위젯 열기 이벤트:', event.detail);
      
      if (event.detail.roomId && event.detail.opponentNickname) {
        // 특정 채팅방으로 바로 이동
        handleChatRoomClick(event.detail.roomId, event.detail.opponentNickname);
      } else {
        // 채팅 목록으로 이동
        setCurrentView('list');
      }
    };

    const handleOpenChatRoom = (event: CustomEvent) => {
      const { roomId, opponentNickname } = event.detail;
      if (isOpen && roomId) {
        handleChatRoomClick(roomId, opponentNickname);
      }
    };

    window.addEventListener('openChatWidget', handleOpenChatWidget as EventListener);
    window.addEventListener('openChatRoom', handleOpenChatRoom as EventListener);
    return () => {
      window.removeEventListener('openChatWidget', handleOpenChatWidget as EventListener);
      window.removeEventListener('openChatRoom', handleOpenChatRoom as EventListener);
    };
  }, [isOpen]);

  // 채팅방 선택
  const handleChatRoomClick = async (roomId: string, opponentNickname: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/v1/chat/room/${roomId}/messages`, {
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
          return;
        }
        throw new Error('채팅방 메시지를 불러오지 못했습니다.');
      }

      const result = await response.json();
      const messagesData = result.data || [];
      
      // 상대방 닉네임 설정
      let otherUserNickname = opponentNickname;
      if (Array.isArray(messagesData) && messagesData.length > 0) {
        const otherMessage = messagesData.find((msg: any) => 
          msg.senderId?.toString() !== currentUserId
        );
        if (otherMessage && otherMessage.senderName) {
          otherUserNickname = otherMessage.senderName;
        }
      }
      
      setOtherUserName(otherUserNickname);

      if (Array.isArray(messagesData)) {
        const formattedMessages = messagesData.map((msg: any) => {
          const senderId = msg.senderId?.toString() || '';
          
          return {
            id: msg.id?.toString() || Date.now().toString(),
            content: msg.content || '',
            senderId: senderId,
            senderName: senderId === currentUserId ? (user?.nickname || '나') : otherUserNickname,
            timestamp: new Date(msg.craetedAt || msg.createdAt || Date.now()),
            isRead: msg.isRead || false
          };
        });
        
        setMessages(formattedMessages);
      }

      setCurrentView('chat');
      setCurrentRoomId(roomId);
      setCurrentOpponentNickname(opponentNickname);
      setupWebSocket(roomId);
      
    } catch (error) {
      console.error('채팅방 접근 실패:', error);
      toast({
        title: "오류",
        description: "채팅방을 불러오지 못했습니다.",
        variant: "destructive"
      });
    }
  };

  // WebSocket 연결 설정
  const setupWebSocket = (roomId: string) => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
    }

    const socket = new SockJS('/ws-stomp');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        setIsConnected(true);
        
        // 채팅방 구독
        client.subscribe(`/sub/chat/${roomId}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          const newMessage = {
            id: receivedMessage.id || Date.now().toString(),
            content: receivedMessage.content,
            senderId: receivedMessage.senderId,
            senderName: receivedMessage.senderName,
            timestamp: new Date(receivedMessage.timestamp || Date.now()),
            isRead: false
          };
          
          setMessages(prev => [...prev, newMessage]);
          
          // 상대방이 보낸 메시지인 경우 읽음 처리
          if (receivedMessage.senderId !== currentUserId) {
            client.publish({
              destination: `/pub/api/v1/chat/read/${roomId}`,
              headers: {
                userId: currentUserId
              },
              body: JSON.stringify({})
            });
          }
        });

        // 읽음 처리 구독
        client.subscribe(`/sub/chat/${roomId}/read`, (message) => {
          setMessages(prev => prev.map(msg => {
            if (msg.senderId === currentUserId) {
              return { ...msg, isRead: true };
            }
            return msg;
          }));
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
  };

  // 메시지 전송
  const handleSendMessage = () => {
    if (!newMessage.trim() || !isConnected || !stompClientRef.current || !currentRoomId) return;

    const message = {
      roomId: currentRoomId,
      senderId: currentUserId,
      senderName: user?.nickname || '사용자',
      content: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 뒤로가기 (채팅방 목록으로)
  const handleBackToList = () => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
    }
    setCurrentRoomId(null);
    setCurrentOpponentNickname(null);
    setMessages([]);
    setIsConnected(false);
    setCurrentView('list');
    // 목록 새로고침
    fetchChatRooms();
  };

  // 위젯 닫기
  const handleClose = () => {
    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
    }
    setCurrentRoomId(null);
    setMessages([]);
    setIsConnected(false);
    setChatRooms([]);
    onClose();
  };

  // 유틸 함수들
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatUnreadCount = (count: number) => {
    if (count === 0) return null;
    if (count <= 10) return count.toString();
    return '10+';
  };

  const truncateMessage = (message: string, maxLines: number = 2) => {
    const maxChars = maxLines * 25;
    if (message.length <= maxChars) return message;
    return message.substring(0, maxChars) + '...';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`bg-white rounded-lg shadow-xl border ${isMinimized ? 'w-80 h-12' : 'w-80 h-96'} transition-all duration-300`}>
        {/* 헤더 */}
        <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-lg">
          <div className="flex items-center space-x-2">
            {currentView === 'chat' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToList}
                className="p-1"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <h3 className="font-medium text-sm">
              {currentView === 'chat' ? `${otherUserName}님` : '채팅'}
            </h3>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1"
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <div className="h-80 flex flex-col">
            {currentView === 'list' ? (
              // 채팅방 목록
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-sm">채팅 목록을 불러오는 중...</p>
                  </div>
                ) : chatRooms.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full px-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                      <MessageCircle className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm text-center">
                      채팅내역이 없어요
                    </p>
                  </div>
                ) : (
                  <div>
                     {chatRooms.map((room) => (
                       <div
                         key={room.roomId}
                         onClick={() => handleChatRoomClick(room.roomId, room.opponentNickname)}
                         className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-gray-900 truncate text-sm">
                                {room.opponentNickname}
                              </h4>
                              <div className="flex flex-col items-end ml-2">
                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                  {formatTime(room.lastMessageTime)}
                                </span>
                                {room.unreadCount > 0 && (
                                  <div className="mt-1 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-bold min-w-[20px] h-4 flex items-center justify-center">
                                    {formatUnreadCount(room.unreadCount)}
                                  </div>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 leading-4">
                              {truncateMessage(room.lastMessageContent)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : currentView === 'chat' && currentRoomId ? (
              // 채팅방
              <>
                {/* 연결 상태 */}
                {!isConnected && (
                  <div className="bg-yellow-50 border-b border-yellow-200 px-3 py-2">
                    <p className="text-xs text-yellow-800 text-center">
                      채팅 서버에 연결 중입니다...
                    </p>
                  </div>
                )}

                {/* 메시지 영역 */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <h4 className="text-sm font-medium text-gray-800 mb-1">
                          {otherUserName}님과의 채팅
                        </h4>
                        <p className="text-xs text-gray-500">
                          첫 메시지를 보내서 대화를 시작해보세요!
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isMyMessage = message.senderId.toString() === currentUserId;
                      
                      return (
                        <div key={message.id} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-xs ${isMyMessage ? 'order-2' : 'order-1'}`}>
                            {!isMyMessage && (
                              <p className="text-xs text-gray-500 mb-1 px-2">
                                {message.senderName}
                              </p>
                            )}
                            <div
                              className={`px-3 py-2 rounded-lg text-sm ${
                                isMyMessage
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">
                                {message.content}
                              </p>
                            </div>
                            <div className={`flex items-center mt-1 ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                              <span className="text-xs text-gray-400 px-2">
                                {formatMessageTime(message.timestamp)}
                              </span>
                              {isMyMessage && message.isRead && (
                                <span className="text-xs text-gray-400">
                                  읽음
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* 메시지 입력 영역 */}
                <div className="border-t bg-white p-2">
                  <div className="flex items-end space-x-2">
                    <div className="flex-1">
                      <textarea
                        ref={textareaRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="메시지를 입력하세요..."
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                        rows={1}
                        style={{ minHeight: '36px', maxHeight: '80px' }}
                        disabled={!isConnected}
                      />
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || !isConnected}
                      size="sm"
                      className="h-9 w-9 p-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  {!isConnected && (
                    <p className="text-xs text-gray-400 mt-1 text-center">
                      연결이 끊어졌습니다. 다시 연결을 시도하고 있습니다...
                    </p>
                  )}
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWidget;