import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppHeaderWithModal from '@/components/AppHeaderWithModal';
import Footer from '@/components/Footer';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, MapPin, Calendar, User, Search, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface Animal {
  desertionNo: string;
  processState: string;
  sexCd: string;
  kindFullNm: string;
  noticeNo: string;
  happenDt: string;
  happenPlace: string;
  popfile1: string;
  upKindCd: string;
  upKindNm: string;
  kindCd: string;
  kindNm: string;
  regionCode: string;
  regionName: string;
  subRegionCode: string;
  subRegionName: string;
}

interface AnimalsResponse {
  code: number;
  data: {
    content: Animal[];
    pageable: {
      pageNumber: number;
      pageSize: number;
    };
    last: boolean;
    totalPages: number;
    totalElements: number;
    first: boolean;
    numberOfElements: number;
  };
  message: string;
}

const Animals = () => {
  const { user, isLoggedIn } = useAuth();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});
  
  // 검색 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedAnimalType, setSelectedAnimalType] = useState('all');
  const [selectedAge, setSelectedAge] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');

  const animalsPerPage = 12;

  // API 호출
  const fetchAnimals = async (page: number = 0) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/v1/animals?page=${page}&size=${animalsPerPage}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        }
      });
      
      if (response.ok) {
        const result: AnimalsResponse = await response.json();
        setAnimals(result.data.content);
        setCurrentPage(result.data.pageable.pageNumber);
        setTotalPages(result.data.totalPages);
        setTotalElements(result.data.totalElements);
      } else {
        toast({
          title: "데이터 로드 실패",
          description: "동물 목록을 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching animals:', error);
      toast({
        title: "네트워크 오류",
        description: "서버와 연결할 수 없습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 북마크 상태 확인
  const checkBookmarkStatus = async (desertionNo: string) => {
    if (!isLoggedIn) return;
    
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/v1/bookmark/${desertionNo}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setBookmarks(prev => ({
          ...prev,
          [desertionNo]: result.data
        }));
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };

  // 북마크 토글
  const toggleBookmark = async (desertionNo: string) => {
    if (!isLoggedIn) {
      toast({
        title: "로그인 필요",
        description: "찜하기 기능은 로그인 후 이용 가능합니다.",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const isCurrentlyBookmarked = bookmarks[desertionNo];
    const method = isCurrentlyBookmarked ? 'DELETE' : 'POST';
    
    try {
      const response = await fetch(`http://localhost:8080/api/v1/bookmark/${desertionNo}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setBookmarks(prev => ({
          ...prev,
          [desertionNo]: result.data.liked
        }));
        
        toast({
          title: result.data.liked ? "찜 추가됨" : "찜 해제됨",
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "오류 발생",
        description: "찜하기 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  useEffect(() => {
    if (isLoggedIn && animals.length > 0) {
      animals.forEach(animal => {
        checkBookmarkStatus(animal.desertionNo);
      });
    }
  }, [isLoggedIn, animals]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');
  };

  const getProcessStateBadge = (processState: string) => {
    if (processState === '보호중') {
      return { text: '보호중', className: '' };
    }
    return { text: processState, className: '' };
  };

  const getSexDisplay = (sexCd: string) => {
    switch (sexCd) {
      case 'F': return '암컷';
      case 'M': return '수컷';
      case 'Q': return '모름';
      default: return '모름';
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAnimals(page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeaderWithModal />
      
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 제목 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">입양 동물 찾기</h1>
          <p className="text-gray-600">새로운 가족을 기다리는 아이들을 만나보세요</p>
        </div>

        {/* 검색 및 필터링 */}
        <div className="mb-8 bg-white rounded-lg p-6 shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* 검색어 입력 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="동물 이름, 품종, 지역으로 검색하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 지역 선택 */}
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="서울">서울특별시</SelectItem>
                <SelectItem value="부산">부산광역시</SelectItem>
                <SelectItem value="대구">대구광역시</SelectItem>
                <SelectItem value="인천">인천광역시</SelectItem>
                <SelectItem value="광주">광주광역시</SelectItem>
                <SelectItem value="대전">대전광역시</SelectItem>
                <SelectItem value="울산">울산광역시</SelectItem>
                <SelectItem value="세종">세종특별자치시</SelectItem>
                <SelectItem value="경기">경기도</SelectItem>
                <SelectItem value="충북">충청북도</SelectItem>
                <SelectItem value="충남">충청남도</SelectItem>
                <SelectItem value="전북">전북특별자치도</SelectItem>
                <SelectItem value="전남">전라남도</SelectItem>
                <SelectItem value="경북">경상북도</SelectItem>
                <SelectItem value="경남">경상남도</SelectItem>
                <SelectItem value="제주">제주특별자치도</SelectItem>
              </SelectContent>
            </Select>

            {/* 동물 종류 선택 */}
            <Select value={selectedAnimalType} onValueChange={setSelectedAnimalType}>
              <SelectTrigger>
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="개">개</SelectItem>
                <SelectItem value="고양이">고양이</SelectItem>
                <SelectItem value="기타">기타</SelectItem>
              </SelectContent>
            </Select>

            {/* 나이 선택 */}
            <Select value={selectedAge} onValueChange={setSelectedAge}>
              <SelectTrigger>
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="어린">어린</SelectItem>
                <SelectItem value="성인">성인</SelectItem>
                <SelectItem value="노령">노령</SelectItem>
              </SelectContent>
            </Select>

            {/* 성별 선택 */}
            <Select value={selectedGender} onValueChange={setSelectedGender}>
              <SelectTrigger>
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="M">수컷</SelectItem>
                <SelectItem value="F">암컷</SelectItem>
              </SelectContent>
            </Select>

            {/* 필터 초기화 버튼 */}
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedRegion('all');
                setSelectedAnimalType('all');
                setSelectedAge('all');
                setSelectedGender('all');
              }}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              필터 초기화
            </Button>
          </div>
        </div>

        {/* 검색 결과 카운트 */}
        <div className="mb-6">
          <p className="text-gray-600">
            총 <span className="font-semibold text-blue-600">{totalElements}</span>마리의 동물이 있습니다.
          </p>
        </div>

        {/* 동물 카드 리스트 */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">데이터를 불러오는 중...</p>
          </div>
        ) : animals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {animals.map((animal) => {
              const processState = getProcessStateBadge(animal.processState);
              return (
                <Card key={animal.desertionNo} className="h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
                    <img 
                      src={animal.popfile1 || 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop'}
                      alt={animal.kindFullNm}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                      onClick={() => toggleBookmark(animal.desertionNo)}
                    >
                      <Heart 
                        className={`w-4 h-4 ${
                          bookmarks[animal.desertionNo] 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-400'
                        }`} 
                      />
                    </Button>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="mb-3">
                      <h3 className="font-bold text-gray-800 mb-1">{animal.noticeNo}</h3>
                      <p className="text-sm text-gray-600 mb-1">{animal.kindFullNm}</p>
                      <p className="text-sm text-gray-500">{getSexDisplay(animal.sexCd)}</p>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        <span>발견일: {formatDate(animal.happenDt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        <span>{animal.happenPlace}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-3">
                      <Badge 
                        className="text-xs"
                        style={{
                          backgroundColor: animal.processState === '보호중' ? '#FEF9C3' : '#F3F4F6',
                          color: animal.processState === '보호중' ? '#B79458' : '#1F2937',
                          border: 'none'
                        }}
                      >
                        {processState.text}
                      </Badge>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="p-4 pt-0">
                    <Link to={`/animal/${animal.desertionNo}`} className="w-full">
                      <Button className="w-full">상세보기</Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">동물 목록이 없습니다.</p>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
            >
              이전
            </Button>
            
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
              const pageNum = currentPage < 5 ? i : currentPage - 5 + i;
              if (pageNum >= totalPages) return null;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => handlePageChange(pageNum)}
                  className="w-10"
                >
                  {pageNum + 1}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
            >
              다음
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Animals;