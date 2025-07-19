import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User } from 'lucide-react';
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
  const [applications, setApplications] = useState<AdoptionApplication[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchApplications();
  }, [currentPage]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      // API 호출 (실제 구현 시)
      // const response = await fetch(`/api/v1/user/adoption-applications?page=${currentPage}&size=${itemsPerPage}`);
      // const data = await response.json();
      
      // Mock 데이터
      const mockData = {
        content: Array.from({ length: itemsPerPage }, (_, index) => ({
          formId: index + 1 + (currentPage - 1) * itemsPerPage,
          processState: ['심사 중', '승인됨', '거절됨', '대기 중'][Math.floor(Math.random() * 4)],
          sexCd: Math.random() > 0.5 ? 'M' : 'F',
          kindFullNm: ['코리안 숏헤어', '포메라니안', '리트리버', '페르시안'][Math.floor(Math.random() * 4)],
          noticeNo: `20250719-${String(index + 1).padStart(3, '0')}`,
          happenPlace: ['서울시 강남구', '경기도 수원시', '부산시 해운대구', '대구시 중구'][Math.floor(Math.random() * 4)],
          popfile1: `https://images.unsplash.com/photo-${1582562124811 + index}?w=400&h=300&fit=crop`,
          formCreatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })),
        totalPages: 5
      };
      
      setApplications(mockData.content);
      setTotalPages(mockData.totalPages);
    } catch (error) {
      console.error('Failed to fetch adoption applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGenderText = (sexCd: string) => {
    switch (sexCd) {
      case 'M': return '수컷';
      case 'F': return '암컷';
      case 'Q': return '미상';
      default: return sexCd;
    }
  };

  const getProcessStateStyle = (processState: string) => {
    if (processState === '심사 중' || processState === '대기 중') {
      return {
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200 rounded-full',
        text: processState
      };
    } else if (processState === '승인됨') {
      return {
        className: 'bg-green-100 text-green-800 border-green-200 rounded-full',
        text: processState
      };
    } else if (processState === '거절됨') {
      return {
        className: 'bg-red-100 text-red-800 border-red-200 rounded-full',
        text: processState
      };
    }
    
    return {
      className: 'bg-blue-100 text-blue-800 border-blue-200 rounded-full',
      text: processState
    };
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(1)}
          className="h-8 w-8 p-0"
        >
          1
        </Button>
      );
      if (startPage > 2) {
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
          {i}
        </Button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="end-ellipsis" className="px-2">...</span>);
      }
      pages.push(
        <Button
          key={totalPages}
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {applications.map((application) => {
                  const processStyle = getProcessStateStyle(application.processState);
                  
                  return (
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
                            <span className="text-sm">신청일: {application.formCreatedAt}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{application.happenPlace}</span>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <Badge 
                            className={`text-xs ${processStyle.className}`}
                            variant="outline"
                          >
                            {processStyle.text}
                          </Badge>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="p-5 pt-0">
                        <Link to={`/adoption-form/${application.noticeNo}/${application.formId}`} className="w-full">
                          <button className="w-full golden hover:bg-yellow-500 text-gray-800 font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-md">
                            신청서 보기
                          </button>
                        </Link>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>

              {/* 페이지네이션 */}
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-3"
                >
                  이전
                </Button>
                
                {renderPagination()}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 px-3"
                >
                  다음
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyAdoptionApplications;