
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, Heart, Home, Users } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-br from-yellow-50 to-orange-50 py-16 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
          새로운 가족을 찾고 있어요
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          유기동물들이 따뜻한 가정에서 새로운 삶을 시작할 수 있도록 도와주세요. 
          당신의 사랑이 한 생명을 구할 수 있습니다.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button className="golden hover:bg-yellow-500 text-gray-800 font-medium px-8 py-3 text-lg">
            입양하기
          </Button>
          <Button variant="outline" className="border-yellow-400 text-gray-700 hover:bg-yellow-50 px-8 py-3 text-lg">
            후원하기
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
          <div className="text-center">
            <div className="w-16 h-16 golden rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" fill="white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">2,500+</h3>
            <p className="text-gray-600">총 보호동물</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 golden rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">1,200+</h3>
            <p className="text-gray-600">새로운 가족을 찾은 아이들</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 golden rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">50+</h3>
            <p className="text-gray-600">협력 보호소</p>
          </div>
        </div>
        
        <div className="animate-bounce">
          <ArrowDown className="w-6 h-6 text-gray-400 mx-auto" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
