import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AppHeaderWithModal from '@/components/AppHeaderWithModal';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, User } from 'lucide-react';

interface BoardPost {
  id: number;
  nickname: string;
  boardTitle: string;
  boardContent: string;
  imageUrl: string;
  createdAt: string;
  viewCount: number;
}

interface MissingPost {
  id: number;
  viewCount: number;
  lostType: string;
  kindName: string;
  gender: string;
  age: number;
  furColor: string;
  missingLocation: string;
  missingDate: string;
  imageUrl: string;
  nickname: string;
}

const MyPostsUpdated = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<'review' | 'sns' | 'missing'>('review');
  const [reviewPosts, setReviewPosts] = useState<BoardPost[]>([]);
  const [snsPosts, setSnsPosts] = useState<BoardPost[]>([]);
  const [missingPosts, setMissingPosts] = useState<MissingPost[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    fetchPosts();
  }, [activeTab, currentPage, isLoggedIn, navigate]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      let url = '';
      
      switch (activeTab) {
        case 'review':
          url = `http://localhost:8080/api/v1/my/boards/review?page=${currentPage}&size=${itemsPerPage}`;
          break;
        case 'sns':
          url = `http://localhost:8080/api/v1/my/boards/sns?page=${currentPage}&size=${itemsPerPage}`;
          break;
        case 'missing':
          url = `http://localhost:8080/api/v1/my/boards/lost?page=${currentPage}&size=${itemsPerPage}`;
          break;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        
        if (activeTab === 'review') {
          setReviewPosts(result.data.content);
        } else if (activeTab === 'sns') {
          setSnsPosts(result.data.content);
        } else if (activeTab === 'missing') {
          setMissingPosts(result.data.content);
        }
        
        setTotalPages(result.data.totalPages);
      }
    } catch (error) {
      console.error('게시글 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\./g, '.').replace(/\s/g, '');
  };

  const formatMissingDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'M': return '수컷';
      case 'F': return '암컷';
      case 'Q': return '미상';
      default: return gender;
    }
  };

  const handleTabChange = (tab: 'review' | 'sns' | 'missing') => {
    setActiveTab(tab);
    setCurrentPage(0);
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

  const getCurrentPosts = () => {
    switch (activeTab) {
      case 'review':
        return reviewPosts;
      case 'sns':
        return snsPosts;
      case 'missing':
        return missingPosts;
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeaderWithModal />
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
      <AppHeaderWithModal />
      
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">내가 작성한 게시글</h1>
          <p className="text-gray-600">작성한 게시글을 확인하세요</p>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => handleTabChange('review')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'review'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              입양후기
            </button>
            <button
              onClick={() => handleTabChange('sns')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'sns'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              SNS홍보
            </button>
            <button
              onClick={() => handleTabChange('missing')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'missing'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              실종/목격
            </button>
          </div>
        </div>

        {/* 게시글 목록 */}
        {getCurrentPosts().length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              작성한 게시글이 없습니다
            </h3>
            <p className="text-gray-500">
              첫 번째 게시글을 작성해보세요!
            </p>
          </div>
        ) : (
          <>
            {/* 입양후기/SNS홍보 게시글 */}
            {(activeTab === 'review' || activeTab === 'sns') && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {(activeTab === 'review' ? reviewPosts : snsPosts).map((post: BoardPost) => (
                  <Card 
                    key={post.id}
                    className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white rounded-2xl overflow-hidden hover:scale-[1.02]"
                    onClick={() => {
                      if (activeTab === 'review') {
                        navigate(`/adoption-review/${post.id}`);
                      } else {
                        navigate(`/sns-post/${post.id}`);
                      }
                    }}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.boardTitle}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=400&h=300&fit=crop';
                        }}
                      />
                    </div>
                    
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <Badge className={
                          activeTab === 'review' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-100 text-xs flex items-center gap-1' 
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-100 text-xs flex items-center gap-1'
                        }>
                          {activeTab === 'review' ? '입양후기' : 'SNS홍보'}
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 leading-tight">
                        {post.boardTitle}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {post.boardContent}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{post.nickname}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.viewCount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* 실종/목격 게시글 */}
            {activeTab === 'missing' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {missingPosts.map((post: MissingPost) => (
                  <Card 
                    key={post.id}
                    className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-white rounded-2xl overflow-hidden hover:scale-[1.02]"
                    onClick={() => navigate(`/missing-post/${post.id}`)}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={`${post.kindName} ${post.lostType === 'WT' ? '목격' : '실종'}`}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=400&h=300&fit=crop';
                        }}
                      />
                    </div>
                    
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <Badge className={
                          post.lostType === 'WT' 
                            ? 'bg-orange-100 text-orange-800 hover:bg-orange-100 text-xs flex items-center gap-1' 
                            : 'bg-red-100 text-red-800 hover:bg-red-100 text-xs flex items-center gap-1'
                        }>
                          {post.lostType === 'WT' ? '목격' : '실종'}
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 leading-tight">
                        {post.kindName}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {getGenderText(post.gender)} • {post.age}살 • {post.furColor}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{post.nickname}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatMissingDate(post.missingDate)}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-3 h-3" />
                          <span>{post.viewCount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

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

export default MyPostsUpdated;