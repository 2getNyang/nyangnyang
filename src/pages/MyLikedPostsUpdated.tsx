import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AppHeader from '@/components/AppHeader';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye } from 'lucide-react';

interface LikedPost {
  id: string;
  title: string;
  author: string;
  date: string;
  category: string;
  imageUrl: string;
  viewCount?: number;
}

const MyLikedPostsUpdated = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [likedPosts, setLikedPosts] = useState<LikedPost[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    fetchLikedPosts();
  }, [currentPage, isLoggedIn, navigate]);

  const fetchLikedPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/v1/my/likes?page=${currentPage}&size=${itemsPerPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setLikedPosts(result.data.content);
        setTotalPages(result.data.totalPages);
      }
    } catch (error) {
      console.error('좋아요한 게시글 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCardClick = (post: LikedPost) => {
    try {
      if (post.category === 'sns') {
        navigate(`/sns-post/${post.id}`);
      } else if (post.category === 'adoption') {
        navigate(`/adoption-review/${post.id}`);
      } else if (post.category === 'missing') {
        navigate(`/missing-post/${post.id}`);
      }
    } catch (error) {
      // 삭제된 게시글인 경우
      alert('삭제된 게시글입니다.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    if (startPage > 0) {
      pages.push(
        <Button
          key={0}
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(0)}
          className="h-8 w-8 p-0"
        >
          1
        </Button>
      );
      if (startPage > 1) {
        pages.push(<span key="start-ellipsis" className="px-2">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(i)}
          className="h-8 w-8 p-0"
        >
          {i + 1}
        </Button>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push(<span key="end-ellipsis" className="px-2">...</span>);
      }
      pages.push(
        <Button
          key={totalPages - 1}
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(totalPages - 1)}
          className="h-8 w-8 p-0"
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader onLoginClick={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">데이터를 불러오는 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onLoginClick={() => {}} />
      
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">내가 좋아요한 게시글</h1>
          <p className="text-gray-600">좋아요한 총 {likedPosts.length}개의 게시글</p>
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
        ) : (
          <>
            {/* 좋아요한 게시글 목록 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {likedPosts.map((post) => (
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
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=400&h=300&fit=crop';
                        }}
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
                        <div className="flex items-center gap-2">
                          {post.viewCount && (
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              <span>{post.viewCount}</span>
                            </div>
                          )}
                          <span>{formatDate(post.date)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="h-8 px-3"
                >
                  이전
                </Button>
                
                {renderPagination()}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="h-8 px-3"
                >
                  다음
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default MyLikedPostsUpdated;