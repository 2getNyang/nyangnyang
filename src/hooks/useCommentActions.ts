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
  boardType: 'review' | 'sns' | 'lost'; // 게시판 타입 추가
}

export const useCommentActions = ({ boardId, onCommentsUpdate, boardType }: UseCommentActionsProps) => {
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
      const response = await fetch(`/api/v1/comments/boards/${boardId}`, {
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
      const response = await fetch(`/api/v1/comments/${commentId}`, {
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
      const response = await fetch(`/api/v1/comments/${commentId}`, {
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
      // 게시판 타입에 따른 API 엔드포인트 결정
      let apiUrl = '';
      switch (boardType) {
        case 'review':
          apiUrl = `/api/v1/boards/review/${boardId}`;
          break;
        case 'sns':
          apiUrl = `/api/v1/boards/sns/${boardId}`;
          break;
        case 'lost':
          apiUrl = `/api/v1/boards/lost/${boardId}`;
          break;
        default:
          apiUrl = `/api/v1/comments/boards/${boardId}`;
      }

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (response.ok) {
        const result = await response.json();
        const comments = result.data?.comments || result.comments || [];
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
    fetchComments,
    isSubmitting
  };
};