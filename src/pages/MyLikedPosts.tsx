import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import { allPosts } from '@/data/mockPosts';
import { Post } from '@/types/board';

const MyLikedPosts = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUserName] = useState('김철수');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;
  const navigate = useNavigate();

  // 임시로 좋아요한 게시글 (실제로는 API에서 가져올 데이터)
  const likedPostIds = ['1', '3', '4', '7']; // 사용자가 좋아요한 게시글 ID들
  const likedPosts = allPosts.filter(post => likedPostIds.includes(post.id));

  const totalPages = Math.ceil(likedPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = likedPosts.slice(startIndex, startIndex + postsPerPage);

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'adoption': return '입양후기';
      case 'sns': return 'SNS홍보';
      case 'missing': return '실종/목격';
      default: return '기타';
    }
  };

  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'adoption': return 'bg-green-100 text-green-700';
      case 'sns': return 'bg-blue-100 text-blue-700';
      case 'missing': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleCardClick = (post: any) => {
    if (post.category === 'sns') {
      navigate(`/sns-post/${post.id}`);
    } else if (post.category === 'adoption') {
      navigate(`/adoption-review/${post.id}`);
    } else if (post.category === 'missing') {
      navigate(`/missing-post/${post.id}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        onLoginClick={() => {}}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">내가 좋아요한 게시글</h1>
          <p className="text-gray-600">{userName}님이 좋아요한 총 {likedPosts.length}개의 게시글</p>
        </div>

        {/* 좋아요한 게시글이 없는 경우 */}
        {likedPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">💕</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              좋아요한 게시글이 아직 없습니다 🐾
            </h3>
            <p className="text-gray-500">
              마음에 드는 게시글에 좋아요를 눌러보세요!
            </p>
          </div>
        ) : currentPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              해당 페이지에 표시할 게시글이 없습니다
            </h3>
          </div>
        ) : (
          <>
            {/* 좋아요한 게시글 목록 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentPosts.map((post) => (
                <Card 
                  key={post.id}
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-0 shadow-md bg-gradient-to-br from-pink-50 to-rose-50 border-l-4 border-l-pink-300"
                  onClick={() => handleCardClick(post)}
                >
                  <CardContent className="p-0">
                    {/* 이미지 영역 */}
                    <div className="relative">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {/* 좋아요 뱃지 */}
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-pink-500 text-white gap-1 shadow-sm">
                          <Heart className="w-3 h-3 fill-current" />
                          좋아요한 글
                        </Badge>
                      </div>
                      {/* 카테고리 뱃지 */}
                      <div className="absolute top-2 right-2">
                        <Badge className={getCategoryColor(post.category)}>
                          {getCategoryLabel(post.category)}
                        </Badge>
                      </div>
                    </div>

                    {/* 콘텐츠 영역 */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="font-medium">{post.author}</span>
                        <span>{formatDate(post.date)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-md ${
                        currentPage === page
                          ? 'bg-primary text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default MyLikedPosts;