
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Camera, X, Upload, Loader2 } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/context/AuthContext';

interface PetApplicationDTO {
  formId: number;
  noticeNo: string;
  kindFullNm: string;
  sexCd: string;
  subRegionName: string;
  regionName: string;
  profile1: string;
  formCreateAt: string;
}

interface ImageData {
  imageId: number;
  imageUrl: string;
  thumbnail: boolean;
}

interface EditFormData {
  boardId: number;
  userId: number;
  boardTitle: string;
  boardContent: string;
  petApplicationDTO: PetApplicationDTO | null;
  images: ImageData[];
}

const EditAdoptionReviewPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoggedIn } = useAuth();
  
  const [formData, setFormData] = useState<EditFormData | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "로그인 필요",
        description: "게시글 수정을 위해 로그인이 필요합니다.",
        variant: "destructive",
      });
      navigate('/board?category=adoption-review');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (id) {
      fetchEditForm();
    }
  }, [id]);

  const fetchEditForm = async () => {
    try {
      console.log('수정 폼 데이터 요청:', `/api/v1/boards/review/${id}/form`);
      setLoading(true);
      
      const response = await fetch(`http://localhost:8080/api/v1/boards/review/${id}/form`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      const result = await response.json();
      console.log('수정 폼 데이터 응답:', result);
      
      if (result.code === 200) {
        setFormData(result.data);
        setTitle(result.data.boardTitle);
        setContent(result.data.boardContent);
        setExistingImages(result.data.images);
      } else {
        throw new Error(result.message || '데이터를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('수정 폼 데이터 로딩 실패:', error);
      // null-safe 처리: petApplicationDTO가 null인 경우도 정상 처리
      if (error instanceof Error && !error.message.includes('NullPointerException')) {
        toast({
          title: "오류",
          description: "수정 폼 데이터를 불러오는데 실패했습니다.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = existingImages.length + newImages.length + files.length;
    
    if (totalImages > 5) {
      toast({
        title: "이미지 업로드 제한",
        description: "최대 5개의 이미지만 업로드할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }
    setNewImages(prev => [...prev, ...files]);
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId: number) => {
    setExistingImages(prev => prev.filter(img => img.imageId !== imageId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn || !user) {
      toast({
        title: "로그인 필요",
        description: "게시글 수정을 위해 로그인이 필요합니다.",
        variant: "destructive",
      });
      return;
    }
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "입력 오류",
        description: "모든 항목을 기재해주세요.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      const boardDTO = {
        boardTitle: title,
        boardContent: content,
        existingImageIds: existingImages.map(img => img.imageId)
      };
      
      const boardBlob = new Blob([JSON.stringify(boardDTO)], {
        type: 'application/json'
      });
      formDataToSend.append('boardDTO', boardBlob);
      
      if (newImages.length > 0) {
        newImages.forEach(file => {
          formDataToSend.append('images', file);
        });
      } else {
        formDataToSend.append('images', new Blob(), '');
      }

      console.log('수정 요청 데이터:', {
        boardDTO,
        newImagesCount: newImages.length,
        existingImagesCount: existingImages.length
      });

      const response = await fetch(`http://localhost:8080/api/v1/boards/review/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: formDataToSend
      });

      const result = await response.json();
      console.log('수정 응답:', result);

      if (result.code === 200) {
        toast({
          title: "성공",
          description: "게시글이 수정되었습니다.",
        });
        navigate(`/adoption-review/${id}`);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('게시글 수정 실패:', error);
      toast({
        title: "오류",
        description: "게시글 수정에 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return dateString.split('T')[0].replace(/-/g, '.');
  };

  const getSexDisplay = (sexCd: string) => {
    switch (sexCd) {
      case 'F': return '암컷';
      case 'M': return '수컷';
      case 'Q': return '모름';
      default: return sexCd;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader onLoginClick={handleLoginClick} />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">게시글 정보를 불러오는 중...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader onLoginClick={handleLoginClick} />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex justify-center items-center min-h-screen">데이터를 불러올 수 없습니다.</div>
        </div>
      </div>
    );
  }

  const totalImages = existingImages.length + newImages.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onLoginClick={handleLoginClick} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">입양 후기 수정</h1>
          <p className="text-gray-600">입양 경험을 공유하고 다른 분들에게 도움이 되는 후기를 작성해주세요.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>입양 후기 수정</CardTitle>
          </CardHeader>
          <CardContent>
            {formData.petApplicationDTO && (
              <div className="mb-6">
                <Label className="text-base font-medium mb-4 block">입양 신청 정보</Label>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img 
                        src={formData.petApplicationDTO.profile1} 
                        alt="반려동물"
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-lg mb-1">
                          {formData.petApplicationDTO.noticeNo}
                        </div>
                        <div className="text-muted-foreground mb-1">
                          {formData.petApplicationDTO.kindFullNm}
                        </div>
                        <div className="text-muted-foreground mb-1">
                          {getSexDisplay(formData.petApplicationDTO.sexCd)}
                        </div>
                        <div className="text-muted-foreground mb-1">
                          {formData.petApplicationDTO.regionName} {formData.petApplicationDTO.subRegionName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          신청일: {formatDate(formData.petApplicationDTO.formCreateAt)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">제목</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-base font-medium">내용</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="입양 후기를 자세히 작성해주세요"
                  className="min-h-[200px] text-base resize-none"
                />
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">이미지 (최대 5개)</Label>
                
                {/* 기존 이미지와 새 이미지를 함께 표시 */}
                {(existingImages.length > 0 || newImages.length > 0) && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                    {/* 기존 이미지들 */}
                    {existingImages.map((image) => (
                      <div key={`existing-${image.imageId}`} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                          <img
                            src={image.imageUrl}
                            alt="기존 이미지"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExistingImage(image.imageId)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        {image.thumbnail && (
                          <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                            썸네일
                          </div>
                        )}
                      </div>
                    ))}

                    {/* 새로운 이미지들 */}
                    {newImages.map((image, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`새 이미지 ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                          새 이미지
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 이미지 업로드 */}
                {totalImages < 5 && (
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">이미지 선택하기</span>
                    <span className="text-xs text-gray-500 mt-1">
                      {totalImages}/5개 선택됨
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
                  disabled={totalImages >= 5}
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/adoption-review/${id}`)}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting || !isLoggedIn}>
                  {isSubmitting ? '수정 중...' : '입양 후기 수정'}
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

export default EditAdoptionReviewPost;
