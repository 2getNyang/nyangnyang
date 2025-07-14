
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

interface HeaderProps {
  onLoginClick: () => void;
}

const Header = ({ onLoginClick }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 golden rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 font-cute">함께하개냥</h1>
              <p className="text-sm text-gray-600">유기동물 입양 플랫폼</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">입양하기</a>
            <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">보호소 찾기</a>
            <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">입양 후기</a>
            
          </nav>
          
          <Button 
            onClick={onLoginClick}
            className="golden hover:bg-yellow-500 text-gray-800 font-medium px-6"
          >
            로그인
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
