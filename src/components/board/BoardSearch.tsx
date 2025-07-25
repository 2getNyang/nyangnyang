
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface BoardSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  currentCategory: string;
}

const BoardSearch = ({ searchTerm, onSearchChange, onSearch, currentCategory }: BoardSearchProps) => {

  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="게시글을 검색해보세요..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyUp={(e) => onSearch()}
          className="pl-10 pr-4 py-3 w-full rounded-xl border-gray-200 text-base"
        />
      </div>
    </div>
  );
};

export default BoardSearch;
