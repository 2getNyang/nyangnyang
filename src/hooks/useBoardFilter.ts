
import { useState, useMemo } from 'react';
import { Post, BoardCategory } from '@/types/board';

interface UseBoardFilterProps {
  posts: Post[];
  postsPerPage: number;
}

export const useBoardFilter = ({ posts, postsPerPage }: UseBoardFilterProps) => {
  const [activeTab, setActiveTab] = useState<BoardCategory>('adoption');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesCategory = post.category === activeTab;
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [posts, activeTab, searchTerm]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  // Reset to first page when tab or search changes
  const handleTabChange = (tab: BoardCategory) => {
    setActiveTab(tab);
    setCurrentPage(1);
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
