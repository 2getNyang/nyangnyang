
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppHeaderWithModal from '@/components/AppHeaderWithModal';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious, 
  PaginationEllipsis 
} from '@/components/ui/pagination';
import { Search, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';


interface ShelterData {
  careRegNumber: string;
  careName: string;
  careTel: string;
  regionName: string;
  subRegionName: string;
}

interface ShelterResponse {
  content: ShelterData[];
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

const Shelters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedCity, setSelectedCity] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [shelters, setShelters] = useState<ShelterData[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  
  const itemsPerPage = 12; // 4열 x 3행

  // 보호소 데이터 가져오기
  const fetchShelters = async (page: number = 0, search?: string, province?: string, city?: string) => {
    try {
      setLoading(true);
      let url = '';
      
      // 검색 조건이 있으면 필터 API 사용
      if (search || (province && province !== 'all') || (city && city !== 'all')) {
        url = `http://localhost:8080/api/v1/shelters/filter?page=${page}&size=${itemsPerPage}`;
        
        if (province && province !== 'all') {
          url += `&regionName=${encodeURIComponent(province)}`;
        }
        if (city && city !== 'all') {
          url += `&subRegionName=${encodeURIComponent(city)}`;
        }
        if (search) {
          url += `&careName=${encodeURIComponent(search)}`;
        }
      } else {
        // 기본 전체 조회 API
        url = `http://localhost:8080/api/v1/shelters?page=${page}&size=${itemsPerPage}`;
      }

      const response = await fetch(url);
      const data: ShelterResponse = await response.json();
      
      setShelters(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('보호소 데이터 가져오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    fetchShelters();
  }, []);

  // 검색/필터 변경 시
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(0);
      fetchShelters(0, searchTerm, selectedProvince, selectedCity);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedProvince, selectedCity]);
  
  // 페이지 변경 시 처리
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchShelters(page, searchTerm, selectedProvince, selectedCity);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedCity(''); // 시/도 변경시 시/군/구 초기화
  };

  // 지역 데이터 (하드코딩된 옵션)
  const provinces = [
    { code: '서울특별시', name: '서울특별시' },
    { code: '부산광역시', name: '부산광역시' },
    { code: '대구광역시', name: '대구광역시' },
    { code: '인천광역시', name: '인천광역시' },
    { code: '광주광역시', name: '광주광역시' },
    { code: '대전광역시', name: '대전광역시' },
    { code: '울산광역시', name: '울산광역시' },
    { code: '세종특별자치시', name: '세종특별자치시' },
    { code: '경기도', name: '경기도' },
    { code: '강원도', name: '강원도' },
    { code: '충청북도', name: '충청북도' },
    { code: '충청남도', name: '충청남도' },
    { code: '전라북도', name: '전라북도' },
    { code: '전라남도', name: '전라남도' },
    { code: '경상북도', name: '경상북도' },
    { code: '경상남도', name: '경상남도' },
    { code: '제주특별자치도', name: '제주특별자치도' }
  ];

  const cities = [
    // 서울 구
    { code: '종로구', name: '종로구', provinceCode: '서울특별시' },
    { code: '중구', name: '중구', provinceCode: '서울특별시' },
    { code: '용산구', name: '용산구', provinceCode: '서울특별시' },
    { code: '성동구', name: '성동구', provinceCode: '서울특별시' },
    { code: '광진구', name: '광진구', provinceCode: '서울특별시' },
    { code: '동대문구', name: '동대문구', provinceCode: '서울특별시' },
    { code: '중랑구', name: '중랑구', provinceCode: '서울특별시' },
    { code: '성북구', name: '성북구', provinceCode: '서울특별시' },
    { code: '강북구', name: '강북구', provinceCode: '서울특별시' },
    { code: '도봉구', name: '도봉구', provinceCode: '서울특별시' },
    { code: '노원구', name: '노원구', provinceCode: '서울특별시' },
    { code: '은평구', name: '은평구', provinceCode: '서울특별시' },
    { code: '서대문구', name: '서대문구', provinceCode: '서울특별시' },
    { code: '마포구', name: '마포구', provinceCode: '서울특별시' },
    { code: '양천구', name: '양천구', provinceCode: '서울특별시' },
    { code: '강서구', name: '강서구', provinceCode: '서울특별시' },
    { code: '구로구', name: '구로구', provinceCode: '서울특별시' },
    { code: '금천구', name: '금천구', provinceCode: '서울특별시' },
    { code: '영등포구', name: '영등포구', provinceCode: '서울특별시' },
    { code: '동작구', name: '동작구', provinceCode: '서울특별시' },
    { code: '관악구', name: '관악구', provinceCode: '서울특별시' },
    { code: '서초구', name: '서초구', provinceCode: '서울특별시' },
    { code: '강남구', name: '강남구', provinceCode: '서울특별시' },
    { code: '송파구', name: '송파구', provinceCode: '서울특별시' },
    { code: '강동구', name: '강동구', provinceCode: '서울특별시' },
    // 경기도 주요 시
    { code: '수원시', name: '수원시', provinceCode: '경기도' },
    { code: '성남시', name: '성남시', provinceCode: '경기도' },
    { code: '고양시', name: '고양시', provinceCode: '경기도' },
    { code: '용인시', name: '용인시', provinceCode: '경기도' },
    { code: '부천시', name: '부천시', provinceCode: '경기도' },
    { code: '안산시', name: '안산시', provinceCode: '경기도' },
    { code: '안양시', name: '안양시', provinceCode: '경기도' },
    { code: '남양주시', name: '남양주시', provinceCode: '경기도' },
    { code: '화성시', name: '화성시', provinceCode: '경기도' },
    { code: '평택시', name: '평택시', provinceCode: '경기도' },
    { code: '의정부시', name: '의정부시', provinceCode: '경기도' },
    { code: '시흥시', name: '시흥시', provinceCode: '경기도' }
  ];

  // 선택된 시/도에 따른 시/군/구 필터링
  const filteredCities = selectedProvince && selectedProvince !== 'all'
    ? cities.filter(city => city.provinceCode === selectedProvince)
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeaderWithModal />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">보호소 찾기</h1>
          <p className="text-gray-600">우리 지역의 동물보호소를 찾아보세요</p>
        </div>

        {/* 검색 및 필터 섹션 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="space-y-4">
            {/* 검색바 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="보호소 이름으로 검색해보세요..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // 검색 시 첫 페이지로
                }}
                className="pl-10 pr-4 py-3 w-full rounded-xl border-gray-200 text-base"
              />
            </div>

            {/* 지역 선택 */}
            <div className="flex gap-4">
              {/* 시/도 선택 */}
              <div className="flex-1">
                <Select value={selectedProvince} onValueChange={handleProvinceChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="전체 지역" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 지역</SelectItem>
                    {provinces.map((province) => (
                      <SelectItem key={province.code} value={province.code}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 시/군/구 선택 - 시/도가 선택되었고 'all'이 아닐 때만 표시 */}
              {selectedProvince && selectedProvince !== 'all' && (
                <div className="flex-1">
                  <Select value={selectedCity} onValueChange={(value) => {
                    setSelectedCity(value);
                    setCurrentPage(1); // 시/군/구 변경 시 첫 페이지로
                  }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="시/군/구 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      {filteredCities.map((city) => (
                        <SelectItem key={city.code} value={city.code}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 보호소 목록 */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">보호소 정보를 불러오는 중...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {shelters.map((shelter) => (
              <Link key={shelter.careRegNumber} to={`/shelter/${shelter.careRegNumber}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {shelter.careName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>
                          {shelter.regionName}
                          {shelter.subRegionName && shelter.subRegionName !== '정보없음' && (
                            <> {shelter.subRegionName}</>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{shelter.careTel}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* 페이징 */}
        {totalPages > 1 && !loading && (
          <Pagination className="mb-8">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => currentPage > 0 && handlePageChange(currentPage - 1)}
                  className={currentPage === 0 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, index) => {
                const page = index;
                const shouldShow = 
                  page === 0 || 
                  page === totalPages - 1 || 
                  (page >= currentPage - 1 && page <= currentPage + 1);
                
                if (!shouldShow) {
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                }
                
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer"
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => currentPage < totalPages - 1 && handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        {shelters.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">검색 조건에 맞는 보호소가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shelters;
