
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { User, MessageCircle, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface Comment {
  id: number;
  commentContent?: string;
  commnetContent?: string; // 오타가 있는 필드명도 지원
  createdAt: string;
  commentNickname: string;
  parentId: number | null;
}

interface CommentSectionProps {
  comments: Comment[];
  boardId: string;
  boardType: 'review' | 'sns' | 'missing';
  onCommentAdded?: () => void;
}

const CommentSection = ({ comments, boardId, boardType, onCommentAdded }: CommentSectionProps) => {
  const { user, isLoggedIn } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString: string) => {
    return dateString.split('T')[0].replace(/-/g, '.');
  };

  const getCommentContent = (comment: Comment) => {
    return comment.commentContent || comment.commnetContent || '';
  };

  const getApiEndpoint = () => {
    switch (boardType) {
      case 'review':
        return `http://localhost:8080/api/v1/boards/review/${boardId}/comments`;
      case 'sns':
        return `http://localhost:8080/api/v1/boards/sns/${boardId}/comments`;
      case 'missing':
        return `http://localhost:8080/api/v1/boards/missing/${boardId}/comments`;
      default:
        return '';
    }
  };

  const handleSubmitComment = async (content: string, parentId: number | null = null) => {
    if (!isLoggedIn || !user) {
      toast({
        title: "로그인 필요",
        description: "댓글을 작성하려면 로그인해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "입력 오류",
        description: "댓글 내용을 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(getApiEndpoint(), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          commentContent: content.trim(),
          parentId: parentId,
        }),
      });

      if (response.ok) {
        toast({
          title: "댓글 작성 완료",
          description: "댓글이 성공적으로 작성되었습니다.",
        });
        
        // 댓글 입력 필드 초기화
        if (parentId) {
          setReplyContent('');
          setReplyingTo(null);
        } else {
          setNewComment('');
        }
        
        // 부모 컴포넌트에 댓글 추가 알림
        if (onCommentAdded) {
          onCommentAdded();
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: "댓글 작성 실패",
          description: errorData.message || "댓글 작성 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('댓글 작성 오류:', error);
      toast({
        title: "댓글 작성 실패",
        description: "네트워크 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const mainComments = comments.filter(comment => comment.parentId === null);

  return (
    <div className="space-y-6">
      {/* 댓글 통계 */}
      <div className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
        <MessageCircle className="w-5 h-5" />
        <span>댓글 {comments.length}개</span>
      </div>

      {/* 댓글 입력창 */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="space-y-3">
            <Textarea
              placeholder={isLoggedIn ? "댓글을 입력하세요..." : "로그인 후 댓글을 작성할 수 있습니다."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="resize-none bg-white"
              rows={3}
              disabled={!isLoggedIn}
            />
            <div className="flex justify-end">
              <Button
                onClick={() => handleSubmitComment(newComment)}
                disabled={!isLoggedIn || !newComment.trim() || isSubmitting}
                size="sm"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? '작성 중...' : '댓글 작성'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 댓글 목록 */}
      {comments.length > 0 && (
        <div className="space-y-6">
          {mainComments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              {/* 주 댓글 */}
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-800">{comment.commentNickname}</span>
                        <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {getCommentContent(comment)}
                      </p>
                      <div className="mt-3 flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="text-xs text-gray-600 hover:text-gray-800"
                        >
                          답글
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 답글 입력창 */}
                  {replyingTo === comment.id && (
                    <Card className="mt-3 bg-blue-50 border-blue-200">
                      <CardContent className="p-3">
                        <div className="space-y-3">
                          <Textarea
                            placeholder="답글을 입력하세요..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="resize-none bg-white"
                            rows={2}
                          />
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setReplyingTo(null);
                                setReplyContent('');
                              }}
                            >
                              취소
                            </Button>
                            <Button
                              onClick={() => handleSubmitComment(replyContent, comment.id)}
                              disabled={!replyContent.trim() || isSubmitting}
                              size="sm"
                            >
                              답글 작성
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>

              {/* 대댓글 */}
              {comments
                .filter(reply => reply.parentId === comment.id)
                .map((reply) => (
                  <div key={reply.id} className="flex space-x-4 ml-14">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-800">{reply.commentNickname}</span>
                            <span className="text-sm text-gray-500">{formatDate(reply.createdAt)}</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {getCommentContent(reply)}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}

      {comments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
        </div>
      )}
    </div>
  );
};

export default CommentSection;
