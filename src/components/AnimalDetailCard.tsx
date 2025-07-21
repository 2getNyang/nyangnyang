import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Heart, Calendar, MapPin, Info, MessageSquare, Reply, Edit, Trash2 } from 'lucide-react';

// AnimalDTO 타입 정의
interface AnimalCommentDTO {
  id: number;
  authorName: string;
  content: string;
  createdAt: string;
  isAuthor: boolean;
  replies?: AnimalCommentDTO[];
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
  careRegNumber: string;
  bookmarked: boolean;
  popfile1?: string;
  popfile2?: string;
  popfile3?: string;
  comments: AnimalCommentDTO[];
}

interface AnimalDetailCardProps {
  animal: AnimalDTO;
}

const AnimalDetailCard: React.FC<AnimalDetailCardProps> = ({ animal }) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(animal.bookmarked);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [editingComment, setEditingComment] = useState<number | null>(null);

  // 이미지 배열 생성
  const images = [animal.popfile1, animal.popfile2, animal.popfile3].filter(Boolean);
  const hasImages = images.length > 0;

  // 성별 변환
  const getSexDisplay = (sexCd: string) => {
    switch (sexCd) {
      case 'M': return '남아';
      case 'F': return '여아';
      default: return '성별 정보 없음';
    }
  };

  // 중성화 상태 변환
  const getNeuterDisplay = (neuterYn: string) => {
    switch (neuterYn) {
      case 'Y': return '중성화 완료';
      case 'N': return '중성화 안됨';
      default: return '미상';
    }
  };

  // 보호 상태 변환 및 스타일
  const getProcessStateDisplay = (processState: string) => {
    switch (processState) {
      case 'NOTICE':
        return { text: '입양 가능', variant: 'default' as const, className: 'bg-green-500 text-white' };
      case 'PROTECT':
        return { text: '임시 보호 중', variant: 'secondary' as const, className: 'bg-blue-500 text-white' };
      case 'FINISH':
        return { text: '입양 완료', variant: 'outline' as const, className: 'bg-gray-500 text-white' };
      default:
        return { text: processState, variant: 'outline' as const, className: '' };
    }
  };

  const processStateInfo = getProcessStateDisplay(animal.processState);

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: 백엔드 API 호출
  };

  const handleAdoptionForm = () => {
    navigate(`/adoption-form/${animal.desertionNo}`);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return dateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3');
  };

  const CommentItem: React.FC<{ comment: AnimalCommentDTO; isReply?: boolean }> = ({ comment, isReply = false }) => (
    <div className={`p-4 ${isReply ? 'ml-8 bg-muted/50' : 'bg-background'} rounded-lg`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{comment.authorName}</span>
          <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
        </div>
        {comment.isAuthor && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingComment(comment.id)}
              className="h-6 w-6 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-destructive"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      
      {editingComment === comment.id ? (
        <div className="space-y-2">
          <Textarea
            defaultValue={comment.content}
            className="min-h-[60px]"
            placeholder="댓글을 수정해주세요"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setEditingComment(null)}>저장</Button>
            <Button size="sm" variant="outline" onClick={() => setEditingComment(null)}>취소</Button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-sm mb-2">{comment.content}</p>
          {!isReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="h-6 text-xs"
            >
              <Reply className="h-3 w-3 mr-1" />
              답글
            </Button>
          )}
        </>
      )}

      {replyingTo === comment.id && (
        <div className="mt-3 space-y-2">
          <Textarea
            placeholder="답글을 입력해주세요"
            className="min-h-[60px]"
          />
          <div className="flex gap-2">
            <Button size="sm">답글 작성</Button>
            <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>취소</Button>
          </div>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">동물 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">나이:</span>
                  <span>{animal.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">성별:</span>
                  <span>{getSexDisplay(animal.sexCd)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">중성화:</span>
                  <span>{getNeuterDisplay(animal.neuterYn)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">털색:</span>
                  <span>{animal.colorCd}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">무게:</span>
                  <span>{animal.weight}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">발견 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">발견일:</span>
                    <span className="ml-2">{formatDate(animal.happenDt)}</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">발견장소:</span>
                    <span className="ml-2">{animal.happenPlace}</span>
                  </div>
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
            <p className="text-sm">
              <span className="text-muted-foreground">보호소 번호:</span>
              <span className="ml-2 font-mono">{animal.careRegNumber}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 섹션 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            댓글 ({animal.comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 댓글 작성 */}
          <div className="space-y-2">
            <Textarea
              placeholder="댓글을 입력해주세요"
              className="min-h-[80px]"
            />
            <Button>댓글 작성</Button>
          </div>

          <Separator />

          {/* 댓글 목록 */}
          <div className="space-y-4">
            {animal.comments.length > 0 ? (
              animal.comments.map((comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))
            ) : (
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
          disabled={animal.processState === 'FINISH'}
        >
          {animal.processState === 'FINISH' ? '입양 완료된 동물입니다' : '입양 신청서 작성하기'}
        </Button>
      </div>
    </div>
  );
};

export default AnimalDetailCard;