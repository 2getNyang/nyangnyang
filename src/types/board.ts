
export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author: string;
  date: string;
  category: string;
  views: number;
  likes?: number;
  // 여러 이미지를 위한 배열 추가
  images?: string[];
  // SNS 홍보 게시판 전용 필드
  instagramLink?: string;
  // 실종/목격 게시판 전용 필드
  breed?: string;
  gender?: string;
  age?: string;
  furColor?: string;
  missingLocation?: string;
  missingDate?: string;
  // 실종/목격 구분 필드 (MS: 실종, WT: 목격)
  missingType?: 'MS' | 'WT';
  // 입양 후기 관련 필드
  adoptionPostId?: string;
}

export type BoardCategory = 'adoption' | 'sns' | 'missing' | 'all';
