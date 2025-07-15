export interface boardList {
  //게시글 id
  id: number;

  //카테고리 id
  categoryId : number;

  //작성자
  nickname : string;

  //유저 id
  userId? : string;

  //조회수
  boardViewCount : number;

  //썸네일 이미지 링크
  imageUrl? : string;

  //은서님 전용 이미지 링크
  images?: string[];

  //제목
  boardTitle?: string;

  //본문
  boardContent: string;

  //작성일
  createdAt: string;

  // SNS 홍보 게시판 전용 필드
  instagramLink?: string;

  // 실종/목격 게시판 전용 필드
  kindName?: string;
  gender?: string;
  age?: string;
  furColor?: string;
  missingLocation?: string;
  missingDate?: string;
  // 실종/목격 구분 필드 (MS: 실종, WT: 목격)
  lostType?: 'MS' | 'WT';
}

export type BoardCategory = 'adoption' | 'review' | 'sns' | 'lost';

// API 응답 타입
export interface ApiResponse {
  code: number;
  data: {
    content: ApiAnimal[];
    pageable: {
      pageNumber: number;
      pageSize: number;
      sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
      };
      offset: number;
      unpaged: boolean;
      paged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
  };
  message: string;
}

export interface ApiAnimal {
  boardId: number;
  categoryId: number;
  userId: number;
  nickName: string;
  lostType?: string;
  viewCount: number;
  kindName: string;
  age: number;
  furColor: string;
  gender: string;
  missingLocation: string;
  missingDate: string;
  thumbnailUrl?: string;
  createdAt: string;
  deleteAt?: string;
}