import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // 서버로 로그아웃 요청
      await fetch('http://localhost:8080/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
    } finally {
      // 로컬 상태 초기화
      setUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      
      // 브라우저 히스토리를 대체하여 뒤로가기 시 로그인 상태가 되지 않도록 함
      window.history.replaceState(null, '', window.location.pathname);
      
      // 메인 페이지로 리다이렉트
      window.location.href = '/';
    }
  };

  const checkAuthStatus = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const headers: Record<string, string> = {};
      
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      
      const response = await fetch('http://localhost:8080/api/v1/auth/me', {
        method: 'GET',
        headers,
        credentials: 'include',
      });
      
      if (response.ok) {
        const userData = await response.json();
        login(userData);
      } else {
        // 서버에서 인증되지 않은 경우 로컬 스토리지 정리
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
      // 로컬 스토리지에서 사용자 정보 확인 (fallback)
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsLoggedIn(true);
        } catch (parseError) {
          localStorage.removeItem('user');
        }
      }
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const value = {
    user,
    isLoggedIn,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};