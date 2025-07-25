import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Footer from '@/components/Footer';

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

const Chat = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Mock data - 실제로는 API에서 가져올 데이터
  const currentUser = { id: '1', name: '나' };
  const chatUser: ChatUser = {
    id: userId || '2',
    name: userId === '2' ? '김철수' : '이영희'
  };

  const mockMessages: Message[] = [
    {
      id: '1',
      content: '안녕하세요! 실종된 강아지에 대해 문의드립니다.',
      senderId: '1',
      senderName: '나',
      timestamp: new Date('2024-07-13T14:30:00'),
      isRead: true
    },
    {
      id: '2',
      content: '네, 안녕하세요. 어떤 강아지를 찾고 계신가요?',
      senderId: userId || '2',
      senderName: chatUser.name,
      timestamp: new Date('2024-07-13T14:31:00'),
      isRead: true
    },
    {
      id: '3',
      content: '포메라니안이고 크림색입니다. 목에 빨간 목걸이를 하고 있어요.',
      senderId: '1',
      senderName: '나',
      timestamp: new Date('2024-07-13T14:32:00'),
      isRead: true
    },
    {
      id: '4',
      content: '아, 어제 공원에서 비슷한 강아지를 봤어요! 정확한 위치를 알려드릴게요.',
      senderId: userId || '2',
      senderName: chatUser.name,
      timestamp: new Date('2024-07-13T14:35:00'),
      isRead: true
    },
    {
      id: '5',
      content: '정말요? 감사합니다! 혹시 사진이나 더 자세한 정보가 있으시면 공유해주세요.',
      senderId: '1',
      senderName: '나',
      timestamp: new Date('2024-07-14T09:15:00'),
      isRead: false
    }
  ];

  useEffect(() => {
    setMessages(mockMessages);
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const shouldShowDate = (currentMsg: Message, prevMsg?: Message) => {
    if (!prevMsg) return true;
    const currentDate = new Date(currentMsg.timestamp).toDateString();
    const prevDate = new Date(prevMsg.timestamp).toDateString();
    return currentDate !== prevDate;
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      timestamp: new Date(),
      isRead: false
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // 실제로는 여기서 STOMP를 통해 메시지 전송
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id ? { ...msg, isRead: true } : msg
        )
      );
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(-1)}
          className="hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold">{chatUser.name}과의 채팅</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, index) => {
          const prevMsg = index > 0 ? messages[index - 1] : undefined;
          const isMyMessage = msg.senderId === currentUser.id;
          const showDate = shouldShowDate(msg, prevMsg);

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="flex justify-center my-4">
                  <div className="bg-muted px-3 py-1 rounded-full text-sm text-muted-foreground">
                    {formatDate(msg.timestamp)}
                  </div>
                </div>
              )}
              
              <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex flex-col max-w-[70%] ${isMyMessage ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-4 py-2 rounded-2xl whitespace-pre-wrap break-words ${
                      isMyMessage
                        ? 'bg-primary text-primary-foreground rounded-br-lg'
                        : 'bg-background border border-border rounded-bl-lg'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <span>{formatTime(msg.timestamp)}</span>
                    {isMyMessage && (
                      <span className={msg.isRead ? 'text-primary' : 'text-muted-foreground'}>
                        {msg.isRead ? '읽음' : '1'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-background border-t border-border px-4 py-3">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="메시지를 입력하세요..."
              className="w-full resize-none rounded-2xl border border-border px-4 py-3 pr-12 text-sm bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              style={{ minHeight: '48px', maxHeight: '120px' }}
              rows={1}
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            size="icon"
            className="h-12 w-12 rounded-full"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Chat;