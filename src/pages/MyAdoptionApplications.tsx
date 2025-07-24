import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Calendar, MapPin, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AppHeader from '@/components/AppHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

interface AdoptionApplication {
  formId: number;
  processState: string;
  sexCd: string;
  kindFullNm: string;
  noticeNo: string;
  happenPlace: string;
  popfile1: string;
  formCreatedAt: string;
}

const MyAdoptionApplications = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    fetchApplications();
  }, [currentPage, isLoggedIn, navigate]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/v1/my/adoption?page=${currentPage}&size=${itemsPerPage}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setApplications(result.data.content);
        setTotalPages(result.data.totalPages);
      }
    } catch (error) {
      console.error('입양 신청 내역 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGenderText = (sexCd: string) => {
    switch (sexCd) {
      case 'M': return '수컷';
      case 'F': return '암컷';
      case 'Q': return '모름';
      default: return sexCd;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    if (startPage > 0) {
      pages.push(
        <Button
          key={0}
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(0)}
          className="h-8 w-8 p-0"
        >
          1
        </Button>
      );
      if (startPage > 1) {
        pages.push(<span key="start-ellipsis" className="px-2">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          onClick={() => setCurrentPage(i)}
          className="h-8 w-8 p-0"
        >
          {i + 1}
        </Button>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push(<span key="end-ellipsis" className="px-2">...</span>);
      }
      pages.push(
        <Button
          key={totalPages - 1}
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(totalPages - 1)}
          className="h-8 w-8 p-0"
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader onLoginClick={() => {}} />
        <main className="pt-20 pb-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">데이터를 불러오는 중...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onLoginClick={() => {}} />
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center mb-2">입양 신청 내역</h1>
            <p className="text-muted-foreground text-center">나의 입양 신청 기록을 확인하세요</p>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">아직 입양 신청 내역이 없습니다.</p>
              <Link to="/animals" className="inline-block mt-4">
                <Button>입양 가능한 동물 보러가기</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {applications.map((application) => (
                  <Card 
                    key={application.formId} 
                    className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white rounded-2xl overflow-hidden hover:scale-[1.02]"
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img 
                        src={application.popfile1}
                        alt={application.noticeNo}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=400&h=300&fit=crop';
                        }}
                      />
                    </div>
                    
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 mb-1">
                            {application.noticeNo}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {application.kindFullNm}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center space-x-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span className="text-sm">
                            {getGenderText(application.sexCd)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">신청일: {formatDate(application.formCreatedAt)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{application.happenPlace}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-5 pt-0">
                      <Link to={`/adoption-form/view/${application.formId}`} className="w-full">
                        <button className="w-full golden hover:bg-yellow-500 text-gray-800 font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-md">
                          신청서 보기
                        </button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="h-8 px-3"
                  >
                    이전
                  </Button>
                  
                  {renderPagination()}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className="h-8 px-3"
                  >
                    다음
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyAdoptionApplications;