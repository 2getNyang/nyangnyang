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
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  furColor: string;
  weight: string;
  health: string;
  personality: string;
  location: string;
  arrivalDate: string;
  description: string;
  imageUrl?: string;
  shelter: string;
  contact: string;
  isNeutered: boolean;
  adoptionFee: string;
  adoptionStatus: string;
}

const Animals = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUserName] = useState('김철수');
  const [favorites, setFavorites] = useState<string[]>(['1', '3']);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [selectedBreed, setSelectedBreed] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const animalsPerPage = 12;

  // Mock data
  const mockAnimals: Animal[] = [
    {
      id: '1',
      name: '골디',
      species: 'dog',
      breed: '골든 리트리버',
      age: '3',
      gender: 'male',
      furColor: '황금색',
      weight: '25kg',
      health: '건강',
      personality: '온순하고 사람을 좋아함',
      location: '서울시 강남구',
      arrivalDate: '2024-01-15',
      description: '매우 친근하고 아이들과 잘 어울리는 골든 리트리버입니다.',
      imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop',
      shelter: '강남구 동물보호소',
      contact: '02-1234-5678',
      isNeutered: true,
      adoptionFee: '무료',
      adoptionStatus: 'available'
    },
    {
      id: '2',
      name: '나비',
      species: 'cat',
      breed: '코리안 숏헤어',
      age: '2',
      gender: 'female',
      furColor: '삼색',
      weight: '3.5kg',
      health: '건강',
      personality: '조용하고 독립적',
      location: '서울시 서초구',
      arrivalDate: '2024-02-01',
      description: '예쁜 삼색 고양이로 조용한 성격을 가지고 있습니다.',
      imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
      shelter: '서초구 동물보호소',
      contact: '02-2345-6789',
      isNeutered: true,
      adoptionFee: '무료',
      adoptionStatus: 'available'
    },
    {
      id: '3',
      name: '초코',
      species: 'dog',
      breed: '믹스견',
      age: '1',
      gender: 'male',
      furColor: '갈색',
      weight: '8kg',
      health: '건강',
      personality: '활발하고 장난기 많음',
      location: '서울시 송파구',
      arrivalDate: '2024-02-10',
      description: '어린 믹스견으로 매우 활발하고 에너지가 넘칩니다.',
      imageUrl: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400&h=300&fit=crop',
      shelter: '송파구 동물보호소',
      contact: '02-3456-7890',
      isNeutered: false,
      adoptionFee: '10만원',
      adoptionStatus: 'available'
    },
    {
      id: '4',
      name: '루나',
      species: 'cat',
      breed: '러시안 블루',
      age: '4',
      gender: 'female',
      furColor: '회색',
      weight: '4kg',
      health: '건강',
      personality: '우아하고 조용함',
      location: '경기도 성남시',
      arrivalDate: '2024-01-20',
      description: '고급스러운 러시안 블루 고양이입니다.',
      imageUrl: 'https://images.unsplash.com/photo-1606214174585-fe31582cd22c?w=400&h=300&fit=crop',
      shelter: '성남시 동물보호센터',
      contact: '031-1234-5678',
      isNeutered: true,
      adoptionFee: '무료',
      adoptionStatus: 'available'
    },
    {
      id: '5',
      name: '백설이',
      species: 'dog',
      breed: '말티즈',
      age: '5',
      gender: 'female',
      furColor: '흰색',
      weight: '3kg',
      health: '건강',
      personality: '애교 많고 사랑스러움',
      location: '인천시 남동구',
      arrivalDate: '2024-02-05',
      description: '작고 귀여운 말티즈로 애교가 많습니다.',
      imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop',
      shelter: '인천시 동물보호소',
      contact: '032-2345-6789',
      isNeutered: true,
      adoptionFee: '무료',
      adoptionStatus: 'available'
    },
    {
      id: '6',
      name: '호랑이',
      species: 'cat',
      breed: '벵갈',
      age: '3',
      gender: 'male',
      furColor: '호피색',
      weight: '5kg',
      health: '건강',
      personality: '활발하고 호기심 많음',
      location: '부산시 해운대구',
      arrivalDate: '2024-01-25',
      description: '야생적인 매력의 벵갈 고양이입니다.',
      imageUrl: 'https://images.unsplash.com/photo-1568043210943-a0e3f6149cc8?w=400&h=300&fit=crop',
      shelter: '부산시 동물보호센터',
      contact: '051-3456-7890',
      isNeutered: true,
      adoptionFee: '무료',
      adoptionStatus: 'available'
    }
  ];

  // 검색 및 필터링된 동물들
  const filteredAnimals = useMemo(() => {
    return mockAnimals.filter(animal => {
      const matchesSearch = searchTerm === '' || 
        animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSpecies = selectedSpecies === 'all' || animal.species === selectedSpecies;
      const matchesBreed = selectedBreed === 'all' || animal.breed === selectedBreed;
      const matchesCity = selectedCity === 'all' || animal.location.includes(selectedCity);
      const matchesDistrict = selectedDistrict === 'all' || animal.location.includes(selectedDistrict);
      
      return matchesSearch && matchesSpecies && matchesBreed && matchesCity && matchesDistrict;
    });
  }, [mockAnimals, searchTerm, selectedSpecies, selectedBreed, selectedCity, selectedDistrict]);

  // 페이지네이션
  const totalPages = Math.ceil(filteredAnimals.length / animalsPerPage);
  const startIndex = (currentPage - 1) * animalsPerPage;
  const endIndex = startIndex + animalsPerPage;
  const currentAnimals = filteredAnimals.slice(startIndex, endIndex);

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
    setSearchTerm('');
    setSelectedSpecies('all');
    setSelectedBreed('all');
    setSelectedCity('all');
    setSelectedDistrict('all');
    setCurrentPage(1);
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
            {/* 검색바 */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="동물 이름, 품종, 지역으로 검색하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* 필터 옵션 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
                <SelectTrigger>
                  <SelectValue placeholder="동물 종류" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="dog">개</SelectItem>
                  <SelectItem value="cat">고양이</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedBreed} onValueChange={setSelectedBreed}>
                <SelectTrigger>
                  <SelectValue placeholder="품종" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="골든 리트리버">골든 리트리버</SelectItem>
                  <SelectItem value="믹스견">믹스견</SelectItem>
                  <SelectItem value="코리안 숏헤어">코리안 숏헤어</SelectItem>
                  <SelectItem value="러시안 블루">러시안 블루</SelectItem>
                  <SelectItem value="말티즈">말티즈</SelectItem>
                  <SelectItem value="벵갈">벵갈</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="시/도" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="서울시">서울시</SelectItem>
                  <SelectItem value="경기도">경기도</SelectItem>
                  <SelectItem value="인천시">인천시</SelectItem>
                  <SelectItem value="부산시">부산시</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="구/군" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="강남구">강남구</SelectItem>
                  <SelectItem value="서초구">서초구</SelectItem>
                  <SelectItem value="송파구">송파구</SelectItem>
                  <SelectItem value="성남시">성남시</SelectItem>
                  <SelectItem value="남동구">남동구</SelectItem>
                  <SelectItem value="해운대구">해운대구</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 초기화 버튼 */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
                <X className="w-4 h-4" />
                필터 초기화
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
                    <p className="text-sm text-gray-600">{animal.breed}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      <span>{animal.age}세 • {animal.gender === 'male' ? '수컷' : '암컷'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      <span>보호 시작: {animal.arrivalDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span>{animal.location}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <Badge variant={animal.gender === 'male' ? 'default' : 'secondary'} className="text-xs">
                      {animal.gender === 'male' ? '수컷' : '암컷'}
                    </Badge>
                    {animal.isNeutered && (
                      <Badge variant="outline" className="text-xs">중성화 완료</Badge>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {animal.personality}
                  </p>
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
            <Button onClick={resetFilters}>필터 초기화</Button>
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              이전
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                if (totalPages <= 7) return true;
                if (page === 1 || page === totalPages) return true;
                if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                return false;
              })
              .map((page, index, array) => {
                const showEllipsis = index > 0 && array[index - 1] < page - 1;
                return (
                  <React.Fragment key={page}>
                    {showEllipsis && <span className="px-2">...</span>}
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="w-10"
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                );
              })}
            
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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