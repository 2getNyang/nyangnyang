import React, { useState } from 'react';
import { User, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Comment {
  id: number;
  commnetContent?: string;
  commentContent?: string;
  createdAt: string;
  commentNickname: string;
  parentId: number | null;
}

interface CommentSectionProps {
  comments: Comment[];
  isLoggedIn: boolean;
  onSubmitComment?: (content: string, parentId?: number | null) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  comments, 
  isLoggedIn, 
  onSubmitComment 
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    onSubmitComment?.(newComment, null);
    setNewComment('');
  };

  const handleSubmitReply = (parentId: number) => {
    if (!replyContent.trim()) return;
    onSubmitComment?.(replyContent, parentId);
    setReplyContent('');
    setReplyTo(null);
  };

  const formatDate = (dateString: string) => {
    return dateString.split('T')[0].replace(/-/g, '.');
  };

  // 계층구조로 댓글 정리
  const organizeComments = (comments: Comment[]) => {
    const parentComments = comments.filter(comment => comment.parentId === null);
    const childComments = comments.filter(comment => comment.parentId !== null);
    
    return parentComments.map(parent => ({
      ...parent,
      replies: childComments.filter(child => child.parentId === parent.id)
    }));
  };

  const organizedComments = organizeComments(comments);

  return (
    <div className="px-8 py-6 border-t border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        댓글 {comments.length}개
      </h3>
      
      {/* 댓글 입력창 */}
      {isLoggedIn && (
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="mb-3 resize-none"
            rows={3}
          />
          <div className="flex justify-end">
            <Button 
              onClick={handleSubmitComment}
              disabled={!newComment.trim()}
              size="sm"
            >
              <Send className="w-4 h-4 mr-1" />
              댓글 작성
            </Button>
          </div>
        </div>
      )}
      
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
                    <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {comment.commnetContent || comment.commentContent}
                  </p>
                  {isLoggedIn && (
                    <div className="mt-3 flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        답글
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* 답글 입력창 */}
                {replyTo === comment.id && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-3">
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="답글을 입력하세요..."
                      className="mb-2 resize-none"
                      rows={2}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyTo(null)}
                      >
                        취소
                      </Button>
                      <Button
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={!replyContent.trim()}
                        size="sm"
                      >
                        답글 작성
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 대댓글 */}
            {comment.replies && comment.replies.map((reply) => (
              <div key={reply.id} className="flex space-x-4 ml-14">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800 text-sm">{reply.commentNickname}</span>
                      <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {reply.commnetContent || reply.commentContent}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;