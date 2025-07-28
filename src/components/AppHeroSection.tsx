import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Home, Users, ArrowRight } from 'lucide-react';

interface CountData {
  shelterCount: number;
  protectedAnimalCount: number;
  adoptedOrReturnedCount: number;
}

const AppHeroSection = () => {
  const [counts, setCounts] = useState<CountData>({
    shelterCount: 0,
    protectedAnimalCount: 0,
    adoptedOrReturnedCount: 0
  });
  const [loading, setLoading] = useState(true);

  // 100단위로 끊어서 +로 표시하는 함수
  const formatCount = (count: number): string => {
    if (count === 0) return '0';
    const rounded = Math.floor(count / 100) * 100;
    return rounded.toLocaleString() + '+';
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        console.log('🔄 통계 데이터 가져오기 시작...');
        
        const response = await fetch('http://localhost:8080/api/v1/animals/counts');
        console.log('📊 통계 API 응답 상태:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('📊 통계 API 전체 응답:', result);
        console.log('📊 통계 데이터:', result.data);
        
        if (result.code === 200 && result.data) {
          setCounts(result.data);
          console.log('✅ 통계 데이터 설정 완료:', result.data);
        } else {
          console.error('❌ 통계 API 응답 형식 오류:', result);
        }
      } catch (error) {
        console.error('❌ 통계 데이터 가져오기 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);
  return (
    <section className="bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            새로운 가족을 찾고 있어요
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            유기동물들이 따뜻한 가정에서 새로운 삶을 시작할 수 있도록 도와주세요.
          </p>
          
          <div className="flex justify-center mb-8">
            <Link to="/animals">
              <Button className="golden hover:bg-yellow-500 text-gray-800 font-medium px-6 py-3">
                입양하기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center border border-yellow-200">
            <div className="w-12 h-12 golden rounded-xl flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {loading ? '...' : formatCount(counts.protectedAnimalCount)}
            </h3>
            <p className="text-gray-600 text-sm">총 보호동물</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center border border-yellow-200">
            <div className="w-12 h-12 golden rounded-xl flex items-center justify-center mx-auto mb-3">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {loading ? '...' : formatCount(counts.adoptedOrReturnedCount)}
            </h3>
            <p className="text-gray-600 text-sm">새로운 가족을 찾은 아이들</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center border border-yellow-200">
            <div className="w-12 h-12 golden rounded-xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">
              {loading ? '...' : formatCount(counts.shelterCount)}
            </h3>
            <p className="text-gray-600 text-sm">협력 보호소</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppHeroSection;