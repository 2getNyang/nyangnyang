
// 댓글 더미 데이터
export const comments = [
  {
    id: '1',
    postId: '1',
    author: '박영수',
    content: '정말 따뜻한 이야기네요! 새 가족과 행복하길 바랍니다 😊',
    date: '2024-01-15',
    parentId: null,
    replies: [
      {
        id: '2',
        postId: '1',
        author: '김철수',
        content: '감사합니다! 정말 행복해요',
        date: '2024-01-15',
        parentId: '1'
      },
      {
        id: '3',
        postId: '1',
        author: '이민지',
        content: '저도 입양을 고려해보고 있어요. 어떤 준비가 필요한지 궁금해요',
        date: '2024-01-15',
        parentId: '1'
      }
    ]
  },
  {
    id: '4',
    postId: '1',
    author: '최유진',
    content: '사진 너무 예뻐요! 얼마나 적응기간이 걸렸나요?',
    date: '2024-01-15',
    parentId: null,
    replies: [
      {
        id: '5',
        postId: '1',
        author: '김철수',
        content: '약 2주 정도 걸렸어요. 처음엔 낯가림이 있었지만 지금은 완전히 적응했어요!',
        date: '2024-01-15',
        parentId: '4'
      }
    ]
  },
  {
    id: '6',
    postId: '1',
    author: '정한솔',
    content: '입양 전에 어떤 것들을 고려하셨나요? 조언 부탁드려요',
    date: '2024-01-16',
    parentId: null,
    replies: []
  }
];

// 입양 공고 더미 데이터
export const adoptionAnimals = [
  {
    id: 'adopt-1',
    name: '멍멍이',
    species: '강아지',
    breed: '믹스견',
    age: '2세',
    gender: '수컷',
    location: '서울 동물보호센터',
    rescueDate: '2023-12-01',
    description: '활발하고 사람을 좋아하는 아이입니다. 산책을 매우 좋아하며 다른 강아지들과도 잘 어울려요.',
    personality: ['활발함', '친화적', '똑똑함'],
    isUrgent: false,
    imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

export const allPosts = [
  {
    id: '1',
    title: '새로운 가족을 찾은 멍멍이',
    content: '드디어 새로운 가족을 만나게 되었어요! 행복한 모습을 보니 정말 기쁩니다. 처음에는 낯가림이 있었지만 지금은 완전히 우리 가족이 되었어요. 매일 아침 저를 깨우러 오는 모습이 너무 사랑스럽습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    author: '김철수',
    date: '2024-01-15',
    category: 'adoption',
    views: 120,
    likes: 24,
    adoptionPostId: 'adopt-1'
  },
  {
    id: '2',
    title: '고양이 입양 후기',
    content: '3개월 전에 입양한 고양이가 이제는 완전히 적응했어요. 매일이 행복합니다.',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: '이영희',
    date: '2024-01-14',
    category: 'adoption',
    views: 95,
    likes: 18
  },
  {
    id: '3',
    title: '실종된 강아지를 찾습니다',
    content: '12월 28일 오후 2시경 서울 강남구 역삼동에서 실종되었습니다.',
    imageUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: '박민수',
    date: '2024-01-13',
    category: 'missing',
    views: 234,
    likes: 67,
    breed: '골든 리트리버',
    gender: '수컷',
    missingType: 'MS',
    age: '3세',
    furColor: '금색',
    missingLocation: '서울 강남구 역삼동',
    missingDate: '2024-12-28'
  },
  {
    id: '4',
    title: '귀여운 우리 강아지 자랑',
    content: '우리 강아지가 너무 귀여워서 자랑하고 싶어요! 많은 사랑 부탁드려요 🐕',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: '최지은',
    date: '2024-01-12',
    category: 'sns',
    views: 78,
    likes: 32,
    instagramLink: 'https://www.instagram.com/p/DLXIzQ2z_mt/'
  },
  {
    id: '5',
    title: '보호소에서 만난 천사',
    content: '보호소에서 봉사활동을 하다가 만난 아이입니다. 정말 사랑스러워요.',
    imageUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: '정수민',
    date: '2024-01-11',
    category: 'adoption',
    views: 156,
    likes: 45
  },
  {
    id: '6',
    title: '고양이 목격 정보',
    content: '어제 저녁 홍대 근처에서 목격했습니다. 주인을 찾고 있는 것 같았어요.',
    imageUrl: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: '한상우',
    date: '2024-01-10',
    category: 'missing',
    views: 189,
    likes: 23,
    breed: '러시안 블루',
    gender: '암컷',
    age: '2세',
    furColor: '회색',
    missingType: 'WT',
    missingLocation: '서울 마포구 홍대',
    missingDate: '2024-01-09'
  },
  {
    id: '7',
    title: '우리 고양이의 일상',
    content: '매일매일 새로운 모습을 보여주는 우리 고양이! 인스타그램에서 더 많은 사진을 확인하세요 😸',
    imageUrl: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: '김미영',
    date: '2024-01-09',
    category: 'sns',
    instagramLink: 'https://www.instagram.com/p/C-XdmZevIZL/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==/',
    views: 67,
    likes: 12
  },
  {
    id: '8',
    title: '우리 댕댕이의 특별한 하루',
    content: '오늘 우리 강아지가 특별한 하루를 보냈어요! 인스타그램에 올린 사진들을 보시면 얼마나 행복한지 아실 거예요 🐶✨',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: '이안다',
    date: '2024-01-08',
    category: 'sns',
    views: 145,
    likes: 38,
    instagramLink: 'https://www.instagram.com/p/DLXIzQ2z_mt/'
  }
];
