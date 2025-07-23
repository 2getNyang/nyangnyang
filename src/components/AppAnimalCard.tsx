
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Calendar, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Animal {
  // API 데이터 (추천 동물)
  desertionNo?: string;
  noticeNo?: string;
  kindFullNm?: string;
  sexCd?: string;
  happenPlace?: string;
  happenDt?: string;
  processState?: string;
  popfile1?: string;
  // Mock 데이터 (기존 하위 호환성)
  id?: string;
  name?: string;
  species?: string;
  breed?: string;
  age?: string;
  gender?: string;
  location?: string;
  rescueDate?: string;
  description?: string;
  personality?: string[];
  isUrgent?: boolean;
  imageUrl?: string;
}

interface AppAnimalCardProps {
  animal: Animal;
}

const AppAnimalCard = ({ animal }: AppAnimalCardProps) => {
  const { isLoggedIn } = useAuth();
  // API 데이터인지 확인 (desertionNo가 있으면 API 데이터)
  const isApiData = animal.desertionNo !== undefined;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // 성별 변환 함수
  const getGenderText = (sexCd?: string) => {
    if (!sexCd) return '';
    switch (sexCd) {
      case 'M': return '수컷';
      case 'F': return '암컷';
      case 'Q': return '미상';
      default: return sexCd;
    }
  };

  // processState에 따른 뱃지 스타일
  const getProcessStateStyle = (processState?: string) => {
    if (!processState) return { className: '', text: '' };
    
    if (processState === '보호중') {
      return {
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200 rounded-full',
        text: processState
      };
    } else if (processState.includes('종료')) {
      return {
        className: 'bg-gray-100 text-gray-800 border-gray-200 rounded-full',
        text: processState
      };
    }
    
    return {
      className: 'bg-blue-100 text-blue-800 border-blue-200 rounded-full',
      text: processState
    };
  };

  const processStyle = getProcessStateStyle(animal.processState);

  // 찜 상태 확인
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!isLoggedIn || !isApiData || !animal.desertionNo) return;
      
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch(`/api/v1/bookmark/${animal.desertionNo}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          credentials: 'include',
        });
        
        if (response.ok) {
          const result = await response.json();
          setIsBookmarked(result.data === true);
        }
      } catch (error) {
        console.error('찜 상태 확인 오류:', error);
      }
    };

    checkBookmarkStatus();
  }, [isLoggedIn, isApiData, animal.desertionNo]);

  // 찜 추가/삭제 핸들러
  const handleBookmarkToggle = async () => {
    if (!isLoggedIn) {
      toast({
        title: "로그인 필요",
        description: "찜 기능을 사용하려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    if (!isApiData || !animal.desertionNo) return;

    setIsLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      const method = isBookmarked ? 'DELETE' : 'POST';
      
      const response = await fetch(`/api/v1/bookmark/${animal.desertionNo}`, {
        method,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        setIsBookmarked(result.data.liked);
        toast({
          title: result.data.liked ? "찜하기 성공" : "찜 취소 성공",
          description: result.message,
        });
      } else {
        toast({
          title: "오류",
          description: "찜 처리 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('찜 처리 오류:', error);
      toast({
        title: "오류",
        description: "네트워크 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white rounded-2xl overflow-hidden hover:scale-[1.02]">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={isApiData ? animal.popfile1 : (animal.imageUrl || 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop')}
          alt={isApiData ? animal.noticeNo : animal.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=400&h=300&fit=crop';
          }}
        />
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {isApiData ? animal.noticeNo : animal.name}
            </h3>
            <p className="text-gray-600 text-sm">
              {isApiData ? animal.kindFullNm : `${animal.species} • ${animal.breed}`}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {!isApiData && animal.isUrgent && (
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">
                긴급
              </Badge>
            )}
            {isApiData ? (
              <button 
                onClick={handleBookmarkToggle}
                disabled={isLoading}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Heart 
                  className={`w-5 h-5 transition-colors ${
                    isBookmarked 
                      ? 'text-red-500 fill-red-500' 
                      : 'text-gray-400 hover:text-red-500'
                  } ${isLoading ? 'opacity-50' : ''}`}
                />
              </button>
            ) : (
              <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
            )}
          </div>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center space-x-2 text-gray-600">
            <User className="w-4 h-4" />
            <span className="text-sm">
              {isApiData ? getGenderText(animal.sexCd) : `${animal.age} • ${animal.gender}`}
            </span>
          </div>
          
          {isApiData && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">발견일: {animal.happenDt}</span>
            </div>
          )}
          
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{isApiData ? animal.happenPlace : animal.location}</span>
          </div>
          
          {!isApiData && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">구조일: {animal.rescueDate}</span>
            </div>
          )}
        </div>
        
        {/* API 데이터인 경우 processState 표시, mock 데이터인 경우 기존 설명 */}
        {isApiData ? (
          <div className="mb-4">
            {animal.processState && (
              <Badge 
                className={`text-xs ${processStyle.className}`}
                variant="outline"
              >
                {processStyle.text}
              </Badge>
            )}
          </div>
        ) : (
          <>
            <p className="text-gray-700 text-sm mb-4 line-clamp-2">
              {animal.description}
            </p>
            
            <div className="flex flex-wrap gap-1">
              {animal.personality?.slice(0, 3).map((trait, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs"
                >
                  {trait}
                </Badge>
              ))}
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        {isApiData ? (
          <Link to={`/animal/${animal.desertionNo}`} className="w-full">
            <button className="w-full golden hover:bg-yellow-500 text-gray-800 font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-md">
              자세히 보기
            </button>
          </Link>
        ) : (
          <button className="w-full golden hover:bg-yellow-500 text-gray-800 font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-md">
            자세히 보기
          </button>
        )}
      </CardFooter>
    </Card>
  );
};

export default AppAnimalCard;
