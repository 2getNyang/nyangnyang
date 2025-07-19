
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import AppHeroSection from '@/components/AppHeroSection';
import AppAnimalCard from '@/components/AppAnimalCard';
import LoginModal from '@/components/LoginModal';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

interface RecommendedAnimal {
  desertionNo: string;
  noticeNo: string;
  kindFullNm: string;
  sexCd: string;
  happenPlace: string;
  processState: string;
  popfile: string;
}

const Index = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const [recommendedAnimals, setRecommendedAnimals] = useState<RecommendedAnimal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedAnimals = async () => {
      try {
        console.log('🔄 추천 동물 데이터 가져오기 시작...');
        
        const response = await fetch('http://localhost:8080/api/v1/recommendations');
        console.log('🐕 추천 동물 API 응답 상태:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('🐕 추천 동물 API 전체 응답:', result);
        
        if (result.code === 200 && result.data) {
          console.log('🐕 추천 동물 데이터:', result.data);
          console.log('🐕 추천 동물 개수:', result.data.length);
          
          // 각 동물 데이터 상세 로그
          result.data.forEach((animal: RecommendedAnimal, index: number) => {
            console.log(`🐕 추천 동물 ${index + 1}:`, {
              desertionNo: animal.desertionNo,
              noticeNo: animal.noticeNo,
              kindFullNm: animal.kindFullNm,
              sexCd: animal.sexCd,
              happenPlace: animal.happenPlace,
              processState: animal.processState,
              popfile: animal.popfile
            });
          });
          
          setRecommendedAnimals(result.data);
          console.log('✅ 추천 동물 데이터 설정 완료');
        } else {
          console.error('❌ 추천 동물 API 응답 형식 오류:', result);
        }
      } catch (error) {
        console.error('❌ 추천 동물 데이터 가져오기 실패:', error);
        // 실패 시 빈 배열로 설정
        setRecommendedAnimals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedAnimals();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        onLoginClick={() => setIsLoginModalOpen(true)}
      />
      <AppHeroSection />
      
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              새로운 가족을 기다리는 아이들
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              각각의 동물들은 고유한 성격과 매력을 가지고 있습니다. 
              당신과 잘 맞는 반려동물을 찾아보세요.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {loading ? (
              // 로딩 중일 때 스켈레톤 표시
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-t-lg"></div>
                  <div className="p-4 bg-white rounded-b-lg border border-gray-200">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-4"></div>
                    <div className="h-8 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))
            ) : recommendedAnimals.length > 0 ? (
              recommendedAnimals.map((animal) => (
                <AppAnimalCard key={animal.desertionNo} animal={animal} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">추천 동물 데이터를 불러올 수 없습니다.</p>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <Link to="/animals">
              <button className="golden hover:bg-yellow-500 text-gray-800 font-medium px-8 py-3 rounded-xl transition-all duration-200 hover:shadow-lg">
                더 많은 아이들 보기
              </button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
      
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
      />
      
    </div>
  );
};

export default Index;
