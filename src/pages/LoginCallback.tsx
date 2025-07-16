import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

const LoginCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, checkAuthStatus } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        console.error('로그인 실패:', error);
        navigate('/?error=login_failed');
        return;
      }

      if (token) {
        // JWT 토큰이 URL 파라미터로 전달된 경우
        try {
          // 토큰을 localStorage에 저장
          localStorage.setItem('accessToken', token);
          
          // 사용자 정보 가져오기
          await checkAuthStatus();
          
          navigate('/');
        } catch (error) {
          console.error('로그인 처리 실패:', error);
          navigate('/?error=login_failed');
        }
      } else {
        // 토큰이 없으면 쿠키에서 확인 (일반적인 OAuth2 플로우)
        try {
          await checkAuthStatus();
          navigate('/');
        } catch (error) {
          console.error('인증 상태 확인 실패:', error);
          navigate('/?error=auth_check_failed');
        }
      }
    };

    handleAuthCallback();
  }, [searchParams, navigate, login, checkAuthStatus]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">로그인 처리 중...</h2>
        <p className="text-gray-600">잠시만 기다려 주세요.</p>
      </div>
    </div>
  );
};

export default LoginCallback;