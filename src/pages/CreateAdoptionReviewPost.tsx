import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import LoginModal from '@/components/LoginModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Upload, X, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

interface PetApplication {
  formId: number;
  noticeNo: string;
  kindFullNm: string;
  sexCd: string;
  subRegionName: string;
  regionName: string;
  profile1: string;
  formCreateAt: string;
}

interface ReviewFormData {
  id: null;
  userId: number;
  petApplicationDTO: PetApplication[];
}

const CreateAdoptionReviewPost = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFormId, setSelectedFormId] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [petApplications, setPetApplications] = useState<PetApplication[]>([]);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  // 로그인 확인 및 폼 데이터 로드
  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "로그인 필요",
        description: "게시글 작성을 위해 로그인이 필요합니다.",
        variant: "destructive",
      });
      navigate('/board');
      return;
    }

    const fetchFormData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const response = await fetch('http://localhost:8080/api/v1/boards/review/form', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          credentials: 'include',
        });

        if (response.ok) {
          const result = await response.json();
          setPetApplications(result.data.petApplicationDTO || []);
        } else {
          toast({
            title: "데이터 로드 실패",
            description: "입양 신청 내역을 불러올 수 없습니다.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('폼 데이터 로드 오류:', error);
        toast({
          title: "데이터 로드 실패",
          description: "네트워크 오류가 발생했습니다.",
          variant: "destructive",
        });
      } finally {
        setFormLoading(false);
      }
    };

    fetchFormData();
  }, [isLoggedIn, navigate]);

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

  const formatGender = (sexCd: string) => {
    switch (sexCd) {
      case 'F': return '암컷';
      case 'M': return '수컷';
      case 'Q': return '모름';
      default: return sexCd;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn || !user) {
      toast({
        title: "로그인 필요",
        description: "게시글 작성을 위해 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || !content.trim() || images.length === 0) {
      toast({
        title: "입력 오류",
        description: "모든 항목을 기재해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      
      // boardDTO 데이터 생성
      const boardDTO = {
        boardTitle: title.trim(),
        boardContent: content.trim(),
        categoryId: 2,
        userId: user.id,
        formId: selectedFormId ? parseInt(selectedFormId) : null
      };
      
      console.log('전송할 boardDTO 데이터:', boardDTO);
      
      // boardDTO를 JSON Blob으로 생성하여 추가
      const boardDTOBlob = new Blob([JSON.stringify(boardDTO)], {
        type: 'application/json'
      });
      formData.append('boardDTO', boardDTOBlob);

      // 이미지 파일들 추가 (이미지가 없어도 빈 배열로 전송)
      if (images.length > 0) {
        images.forEach((image) => {
          formData.append('images', image);
        });
      } else {
        // 이미지가 없을 때 빈 파일 추가
        const emptyFile = new File([], '', { type: 'image/jpeg' });
        formData.append('images', emptyFile);
      }
      
      console.log('FormData 내용 확인:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8080/api/v1/boards/review', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        credentials: 'include',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "입양 후기 게시글 작성 완료",
          description: "게시글이 성공적으로 작성되었습니다.",
        });
        navigate('/board');
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: "게시글 작성 실패",
          description: errorData.message || "게시글 작성 중 오류가 발생했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('게시글 작성 오류:', error);
      toast({
        title: "게시글 작성 실패",
        description: "네트워크 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (formLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader onLoginClick={handleLoginClick} />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onLoginClick={handleLoginClick} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">입양 후기 게시글 작성</h1>
          <p className="text-gray-600">새로운 가족과의 소중한 순간을 공유해 주세요.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              입양 후기 글 작성
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 제목 */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">제목</Label>
                <Input
                  id="title"
                  placeholder="입양 후기 제목을 입력해주세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-base"
                />
              </div>

              {/* 본문 */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-base font-medium">본문</Label>
                <Textarea
                  id="content"
                  placeholder="입양 후기를 자세히 작성해주세요"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] text-base resize-none"
                />
              </div>

              {/* 입양 신청 내역 선택 */}
              <div className="space-y-4">
                <Label className="text-base font-medium">입양 신청 내역</Label>
                {petApplications.length === 0 ? (
                  <p className="text-gray-500">입양 신청 내역이 없습니다.</p>
                ) : (
                  <RadioGroup value={selectedFormId} onValueChange={setSelectedFormId}>
                    <div className="space-y-4">
                      {/* 선택안함 옵션 */}
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value="" id="no-selection" />
                        <Label htmlFor="no-selection" className="cursor-pointer text-gray-600">
                          선택안함
                        </Label>
                      </div>
                      
                      {/* 입양 신청 내역 카드들 - 2열 그리드 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {petApplications.map((app) => (
                          <div key={app.formId} className="flex items-start space-x-3">
                            <RadioGroupItem 
                              value={app.formId.toString()} 
                              id={`app-${app.formId}`} 
                              className="mt-2"
                            />
                            <Label 
                              htmlFor={`app-${app.formId}`} 
                              className="flex-1 cursor-pointer"
                            >
                              <Card className="p-3 hover:bg-gray-50 transition-colors">
                                <div className="flex gap-3">
                                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    <img
                                      src={app.profile1}
                                      alt="동물 사진"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 space-y-1 min-w-0">
                                    <h3 className="font-semibold text-gray-800 text-sm truncate">{app.noticeNo}</h3>
                                    <p className="text-xs text-gray-600 truncate">{app.kindFullNm}</p>
                                    <p className="text-xs text-gray-600">{formatGender(app.sexCd)}</p>
                                    <p className="text-xs text-gray-600 truncate">{app.regionName} {app.subRegionName}</p>
                                    <p className="text-xs text-gray-500">신청일: {formatDate(app.formCreateAt)}</p>
                                  </div>
                                </div>
                              </Card>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </RadioGroup>
                )}
              </div>

              {/* 이미지 업로드 */}
              <div className="space-y-4">
                <Label className="text-base font-medium">이미지 (최대 5개)</Label>
                <div className="space-y-4">
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
                <Button type="submit" className="flex-1" disabled={isLoading || !isLoggedIn}>
                  {isLoading ? '작성 중...' : '입양 후기 게시글 작성'}
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

export default CreateAdoptionReviewPost;