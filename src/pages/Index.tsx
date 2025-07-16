
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import AppHeroSection from '@/components/AppHeroSection';
import AppAnimalCard from '@/components/AppAnimalCard';
import LoginModal from '@/components/LoginModal';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  // Mock data for abandoned animals with images
  const animals = [
    {
      id: '1',
      name: '초코',
      species: '개',
      breed: '믹스견',
      age: '3세',
      gender: '수컷',
      location: '서울시 강남구 보호소',
      rescueDate: '2024-06-15',
      description: '매우 온순하고 사람을 좋아하는 초코입니다. 산책을 무척 좋아하고 아이들과도 잘 지내요. 건강한 상태이며 모든 기본 예방접종을 완료했습니다.',
      personality: ['온순함', '사람좋아함', '산책매니아'],
      isUrgent: false,
      imageUrl: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=400&h=300&fit=crop'
    },
    {
      id: '2',
      name: '나비',
      species: '고양이',
      breed: '코리안숏헤어',
      age: '1세',
      gender: '암컷',
      location: '경기도 수원시 보호소',
      rescueDate: '2024-06-20',
      description: '호기심이 많고 활발한 나비입니다. 다른 고양이들과도 잘 어울리며, 장난감을 가지고 노는 것을 좋아합니다. 중성화 수술을 완료했습니다.',
      personality: ['활발함', '호기심많음', '사교적'],
      isUrgent: true,
      imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop'
    },
    {
      id: '3',
      name: '멍멍이',
      species: '개',
      breed: '진돗개',
      age: '5세',
      gender: '수컷',
      location: '부산시 해운대구 보호소',
      rescueDate: '2024-05-30',
      description: '충성심이 강하고 주인을 잘 따르는 멍멍이입니다. 약간 수줍음이 많지만 시간이 지나면 친해집니다. 산책과 공놀이를 좋아합니다.',
      personality: ['충성스러움', '수줍음', '놀이좋아함'],
      isUrgent: false,
      imageUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=300&fit=crop'
    },
    {
      id: '4',
      name: '까미',
      species: '고양이',
      breed: '페르시안',
      age: '4세',
      gender: '암컷',
      location: '대구시 중구 보호소',
      rescueDate: '2024-06-01',
      description: '조용하고 차분한 성격의 까미입니다. 햇볕이 드는 곳에서 낮잠 자는 것을 좋아하고, 브러시질을 받는 것을 좋아합니다.',
      personality: ['차분함', '조용함', '독립적'],
      isUrgent: false,
      imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop'
    },
    {
      id: '5',
      name: '뽀삐',
      species: '개',
      breed: '말티즈',
      age: '2세',
      gender: '암컷',
      location: '인천시 남동구 보호소',
      rescueDate: '2024-06-25',
      description: '작고 귀여운 뽀삐입니다. 사람들의 관심을 받는 것을 좋아하고 매우 애교가 많습니다. 실내에서 키우기에 적합합니다.',
      personality: ['애교쟁이', '사교적', '작고귀여움'],
      isUrgent: true,
      imageUrl: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=400&h=300&fit=crop'
    },
    {
      id: '6',
      name: '호랑이',
      species: '고양이',
      breed: '아메리칸숏헤어',
      age: '6개월',
      gender: '수컷',
      location: '광주시 서구 보호소',
      rescueDate: '2024-06-28',
      description: '활발하고 장난기 많은 어린 고양이 호랑이입니다. 다른 동물들과도 잘 어울리며, 새로운 환경에 빠르게 적응합니다.',
      personality: ['활발함', '장난꾸러기', '적응력좋음'],
      isUrgent: false,
      imageUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=300&fit=crop'
    }
  ];

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
            {animals.map((animal) => (
              <AppAnimalCard key={animal.id} animal={animal} />
            ))}
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
