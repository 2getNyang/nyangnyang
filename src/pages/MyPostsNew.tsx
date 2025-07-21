import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import MissingAnimalCard from '@/components/MissingAnimalCard';

interface ReviewPost {
  id: number;
  nickname: string;
  boardTitle: string;
  boardContent: string;
  imageUrl: string;
  createdAt: string;
  viewCount: number;
}

interface SNSPost {
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

type TabType = 'review' | 'sns' | 'missing';

const MyPostsNew = () => {
  console.log('🔥 MyPostsNew 페이지 로드됨');
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('review');
  const [reviewPosts, setReviewPosts] = useState<ReviewPost[]>([]);
  const [snsPosts, setSNSPosts] = useState<SNSPost[]>([]);
  const [missingPosts, setMissingPosts] = useState<MissingPost[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    fetchPosts();
  }, [activeTab, currentPage]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      console.log('🔑 토큰 확인:', token ? '토큰 존재' : '토큰 없음');
      
      let endpoint = '';
      
      switch (activeTab) {
        case 'review':
          endpoint = `http://localhost:8080/api/v1/my/boards/reveiw?page=${currentPage}&size=12`;
          break;
        case 'sns':
          endpoint = `http://localhost:8080/api/v1/my/boards/sns?page=${currentPage}&size=12`;
          break;
        case 'missing':
          endpoint = `http://localhost:8080/api/v1/my/boards/lost?page=${currentPage}&size=12`;
          break;
      }

      console.log('📡 API 호출:', activeTab, endpoint);

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 응답 상태:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('📦 받은 데이터:', activeTab, data);
        
        switch (activeTab) {
          case 'review':
            setReviewPosts(data.data.content);
            console.log('✅ 입양후기 설정됨:', data.data.content.length, '개');
            break;
          case 'sns':
            setSNSPosts(data.data.content);
            console.log('✅ SNS홍보 설정됨:', data.data.content.length, '개');
            break;
          case 'missing':
            setMissingPosts(data.data.content);
            console.log('✅ 실종목격 설정됨:', data.data.content.length, '개');
            break;
        }
        
        setTotalPages(data.data.totalPages);
      } else {
        console.error('❌ API 응답 실패:', response.status, await response.text());
      }
    } catch (error) {
      console.error('❌ 게시글 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 게시글 클릭 핸들러
  const handlePostClick = async (postId: number, type: TabType) => {
    try {
      let url = '';
      let redirectUrl = '';
      
      if (type === 'review') {
        url = `http://localhost:8080/api/v1/boards/review/${postId}`;
        redirectUrl = `/adoption-review/${postId}`;
      } else if (type === 'sns') {
        url = `http://localhost:8080/api/v1/boards/sns/${postId}`;
        redirectUrl = `/sns-post/${postId}`;
      } else if (type === 'missing') {
        url = `http://localhost:8080/api/v1/boards/lost/${postId}`;
        redirectUrl = `/missing-post/${postId}`;
      }
      
      // 게시글 존재 여부 확인
      const response = await fetch(url);
      if (response.ok) {
        navigate(redirectUrl);
      } else {
        toast({
          title: "게시글 없음",
          description: "게시글이 없습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "게시글 없음", 
        description: "게시글이 없습니다.",
        variant: "destructive",
      });
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  };

  const getGenderText = (gender: string) => {
    switch (gender) {
      case 'M': return '수컷';
      case 'F': return '암컷';
      default: return '모름';
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {startPage > 0 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(0)}
            >
              1
            </Button>
            {startPage > 1 && <span className="px-2">...</span>}
          </>
        )}

        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(pageNum)}
          >
            {pageNum + 1}
          </Button>
        ))}

        {endPage < totalPages - 1 && (
          <>
            {endPage < totalPages - 2 && <span className="px-2">...</span>}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages - 1)}
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  const getCurrentPosts = () => {
    switch (activeTab) {
      case 'review': return reviewPosts;
      case 'sns': return snsPosts;
      case 'missing': return missingPosts;
      default: return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader onLoginClick={() => {}} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <p className="text-gray-500">게시글을 불러오는 중...</p>
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">내가 작성한 게시글</h1>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="review" className="text-sm">입양 후기</TabsTrigger>
              <TabsTrigger value="sns" className="text-sm">SNS 홍보</TabsTrigger>
              <TabsTrigger value="missing" className="text-sm">실종/목격 제보</TabsTrigger>
            </TabsList>
          </div>

          {/* 입양 후기 탭 */}
          <TabsContent value="review" className="mt-0">
            {reviewPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  작성한 입양 후기가 없습니다
                </h3>
                <p className="text-gray-500">
                  첫 번째 입양 후기를 작성해보세요!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {reviewPosts.map((post) => (
                  <Card 
                    key={post.id} 
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handlePostClick(post.id, 'review')}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.boardTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.boardTitle}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.boardContent}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{post.nickname}</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary">입양후기</Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span>{post.viewCount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* SNS 홍보 탭 */}
          <TabsContent value="sns" className="mt-0">
            {snsPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📢</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  작성한 SNS 홍보글이 없습니다
                </h3>
                <p className="text-gray-500">
                  첫 번째 SNS 홍보글을 작성해보세요!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {snsPosts.map((post) => (
                  <Card 
                    key={post.id} 
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handlePostClick(post.id, 'sns')}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.boardTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{post.boardTitle}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{post.boardContent}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{post.nickname}</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary">SNS홍보</Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span>{post.viewCount}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* 실종/목격 탭 */}
          <TabsContent value="missing" className="mt-0">
            {missingPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  작성한 실종/목격 제보가 없습니다
                </h3>
                <p className="text-gray-500">
                  첫 번째 실종/목격 제보를 작성해보세요!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {missingPosts.map((post) => (
                  <Card 
                    key={post.id} 
                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handlePostClick(post.id, 'missing')}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={`${post.kindName} ${post.lostType === 'MS' ? '실종' : '목격'}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge 
                          variant={post.lostType === 'MS' ? 'destructive' : 'default'}
                          className="text-xs"
                        >
                          {post.lostType === 'MS' ? '실종' : '목격'}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span>{post.viewCount}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">품종:</span>
                          <span className="font-medium">{post.kindName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">성별:</span>
                          <span className="font-medium">{getGenderText(post.gender)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">나이:</span>
                          <span className="font-medium">{post.age}살</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">털색:</span>
                          <span className="font-medium">{post.furColor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">장소:</span>
                          <span className="font-medium text-right flex-1 ml-2 break-words">{post.missingLocation}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">실종일:</span>
                          <span className="font-medium">{post.missingDate}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {renderPagination()}
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default MyPostsNew;