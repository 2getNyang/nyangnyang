import React, { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import MyBoardTabs from '@/components/board/MyBoardTabs';
import BoardPagination from '@/components/board/BoardPagination';
import Footer from '@/components/Footer';
import { useBoardFilter } from '@/hooks/useBoardFilter';
import { allPosts } from '@/data/mockPosts';
import { Post } from '@/types/board';

const MyPosts = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUserName] = useState('김철수');

  // 현재 로그인한 사용자의 게시글만 필터링
  const userPosts = allPosts.filter(post => post.author === userName) as Post[];

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
    posts: userPosts,
    postsPerPage: 12,
  });

  const handleSearch = () => {
    // MyPosts에서는 로컬 필터링으로 검색 처리
    console.log('내 게시글 검색:', searchTerm);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        onLoginClick={() => {}}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* 페이지 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">내가 작성한 게시글</h1>
          <p className="text-gray-600">{userName}님이 작성한 총 {userPosts.length}개의 게시글</p>
        </div>

        {/* 게시글이 없는 경우 */}
        {userPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              아직 작성한 게시글이 없습니다
            </h3>
            <p className="text-gray-500">
              첫 번째 게시글을 작성해보세요!
            </p>
          </div>
        ) : currentPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-500">
              다른 검색어로 시도해보세요!
            </p>
          </div>
        ) : (
          <>
            <MyBoardTabs
              activeTab={activeTab}
              onTabChange={handleTabChange}
              currentPosts={currentPosts}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              onSearch={handleSearch}
            />

            <BoardPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default MyPosts;