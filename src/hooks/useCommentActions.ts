import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface Comment {
  id: number;
  commentContent: string;
  commnetContent?: string;
  createdAt: string;
  commentNickname: string;
  commentUserId: number;
  parentId: number | null;
}

interface UseCommentActionsProps {
  boardId: string | undefined;
  onCommentsUpdate: (comments: Comment[]) => void;
}

export const useCommentActions = ({ boardId, onCommentsUpdate }: UseCommentActionsProps) => {
  const { user, isLoggedIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitComment = async (content: string, parentId?: number | null) => {
    if (!isLoggedIn || !user || !boardId) {
      toast({
        title: "로그인이 필요합니다",
        description: "댓글을 작성하려면 로그인해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "댓글 내용을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/v1/comments/boards/${boardId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          boardId: parseInt(boardId),
          commentContent: content,
          parentId: parentId || null
        })
      });

      if (response.ok) {
        toast({
          title: "댓글이 등록되었습니다",
        });
        // 댓글 목록 다시 가져오기
        await fetchComments();
      } else {
        throw new Error('댓글 등록에 실패했습니다');
      }
    } catch (error) {
      console.error('댓글 등록 실패:', error);
      toast({
        title: "댓글 등록에 실패했습니다",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const editComment = async (commentId: number, content: string) => {
    if (!isLoggedIn || !user || !boardId) {
      toast({
        title: "로그인이 필요합니다",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: "댓글 내용을 입력해주세요",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/v1/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          boardId: parseInt(boardId),
          commentContent: content,
          parentId: null
        })
      });

      if (response.ok) {
        toast({
          title: "댓글이 수정되었습니다",
        });
        // 댓글 목록 다시 가져오기
        await fetchComments();
      } else {
        throw new Error('댓글 수정에 실패했습니다');
      }
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      toast({
        title: "댓글 수정에 실패했습니다",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteComment = async (commentId: number) => {
    if (!isLoggedIn || !user) {
      toast({
        title: "로그인이 필요합니다",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/v1/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast({
          title: "댓글이 삭제되었습니다",
        });
        // 댓글 목록 다시 가져오기
        await fetchComments();
      } else {
        throw new Error('댓글 삭제에 실패했습니다');
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      toast({
        title: "댓글 삭제에 실패했습니다",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchComments = async () => {
    if (!boardId) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/v1/comments/boards/${boardId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const comments = Array.isArray(data) ? data : data.data || [];
        onCommentsUpdate(comments);
      }
    } catch (error) {
      console.error('댓글 목록 가져오기 실패:', error);
    }
  };

  return {
    submitComment,
    editComment,
    deleteComment,
    isSubmitting
  };
};