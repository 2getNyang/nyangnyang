export interface BoardListItem {
  // 공통 필드
  id?: number;
  boardId?: number; // lost 카테고리에서 사용
  categoryId?: number;
  nickname?: string;
  nickName?: string; // lost 카테고리에서 사용
  userId?: number;
  boardTitle?: string;
  boardContent?: string;
  viewCount?: number;
  createdAt: string;
  
  // 이미지 필드
  imageUrl?: string; // review, lost 카테고리
  thumbnailUrl?: string; // lost 카테고리 대체 필드
  images?: string[]; // sns 카테고리
  
  // SNS 홍보 게시판 전용 필드
  instagramLink?: string;
  likeCount?: number;
  comments?: any;
  modifiedAt?: string;
  deletedAt?: string;
  
  // 실종/목격 게시판 전용 필드
  kindName?: string;
  gender?: string;
  age?: number;
  furColor?: string;
  missingLocation?: string;
  missingDate?: string;
  lostType?: string; // "실종" | "목격"
  deleteAt?: string;
}

export type BoardCategory = 'adoption' | 'review' | 'sns' | 'lost';

export interface BoardApiResponse {
  code: number;
  data: BoardListItem[];
  message: string;
}