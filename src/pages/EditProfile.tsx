import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import AppHeader from '@/components/AppHeader';
import Footer from '@/components/Footer';

const EditProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isLoggedIn, user } = useAuth();
  
  const [formData, setFormData] = useState({
    nickname: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    fetchUserInfo();
  }, [isLoggedIn, navigate]);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8080/api/v1/user/info', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setFormData({
          nickname: result.data.nickname || '',
          email: result.data.email || ''
        });
      }
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      toast({
        title: "정보 로드 실패",
        description: "사용자 정보를 불러올 수 없습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nickname.trim()) {
      toast({
        title: "입력 오류",
        description: "모든 항목을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8080/api/v1/user/info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nickname: formData.nickname,
          email: formData.email
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        toast({
          title: "프로필 수정 완료",
          description: "회원 정보가 성공적으로 수정되었습니다.",
        });
        
        // 업데이트된 정보로 폼 데이터 갱신
        setFormData({
          nickname: result.data.nickname || '',
          email: result.data.email || ''
        });

        // AuthContext의 사용자 정보도 업데이트
        if (user) {
          const updatedUser = {
            ...user,
            nickname: result.data.nickname,
            email: result.data.email
          };
          // localStorage의 user 정보도 업데이트
          localStorage.setItem('user', JSON.stringify(updatedUser));
          // AuthContext 재확인 호출하여 헤더 업데이트
          window.location.reload();
        }
      } else {
        throw new Error('수정 실패');
      }
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      toast({
        title: "수정 실패",
        description: "프로필 수정 중 오류가 발생했습니다. 다시 시도해 주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader onLoginClick={() => {}} />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-gray-500">사용자 정보를 불러오는 중...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onLoginClick={() => {}} />
      
      <div className="container mx-auto px-4 py-8">
        {/* 뒤로가기 & 헤더 */}
        <div className="max-w-2xl mx-auto mb-8">
          <button
            onClick={() => navigate('/mypage')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            마이페이지로 돌아가기
          </button>
          
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">내 정보 수정</h1>
            <p className="text-gray-600">회원 정보를 수정할 수 있습니다</p>
          </div>
        </div>

        {/* 수정 폼 */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-semibold text-gray-800">
                기본 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 닉네임 */}
                <div className="space-y-2">
                  <Label htmlFor="nickname" className="text-sm font-medium text-gray-700 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    닉네임 *
                  </Label>
                  <Input
                    id="nickname"
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => handleInputChange('nickname', e.target.value)}
                    placeholder="닉네임을 입력해주세요"
                    className="w-full"
                    required
                  />
                </div>

                {/* 이메일 */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    이메일
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="이메일을 입력해주세요 (선택사항)"
                    className="w-full"
                  />
                </div>

                {/* 수정 완료 버튼 */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-base font-medium"
                  >
                    {isSubmitting ? '수정 중...' : '수정 완료'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 안내 정보 */}
          <Card className="mt-6 border-0 shadow-md bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-800 mb-1">
                    소셜 로그인 계정 안내
                  </h4>
                  <p className="text-sm text-blue-600">
                    소셜 로그인으로 가입한 계정은 닉네임과 이메일만 수정할 수 있습니다.
                    비밀번호는 각 소셜 서비스에서 관리됩니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EditProfile;