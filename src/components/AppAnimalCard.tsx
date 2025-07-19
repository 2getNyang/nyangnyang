
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Calendar, User } from 'lucide-react';

interface Animal {
  // API 데이터 (추천 동물)
  desertionNo?: string;
  noticeNo?: string;
  kindFullNm?: string;
  sexCd?: string;
  happenPlace?: string;
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
  // API 데이터인지 확인 (desertionNo가 있으면 API 데이터)
  const isApiData = animal.desertionNo !== undefined;
  
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
            <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
          </div>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center space-x-2 text-gray-600">
            <User className="w-4 h-4" />
            <span className="text-sm">
              {isApiData ? getGenderText(animal.sexCd) : `${animal.age} • ${animal.gender}`}
            </span>
          </div>
          
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
          <Link to={`/animals/${animal.desertionNo}`} className="w-full">
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
