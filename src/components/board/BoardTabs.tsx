import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Post, BoardCategory } from '@/types/board';
import BoardCard from '@/components/BoardCard';
import MissingAnimalCard from '@/components/MissingAnimalCard';
import BoardSearch from '@/components/board/BoardSearch';
import { Plus } from 'lucide-react';

interface BoardTabsProps {
  activeTab: BoardCategory;
  onTabChange: (value: BoardCategory) => void;
  currentPosts: Post[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  loading?: boolean;
}

const BoardTabs = ({ activeTab, onTabChange, currentPosts, searchTerm, onSearchChange, onSearch, loading }: BoardTabsProps) => {
  const navigate = useNavigate();

const handleCreatePost = () => {
  console.log('글작성 버튼 클릭, 현재 탭:', activeTab);
  if (activeTab === 'adoption') {
    console.log('입양 후기 게시글 작성 페이지로 이동');
    navigate('/create-adoption-review-post');
  } else if (activeTab === 'sns') {
    console.log('SNS 홍보 게시글 작성 페이지로 이동');
    navigate('/create-sns-post');
  } else if (activeTab === 'missing') {
    console.log('실종/목격 게시글 작성 페이지로 이동');
    navigate('/create-missing-post');
  } else {
    console.log('기본 게시글 작성 페이지로 이동');
    navigate('/create-post', { state: { category: activeTab } });
  }
};


  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="flex flex-col gap-6 mb-8">
        {/* 검색창 - 중앙에 크게 */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <BoardSearch 
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
              onSearch={onSearch}
              currentCategory={activeTab}
            />
          </div>
        </div>
        
        {/* 카테고리 탭과 글작성 버튼 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="adoption" className="text-sm">입양 후기</TabsTrigger>
            <TabsTrigger value="sns" className="text-sm">SNS 홍보</TabsTrigger>
            <TabsTrigger value="missing" className="text-sm">실종/목격 제보</TabsTrigger>
          </TabsList>
          
          <Button onClick={handleCreatePost} className="gap-2 flex-shrink-0">
            <Plus className="w-4 h-4" />
            글작성하기
          </Button>
        </div>
      </div>

      <TabsContent value="adoption" className="mt-0">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-muted-foreground">로딩 중...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentPosts.map((post) => (
              <BoardCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="sns" className="mt-0">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-muted-foreground">로딩 중...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentPosts.map((post) => (
              <BoardCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="missing" className="mt-0">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-muted-foreground">로딩 중...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentPosts.map((post) => (
              <div key={post.id} onClick={() => navigate(`/missing-post/${post.id}`)} className="cursor-pointer">
                <MissingAnimalCard post={post} />
              </div>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default BoardTabs;