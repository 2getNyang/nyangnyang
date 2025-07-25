import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface Notification {
  notyId: number;
  notyContent: string;
  notyLink: string;
  isRead: boolean;
  notyType: string;
  notyCreatedAt: string;
}

interface NotificationContextType {
  notifications: Notification[];
  hasUnreadNotifications: boolean;
  markAsRead: (notyId: number) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const stompClientRef = useRef<Client | null>(null);

  const hasUnreadNotifications = notifications.some(n => !n.isRead);

  // 안읽은 알림 목록 가져오기
  const fetchUnreadNotifications = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch('/api/v1/notifications/unread', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const unreadNotifications = await response.json();
        // notyCreatedAt 내림차순으로 정렬
        const sortedNotifications = unreadNotifications.sort((a: Notification, b: Notification) => 
          new Date(b.notyCreatedAt).getTime() - new Date(a.notyCreatedAt).getTime()
        );
        setNotifications(sortedNotifications);
      }
    } catch (error) {
      console.error('안읽은 알림 가져오기 실패:', error);
    }
  };

  const markAsRead = async (notyId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch(`/api/v1/notifications/${notyId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.notyId === notyId ? { ...n, isRead: true } : n)
        );
      }
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await fetch('/api/v1/notifications/read-all', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => ({ ...n, isRead: true }))
        );
      }
    } catch (error) {
      console.error('전체 알림 읽음 처리 실패:', error);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    
    // 토스트 알림 표시
    toast({
      title: "새 알림",
      description: notification.notyContent,
      duration: 4000,
    });
  };

  useEffect(() => {
    console.log("👤 알림 구독 시도 → user.id =", user?.id);
    
    if (!isLoggedIn || !user?.id) {
      // 로그아웃 시 연결 해제
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
      setNotifications([]);
      return;
    }

    // STOMP 연결 설정
    const connectStomp = () => {
      const socket = new SockJS('/ws-stomp');
      const client = new Client({
        webSocketFactory: () => socket,
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        onConnect: () => {
          console.log('알림 STOMP 연결 성공');
          
          // 알림 구독
          client.subscribe(`/sub/notifications/${user.id}`, (message) => {
            try {
              console.log("📩 받은 알림", message.body);
              const notification: Notification = JSON.parse(message.body);
              console.log('새 알림 수신:', notification);
              addNotification(notification);
            } catch (error) {
              console.error('알림 파싱 오류:', error);
            }
          });
        },
        onStompError: (frame) => {
          console.error('STOMP 오류:', frame);
        },
        onDisconnect: () => {
          console.log('알림 STOMP 연결 해제');
        }
      });

      client.activate();
      stompClientRef.current = client;
    };

    connectStomp();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
    };
  }, [isLoggedIn, user?.id, toast]);

  // 로그인 시 안읽은 알림 목록 가져오기
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      fetchUnreadNotifications();
    }
  }, [isLoggedIn, user?.id]);

  const value = {
    notifications,
    hasUnreadNotifications,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};