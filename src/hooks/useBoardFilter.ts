
import { useState, useMemo, useEffect } from 'react';
import { Post, BoardCategory } from '@/types/board';

interface UseBoardFilterProps {
  posts: Post[];
  postsPerPage: number;
}

export const useBoardFilter = ({ posts, postsPerPage }: UseBoardFilterProps) => {
  const [activeTab, setActiveTab] = useState<BoardCategory>('adoption');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // URL 파라미터에서 tab 읽기
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    
    if (tabParam) {
      const validTabs: BoardCategory[] = ['adoption', 'sns', 'missing'];
      if (tabParam === 'lost') {
        setActiveTab('missing');
      } else if (validTabs.includes(tabParam as BoardCategory)) {
        setActiveTab(tabParam as BoardCategory);
      }
    }
  }, []);


  const totalPages = Math.ceil(posts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

  // Reset to first page when tab or search changes
  const handleTabChange = (tab: BoardCategory) => {
    setActiveTab(tab);
    setCurrentPage(1);
    
    // URL 업데이트
    const url = new URL(window.location.href);
    if (tab === 'missing') {
      url.searchParams.set('tab', 'lost');
    } else {
      url.searchParams.set('tab', tab);
    }
    window.history.replaceState({}, '', url.toString());
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return {
    activeTab,
    searchTerm,
    currentPage,
    currentPosts,
    totalPages,
    handleTabChange,
    handleSearchChange,
    setCurrentPage,
  };
};
