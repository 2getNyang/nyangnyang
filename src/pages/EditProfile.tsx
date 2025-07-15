import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AppHeader from '@/components/AppHeader';
import Footer from '@/components/Footer';

const EditProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // 초기 사용자 정보 (실제로는 전역 상태나 API에서 가져와야 함)
  const [formData, setFormData] = useState({
    nickname: '김철수',
    email: 'kimcs@example.com'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 실제로는 API 호출로 중복 체크
      const checkDuplicate = () => {
        // 임시 중복 체크 로직 (실제로는 서버에서 확인)
        const existingNicknames = ['admin', '관리자', 'test', '김영희'];
        const existingEmails = ['admin@example.com', 'test@example.com', 'kimyh@example.com'];
        
        if (existingNicknames.includes(formData.nickname)) {
          return { isDuplicate: true, field: 'nickname' };
        }
        if (existingEmails.includes(formData.email)) {
          return { isDuplicate: true, field: 'email' };
        }
        return { isDuplicate: false };
      };

      const duplicateCheck = checkDuplicate();
      
      if (duplicateCheck.isDuplicate) {
        const fieldName = duplicateCheck.field === 'nickname' ? '닉네임' : '이메일';
        toast({
          title: `${fieldName} 중복`,
          description: `이미 사용 중인 ${fieldName}입니다. 다른 ${fieldName}을 입력해주세요.`,
          variant: "destructive",
        });
        return;
      }

      // 실제 저장 로직 (API 호출)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "프로필 수정 완료",
        description: "회원 정보가 성공적으로 수정되었습니다.",
      });
    } catch (error) {
      toast({
        title: "수정 실패",
        description: "프로필 수정 중 오류가 발생했습니다. 다시 시도해 주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        onLoginClick={() => {}}
        isLoggedIn={true}
        userName={formData.nickname}
        onLogout={() => {}}
      />
      
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
                    닉네임
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
                    placeholder="이메일을 입력해주세요"
                    className="w-full"
                    required
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