import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface ChatRoom {
  roomId: string;
  opponentNickname: string;
  lastMessageContent: string;
  lastMessageTime: string;
  unreadCount: number;
}

const ChatList = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    fetchChatRooms();
  }, [isLoggedIn, navigate]);

  const fetchChatRooms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      console.log('채팅방 토큰:', token);
      
      const response = await fetch('/api/v1/chat/rooms', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('채팅방 응답 상태:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('채팅방 데이터:', data);
        
        // API 응답이 배열인지 확인하고 적절히 처리
        if (Array.isArray(data)) {
          setChatRooms(data);
        } else if (data && Array.isArray(data.data)) {
          setChatRooms(data.data);
        } else if (data && Array.isArray(data.content)) {
          setChatRooms(data.content);
        } else {
          console.error('예상치 못한 데이터 구조:', data);
          setChatRooms([]);
        }
      } else {
        console.error('채팅방 응답 실패:', response.status);
        setChatRooms([]);
      }
    } catch (error) {
      console.error('채팅 목록 가져오기 실패:', error);
      setChatRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  const formatUnreadCount = (count: number) => {
    if (count === 0) return null;
    if (count <= 10) return count.toString();
    return '10+';
  };

  const truncateMessage = (message: string, maxLines: number = 2) => {
    // 대략적으로 한 줄에 25자 정도로 계산 (모바일 기준)
    const maxChars = maxLines * 25;
    if (message.length <= maxChars) return message;
    return message.substring(0, maxChars) + '...';
  };

  const handleChatRoomClick = async (roomId: string, opponentNickname: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`/api/v1/chat/room/${roomId}/messages`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        navigate(`/chat/${roomId}?name=${encodeURIComponent(opponentNickname)}`);
      }
    } catch (error) {
      console.error('채팅방 접근 실패:', error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
        <div className="bg-white border-b px-4 py-3 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="p-2 mr-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">채팅</h1>
        </div>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-gray-500">채팅 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (chatRooms.length === 0) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
        {/* Header */}
        <div className="bg-white border-b px-4 py-3 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="p-2 mr-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold">채팅</h1>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] px-8">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 text-center">
            채팅내역이 없어요
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F5F5' }}>
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBack}
          className="p-2 mr-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-semibold">채팅</h1>
      </div>

      {/* Chat Room List */}
      <div className="bg-white">
        {chatRooms.map((room) => (
          <div
            key={room.roomId}
            onClick={() => handleChatRoomClick(room.roomId, room.opponentNickname)}
            className="px-4 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer active:bg-gray-100 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                {/* 상대방 닉네임 */}
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900 truncate">
                    {room.opponentNickname}
                  </h3>
                  <div className="flex flex-col items-end ml-2">
                    {/* 시간 */}
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTime(room.lastMessageTime)}
                    </span>
                    {/* 안읽은 수 */}
                    {room.unreadCount > 0 && (
                      <div 
                        className="mt-1 px-2 py-1 rounded-full text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center"
                        style={{ backgroundColor: '#FF3B30' }}
                      >
                        {formatUnreadCount(room.unreadCount)}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 마지막 메시지 */}
                <p className="text-sm text-gray-500 leading-5 whitespace-pre-wrap">
                  {truncateMessage(room.lastMessageContent)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Footer />
    </div>
  );
};

export default ChatList;