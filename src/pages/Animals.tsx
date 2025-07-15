import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import Footer from '@/components/Footer';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, MapPin, Calendar, User, Search, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ApiResponse, ApiAnimal } from '@/types/boardList';

interface Animal {
  id: string;
  noticeNumber: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  location: string;
  foundDate: string;
  foundPlace: string;
  description: string;
  personality: string[];
  isUrgent: boolean;
  protectionStatus: string;
  color: string;
  shelter: string;
  imageUrl?: string;
}

const Animals = () => {
  const [selectedCategory, setSelectedCategory] = useState<'adoption' | 'review' | 'sns' | 'lost'>('lost'); // 기본값 lost
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUserName] = useState('김철수');
  const [favorites, setFavorites] = useState<string[]>(['1', '3']);
  const [currentPage, setCurrentPage] = useState(0); // API는 0부터 시작
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filters, setFilters] = useState({
    noticeNumber: '',
    species: '',
    breed: '',
    city: '',
    district: ''
  });
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const animalsPerPage = 12;

  // 카테고리 ID 매핑
  const getCategoryId = (category: string): number => {
    const categoryMap = {
      'adoption': 1,
      'review': 2, 
      'sns': 3,
      'lost': 4
    };
    return categoryMap[category as keyof typeof categoryMap] || 4;
  };

  // API 호출 함수
  const fetchAnimals = async (page: number = 0, category: string = selectedCategory) => {
    setLoading(true);
    try {
      const categoryId = getCategoryId(category);
      const url = `http://localhost:8080/api/v1/boards/${categoryId}?page=${page}&size=${animalsPerPage}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch animals');
      }
      
      const data: ApiResponse = await response.json();
      
      // API 데이터를 Animal 인터페이스에 맞게 변환
      const transformedAnimals: Animal[] = data.data.content.map(apiAnimal => ({
        id: apiAnimal.boardId.toString(),
        noticeNumber: apiAnimal.boardId.toString(),
        name: apiAnimal.kindName || '이름 없음',
        species: getSpeciesFromKindName(apiAnimal.kindName),
        breed: apiAnimal.kindName || '',
        age: `${apiAnimal.age}세`,
        gender: apiAnimal.gender === '수컷' ? '수컷' : '암컷',
        location: apiAnimal.missingLocation || '',
        foundDate: apiAnimal.missingDate || '',
        foundPlace: apiAnimal.missingLocation || '',
        description: '',
        personality: [],
        isUrgent: false,
        protectionStatus: apiAnimal.lostType === '실종' ? '실종' : '목격',
        color: apiAnimal.furColor || '',
        shelter: apiAnimal.nickName || '',
        imageUrl: apiAnimal.thumbnailUrl || 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=400&h=300&fit=crop'
      }));
      
      setAnimals(transformedAnimals);
      setTotalElements(data.data.totalElements);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      console.error('Error fetching animals:', error);
      toast({
        title: "데이터 로드 실패",
        description: "동물 정보를 불러오는데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // kindName에서 축종 추출
  const getSpeciesFromKindName = (kindName: string): string => {
    if (!kindName) return '';
    // 개 품종들
    const dogBreeds = ['골든 리트리버', '그레이 하운드', '미텔 스피츠', '말티즈', '진돗개', '믹스견'];
    // 고양이 품종들
    const catBreeds = ['레그돌', '브리티쉬롱헤어', '러시안 블루', '데본 렉스', '코리안숏헤어'];
    
    if (dogBreeds.some(breed => kindName.includes(breed))) return '개';
    if (catBreeds.some(breed => kindName.includes(breed))) return '고양이';
    
    // 기본적으로 품종명에 따라 추정
    if (kindName.includes('개') || kindName.includes('리트리버') || kindName.includes('하운드')) return '개';
    if (kindName.includes('고양이') || kindName.includes('숏헤어') || kindName.includes('롱헤어')) return '고양이';
    
    return '기타';
  };

  // 컴포넌트 마운트 시 API 호출
  useEffect(() => {
    fetchAnimals(currentPage, selectedCategory);
  }, [currentPage, selectedCategory]);

  // 검색 및 필터링된 동물들 (클라이언트 사이드 필터링)
  const filteredAnimals = useMemo(() => {
    return animals.filter(animal => {
      // 키워드 검색
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        const searchFields = [
          animal.noticeNumber,
          animal.breed,
          animal.color,
          animal.shelter
        ].join(' ').toLowerCase();
        
        if (!searchFields.includes(keyword)) {
          return false;
        }
      }

      // 필터 적용
      if (filters.noticeNumber && !animal.noticeNumber.includes(filters.noticeNumber)) {
        return false;
      }
      if (filters.species && filters.species !== 'all' && animal.species !== filters.species) {
        return false;
      }
      if (filters.breed && filters.breed !== 'all' && !animal.breed.includes(filters.breed)) {
        return false;
      }
      if (filters.city && filters.city !== 'all' && !animal.location.includes(filters.city)) {
        return false;
      }
      if (filters.district && filters.district !== 'all' && !animal.location.includes(filters.district)) {
        return false;
      }

      return true;
    });
  }, [animals, searchKeyword, filters]);

  // 찜하기 토글
  const toggleFavorite = (animalId: string) => {
    if (!isLoggedIn) {
      toast({
        title: "로그인 필요",
        description: "찜하기 기능은 로그인 후 이용 가능합니다.",
        variant: "destructive",
      });
      return;
    }

    setFavorites(prev => {
      const newFavorites = prev.includes(animalId)
        ? prev.filter(id => id !== animalId)
        : [...prev, animalId];
      
      toast({
        title: prev.includes(animalId) ? "찜 해제됨" : "찜 추가됨",
        description: prev.includes(animalId) 
          ? "찜 목록에서 제거되었습니다." 
          : "찜 목록에 추가되었습니다.",
      });
      
      return newFavorites;
    });
  };

  // 필터 초기화
  const resetFilters = () => {
    setSearchKeyword('');
    setFilters({
      noticeNumber: '',
      species: '',
      breed: '',
      city: '',
      district: ''
    });
    setCurrentPage(0);
  };

  // 페이지 변경
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
        {/* 페이지 제목 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">게시판</h1>
          <p className="text-gray-600">다양한 카테고리의 게시글을 확인하세요</p>
        </div>

        {/* 카테고리 선택 */}
        <div className="mb-8">
          <div className="flex justify-center">
            <div className="flex bg-white rounded-lg shadow-sm border p-1">
              {[
                { key: 'adoption', label: '입양 공고', id: 1 },
                { key: 'review', label: '입양 후기', id: 2 },
                { key: 'sns', label: 'SNS 홍보', id: 3 },
                { key: 'lost', label: '실종/목격', id: 4 }
              ].map((category) => (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? "default" : "ghost"}
                  onClick={() => {
                    setSelectedCategory(category.key as any);
                    setCurrentPage(0);
                  }}
                  className="mx-1"
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* 검색 및 필터 영역 */}
        <Card className="mb-8">
          <CardContent className="p-6">
            {/* 키워드 검색 */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="공고번호, 품종, 털색, 보호소명으로 검색하세요"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* 필터 옵션 */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <Input
                placeholder="공고번호"
                value={filters.noticeNumber}
                onChange={(e) => setFilters(prev => ({ ...prev, noticeNumber: e.target.value }))}
              />
              
              <Select value={filters.species} onValueChange={(value) => setFilters(prev => ({ ...prev, species: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="축종" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="개">개</SelectItem>
                  <SelectItem value="고양이">고양이</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.breed} onValueChange={(value) => setFilters(prev => ({ ...prev, breed: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="품종" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="믹스견">믹스견</SelectItem>
                  <SelectItem value="코리안숏헤어">코리안숏헤어</SelectItem>
                  <SelectItem value="말티즈">말티즈</SelectItem>
                  <SelectItem value="진돗개">진돗개</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.city} onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="시도" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="서울시">서울시</SelectItem>
                  <SelectItem value="부산시">부산시</SelectItem>
                  <SelectItem value="대구시">대구시</SelectItem>
                  <SelectItem value="인천시">인천시</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.district} onValueChange={(value) => setFilters(prev => ({ ...prev, district: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="시군구" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="강남구">강남구</SelectItem>
                  <SelectItem value="서초구">서초구</SelectItem>
                  <SelectItem value="송파구">송파구</SelectItem>
                  <SelectItem value="강동구">강동구</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 초기화 버튼 */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
                <X className="w-4 h-4" />
                검색 조건 초기화
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 검색 결과 카운트 */}
        <div className="mb-6">
          <p className="text-gray-600">
            총 <span className="font-semibold text-blue-600">{filteredAnimals.length}</span>마리의 동물이 있습니다.
          </p>
        </div>

        {/* 동물 카드 리스트 */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">데이터를 불러오는 중...</p>
          </div>
        ) : filteredAnimals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {filteredAnimals.map((animal) => (
              <Card key={animal.id} className="h-full hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-[4/3] overflow-hidden rounded-t-lg relative">
                  <img 
                    src={animal.imageUrl}
                    alt={animal.name}
                    className="w-full h-full object-cover"
                  />
                  {animal.isUrgent && (
                    <Badge className="absolute top-2 left-2 bg-red-100 text-red-800">
                      긴급
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={() => toggleFavorite(animal.id)}
                  >
                    <Heart 
                      className={`w-4 h-4 ${
                        favorites.includes(animal.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-gray-400'
                      }`} 
                    />
                  </Button>
                </div>
                
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="font-bold text-gray-800 mb-1">{animal.name}</h3>
                    <p className="text-sm text-gray-600">공고번호: {animal.noticeNumber}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span>{animal.species} • {animal.breed} • {animal.gender}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>발견일: {animal.foundDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>{animal.foundPlace}</span>
                    </div>
                  </div>

                  <Badge variant="secondary" className="mb-3">
                    {animal.protectionStatus}
                  </Badge>
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Link to={`/animal/${animal.id}`} className="w-full">
                    <Button className="w-full">상세보기</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">검색 조건에 맞는 동물이 없습니다.</p>
            <Button onClick={resetFilters}>검색 조건 초기화</Button>
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
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (currentPage <= 2) {
                pageNum = i;
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => handlePageChange(pageNum)}
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