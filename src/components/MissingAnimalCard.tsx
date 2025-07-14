import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Calendar, MapPin } from 'lucide-react';
import { Post } from '@/types/board';

interface MissingAnimalCardProps {
  post: Post;
}

const MissingAnimalCard = ({ post }: MissingAnimalCardProps) => {
  // missingType에 따라 라벨과 색상 결정
  const getMissingTypeLabel = () => {
    return post.missingType === 'MS' ? '실종' : post.missingType === 'WT' ? '목격' : '실종/목격';
  };

  const getMissingTypeColor = () => {
    return post.missingType === 'MS' ? 'bg-red-100 text-red-800' : 
           post.missingType === 'WT' ? 'bg-blue-100 text-blue-800' : 
           'bg-red-100 text-red-800';
  };

  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white rounded-2xl overflow-hidden hover:scale-[1.02] cursor-pointer">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
      
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <Badge className={`${getMissingTypeColor()} hover:${getMissingTypeColor()} text-xs`}>
            {getMissingTypeLabel()}
          </Badge>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Eye className="w-3 h-3" />
            <span>{post.views}</span>
          </div>
        </div>
        
        {/* 품종을 제목 자리에 bold로 표시 */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 leading-tight">
          {post.breed || '품종 미상'}
        </h3>
        
        {/* 성별, 나이, 털색을 다음 줄에 표시 */}
        <div className="text-sm text-gray-600 mb-3 flex flex-wrap gap-1">
          <span>{post.gender}</span>
          <span className="text-gray-400">|</span>
          <span>{post.age}</span>
          <span className="text-gray-400">|</span>
          <span>{post.furColor}</span>
        </div>
        
        {/* 실종 장소 */}
        <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
          <MapPin className="w-3 h-3" />
          <span>{post.missingLocation}</span>
        </div>
        
        {/* 실종일 */}
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Calendar className="w-3 h-3" />
          <span>실종일: {post.missingDate}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissingAnimalCard;