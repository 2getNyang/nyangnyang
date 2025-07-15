import React, { useState, useMemo } from 'react';
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
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUserName] = useState('김철수');
  const [favorites, setFavorites] = useState<string[]>(['1', '3']);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filters, setFilters] = useState({
    noticeNumber: '',
    species: '',
    breed: '',
    city: '',
    district: ''
  });

  const animalsPerPage = 12;

  // Mock data for animals
  const allAnimals: Animal[] = [
    {
      id: '1',
      noticeNumber: 'A2024070001',
      name: '초코',
      species: '개',
      breed: '믹스견',
      age: '3세',
      gender: '수컷',
      location: '서울시 강남구',
      foundDate: '2024-06-15',
      foundPlace: '강남역 근처',
      description: '매우 온순하고 사람을 좋아하는 초코입니다.',
      personality: ['온순함', '사람좋아함'],
      isUrgent: false,
      protectionStatus: '보호중',
      color: '갈색',
      shelter: '강남구 보호소',
      imageUrl: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=400&h=300&fit=crop'
    },
    // ... 더 많은 동물 데이터를 추가하여 페이징 테스트
    ...Array.from({ length: 50 }, (_, i) => ({
      id: `${i + 2}`,
      noticeNumber: `A202407${String(i + 2).padStart(4, '0')}`,
      name: `동물${i + 2}`,
      species: i % 2 === 0 ? '개' : '고양이',
      breed: i % 2 === 0 ? '믹스견' : '코리안숏헤어',
      age: `${(i % 5) + 1}세`,
      gender: i % 2 === 0 ? '수컷' : '암컷',
      location: `서울시 ${['강남구', '서초구', '송파구', '강동구'][i % 4]}`,
      foundDate: `2024-06-${String((i % 30) + 1).padStart(2, '0')}`,
      foundPlace: `${['역 근처', '공원', '주택가', '상가'][i % 4]}`,
      description: `귀여운 동물${i + 2}입니다.`,
      personality: ['온순함', '활발함'][i % 2] ? ['온순함'] : ['활발함'],
      isUrgent: i % 10 === 0,
      protectionStatus: '보호중',
      color: ['갈색', '검은색', '흰색', '회색'][i % 4],
      shelter: `${['강남구', '서초구', '송파구', '강동구'][i % 4]} 보호소`,
      imageUrl: i % 2 === 0 
        ? 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=400&h=300&fit=crop'
        : 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop'
    }))
  ];

  // 검색 및 필터링 로직
  const filteredAnimals = useMemo(() => {
    return allAnimals.filter(animal => {
      // 키워드 검색
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        const searchFields = [
          animal.noticeNumber,
          animal.description,
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
      if (filters.breed && filters.breed !== 'all' && animal.breed !== filters.breed) {
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
  }, [searchKeyword, filters]);

  // 페이징 계산
  const totalPages = Math.ceil(filteredAnimals.length / animalsPerPage);
  const startIndex = (currentPage - 1) * animalsPerPage;
  const currentAnimals = filteredAnimals.slice(startIndex, startIndex + animalsPerPage);

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
    setCurrentPage(1);
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">입양 동물 찾기</h1>
          <p className="text-gray-600">새로운 가족을 기다리는 아이들을 만나보세요</p>
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
        {currentAnimals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {currentAnimals.map((animal) => (
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
              disabled={currentPage === 1}
            >
              이전
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
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