
import React, { useState, useEffect } from 'react';
import AppHeaderWithModal from '@/components/AppHeaderWithModal';
import Footer from '@/components/Footer';
import BoardTabs from '@/components/board/BoardTabs';
import BoardPagination from '@/components/board/BoardPagination';

import { useBoardFilter } from '@/hooks/useBoardFilter';
import { boardList, BoardCategory } from '@/types/boardList';
import { Post } from '@/types/board';

const Board = () => {
  const [boardData, setBoardData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
    pageSize: 12
  });

  // API 데이터 가져오기
  const fetchBoardData = async (category: BoardCategory, page: number = 0) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/v1/boards/${category}?page=${page}&size=12`);
      const result = await response.json();
      console.log('API response:', result); // API 응답 전체 구조 확인
      
      // API 응답에서 실제 게시글 배열 추출
      const data: any[] = result.data?.content || [];
      
      // 페이징 정보 업데이트
      setPaginationInfo({
        totalPages: result.data?.totalPages || 0,
        totalElements: result.data?.totalElements || 0,
        currentPage: result.data?.number || 0,
        pageSize: result.data?.size || 12
      });
      
      const convertedPosts: Post[] = data.map((item) => {
        console.log('Board item from API:', item); // API에서 받은 아이템 확인
        return {
          id: item.id.toString(),
          title: item.boardTitle || `${item.kindName || '게시글'} - ${item.lostType || ''}`,
          content: item.boardContent || '',
          imageUrl: item.imageUrl || item.thumbnailUrl || (item.images && item.images[0]) || '',
          author: item.nickname || item.nickName || '익명',
          date: item.createdAt,
          category: category === 'review' ? 'adoption' : category === 'lost' ? 'missing' : category,
          views: item.boardViewCount || item.viewCount || 0,
          // 실종/목격 게시판 전용 필드
          breed: item.kindName,
          gender: item.gender,
          age: item.age?.toString(),
          furColor: item.furColor,
          missingLocation: item.missingLocation,
          missingDate: item.missingDate,
          missingType: item.lostType === '실종' ? 'MS' : item.lostType === '목격' ? 'WT' : undefined,
          // SNS 홍보 게시판 전용 필드
          instagramLink: item.instagramLink,
          images: item.images
        };
      });
      
      setBoardData(convertedPosts);
    } catch (error) {
      console.error('Failed to fetch board data:', error);
      setBoardData([]);
      setPaginationInfo({
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        pageSize: 12
      });
    } finally {
      setLoading(false);
    }
  };

  const {
    activeTab,
    searchTerm,
    handleTabChange,
    handleSearchChange,
  } = useBoardFilter({
    posts: boardData,
    postsPerPage: 12,
  });

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    let apiCategory: BoardCategory;
    switch (activeTab) {
      case 'adoption':
        apiCategory = 'review';
        break;
      case 'missing':
        apiCategory = 'lost';
        break;
      default:
        apiCategory = activeTab as BoardCategory;
    }
    fetchBoardData(apiCategory, page - 1); // API는 0부터 시작하므로 -1
  };

  // 탭 변경 시 데이터 가져오기
  useEffect(() => {
    let apiCategory: BoardCategory;
    switch (activeTab) {
      case 'adoption':
        apiCategory = 'review'; // 입양 후기는 review API 사용
        break;
      case 'missing':
        apiCategory = 'lost'; // 실종/목격은 lost API 사용
        break;
      default:
        apiCategory = activeTab as BoardCategory;
    }
    fetchBoardData(apiCategory, 0); // 탭 변경 시 첫 페이지로
  }, [activeTab]);


  // 검색 기능
  const handleSearch = async () => {
    
    setLoading(true);
    try {
      let searchEndpoint = '';
      switch (activeTab) {
        case 'adoption':
          searchEndpoint = 'review';
          break;
        case 'sns':
          searchEndpoint = 'sns';
          break;
        case 'missing':
          searchEndpoint = 'lost';
          break;
        default:
          searchEndpoint = activeTab;
      }

      if (!searchTerm.trim()) {fetchBoardData(searchEndpoint as BoardCategory, 0); return;};
      
      const response = await fetch(
        `/api/v1/boards/${searchEndpoint}/elasticsearch?keyword=${encodeURIComponent(searchTerm)}&page=0&size=12`
      );
      const result = await response.json();
      
      // 검색 결과에 대한 페이징 정보 업데이트
      setPaginationInfo({
        totalPages: result.data?.totalPages || 0,
        totalElements: result.data?.totalElements || 0,
        currentPage: result.data?.number || 0,
        pageSize: result.data?.size || 12
      });
      
      const data: any[] = result.data?.content || [];
      const convertedPosts: Post[] = data.map((item) => ({
        id: item.id.toString(),
        title: item.boardTitle || `${item.kindName || '게시글'} - ${item.lostType || ''}`,
        content: item.boardContent || '',
        imageUrl: item.imageUrl || item.thumbnailUrl || (item.images && item.images[0]) || '',
        author: item.nickname || item.nickName || '익명',
        date: item.createdAt,
        category: activeTab === 'adoption' ? 'adoption' : activeTab === 'missing' ? 'missing' : activeTab,
        views: item.boardViewCount || item.viewCount || 0,
        breed: item.kindName,
        gender: item.gender,
        age: item.age?.toString(),
        furColor: item.furColor,
        missingLocation: item.missingLocation,
        missingDate: item.missingDate,
        missingType: item.lostType === '실종' ? 'MS' : item.lostType === '목격' ? 'WT' : undefined,
        instagramLink: item.instagramLink,
        images: item.images
      }));
      
      setBoardData(convertedPosts);
    } catch (error) {
      console.error('검색 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeaderWithModal />
      
      <div className="container mx-auto px-4 py-8">
        <BoardTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          currentPosts={boardData}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onSearch={handleSearch}
          loading={loading}
        />

        <BoardPagination
          currentPage={paginationInfo.currentPage + 1}
          totalPages={paginationInfo.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default Board;
