import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AppHeader from '@/components/AppHeader';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Calendar } from 'lucide-react';

interface FavoriteAdoption {
  desertionNo: string;
  processState: string;
  sexCd: string;
  kindFullNm: string;
  noticeNo: string;
  happenDt: string;
  happenPlace: string;
  popfile1: string;
}

const MyFavoriteAdoptionsUpdated = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteAdoption[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    fetchFavorites();
  }, [currentPage, isLoggedIn, navigate]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      console.log('🔑 토큰 확인 (찜한 공고):', token ? '토큰 존재' : '토큰 없음');
      
      const endpoint = `http://localhost:8080/api/v1/my/bookmarks?page=${currentPage}&size=${itemsPerPage}`;
      console.log('📡 API 호출 (찜한 공고):', endpoint);
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('📡 응답 상태 (찜한 공고):', response.status, response.statusText);
      
      if (response.ok) {
        const result = await response.json();
        console.log('📦 받은 데이터 (찜한 공고):', result);
        setFavorites(result.data.content);
        setTotalPages(result.data.totalPages);
        console.log('✅ 찜한 공고 설정됨:', result.data.content.length, '개');
      } else {
        console.error('❌ API 응답 실패 (찜한 공고):', response.status, await response.text());
      }
    } catch (error) {
      console.error('❌ 찜한 입양 공고 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = async (animal: FavoriteAdoption) => {
    try {
      // 해당 공고가 여전히 존재하는지 확인
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/v1/animals/${animal.desertionNo}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        navigate(`/animal/${animal.desertionNo}`);
      } else {
        alert('이미 종료된 공고입니다.');
      }
    } catch (error) {
      console.error('공고 확인 실패:', error);
      alert('이미 종료된 공고입니다.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    if (startPage > 0) {
      pages.push(
        <Button
          key={0}
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(0)}
          className="h-8 w-8 p-0"
        >
          1
        </Button>
      );
      if (startPage > 1) {
        pages.push(<span key="start-ellipsis" className="px-2">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(i)}
          className="h-8 w-8 p-0"
        >
          {i + 1}
        </Button>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push(<span key="end-ellipsis" className="px-2">...</span>);
      }
      pages.push(
        <Button
          key={totalPages - 1}
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(totalPages - 1)}
          className="h-8 w-8 p-0"
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader onLoginClick={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">데이터를 불러오는 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onLoginClick={() => {}} />
      
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">찜한 입양 공고</h1>
          <p className="text-gray-600">찜한 총 {favorites.length}개의 입양 공고</p>
        </div>

        {/* 찜한 입양 공고가 없는 경우 */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🐕</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              찜한 입양 공고가 아직 없습니다 🐾
            </h3>
            <p className="text-gray-500">
              마음에 드는 아이를 찜해보세요!
            </p>
          </div>
        ) : (
          <>
            {/* 찜한 입양 공고 목록 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {favorites.map((animal) => (
                <Card 
                  key={animal.desertionNo}
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-0 shadow-md"
                  onClick={() => handleCardClick(animal)}
                >
                  <CardContent className="p-0">
                    {/* 이미지 영역 */}
                    <div className="relative">
                      <img 
                        src={animal.popfile1} 
                        alt={animal.kindFullNm}
                        className="w-full h-48 object-cover rounded-t-lg"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=400&h=300&fit=crop';
                        }}
                      />
                      {/* 찜한 공고 뱃지 */}
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-red-500 text-white gap-1 shadow-sm">
                          <Heart className="w-3 h-3 fill-current" />
                          찜한 공고
                        </Badge>
                      </div>
                    </div>

                    {/* 콘텐츠 영역 */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{animal.kindFullNm}</h3>
                      
                      {/* 동물 정보 */}
                      <div className="space-y-1 text-sm mb-3">
                        <p><span className="text-gray-600">공고번호:</span> {animal.noticeNo}</p>
                        <p><span className="text-gray-600">품종:</span> {animal.kindFullNm}</p>
                        <p><span className="text-gray-600">성별:</span> {animal.sexCd === 'F' ? '암컷' : animal.sexCd === 'M' ? '수컷' : '모름'}</p>
                        <p><span className="text-gray-600">발견일:</span> {animal.happenDt}</p>
                        <p><span className="text-gray-600">발견장소:</span> {animal.happenPlace}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="h-8 px-3"
                >
                  이전
                </Button>
                
                {renderPagination()}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="h-8 px-3"
                >
                  다음
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default MyFavoriteAdoptionsUpdated;