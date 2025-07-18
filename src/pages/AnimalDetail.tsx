import React from 'react';
import { useParams } from 'react-router-dom';
import AnimalDetailCard from '@/components/AnimalDetailCard';
import AppHeader from '@/components/AppHeader';

// Mock data for testing - replace with actual API call
const mockAnimal = {
  desertionNo: "241205-015",
  kindFullNm: "[개] 리트리버",
  age: "2024(년생)",
  sexCd: "M",
  neuterYn: "Y",
  colorCd: "갈색",
  weight: "15(Kg)",
  happenDt: "20241201",
  happenPlace: "서울시 강남구 테헤란로",
  processState: "NOTICE",
  noticeNo: "서울-2024-12-001",
  noticeSdt: "20241205",
  noticeEdt: "20241219",
  specialMark: "사람을 매우 좋아하며 활발한 성격입니다. 산책을 좋아하고 다른 강아지들과도 잘 어울립니다.",
  careRegNumber: "410000201912001",
  bookmarked: false,
  popfile1: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=500&h=400&fit=crop",
  popfile2: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&h=400&fit=crop",
  popfile3: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&h=400&fit=crop",
  comments: [
    {
      id: 1,
      authorName: "김철수",
      content: "정말 귀여운 강아지네요! 입양을 고려해보고 있습니다.",
      createdAt: "2024.12.05 14:30",
      isAuthor: false,
      replies: [
        {
          id: 2,
          authorName: "보호소관리자",
          content: "안녕하세요! 입양 문의 감사드립니다. 자세한 상담은 전화로 연락 부탁드려요.",
          createdAt: "2024.12.05 15:15",
          isAuthor: false
        }
      ]
    },
    {
      id: 3,
      authorName: "이영희",
      content: "혹시 다른 강아지들과 함께 지낼 수 있나요?",
      createdAt: "2024.12.06 09:20",
      isAuthor: true
    }
  ]
};

const AnimalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // TODO: Replace with actual API call
  // const { data: animal, isLoading } = useQuery({
  //   queryKey: ['animal', id],
  //   queryFn: () => fetchAnimal(id),
  // });

  const handleLoginClick = () => {
    // TODO: Implement login modal
    console.log('Login clicked');
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onLoginClick={handleLoginClick} />
      <main className="pt-20">
        <AnimalDetailCard animal={mockAnimal} />
      </main>
    </div>
  );
};

export default AnimalDetail;