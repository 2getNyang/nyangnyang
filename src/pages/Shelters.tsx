
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

// API 응답 타입 정의
interface RegionData {
  regionCode: string | null;
  regionName: string;
}

interface SubRegionData {
  subRegionName: string;
  subRegionCode: string | null;
}


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
  
  // API로부터 가져올 지역 데이터
  const [provinces, setProvinces] = useState<RegionData[]>([]);
  const [subRegions, setSubRegions] = useState<SubRegionData[]>([]);
  
  const navigate = useNavigate();
  
  const itemsPerPage = 12; // 4열 x 3행

  // 보호소 데이터 가져오기
  const fetchShelters = async (page: number = 0, search?: string, province?: string, city?: string) => {
    try {
      setLoading(true);
      let url = '';
      
      // 검색 조건이 있으면 필터 API 사용
      if (search || (province && province !== 'all') || (city && city !== 'all')) {
        url = `/api/v1/shelters/filter?page=${page}&size=${itemsPerPage}`;
        
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
        url = `/api/v1/shelters?page=${page}&size=${itemsPerPage}`;
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

  // 시/도 API 호출
  const fetchProvinces = async () => {
    try {
      const response = await fetch('/api/v1/regions');
      const data: RegionData[] = await response.json();
      setProvinces(data);
    } catch (error) {
      console.error('시/도 데이터 가져오기 실패:', error);
    }
  };

  // 시/군/구 API 호출
  const fetchSubRegions = async (regionName: string) => {
    try {
      const response = await fetch(`/api/v1/regions/${encodeURIComponent(regionName)}`);
      const data: SubRegionData[] = await response.json();
      setSubRegions(data);
    } catch (error) {
      console.error('시/군/구 데이터 가져오기 실패:', error);
    }
  };

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedCity(''); // 시/도 변경시 시/군/구 초기화
    
    // 시/도가 선택되면 해당 시/군/구 데이터 가져오기
    if (value && value !== 'all') {
      fetchSubRegions(value);
    } else {
      setSubRegions([]);
    }
  };

  // 초기 시/도 데이터 로드
  useEffect(() => {
    fetchProvinces();
  }, []);

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
                       <SelectItem key={province.regionName} value={province.regionName}>
                         {province.regionName}
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
                       {subRegions.map((subRegion) => (
                         <SelectItem key={subRegion.subRegionName} value={subRegion.subRegionName}>
                           {subRegion.subRegionName}
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
