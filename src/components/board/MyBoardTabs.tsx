import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Post, BoardCategory } from '@/types/board';
import BoardCard from '@/components/BoardCard';
import MissingAnimalCard from '@/components/MissingAnimalCard';
import BoardSearch from '@/components/board/BoardSearch';

interface MyBoardTabsProps {
  activeTab: BoardCategory;
  onTabChange: (value: BoardCategory) => void;
  currentPosts: Post[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const MyBoardTabs = ({ activeTab, onTabChange, currentPosts, searchTerm, onSearchChange }: MyBoardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <div className="flex flex-col gap-6 mb-8">
        {/* 검색창 - 중앙에 크게 */}
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <BoardSearch 
              searchTerm={searchTerm}
              onSearchChange={onSearchChange}
            />
          </div>
        </div>
        
        {/* 카테고리 탭만 표시 (글작성 버튼 제거) */}
        <div className="flex justify-center">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="adoption" className="text-sm">입양 후기</TabsTrigger>
            <TabsTrigger value="sns" className="text-sm">SNS 홍보</TabsTrigger>
            <TabsTrigger value="missing" className="text-sm">실종/목격 제보</TabsTrigger>
          </TabsList>
        </div>
      </div>

      <TabsContent value="adoption" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentPosts.map((post) => (
            <BoardCard key={post.id} post={post} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="sns" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentPosts.map((post) => (
            <BoardCard key={post.id} post={post} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="missing" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentPosts.map((post) => (
            <MissingAnimalCard key={post.id} post={post} />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default MyBoardTabs;