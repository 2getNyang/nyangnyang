import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Calendar } from 'lucide-react';
import { adoptionAnimals } from '@/data/mockPosts';

const MyFavoriteAdoptions = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUserName] = useState('김철수');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;
  const navigate = useNavigate();

  // 임시로 찜한 입양 공고 (실제로는 API에서 가져올 데이터)
  const favoriteAdoptionIds = ['adopt-1']; // 사용자가 찜한 입양 공고 ID들
  const favoriteAdoptions = adoptionAnimals.filter(animal => favoriteAdoptionIds.includes(animal.id));

  const totalPages = Math.ceil(favoriteAdoptions.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentAnimals = favoriteAdoptions.slice(startIndex, startIndex + postsPerPage);

  const handleCardClick = (animal: any) => {
    navigate(`/adoption/${animal.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        onLoginClick={() => {}}
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogout={() => setIsLoggedIn(false)}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">찜한 입양 공고</h1>
          <p className="text-gray-600">{userName}님이 찜한 총 {favoriteAdoptions.length}개의 입양 공고</p>
        </div>

        {/* 찜한 입양 공고가 없는 경우 */}
        {favoriteAdoptions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🐕</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              찜한 입양 공고가 아직 없습니다 🐾
            </h3>
            <p className="text-gray-500">
              마음에 드는 아이를 찜해보세요!
            </p>
          </div>
        ) : currentAnimals.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              해당 페이지에 표시할 공고가 없습니다
            </h3>
          </div>
        ) : (
          <>
            {/* 찜한 입양 공고 목록 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentAnimals.map((animal) => (
                <Card 
                  key={animal.id}
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-0 shadow-md"
                  onClick={() => handleCardClick(animal)}
                >
                  <CardContent className="p-0">
                    {/* 이미지 영역 */}
                    <div className="relative">
                      <img 
                        src={animal.imageUrl} 
                        alt={animal.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {/* 찜한 공고 뱃지 */}
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-red-500 text-white gap-1 shadow-sm">
                          <Heart className="w-3 h-3 fill-current" />
                          찜한 공고
                        </Badge>
                      </div>
                      {/* 긴급 뱃지 (필요한 경우) */}
                      {animal.isUrgent && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-red-600 text-white">
                            긴급
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* 콘텐츠 영역 */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-800">{animal.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {animal.species}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">
                        {animal.breed} • {animal.age} • {animal.gender}
                      </p>

                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{animal.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>구조일: {formatDate(animal.rescueDate)}</span>
                        </div>
                      </div>

                      {/* 성격 태그 */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {animal.personality.slice(0, 2).map((trait: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {trait}
                          </Badge>
                        ))}
                        {animal.personality.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{animal.personality.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default MyFavoriteAdoptions;