import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Heart } from 'lucide-react';

interface AppHeaderProps {
  onLoginClick: () => void;
  isLoggedIn?: boolean;
  userName?: string;
  onLogout?: () => void;
}

const AppHeader = ({ onLoginClick, isLoggedIn = false, userName = "사용자", onLogout }: AppHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mock notification data
  const notifications = [
    { id: 1, title: "새로운 입양 신청", content: "초코에 대한 입양 신청이 접수되었습니다.", time: "2분 전" },
    { id: 2, title: "메시지 도착", content: "보호소에서 새로운 메시지가 도착했습니다.", time: "1시간 전" },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 golden rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
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
                {/* 마이페이지 버튼 */}
                <Link to="/mypage">
                  <Button className="golden hover:bg-yellow-500 text-gray-800 font-medium px-4 py-2 text-sm flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>마이페이지</span>
                  </Button>
                </Link>

                {/* 사용자 드롭다운 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 px-3 py-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-600">
                          {userName.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{userName}</span>
                      <ChevronDown className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>내 프로필</DropdownMenuItem>
                    <DropdownMenuItem>설정</DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/chat-list">채팅내역</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* 알림 드롭다운 */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 relative px-3 py-2">
                      <span className="text-sm font-medium">알림</span>
                      <ChevronDown className="w-3 h-3" />
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="p-2">
                      <p className="font-semibold text-sm mb-2">알림</p>
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div key={notification.id} className="p-2 hover:bg-gray-50 rounded text-xs border-b last:border-b-0">
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-gray-600 text-xs">{notification.content}</p>
                            <p className="text-gray-400 text-xs mt-1">{notification.time}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-xs p-2">새 알림이 없습니다.</p>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button 
                  onClick={onLogout}
                  variant="ghost"
                  className="text-gray-700 hover:text-gray-900 px-3 py-2"
                >
                  <span className="text-sm font-medium">로그아웃</span>
                </Button>
              </div>
            ) : (
              <Button 
                onClick={onLoginClick}
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
                <Link to="/mypage" className="text-gray-600 hover:text-gray-800 transition-colors py-2 text-sm font-medium">마이페이지</Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default AppHeader;