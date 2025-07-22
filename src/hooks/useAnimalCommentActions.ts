import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface AnimalComment {
  commentId: number;
  commentContent: string;
  createdAt: string;
  nickname: string;
  userId: number;
  parentId: number | null;
  childComments?: AnimalComment[];
}

interface UseAnimalCommentActionsProps {
  desertionNo: string | undefined;
  onCommentsUpdate: (comments: AnimalComment[]) => void;
}

export const useAnimalCommentActions = ({ desertionNo, onCommentsUpdate }: UseAnimalCommentActionsProps) => {
  const { user, isLoggedIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitComment = async (content: string, parentId?: number | null) => {
    if (!isLoggedIn || !user || !desertionNo) {
      return;
    }

    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/v1/comments/adoption/${desertionNo}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          boardId: null,
          desertionNo: desertionNo,
          commentContent: content,
          parentId: parentId || null
        })
      });

      if (response.ok) {
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
    if (!isLoggedIn || !user || !desertionNo) {
      return;
    }

    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/v1/comments/adoption/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          boardId: null,
          desertionNo: desertionNo,
          commentContent: content,
          parentId: null
        })
      });

      if (response.ok) {
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
    if (!desertionNo) return;

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/v1/animals/${desertionNo}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        }
      });

      if (response.ok) {
        const result = await response.json();
        const comments = result.data.comments || [];
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