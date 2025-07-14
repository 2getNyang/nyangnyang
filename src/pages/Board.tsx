
import React, { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import BoardTabs from '@/components/board/BoardTabs';
import BoardPagination from '@/components/board/BoardPagination';
import LoginModal from '@/components/LoginModal';
import { useBoardFilter } from '@/hooks/useBoardFilter';
import { allPosts } from '@/data/mockPosts';

const Board = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUserName] = useState('김철수');
  
  // 나중에repetedPosts 지워주세요
  const repeatedPosts = Array(5).fill(allPosts).flat();
  const {
    activeTab,
    searchTerm,
    currentPage,
    currentPosts,
    totalPages,
    handleTabChange,
    handleSearchChange,
    setCurrentPage,
  } = useBoardFilter({
  posts: repeatedPosts, //repeatePosts 대신에 appPosts 적으세요
    postsPerPage: 12,
  });

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        onLoginClick={handleLoginClick}
        isLoggedIn={isLoggedIn}
        userName={userName}
        onLogout={() => setIsLoggedIn(false)}
      />
      
      <div className="container mx-auto px-4 py-8">
        <BoardTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          currentPosts={currentPosts}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />

        <BoardPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default Board;
