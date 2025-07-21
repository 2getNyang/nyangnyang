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
  commentUserId: number;
  parentId: number | null;
}

interface CommentSectionProps {
  comments: Comment[];
  isLoggedIn: boolean;
  currentUserId?: number;
  onSubmitComment?: (content: string, parentId?: number | null) => void;
  onEditComment?: (commentId: number, content: string) => void;
  onDeleteComment?: (commentId: number) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ 
  comments, 
  isLoggedIn, 
  currentUserId,
  onSubmitComment,
  onEditComment,
  onDeleteComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

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

  const handleEditClick = (commentId: number, currentContent: string) => {
    setEditingCommentId(commentId);
    setEditContent(currentContent);
  };

  const handleEditSubmit = (commentId: number) => {
    if (!editContent.trim()) return;
    onEditComment?.(commentId, editContent);
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleEditCancel = () => {
    setEditingCommentId(null);
    setEditContent('');
  };

  const handleDeleteClick = async (commentId: number) => {
    if (window.confirm('댓글을 삭제하시겠습니까?')) {
      onDeleteComment?.(commentId);
    }
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
    <div className="bg-white border-t">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          댓글 {comments.length}개
        </h3>
        
        {/* 댓글 입력창 */}
        {isLoggedIn && (
          <div className="mb-8 bg-gray-50 rounded-xl p-6 shadow-sm">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="mb-4 resize-none border-0 bg-white shadow-sm"
              rows={3}
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="px-6"
              >
                <Send className="w-4 h-4 mr-2" />
                댓글 작성
              </Button>
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          {organizedComments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              {/* 주 댓글 */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="mb-3">
                  <span className="font-bold text-gray-900 text-lg">{comment.commentNickname}</span>
                </div>
                
                {editingCommentId === comment.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="resize-none"
                      rows={3}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleEditCancel}
                      >
                        취소
                      </Button>
                      <Button
                        onClick={() => handleEditSubmit(comment.id)}
                        disabled={!editContent.trim()}
                        size="sm"
                      >
                        수정
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-800 leading-relaxed mb-3 text-lg">
                      {comment.commnetContent || comment.commentContent}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                        {isLoggedIn && !comment.parentId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1"
                          >
                            답글달기
                          </Button>
                        )}
                      </div>
                      {currentUserId === comment.commentUserId && (
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditClick(comment.id, comment.commnetContent || comment.commentContent || '')}
                            className="text-gray-600 hover:text-gray-800 px-3 py-1"
                          >
                            수정
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(comment.id)}
                            className="text-red-600 hover:text-red-800 px-3 py-1"
                          >
                            삭제
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* 답글 입력창 */}
                {replyTo === comment.id && (
                  <div className="mt-4 bg-white rounded-lg p-4 border">
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="답글을 입력하세요..."
                      className="mb-3 resize-none"
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

              {/* 대댓글 */}
              {comment.replies && comment.replies.map((reply) => (
                <div key={reply.id} className="ml-8 bg-gray-50 rounded-xl p-6">
                  <div className="mb-3">
                    <span className="font-bold text-gray-900 text-lg">{reply.commentNickname}</span>
                  </div>
                  
                  {editingCommentId === reply.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleEditCancel}
                        >
                          취소
                        </Button>
                        <Button
                          onClick={() => handleEditSubmit(reply.id)}
                          disabled={!editContent.trim()}
                          size="sm"
                        >
                          수정
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-gray-800 leading-relaxed mb-3 text-lg">
                        {reply.commnetContent || reply.commentContent}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{formatDate(reply.createdAt)}</span>
                        {currentUserId === reply.commentUserId && (
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(reply.id, reply.commnetContent || reply.commentContent || '')}
                              className="text-gray-600 hover:text-gray-800 px-3 py-1"
                            >
                              수정
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClick(reply.id)}
                              className="text-red-600 hover:text-red-800 px-3 py-1"
                            >
                              삭제
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;