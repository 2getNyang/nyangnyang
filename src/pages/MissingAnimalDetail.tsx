import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Eye, User, Calendar, Edit, Trash2, Reply, MapPin, Phone, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import AppHeader from '@/components/AppHeader';

interface Comment {
  id: number;
  commnetContent: string;
  createdAt: string;
  commentNickname: string;
  parentId: number | null;
}

interface PostDetail {
  categoryId: number;
  userId: number;
  nickname: string;
  lostType: string;
  kindName: string;
  age: number;
  furColor: string;
  gender: string;
  regionName: string;
  subRegionName: string;
  missingDate: string;
  missingLocation: string;
  phone: string;
  likeCount: number;
  comments: Comment[];
  imageUrls: string[];
  createdAt: string;
  deletedAt: string | null;
  id: number;
}

const MissingPostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [postDetail, setPostDetail] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // 현재 로그인된 사용자 ID (실제로는 auth context에서 가져와야 함)
  const currentUserId = 1; // Mock user ID

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        console.log('useParams id:', id);
        console.log('API URL:', `http://localhost:8080/api/v1/boards/lost/${id}`);
        const response = await fetch(`http://localhost:8080/api/v1/boards/lost/${id}`);
        const result = await response.json();
        
        if (result.code === 200) {
          setPostDetail(result.data);
        } else {
          setError('게시글을 불러올 수 없습니다.');
        }
      } catch (error) {
        console.error('Failed to fetch post detail:', error);
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !postDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{error || '게시글을 찾을 수 없습니다'}</h1>
          <Button onClick={() => navigate('/board?category=missing')} variant="outline">
            실종/목격 게시판으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  // 사용자 권한 확인 (로그인한 사용자이고 작성자인 경우)
  const hasEditPermission = currentUserId === postDetail.userId;

  // 실종/목격 타입에 따른 배지 색상
  const getMissingTypeColor = () => {
    return postDetail.lostType === '실종' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800';
  };

  const getMissingTypeLabel = () => {
    return postDetail.lostType;
  };

  // 댓글을 계층구조로 정리
  const organizeComments = (comments: Comment[]) => {
    const parentComments = comments.filter(comment => comment.parentId === null);
    const childComments = comments.filter(comment => comment.parentId !== null);
    
    return parentComments.map(parent => ({
      ...parent,
      replies: childComments.filter(child => child.parentId === parent.id)
    }));
  };

  const organizedComments = organizeComments(postDetail.comments);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onLoginClick={() => {}} />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/board?category=missing')}
          className="mb-6 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          뒤로가기
        </Button>

        <div className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
          <div className="p-8">
            {/* 카테고리 배지 */}
            <div className="flex justify-between items-start mb-4">
              <Badge className={`${getMissingTypeColor()} hover:${getMissingTypeColor()} text-sm`}>
                {getMissingTypeLabel()}
              </Badge>
              
              {/* 수정/삭제 버튼 */}
              {hasEditPermission && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-800">
                    <Edit className="w-4 h-4 mr-1" />
                    수정
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-1" />
                    삭제
                  </Button>
                </div>
              )}
            </div>

            {/* 품종 (제목 위치) */}
            <h1 className="text-3xl font-bold text-gray-800 mb-6 leading-tight">
              {postDetail.kindName}
            </h1>

            {/* 작성자 정보 */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{postDetail.nickname}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(postDetail.createdAt).toLocaleDateString('ko-KR')}</span>
                </div>
              </div>
            </div>

            {/* 이미지 섹션 */}
            {postDetail.imageUrls.length > 0 && (
              <div className="mb-8 bg-gray-50 rounded-2xl p-6">
                {postDetail.imageUrls.length === 1 ? (
                  <div className="rounded-xl overflow-hidden shadow-md">
                    <img
                      src={postDetail.imageUrls[0]}
                      alt="실종/목격 사진"
                      className="w-full h-96 object-cover"
                    />
                  </div>
                ) : (
                  <Carousel className="w-full">
                    <CarouselContent className="-ml-2 md:-ml-4">
                      {postDetail.imageUrls.map((image, index) => (
                        <CarouselItem key={index} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                          <div className="rounded-xl overflow-hidden shadow-md">
                            <img
                              src={image}
                              alt={`실종/목격 사진 ${index + 1}`}
                              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {postDetail.imageUrls.length > 1 && (
                      <>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </>
                    )}
                  </Carousel>
                )}
                {postDetail.imageUrls.length > 3 && (
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    총 {postDetail.imageUrls.length}장의 사진이 있습니다. 좌우 버튼으로 더 많은 사진을 확인하세요.
                  </p>
                )}
              </div>
            )}

            {/* 상세 정보 */}
            <div className="mb-8 bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">상세 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-600">성별:</span>
                  <span className="text-gray-800">{postDetail.gender}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-600">나이:</span>
                  <span className="text-gray-800">{postDetail.age}세</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-600">털색:</span>
                  <span className="text-gray-800">{postDetail.furColor}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-600">{postDetail.lostType === '실종' ? '실종일:' : '목격일:'}</span>
                  <span className="text-gray-800">{postDetail.missingDate}</span>
                </div>
                <div className="flex items-center space-x-2 md:col-span-2">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="font-medium text-gray-600">{postDetail.lostType === '실종' ? '실종장소:' : '목격장소:'}</span>
                  <span className="text-gray-800">{postDetail.regionName} {postDetail.subRegionName} {postDetail.missingLocation}</span>
                </div>
              </div>
            </div>

            {/* 연락처 */}
            <div className="mb-8 bg-primary/10 border border-primary/20 rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Phone className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-800">연락처</h3>
              </div>
              <div className="bg-background rounded-lg p-4 border border-primary/30">
                <p className="text-gray-700 mb-3">
                  {postDetail.lostType === '실종' ? '실종된 반려동물을 목격하신 분은' : '목격 관련 문의사항이나 추가 정보가 있으시면'} 아래 연락처로 연락 부탁드립니다.
                </p>
                <div className="flex items-center justify-between bg-primary/5 rounded-lg p-3">
                  <div>
                    <p className="font-medium text-gray-800">작성자: {postDetail.nickname}</p>
                    <p className="text-primary font-semibold text-lg">전화: {postDetail.phone}</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10">
                    복사
                  </Button>
                </div>
              </div>
              
              {/* 채팅하기 버튼 */}
              <div className="mt-4">
                <Button 
                  onClick={() => navigate(`/chat/${postDetail.nickname}`)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {postDetail.nickname}님과 채팅하기
                </Button>
              </div>
            </div>
          </div>

          {/* 하단 인터랙션 섹션 */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`${liked ? 'text-red-500 bg-red-50' : 'text-red-500'} hover:text-red-600 hover:bg-red-50`}
                  onClick={() => setLiked(!liked)}
                >
                  <Heart className={`w-5 h-5 mr-2 ${liked ? 'fill-current' : ''}`} />
                  좋아요 {postDetail.likeCount + (liked ? 1 : 0)}
                </Button>
                <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  댓글 {postDetail.comments.length}
                </Button>
              </div>
            </div>
          </div>

          {/* 댓글 섹션 */}
          <div className="px-8 py-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              댓글 {postDetail.comments.length}개
            </h3>
            
            <div className="space-y-6">
              {organizedComments.map((comment) => (
                <div key={comment.id} className="space-y-4">
                  {/* 주 댓글 */}
                  <div className="flex space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-800">{comment.commentNickname}</span>
                          <span className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleDateString('ko-KR')}</span>
                        </div>
                        <p className="text-gray-700">{comment.commnetContent}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="mt-2 text-gray-500 hover:text-gray-700">
                        <Reply className="w-4 h-4 mr-1" />
                        답글
                      </Button>
                    </div>
                  </div>

                  {/* 대댓글들 */}
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="ml-14 flex space-x-4">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">{reply.commentNickname}</span>
                            <span className="text-sm text-gray-500">{new Date(reply.createdAt).toLocaleDateString('ko-KR')}</span>
                          </div>
                          <p className="text-gray-700">{reply.commnetContent}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* 댓글 입력 */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="댓글을 작성해주세요..."
                    className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex justify-end mt-3">
                    <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                      댓글 작성
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissingPostDetail;