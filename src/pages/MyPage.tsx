import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  FileText, 
  Heart, 
  MessageSquare, 
  ClipboardList 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AppHeader from '@/components/AppHeader';
import Footer from '@/components/Footer';

const MyPage = () => {
  const navigate = useNavigate();
  // 임시 로그인 상태 - 실제로는 전역 상태 관리나 props로 받아야 함
  const isLoggedIn = true;
  const userName = '김철수';

  const menuItems = [
    {
      id: 'edit-profile',
      title: '내 정보 수정',
      description: '회원 정보(이름, 비밀번호 등)를 수정하는 화면으로 이동',
      icon: User,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      id: 'adoption-applications',
      title: '입양 신청 내역 조회',
      description: '지금까지 내가 신청한 입양 신청 기록을 볼 수 있음',
      icon: ClipboardList,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      id: 'my-posts',
      title: '내가 작성한 게시글',
      description: '커뮤니티에 남긴 게시글 목록 확인',
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      id: 'favorite-adoptions',
      title: '찜한 입양 공고',
      description: '찜한 동물 리스트',
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      id: 'liked-posts',
      title: '좋아요 한 게시글',
      description: '좋아요를 누른 게시글 리스트',
      icon: MessageSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const handleMenuClick = (menuId: string) => {
    switch (menuId) {
      case 'edit-profile':
        navigate('/edit-profile');
        break;
      case 'my-posts':
        navigate('/my-posts');
        break;
      case 'liked-posts':
        navigate('/my-liked-posts');
        break;
      case 'favorite-adoptions':
        navigate('/my-favorite-adoptions');
        break;
      case 'adoption-applications':
      default:
        console.log(`${menuId} 페이지는 아직 구현되지 않았습니다.`);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        onLoginClick={() => {}}
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogout={() => {}}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">마이페이지</h1>
          <p className="text-gray-600">{userName}님, 안녕하세요!</p>
        </div>

        {/* 메뉴 카드들 */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Card 
                key={item.id}
                className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-0 shadow-md"
                onClick={() => handleMenuClick(item.id)}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center mb-4`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 추가 정보 섹션 */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                도움이 필요하신가요?
              </h3>
              <p className="text-gray-600 mb-4">
                서비스 이용 중 궁금한 점이 있으시면 언제든 문의해 주세요.
              </p>
              <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                고객센터 문의
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MyPage;