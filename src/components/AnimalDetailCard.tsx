import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Heart, Calendar, MapPin, Info, MessageSquare, Reply, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useAnimalCommentActions } from '@/hooks/useAnimalCommentActions';

// 댓글 데이터 타입
interface AnimalComment {
  commentId: number;
  commentContent: string;
  createdAt: string;
  nickname: string;
  userId: number;
  parentId: number | null;
  childComments?: AnimalComment[];
}

interface AnimalDTO {
  desertionNo: string;
  kindFullNm: string;
  age: string;
  sexCd: string;
  neuterYn: string;
  colorCd: string;
  weight: string;
  happenDt: string;
  happenPlace: string;
  processState: string;
  noticeNo: string;
  noticeSdt: string;
  noticeEdt: string;
  specialMark: string;
  bookmarked: boolean;
  popfile1?: string;
  popfile2?: string;
  popfile3?: string;
  comments: AnimalComment[];
  shelterName: string;
  shelterAddress: string;
  shelterTel: string;
  careRegNumber?: string;
}

interface AnimalDetailCardProps {
  animal: AnimalDTO;
}

const AnimalDetailCard: React.FC<AnimalDetailCardProps> = ({ animal }) => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(animal.bookmarked);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [comments, setComments] = useState<AnimalComment[]>(animal.comments);

  const { submitComment, editComment, deleteComment, isSubmitting } = useAnimalCommentActions({
    desertionNo: animal.desertionNo,
    onCommentsUpdate: setComments
  });

  // 이미지 배열 생성
  const images = [animal.popfile1, animal.popfile2, animal.popfile3].filter(Boolean);
  const hasImages = images.length > 0;

  // 성별 변환
  const getSexDisplay = (sexCd: string) => {
    switch (sexCd) {
      case 'M': return '수컷';
      case 'F': return '암컷';
      case 'Q': return '모름';
      default: return '성별 정보 없음';
    }
  };

  // 중성화 상태 변환
  const getNeuterDisplay = (neuterYn: string) => {
    switch (neuterYn) {
      case 'Y': return '중성화 완료';
      case 'N': return '중성화 미완료';
      case 'U': return '불명';
      default: return '불명';
    }
  };

  // 보호 상태 변환 및 스타일
  const getProcessStateDisplay = (processState: string) => {
    if (processState === '보호중') {
      return { text: '보호중', className: 'bg-yellow-500 text-white' };
    }
    return { text: processState, className: 'bg-gray-500 text-white' };
  };

  const processStateInfo = getProcessStateDisplay(animal.processState);

  const handleBookmarkToggle = async () => {
    if (!isLoggedIn) {
      toast({
        title: "로그인 필요",
        description: "찜하기 기능은 로그인 후 이용 가능합니다.",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const method = isBookmarked ? 'DELETE' : 'POST';
    
    try {
      const response = await fetch(`http://localhost:8080/api/v1/bookmark/${animal.desertionNo}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setIsBookmarked(result.data.liked);
        
        toast({
          title: result.data.liked ? "찜 추가됨" : "찜 해제됨",
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "오류 발생",
        description: "찜하기 처리 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  const handleAdoptionForm = () => {
    navigate(`/adoption-form/${animal.desertionNo}?careRegNumber=${encodeURIComponent(animal.careRegNumber || '')}&noticeNo=${encodeURIComponent(animal.noticeNo || '')}`);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');
  };

  // 새 댓글 작성
  const handleNewCommentSubmit = async () => {
    if (!isLoggedIn) {
      toast({
        title: "로그인 필요",
        description: "댓글 작성은 로그인 후 이용 가능합니다.",
        variant: "destructive",
      });
      return;
    }
    
    if (!newCommentContent.trim()) return;
    
    await submitComment(newCommentContent);
    setNewCommentContent('');
  };

  // 답글 작성
  const handleReplySubmit = async (parentId: number) => {
    if (!isLoggedIn) {
      toast({
        title: "로그인 필요",
        description: "댓글 작성은 로그인 후 이용 가능합니다.",
        variant: "destructive",
      });
      return;
    }
    
    if (!replyContent.trim()) return;
    
    await submitComment(replyContent, parentId);
    setReplyContent('');
    setReplyingTo(null);
  };

  // 댓글 수정
  const handleEditSubmit = async (commentId: number) => {
    if (!editContent.trim()) return;
    
    await editComment(commentId, editContent);
    setEditContent('');
    setEditingComment(null);
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (confirm('정말로 댓글을 삭제하시겠습니까?')) {
      await deleteComment(commentId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* 뒤로가기 버튼 */}
      <Button
        variant="ghost"
        onClick={() => window.history.back()}
        className="mb-4 hover:bg-gray-100"
      >
        ← 뒤로가기
      </Button>
      
      {/* 메인 카드 */}
      <Card className="relative">
        {/* 북마크 버튼 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBookmarkToggle}
          className="absolute top-4 right-4 z-10"
        >
          <Heart className={`h-5 w-5 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>

        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            {animal.kindFullNm}
            <Badge className={processStateInfo.className}>
              {processStateInfo.text}
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 이미지 갤러리 */}
          <div className="w-full">
            {hasImages ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`${animal.kindFullNm} 사진 ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {images.length > 1 && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
            ) : (
              <div className="aspect-[4/3] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">이미지가 없습니다</p>
              </div>
            )}
          </div>

          {/* 동물 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">동물 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground w-20">나이:</span>
                  <span>{animal.age}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground w-20">성별:</span>
                  <span>{getSexDisplay(animal.sexCd)}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground w-20">중성화여부:</span>
                  <span>{getNeuterDisplay(animal.neuterYn)}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground w-20">털색:</span>
                  <span>{animal.colorCd}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground w-20">무게:</span>
                  <span>{animal.weight}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">발견 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground w-20">발견일:</span>
                  <span>{formatDate(animal.happenDt)}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground w-20">발견장소:</span>
                  <span>{animal.happenPlace}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* 공고 정보 */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">공고 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">공고번호:</span>
                <span className="ml-2 font-mono">{animal.noticeNo}</span>
              </div>
              <div>
                <span className="text-muted-foreground">공고 시작일:</span>
                <span className="ml-2">{formatDate(animal.noticeSdt)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">공고 종료일:</span>
                <span className="ml-2">{formatDate(animal.noticeEdt)}</span>
              </div>
            </div>
          </div>

          {/* 특이사항 */}
          {animal.specialMark && (
            <>
              <Separator />
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  특이사항
                </h3>
                <p className="text-sm bg-muted p-3 rounded-lg">{animal.specialMark}</p>
              </div>
            </>
          )}

          {/* 보호소 정보 */}
          <Separator />
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">보호소 정보</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground w-24">보호소 이름:</span>
                <span>{animal.shelterName}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground w-24">보호소 주소:</span>
                <span>{animal.shelterAddress}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-muted-foreground w-24">전화번호:</span>
                <span>{animal.shelterTel}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            댓글 ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 댓글 작성 */}
          {isLoggedIn ? (
            <div className="space-y-2">
              <Textarea
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
                placeholder="댓글을 입력해주세요"
                className="min-h-[80px]"
              />
              <Button 
                onClick={handleNewCommentSubmit}
                disabled={isSubmitting || !newCommentContent.trim()}
              >
                {isSubmitting ? '작성 중...' : '댓글 작성'}
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">댓글을 작성하려면 로그인이 필요합니다.</p>
            </div>
          )}

          <Separator />

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {(() => {
              // 댓글을 계층구조로 정리
              const organizeComments = (comments: any[]) => {
                const parentComments = comments.filter(comment => comment.parentId === null);
                const childComments = comments.filter(comment => comment.parentId !== null);
                
                return parentComments.map(parent => ({
                  ...parent,
                  replies: childComments.filter(child => child.parentId === parent.commentId)
                }));
              };

              const organizedComments = organizeComments(comments);
              
              return organizedComments.length > 0 ? (
                organizedComments.map((comment) => (
                <div key={comment.commentId} className="space-y-3">
                  {/* 주 댓글 */}
                  <div className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-gray-600 text-sm font-medium">{comment.nickname?.charAt(0)}</span>
                        </div>
                        <span className="font-medium text-gray-900 text-sm">{comment.nickname}</span>
                      </div>
                      {user && user.id === comment.userId && (
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingComment(comment.commentId);
                              setEditContent(comment.commentContent);
                            }}
                            className="text-gray-500 hover:text-gray-700 px-2 py-1 h-7 text-xs"
                          >
                            수정
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(comment.commentId)}
                            className="text-red-500 hover:text-red-700 px-2 py-1 h-7 text-xs"
                          >
                            삭제
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {editingComment === comment.commentId ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="min-h-[60px]"
                          placeholder="댓글을 수정해주세요"
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            onClick={() => handleEditSubmit(comment.commentId)}
                            disabled={isSubmitting || !editContent.trim()}
                          >
                            {isSubmitting ? '저장 중...' : '저장'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setEditingComment(null);
                              setEditContent('');
                            }}
                          >
                            취소
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-800 leading-relaxed mb-3 text-sm">
                          {comment.commentContent}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                            {!comment.parentId && isLoggedIn && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setReplyingTo(replyingTo === comment.commentId ? null : comment.commentId)}
                                className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 h-6 text-xs"
                              >
                                답글달기
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 답글 작성 폼 */}
                    {replyingTo === comment.commentId && (
                      <div className="mt-3 space-y-2">
                        <Textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="답글을 입력해주세요"
                          className="min-h-[60px]"
                        />
                        <div className="flex gap-2">
                          <Button 
                            size="sm"
                            onClick={() => handleReplySubmit(comment.commentId)}
                            disabled={isSubmitting || !replyContent.trim()}
                          >
                            {isSubmitting ? '작성 중...' : '답글 작성'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyContent('');
                            }}
                          >
                            취소
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 대댓글 */}
                  {comment.childComments && comment.childComments.map((reply) => (
                    <div key={reply.commentId} className="ml-6 bg-gray-50 border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 text-xs font-medium">{reply.nickname?.charAt(0)}</span>
                          </div>
                          <span className="font-medium text-gray-900 text-sm">{reply.nickname}</span>
                        </div>
                        {user && user.id === reply.userId && (
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingComment(reply.commentId);
                                setEditContent(reply.commentContent);
                              }}
                              className="text-gray-500 hover:text-gray-700 px-2 py-1 h-7 text-xs"
                            >
                              수정
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteComment(reply.commentId)}
                              className="text-red-500 hover:text-red-700 px-2 py-1 h-7 text-xs"
                            >
                              삭제
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {editingComment === reply.commentId ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="min-h-[60px]"
                            placeholder="댓글을 수정해주세요"
                          />
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleEditSubmit(reply.commentId)}
                              disabled={isSubmitting || !editContent.trim()}
                            >
                              {isSubmitting ? '저장 중...' : '저장'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => {
                                setEditingComment(null);
                                setEditContent('');
                              }}
                            >
                              취소
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-800 leading-relaxed mb-2 text-sm">
                            {reply.commentContent}
                          </p>
                          <span className="text-xs text-gray-400">{formatDate(reply.createdAt)}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))
            ) : null;
            })()}
            {comments.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 입양 신청 버튼 */}
      <div className="sticky bottom-4">
        <Button
          onClick={handleAdoptionForm}
          className="w-full h-12 text-lg font-semibold"
          disabled={animal.processState !== '보호중'}
        >
          {animal.processState !== '보호중' ? '입양 완료된 동물입니다' : '입양 신청서 작성하기'}
        </Button>
      </div>
    </div>
  );
};

export default AnimalDetailCard;