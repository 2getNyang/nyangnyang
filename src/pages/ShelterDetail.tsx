
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, MapPin, Phone } from 'lucide-react';
import { shelters, provinces, cities } from '@/data/shelterData';
import KakaoMap from '@/components/KakaoMap';

const ShelterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const shelter = shelters.find(s => s.id === id);

  if (!shelter) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader 
          onLoginClick={() => setIsLoggedIn(!isLoggedIn)}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">보호소를 찾을 수 없습니다</h1>
            <Link to="/shelters">
              <Button>보호소 목록으로 돌아가기</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-golden-light via-white to-amber-50">
      <AppHeader 
        onLoginClick={() => setIsLoggedIn(!isLoggedIn)}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* 보호소 상세 정보 */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="relative py-6 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-t-lg">
              <Link to="/shelters" className="absolute left-4 top-4">
                <ArrowLeft className="w-8 h-8 text-white hover:text-white/80 transition-colors" />
              </Link>
              <CardTitle className="text-3xl font-bold text-center pt-2">
                {shelter.name}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6 space-y-6">
              {/* 보호소 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 주소 카드 */}
                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-orange-800">주소</h4>
                  </div>
                  <p className="text-orange-700 leading-relaxed">{shelter.address}</p>
                </div>
                
                {/* 전화번호 카드 */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-4 rounded-lg border border-amber-200">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-amber-800">전화번호</h4>
                  </div>
                  <a 
                    href={`tel:${shelter.phone}`}
                    className="text-amber-600 hover:text-amber-800 hover:underline font-medium transition-colors"
                  >
                    {shelter.phone}
                  </a>
                </div>
              </div>

              {/* 지도 섹션 */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-bold text-yellow-800">지도</h4>
                </div>
                {shelter.latitude && shelter.longitude ? (
                  <KakaoMap 
                    latitude={shelter.latitude}
                    longitude={shelter.longitude}
                    address={shelter.address}
                    name={shelter.name}
                  />
                ) : (
                  <div className="bg-white/70 rounded-lg h-64 flex items-center justify-center border border-yellow-300">
                    <div className="text-center text-yellow-600">
                      <MapPin className="w-12 h-12 mx-auto mb-2 text-yellow-500" />
                      <p className="font-medium">위치 정보가 없습니다</p>
                      <p className="text-sm mt-1 text-yellow-600">{shelter.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShelterDetail;
