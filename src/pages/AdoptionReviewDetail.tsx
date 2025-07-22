import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, MessageCircle, Eye, User, Calendar, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import AppHeader from '@/components/AppHeader';
import CommentSection from '@/components/CommentSection';

interface Comment {
  id: number;
  commnetContent: string;
  commentContent?: string;
  createdAt: string;
  commentNickname: string;
  commentUserId: number;
  parentId: number | null;
}

interface PetApplicationDTO {
  desertionNo: string;
  formId: number;
  kindFullNm: string;
  age: string;
  sexCd: string;
  happenDt: string;
  subRegionName: string;
  regionName: string;
  careName: string;
  noticeNo: string;
  profile1: string;
  formCreateAt: string;
}

interface Image {
  thumbnailIs: string;
  s3Url: string;
  originFileName: string;
}

interface PostDetail {
  id: number;
  nickname: string;
  userId: number;
  boardTitle: string;
  boardContent: string;
  createdAt: string;
  boardViewCount: number;
  likeItCount: number;
  isLiked: boolean;
  petApplicationDTO: PetApplicationDTO | null;
  comments: Comment[];
  images: Image[];
}

const AdoptionReviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [postDetail, setPostDetail] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR').replace(/\./g, '.').replace(/ /g, '');
  };

  // 성별 변환 함수
  const formatGender = (sexCd: string) => {
    switch (sexCd) {
      case 'F': return '암컷';
      case 'M': return '수컷';
      case 'Q': return '모름';
      default: return sexCd;
    }
  };

  // 게시글 상세 조회
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        console.log(`🔍 입양후기 게시글 상세 조회 시작 - ID: ${id}`);
        const response = await fetch(`http://localhost:8080/api/v1/boards/review/${id}`);
        const result = await response.json();
        
        console.log('📋 게시글 상세 조회 응답:', result);
        
        if (result.code === 200) {
          setPostDetail(result.data);
          setLiked(result.data.isLiked);
          setLikeCount(result.data.likeItCount);
          console.log('✅ 게시글 데이터 로드 완료');
          
          // 좋아요 상태 별도 확인
          fetchLikeStatus();
          fetchLikeCount();
        } else {
          setError('게시글을 불러올 수 없습니다.');
        }
      } catch (error) {
        console.error('❌ 게시글 조회 실패:', error);
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostDetail();
    }
  }, [id]);

  // 좋아요 수 조회
  const fetchLikeCount = async () => {
    try {
      console.log(`❤️ 좋아요 수 조회 시작 - boardId: ${id}`);
      const response = await fetch(`http://localhost:8080/api/v1/like/${id}`);
      const result = await response.json();
      
      console.log('📊 좋아요 수 조회 응답:', result);
      
      if (result.code === 200) {
        setLikeCount(result.data);
        console.log(`✅ 좋아요 수: ${result.data}`);
      }
    } catch (error) {
      console.error('❌ 좋아요 수 조회 실패:', error);
    }
  };

  // 좋아요 상태 확인
  const fetchLikeStatus = async () => {
    if (!isLoggedIn) return;
    
    try {
      console.log(`💖 좋아요 상태 확인 시작 - boardId: ${id}`);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/v1/like/${id}/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const result = await response.json();
      
      console.log('📍 좋아요 상태 조회 응답:', result);
      
      if (result.code === 200) {
        setLiked(result.data);
        console.log(`✅ 좋아요 상태: ${result.data ? '좋아요함' : '좋아요 안함'}`);
      }
    } catch (error) {
      console.error('❌ 좋아요 상태 확인 실패:', error);
    }
  };

  // 좋아요 토글
  const handleLikeToggle = async () => {
    if (!isLoggedIn) {
      toast({
        title: "로그인 필요",
        description: "좋아요 기능을 사용하려면 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const url = `http://localhost:8080/api/v1/like/${id}`;
      const method = liked ? 'DELETE' : 'POST';
      
      console.log(`${liked ? '💔' : '❤️'} 좋아요 ${liked ? '삭제' : '추가'} 시작`);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      console.log(`📝 좋아요 ${liked ? '삭제' : '추가'} 응답:`, result);
      
      if (result.code === 200) {
        setLiked(result.data.liked);
        setLikeCount(result.data.likeCount);
        console.log(`✅ 좋아요 ${liked ? '삭제' : '추가'} 완료 - 새 상태: ${result.data.liked}, 개수: ${result.data.likeCount}`);
      }
    } catch (error) {
      console.error(`❌ 좋아요 ${liked ? '삭제' : '추가'} 실패:`, error);
      toast({
        title: "오류",
        description: "좋아요 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  // 삭제 처리 함수
  const handleDelete = async () => {
    if (!isLoggedIn || !user || !id) {
      toast({
        title: "삭제 실패",
        description: "로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);

    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/v1/boards/review/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: "게시글 삭제 완료",
          description: "게시글이 성공적으로 삭제되었습니다.",
        });
        navigate('/board?category=adoption');
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: "게시글 삭제 실패",
          description: errorData.message || "게시글 삭제 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
      toast({
        title: "게시글 삭제 실패",
        description: "네트워크 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            {error || '게시글을 찾을 수 없습니다'}
          </h1>
          <Button onClick={() => navigate('/board?category=adoption')} variant="outline">
            입양 후기 게시판으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  const isAuthor = isLoggedIn && user && user.id === postDetail.userId;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onLoginClick={() => {}} />

      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/board?category=adoption')}
          className="mb-6 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          뒤로가기
        </Button>

        <div className="bg-white rounded-2xl shadow-sm border-0 overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-start mb-4">
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-sm">
                입양 후기
              </Badge>
              
              {/* 수정/삭제 버튼 */}
              {isAuthor && (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-gray-600 hover:text-gray-800"
                    onClick={() => navigate(`/edit-adoption-review/${id}`)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    수정
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800 hover:bg-red-50" disabled={isDeleting}>
                         <Trash2 className="w-4 h-4 mr-1" />
                         {isDeleting ? '삭제 중...' : '삭제'}
                       </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>게시글을 삭제하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>
                          이 작업은 되돌릴 수 없습니다. 게시글이 영구적으로 삭제됩니다.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                          삭제
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-6 leading-tight">
              {postDetail.boardTitle}
            </h1>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{postDetail.nickname}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(postDetail.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <Eye className="w-4 h-4" />
                <span>{postDetail.boardViewCount}</span>
              </div>
            </div>

            {/* 입양 동물 정보 카드 */}
            {postDetail.petApplicationDTO && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">입양한 동물 정보</h3>
                <Card className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={postDetail.petApplicationDTO.profile1} 
                          alt="입양 동물" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold text-gray-800">
                          {postDetail.petApplicationDTO.noticeNo}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {postDetail.petApplicationDTO.kindFullNm}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatGender(postDetail.petApplicationDTO.sexCd)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {postDetail.petApplicationDTO.regionName} {postDetail.petApplicationDTO.subRegionName}
                        </p>
                        <p className="text-xs text-gray-500">
                          신청일: {formatDate(postDetail.petApplicationDTO.formCreateAt)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 첨부 이미지 */}
            {postDetail.images && postDetail.images.length > 0 && (
              <div className="mb-8">
                {postDetail.images.length === 1 ? (
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src={postDetail.images[0].s3Url}
                      alt="첨부 이미지"
                      className="w-full h-80 object-cover"
                    />
                  </div>
                ) : (
                  <Carousel className="w-full">
                    <CarouselContent>
                      {postDetail.images.map((image, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                          <div className="p-1">
                            <div className="aspect-square rounded-lg overflow-hidden">
                              <img
                                src={image.s3Url}
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
                {postDetail.boardContent}
              </p>
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
                  onClick={handleLikeToggle}
                >
                  <Heart className={`w-5 h-5 mr-2 ${liked ? 'fill-current' : ''}`} />
                  좋아요 {likeCount}
                </Button>
                <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  댓글 {postDetail.comments.length}
                </Button>
              </div>
            </div>
          </div>

          {/* 댓글 섹션 */}
          <CommentSection 
            comments={postDetail.comments}
            isLoggedIn={isLoggedIn}
            currentUserId={user?.id}
            onSubmitComment={async (content, parentId) => {
              if (!isLoggedIn || !user) {
                toast({
                  title: "로그인 필요",
                  description: "댓글 작성을 위해 로그인이 필요합니다.",
                  variant: "destructive"
                });
                return;
              }
              
              try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch(`http://localhost:8080/api/v1/comments/boards/${id}`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    userId: user.id,
                    boardId: parseInt(id!),
                    commentContent: content,
                    parentId: parentId
                  }),
                });
                
                const result = await response.json();
                if (result.code === 200) {
                  toast({
                    title: "댓글 등록 완료",
                    description: "댓글이 성공적으로 등록되었습니다.",
                  });
                  window.location.reload();
                } else {
                  throw new Error(result.message || '댓글 등록에 실패했습니다.');
                }
              } catch (error) {
                console.error('댓글 등록 실패:', error);
                toast({
                  title: "댓글 등록 실패",
                  description: "댓글 등록 중 오류가 발생했습니다.",
                  variant: "destructive"
                });
              }
            }}
            onEditComment={async (commentId, content) => {
              if (!isLoggedIn || !user) {
                toast({
                  title: "로그인 필요",
                  description: "댓글 수정을 위해 로그인이 필요합니다.",
                  variant: "destructive"
                });
                return;
              }
              
              try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch(`http://localhost:8080/api/v1/comments/${commentId}`, {
                  method: 'PUT',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    userId: user.id,
                    boardId: parseInt(id!),
                    commentContent: content,
                    parentId: null
                  }),
                });
                
                const result = await response.json();
                if (result.code === 200) {
                  toast({
                    title: "댓글 수정 완료",
                    description: "댓글이 성공적으로 수정되었습니다.",
                  });
                  window.location.reload();
                } else {
                  throw new Error(result.message || '댓글 수정에 실패했습니다.');
                }
              } catch (error) {
                console.error('댓글 수정 실패:', error);
                toast({
                  title: "댓글 수정 실패",
                  description: "댓글 수정 중 오류가 발생했습니다.",
                  variant: "destructive"
                });
              }
            }}
            onDeleteComment={async (commentId) => {
              if (!isLoggedIn || !user) {
                toast({
                  title: "로그인 필요",
                  description: "댓글 삭제를 위해 로그인이 필요합니다.",
                  variant: "destructive"
                });
                return;
              }
              
              try {
                const token = localStorage.getItem('accessToken');
                const response = await fetch(`http://localhost:8080/api/v1/comments/${commentId}`, {
                  method: 'DELETE',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                  },
                });
                
                const result = await response.json();
                if (result.code === 200) {
                  toast({
                    title: "댓글 삭제 완료",
                    description: "댓글이 성공적으로 삭제되었습니다.",
                  });
                  window.location.reload();
                } else {
                  throw new Error(result.message || '댓글 삭제에 실패했습니다.');
                }
              } catch (error) {
                console.error('댓글 삭제 실패:', error);
                toast({
                  title: "댓글 삭제 실패",
                  description: "댓글 삭제 중 오류가 발생했습니다.",
                  variant: "destructive"
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdoptionReviewDetail;