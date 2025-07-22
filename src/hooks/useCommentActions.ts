import { useState } from 'react';
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
      return;
    }

    if (!content.trim()) {
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
        // 댓글 목록 다시 가져오기
        await fetchComments();
      } else {
        throw new Error('댓글 등록에 실패했습니다');
      }
    } catch (error) {
      console.error('댓글 등록 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const editComment = async (commentId: number, content: string) => {
    if (!isLoggedIn || !user || !boardId) {
      return;
    }

    if (!content.trim()) {
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
        // 댓글 목록 다시 가져오기
        await fetchComments();
      } else {
        throw new Error('댓글 수정에 실패했습니다');
      }
    } catch (error) {
      console.error('댓글 수정 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteComment = async (commentId: number) => {
    if (!isLoggedIn || !user) {
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
        // 댓글 목록 다시 가져오기
        await fetchComments();
      } else {
        throw new Error('댓글 삭제에 실패했습니다');
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
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