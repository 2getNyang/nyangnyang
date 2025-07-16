
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const handleSocialLogin = (provider: string) => {
    let authUrl = '';
    
    switch (provider) {
      case 'kakao':
        authUrl = 'http://localhost:8080/oauth2/authorization/kakao';
        break;
      case 'naver':
        authUrl = 'http://localhost:8080/oauth2/authorization/naver';
        break;
      case 'google':
        authUrl = 'http://localhost:8080/oauth2/authorization/google';
        break;
      default:
        console.error('지원하지 않는 소셜 로그인 제공자:', provider);
        return;
    }
    
    // OAuth2 인증 페이지로 리다이렉트
    window.location.href = authUrl;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">로그인</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-gray-600 text-center mb-6">
            소셜 계정으로 간편하게 로그인하세요
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={() => handleSocialLogin('kakao')}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-medium py-3 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 bg-gray-800 rounded-full"></div>
                <span>카카오로 시작하기</span>
              </div>
            </Button>
            
            <Button
              onClick={() => handleSocialLogin('naver')}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors"
            >
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-green-500 font-bold text-xs">N</span>
                </div>
                <span>네이버로 시작하기</span>
              </div>
            </Button>
            
            <Button
              onClick={() => handleSocialLogin('google')}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 rounded-lg border border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400"></div>
                <span>구글로 시작하기</span>
              </div>
            </Button>
          </div>
          
          <div className="text-center pt-4">
            <p className="text-sm text-gray-500">
              로그인하시면 <span className="text-golden font-medium">서비스 이용약관</span> 및{' '}
              <span className="text-golden font-medium">개인정보처리방침</span>에 동의하게 됩니다.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
