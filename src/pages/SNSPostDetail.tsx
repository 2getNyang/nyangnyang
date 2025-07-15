import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Eye, User, Calendar, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { allPosts } from '@/data/mockPosts';
import AppHeader from '@/components/AppHeader';

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process(): void;
      };
    };
  }
}

const SNSPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const post = allPosts.find(p => p.id === id && p.category === 'sns');

  // Instagram embed.js 동적 로딩
 useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://www.instagram.com/embed.js';
  script.async = true;
  document.body.appendChild(script);

  const checkAndRender = setInterval(() => {
    const embedTarget = document.querySelector('.instagram-media');
    if (window.instgrm && embedTarget) {
      window.instgrm.Embeds.process();
      clearInterval(checkAndRender);
    }
  }, 300);

  return () => {
    document.body.removeChild(script);
    clearInterval(checkAndRender);
  };
}, []);


  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">게시글을 찾을 수 없습니다</h1>
          <Button onClick={() => navigate('/board')} variant="outline">
            게시판으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const images = [post.imageUrl, post.imageUrl, post.imageUrl].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onLoginClick={() => {}} />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/board')}
          className="mb-6 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          뒤로가기
        </Button>

        <div className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
          <div className="p-8">
            <div className="flex justify-start mb-4">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-sm flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                SNS 홍보
              </Badge>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{post.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <Eye className="w-4 h-4" />
                <span>{post.views}</span>
              </div>
            </div>

            {/* Instagram Embed */}
            {post.instagramLink && (
              <div className="mb-8 flex justify-center">
                <blockquote
                  className="instagram-media w-full max-w-lg"
                  data-instgrm-permalink={post.instagramLink}
                  data-instgrm-version="14"
                ></blockquote>
              </div>
            )}
            {/* 첨부 이미지 */}
            {images.length > 0 && (
              <div className="mb-8">
                {images.length === 1 ? (
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src={images[0]}
                      alt="첨부 이미지"
                      className="w-full h-80 object-cover"
                    />
                  </div>
                ) : (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {images.map((image, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                          <div className="p-1">
                            <div className="aspect-square rounded-lg overflow-hidden">
                              <img
                                src={image}
                                alt={`첨부 이미지 ${index + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                )}
              </div>
            )}

            <div className="prose prose-lg max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          </div>

          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <Heart className="w-5 h-5 mr-2" />
                  좋아요
                </Button>
                <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  댓글
                </Button>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Eye className="w-4 h-4" />
                <span>조회 {post.views}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SNSPostDetail;
