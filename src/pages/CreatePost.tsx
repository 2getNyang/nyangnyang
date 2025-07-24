import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import LoginModal from '@/components/LoginModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Image, MapPin, Calendar, User, CheckCircle2 } from 'lucide-react';
import { BoardCategory } from '@/types/board';
import { toast } from '@/hooks/use-toast';

// 입양 신청 내역 타입 정의
interface AdoptionApplication {
  id: string;
  animalName: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  location: string;
  applicationDate: string;
  imageUrl?: string;
}

const CreatePost = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [category, setCategory] = useState<BoardCategory>('adoption');
  const [selectedAdoptionId, setSelectedAdoptionId] = useState<string>('');

  useEffect(() => {
    const stateCategory = location.state?.category;
    if (stateCategory && ['adoption', 'sns', 'missing'].includes(stateCategory)) {
      setCategory(stateCategory);
    }
  }, [location.state]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);

  // 모의 입양 신청 내역 데이터
  const [adoptionApplications] = useState<AdoptionApplication[]>([
    {
      id: '1',
      animalName: '코코',
      species: '강아지',
      breed: '말티즈',
      age: '2세',
      gender: '암컷',
      location: '서울 강남구',
      applicationDate: '2024-01-15',
      imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop'
    },
    {
      id: '2',
      animalName: '루루',
      species: '고양이',
      breed: '러시안블루',
      age: '3세',
      gender: '수컷',
      location: '서울 서초구',
      applicationDate: '2024-02-20',
      imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop'
    },
    {
      id: '3',
      animalName: '뽀삐',
      species: '강아지',
      breed: '포메라니안',
      age: '1세',
      gender: '암컷',
      location: '경기 성남시',
      applicationDate: '2024-03-10',
      imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=300&fit=crop'
    }
  ]);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (images.length + files.length > 5) {
      toast({
        title: "이미지 업로드 제한",
        description: "최대 5개의 이미지만 업로드할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({
        title: "입력 오류",
        description: "제목과 본문을 모두 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    // 게시글 저장 로직 - 이미지 배열 처리
    const imageUrls = images.map(image => URL.createObjectURL(image));
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      imageUrl: imageUrls[0] || '', // 첫 번째 이미지를 대표 이미지로
      images: imageUrls, // 모든 이미지를 배열로 저장
      author: '사용자', // 실제로는 로그인된 사용자 정보
      date: new Date().toISOString().split('T')[0],
      category,
      views: 0
    };
    
    console.log('새 게시글:', newPost);

    toast({
      title: "게시글 작성 완료",
      description: "게시글이 성공적으로 작성되었습니다.",
    });
    
    // API 연동 시 실제 생성된 게시글의 ID를 받아와야 함
    // 임시로 카테고리별 게시판으로 이동
    if (category === 'adoption') {
      navigate('/board');
    } else if (category === 'sns') {
      navigate('/board?tab=sns');
    } else if (category === 'missing') {
      navigate('/board?tab=lost');
    } else {
      navigate('/board');
    }
  };

  const categoryLabels = {
    adoption: '입양 후기',
    sns: 'SNS 홍보',
    missing: '실종/목격 제보'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onLoginClick={handleLoginClick} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">게시글 작성</h1>
          <p className="text-gray-600">새로운 게시글을 작성해보세요.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>글 작성</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 제목 */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">제목</Label>
                <Input
                  id="title"
                  placeholder="제목을 입력해주세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-base"
                />
              </div>

              {/* 입양 신청 내역 선택 - 입양 후기에서만 표시 */}
              {category === 'adoption' && (
                <div className="space-y-4">
                  <Label className="text-base font-medium">입양 신청 내역</Label>
                  <p className="text-sm text-gray-600">작성하실 후기와 관련된 입양 신청 내역을 선택해주세요.</p>
                  
                  <RadioGroup
                    value={selectedAdoptionId}
                    onValueChange={setSelectedAdoptionId}
                    className="space-y-4"
                  >
                    {/* 선택 안함 옵션 */}
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="" id="none" />
                      <Label htmlFor="none" className="text-sm font-medium">
                        선택 안함
                      </Label>
                    </div>
                    
                    {/* 입양 신청 카드들 - 스크롤 영역 */}
                    <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {adoptionApplications.map((application) => (
                          <div key={application.id} className="relative">
                            {/* 숨겨진 라디오 버튼 */}
                            <RadioGroupItem
                              value={application.id}
                              id={application.id}
                              className="sr-only"
                            />
                            <Label 
                              htmlFor={application.id}
                              className="cursor-pointer block"
                            >
                              <Card 
                                className={`h-28 transition-all duration-200 hover:shadow-md ${
                                  selectedAdoptionId === application.id 
                                    ? 'ring-2 ring-primary border-primary bg-primary/10' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <div className="flex h-full relative">
                                  {/* 사진 영역 - 정사각형으로 고정 */}
                                  <div className="w-28 h-28 flex-shrink-0 overflow-hidden rounded-l-lg">
                                    <img 
                                      src={application.imageUrl || 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop'}
                                      alt={application.animalName}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  
                                  {/* 내용 영역 */}
                                  <CardContent className="flex-1 p-3 pr-10 flex flex-col justify-center">
                                    <div className="mb-2">
                                      <h4 className="font-semibold text-gray-800 text-sm mb-1 leading-tight">{application.animalName}</h4>
                                      <p className="text-xs text-gray-600">{application.species} • {application.breed}</p>
                                    </div>
                                    
                                    <div className="space-y-1">
                                      <div className="flex items-center space-x-1 text-gray-600">
                                        <User className="w-3 h-3 flex-shrink-0" />
                                        <span className="text-xs truncate">{application.age} • {application.gender}</span>
                                      </div>
                                      
                                      <div className="flex items-center space-x-1 text-gray-600">
                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                        <span className="text-xs truncate">{application.location}</span>
                                      </div>
                                      
                                      <div className="flex items-center space-x-1 text-gray-600">
                                        <Calendar className="w-3 h-3 flex-shrink-0" />
                                        <span className="text-xs truncate">신청일: {application.applicationDate}</span>
                                      </div>
                                    </div>
                                  </CardContent>
                                  
                                  {/* 선택 표시 아이콘 */}
                                  {selectedAdoptionId === application.id && (
                                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5">
                                      <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                  )}
                                </div>
                              </Card>
                            </Label>
                          </div>
                        ))}
                      </div>
                      
                      {/* 카드가 없을 때 메시지 */}
                      {adoptionApplications.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <p className="text-sm">신청한 입양 공고가 없습니다.</p>
                        </div>
                      )}
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* 본문 */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-base font-medium">본문</Label>
                <Textarea
                  id="content"
                  placeholder="내용을 입력해주세요"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] text-base resize-none"
                />
              </div>

              {/* 이미지 업로드 - 개선된 디자인 */}
              <div className="space-y-4">
                <Label className="text-base font-medium">이미지 첨부 (최대 5개)</Label>
                
                <div className="space-y-4">
                  {/* 업로드 버튼 */}
                  {images.length < 5 && (
                    <label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm font-medium text-gray-600">이미지 선택하기</span>
                      <span className="text-xs text-gray-500 mt-1">
                        {images.length}/5개 선택됨
                      </span>
                    </label>
                  )}
                  
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={images.length >= 5}
                  />

                  {/* 선택된 이미지들 */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 버튼 */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/board')}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button type="submit" className="flex-1">
                  게시글 작성
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default CreatePost;
