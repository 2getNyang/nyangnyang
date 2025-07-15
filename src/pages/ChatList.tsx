import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatRoom {
  id: string;
  otherUserName: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}

// Mock 데이터
const mockChatRooms: ChatRoom[] = [
  {
    id: '1',
    otherUserName: '김동물친구',
    lastMessage: '안녕하세요! 실종된 강아지 보셨나요? 어제 오후 3시쯤 공원 근처에서 사라졌어요. 혹시 목격하셨다면 연락 부탁드립니다.',
    lastMessageTime: new Date(2025, 6, 15, 14, 30),
    unreadCount: 2
  },
  {
    id: '2',
    otherUserName: '박보호소장',
    lastMessage: '입양 절차 관련해서 문의드렸는데요, 언제 방문 가능하신지 알려주세요.',
    lastMessageTime: new Date(2025, 6, 14, 16, 45),
    unreadCount: 0
  },
  {
    id: '3',
    otherUserName: '이멍멍이',
    lastMessage: '감사합니다! 덕분에 우리 강아지를 찾았어요 ㅠㅠ',
    lastMessageTime: new Date(2025, 6, 13, 10, 20),
    unreadCount: 15
  }
];

const ChatList = () => {
  const navigate = useNavigate();

  const formatTime = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
      // 오늘이면 오전/오후 시:분
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours < 12 ? '오전' : '오후';
      const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${ampm} ${displayHours}:${minutes}`;
    } else {
      // 오늘이 아니면 MM월 dd일
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${month}월 ${day}일`;
    }
  };

  const formatUnreadCount = (count: number) => {
    if (count === 0) return null;
    if (count <= 9) return count.toString();
    return '10+';
  };

  const truncateMessage = (message: string, maxLines: number = 2) => {
    // 대략적으로 한 줄에 25자 정도로 계산 (모바일 기준)
    const maxChars = maxLines * 25;
    if (message.length <= maxChars) return message;
    return message.substring(0, maxChars) + '...';
  };

  const handleChatRoomClick = (chatRoomId: string, otherUserName: string) => {
    navigate(`/chat/${chatRoomId}?name=${encodeURIComponent(otherUserName)}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (mockChatRooms.length === 0) {
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
        {mockChatRooms.map((room) => (
          <div
            key={room.id}
            onClick={() => handleChatRoomClick(room.id, room.otherUserName)}
            className="px-4 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer active:bg-gray-100 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                {/* 상대방 닉네임 */}
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-900 truncate">
                    {room.otherUserName}
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
                  {truncateMessage(room.lastMessage)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;