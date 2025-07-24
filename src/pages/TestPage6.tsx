import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, Eye, Send } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import { useToast } from '@/hooks/use-toast';

const TestPage6 = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUserId = 6; // 고정된 사용자 ID

  // 테스트용 게시글 데이터
  const testPost = {
    id: 1,
    categoryId: 2,
    userId: 7, // 작성자 ID
    nickname: '테스트작성자',
    lostType: '실종',
    kindName: '골든 리트리버',
    age: 3,
    furColor: '갈색',
    gender: '수컷',
    regionName: '서울시',
    subRegionName: '강남구',
    missingDate: '2024-01-15',
    missingLocation: '역삼동 공원 근처',
    phone: '010-1234-5678',
    likeCount: 25,
    comments: [],
    imageUrls: ['https://images.unsplash.com/photo-1552053831-71594a27632d?w=500'],
    createdAt: '2024-01-15T10:30:00Z',
    deletedAt: null
  };

  // 채팅하기 버튼 클릭 핸들러
  const handleChatClick = async () => {
    if (currentUserId === testPost.userId) {
      toast({
        title: "알림",
        description: "자신과는 채팅할 수 없어요.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('=== 채팅방 생성 시도 ===');
      console.log('currentUserId:', currentUserId);
      console.log('postDetail.userId:', testPost.userId);
      
      const response = await fetch(
        `http://localhost:8080/api/v1/chat/room?user1Id=${currentUserId}&user2Id=${testPost.userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('응답 상태:', response.status);
      const result = await response.json();
      console.log('응답 데이터:', result);
      
      // 응답이 단순히 roomId인 경우와 {code, data} 형태인 경우 모두 처리
      let roomId = null;
      if (typeof result === 'number' || typeof result === 'string') {
        roomId = result;
      } else if (result.code === 200 && result.data?.roomId) {
        roomId = result.data.roomId;
      } else if (result.data) {
        roomId = result.data;
      }
      
      if (roomId) {
        console.log('채팅방 생성 성공, roomId:', roomId);
        navigate(`/chat/room/${roomId}`);
      } else {
        console.log('채팅방 생성 실패:', result);
        toast({
          title: "오류",
          description: `채팅방 생성에 실패했습니다. (${result.message || '알 수 없는 오류'})`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('채팅방 생성 중 예외 발생:', error);
      toast({
        title: "오류",
        description: "채팅방 생성 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onLoginClick={() => {}} />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/board?category=missing')}
            className="hover:bg-gray-100"
          >
            ← 뒤로가기
          </Button>
        </div>

        {/* 사용자 정보 표시 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>테스트 사용자 정보</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Badge variant="default" className="text-lg px-4 py-2">
                현재 로그인한 사용자 ID: {currentUserId}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              게시글 작성자는 ID: {testPost.userId}입니다.
            </p>
          </CardContent>
        </Card>

        <div className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
          <div className="p-8">
            {/* 카테고리 배지 */}
            <div className="flex justify-between items-start mb-4">
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-sm">
                {testPost.lostType}
              </Badge>
            </div>

            {/* 품종 (제목 위치) */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6 leading-tight">
              {testPost.kindName}
            </h1>

            {/* 작성자 정보 */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{testPost.nickname}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(testPost.createdAt).toLocaleDateString('ko-KR')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>조회 123</span>
                </div>
              </div>
            </div>

            {/* 이미지 섹션 */}
            <div className="mb-8 bg-gray-50 rounded-2xl p-6">
              <div className="rounded-xl overflow-hidden shadow-md">
                <img
                  src={testPost.imageUrls[0]}
                  alt="실종/목격 사진"
                  className="w-full h-96 object-cover"
                />
              </div>
            </div>

            {/* 상세 정보 */}
            <div className="mb-8 bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">상세 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-600">성별:</span>
                  <span className="text-gray-800">{testPost.gender}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-600">나이:</span>
                  <span className="text-gray-800">{testPost.age}세</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-600">털색:</span>
                  <span className="text-gray-800">{testPost.furColor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-600">실종일:</span>
                  <span className="text-gray-800">{testPost.missingDate}</span>
                </div>
                <div className="flex items-center space-x-2 md:col-span-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-600">실종장소:</span>
                  <span className="text-gray-800">{testPost.regionName} {testPost.subRegionName} {testPost.missingLocation}</span>
                </div>
              </div>
            </div>

            {/* 연락처 및 채팅 */}
            <div className="mb-8 bg-primary/10 border border-primary/20 rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-semibold text-gray-800">연락처</span>
              </div>
              <div className="bg-background rounded-lg p-4 border border-primary/30">
                <p className="text-gray-700 mb-3">
                  실종된 반려동물을 목격하신 분은 아래 연락처로 연락 부탁드립니다.
                </p>
                <div className="flex items-center justify-between bg-primary/5 rounded-lg p-3">
                  <div>
                    <p className="font-medium text-gray-800">작성자: {testPost.nickname}</p>
                    <p className="text-primary font-semibold text-lg">전화: {testPost.phone}</p>
                  </div>
                </div>
              </div>
              
              {/* 채팅하기 버튼 */}
              <div className="mt-4">
                <Button 
                  onClick={handleChatClick}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                  disabled={currentUserId === testPost.userId}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {currentUserId === testPost.userId ? '자신과는 채팅할 수 없어요' : `${testPost.nickname}님과 채팅하기`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage6;