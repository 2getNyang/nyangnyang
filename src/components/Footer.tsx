
import React from 'react';
import { Heart, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 golden rounded-full flex items-center justify-center">
                <img
                    src="https://backend-nyang.s3.ap-northeast-2.amazonaws.com/2gaenynag/logo_circle.png"
                    alt="함께하개냥 로고"
                    className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-cute">함께하개냥</h3>
                <p className="text-sm text-gray-300">유기동물 입양 플랫폼</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              버려진 동물들에게 새로운 희망을 주고, <br />따뜻한 가정을 찾아주는 것이 저희의 사명입니다.
              <br />함께 더 나은 세상을 만들어가요.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">빠른 링크</h4>
            <ul className="space-y-2">
              <li><a href="/animals" className="text-gray-300 hover:text-golden transition-colors">입양하기</a></li>
              <li><a href="/shelters" className="text-gray-300 hover:text-golden transition-colors">보호소 찾기</a></li>
              <li><a href="/board?tab=adoption" className="text-gray-300 hover:text-golden transition-colors">입양 후기</a></li>
              <li><a href="/board?tab=sns" className="text-gray-300 hover:text-golden transition-colors">SNS 홍보</a></li>
              <li><a href="/board?tab=lost" className="text-gray-300 hover:text-golden transition-colors">실종/목격 제보</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">연락처</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-golden" />
                <span className="text-gray-300">02-1234-5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-golden" />
                <span className="text-gray-300">info@pawheart.kr</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-golden" />
                <span className="text-gray-300">서울시 강남구</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 함께하개냥.
            </p>
            {/*<div className="flex space-x-6">*/}
            {/*  <a href="#" className="text-gray-400 hover:text-golden text-sm transition-colors">*/}
            {/*    개인정보처리방침*/}
            {/*  </a>*/}
            {/*  <a href="#" className="text-gray-400 hover:text-golden text-sm transition-colors">*/}
            {/*    서비스 이용약관*/}
            {/*  </a>*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
