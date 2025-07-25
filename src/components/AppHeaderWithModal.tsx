import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, User, LogOut, Settings, FileText, MessageCircle, Heart as HeartIcon, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotification } from '@/context/NotificationContext';
import LoginModal from '@/components/LoginModal';
import ChatWidget from '@/components/ChatWidget';

const AppHeaderWithModal = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isChatWidgetOpen, setIsChatWidgetOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const { notifications, hasUnreadNotifications, markAsRead, markAllAsRead } = useNotification();
  
  // 로그인 상태 콘솔 출력
  console.log('헤더 상태 - 로그인 여부:', isLoggedIn, '사용자:', user);
  
  // 알림 상태 디버깅
  useEffect(() => {
    console.log('전체 알림 배열:', notifications);
    console.log('hasUnreadNotifications:', hasUnreadNotifications);
    console.log('notifications.some(n => !n.isRead):', notifications.some(n => !n.isRead));
  }, [notifications, hasUnreadNotifications]);

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 golden rounded-full flex items-center justify-center">
                <img
                    src="https://backend-nyang.s3.ap-northeast-2.amazonaws.com/2gaenynag/logo_circle.png"
                    alt="함께하개냥 로고"
                    className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 font-cute">함께하개냥</h1>
                <p className="text-xs text-gray-600 hidden sm:block">유기동물 입양 플랫폼</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/animals" className="text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium">입양하기</Link>
              <Link to="/shelters" className="text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium">보호소 찾기</Link>
              <Link to="/board" className="text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium">커뮤니티</Link>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Desktop Actions */}
              {isLoggedIn ? (
                <div className="hidden md:flex items-center space-x-4">
                  {/* 알림 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                       <Button variant="ghost" className="relative px-3 py-2">
                         <Bell className="w-5 h-5" />
                         {hasUnreadNotifications && (
                           <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></div>
                         )}
                      </Button>
                    </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="w-80">
                       <div className="p-2">
                         <div className="flex items-center justify-between mb-2">
                           <p className="font-semibold text-sm">알림</p>
                           {notifications.some(n => !n.isRead) && (
                             <Button
                               variant="ghost"
                               size="sm"
                               onClick={markAllAsRead}
                               className="text-xs text-blue-600 hover:text-blue-700"
                             >
                               전체 읽음
                             </Button>
                           )}
                          </div>
                              {notifications.filter(n => !n.isRead).length > 0 ? (
                               notifications.filter(n => !n.isRead).map((notification) => {
                                 // 디버깅을 위한 콘솔 출력
                                 console.log('알림 isRead 상태:', notification.notyId, notification.isRead);
                                
                                return (
                                  <div key={notification.notyId} className="relative p-2 hover:bg-gray-50 rounded text-xs border-b last:border-b-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex-1 min-w-0">
                                        <p className="text-gray-600 text-xs">{notification.notyContent}</p>
                                        <p className="text-gray-400 text-xs mt-1">{new Date(notification.notyCreatedAt).toLocaleString()}</p>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          console.log('X 버튼 클릭됨 - 알림 ID:', notification.notyId);
                                          markAsRead(notification.notyId);
                                        }}
                                        className="flex-shrink-0 p-1 h-auto min-w-[24px] text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                                      >
                                        <X className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })
                           ) : (
                            <p className="text-gray-500 text-xs p-2">새 알림이 없습니다.</p>
                          )}
                       </div>
                     </DropdownMenuContent>
                  </DropdownMenu>

                  {/* 사용자 드롭다운 */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">
                            {user?.nickname?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <span className="text-sm font-medium">{user?.nickname || '사용자'}</span>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{user?.nickname || '사용자'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/mypage" className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>마이페이지</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setIsChatWidgetOpen(true)}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>채팅목록</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={logout}
                        className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>로그아웃</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="golden hover:bg-yellow-500 text-gray-800 font-medium px-4 py-2 text-sm"
                >
                  로그인
                </Button>
              )}
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t">
              <div className="flex flex-col space-y-2 pt-4">
                <Link to="/animals" className="text-gray-600 hover:text-gray-800 transition-colors py-2 text-sm font-medium">입양하기</Link>
                <Link to="/shelters" className="text-gray-600 hover:text-gray-800 transition-colors py-2 text-sm font-medium">보호소 찾기</Link>
                <Link to="/board" className="text-gray-600 hover:text-gray-800 transition-colors py-2 text-sm font-medium">커뮤니티</Link>
                {isLoggedIn && (
                  <>
                    <Link to="/mypage" className="text-gray-600 hover:text-gray-800 transition-colors py-2 text-sm font-medium">마이페이지</Link>
                    <button 
                      onClick={() => setIsChatWidgetOpen(true)}
                      className="text-gray-600 hover:text-gray-800 transition-colors py-2 text-sm font-medium text-left"
                    >
                      채팅목록
                    </button>
                    <button 
                      onClick={logout}
                      className="text-red-600 hover:text-red-700 transition-colors py-2 text-sm font-medium text-left"
                    >
                      로그아웃
                    </button>
                  </>
                )}
                {!isLoggedIn && (
                  <button 
                    onClick={() => setIsLoginModalOpen(true)}
                    className="text-golden hover:text-yellow-600 transition-colors py-2 text-sm font-medium text-left"
                  >
                    로그인
                  </button>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
      
      <ChatWidget
        isOpen={isChatWidgetOpen}
        onClose={() => setIsChatWidgetOpen(false)}
      />
    </>
  );
};

export default AppHeaderWithModal;