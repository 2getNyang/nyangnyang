
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
                <svg className="w-5 h-5" viewBox="0 0 256 256" fill="none">
                  <path d="M128 0C77.4 0 36 31.1 36 69.2c0 23.2 15.2 43.6 38.4 55.6L66 156.4c-1.3 4.2 4.5 7.4 7.8 4.2l25.6-24.4c9.6 1.6 19.6 2.4 29.6 2.4 50.6 0 92-31.1 92-69.2S178.6 0 128 0z" fill="currentColor"/>
                </svg>
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
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
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
