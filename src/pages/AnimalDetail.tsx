import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AnimalDetailCard from '@/components/AnimalDetailCard';
import AppHeaderWithModal from '@/components/AppHeaderWithModal';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

interface AnimalDetailResponse {
  code: number;
  data: {
    desertionNo: string;
    happenDt: string;
    happenPlace: string;
    colorCd: string;
    age: string;
    weight: string;
    noticeNo: string;
    noticeSdt: string;
    noticeEdt: string;
    popfile1?: string;
    popfile2?: string;
    popfile3?: string;
    processState: string;
    sexCd: string;
    neuterYn: string;
    specialMark: string;
    kindFullNm: string;
    comments: any[];
    bookmarked: boolean;
    shelterName: string;
    shelterAddress: string;
    shelterTel: string;
    careRegNumber: string;
  };
  message: string;
}

const AnimalDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [animal, setAnimal] = useState<AnimalDetailResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimalDetail = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:8080/api/v1/animals/${id}`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          }
        });
        
        if (response.ok) {
          const result: AnimalDetailResponse = await response.json();
          setAnimal(result.data);
        } else {
          toast({
            title: "데이터 로드 실패",
            description: "동물 정보를 불러오는데 실패했습니다.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching animal detail:', error);
        toast({
          title: "네트워크 오류",
          description: "서버와 연결할 수 없습니다.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnimalDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeaderWithModal />
        <main className="pt-20 flex items-center justify-center">
          <p className="text-lg">데이터를 불러오는 중...</p>
        </main>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeaderWithModal />
        <main className="pt-20 flex items-center justify-center">
          <p className="text-lg">동물 정보를 찾을 수 없습니다.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeaderWithModal />
      <main className="pt-20">
        <AnimalDetailCard animal={animal} />
      </main>
    </div>
  );
};

export default AnimalDetail;