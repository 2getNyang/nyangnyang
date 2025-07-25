import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Camera, X } from 'lucide-react';

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
  
  const [formData, setFormData] = useState<EditFormData | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEditForm();
    }
  }, [id]);

  const fetchEditForm = async () => {
    try {
      console.log('수정 폼 데이터 요청:', `/api/v1/boards/review/${id}/form`);
      
      const response = await fetch(`/api/v1/boards/review/${id}/form`, {
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
        // 입양 신청 정보가 없는 경우도 정상적으로 처리
        if (result.message && result.message.includes("PetApplicationForm")) {
          console.log('입양 신청 정보가 없는 게시글입니다.');
          // petApplicationDTO가 null인 경우에도 수정 폼 로드
          setFormData({
            ...result.data,
            petApplicationDTO: null
          });
          setTitle(result.data.boardTitle || '');
          setContent(result.data.boardContent || '');
          setExistingImages(result.data.images || []);
        } else {
          throw new Error(result.message);
        }
      }
    } catch (error) {
      console.error('수정 폼 데이터 로딩 실패:', error);
      // null 관련 에러가 아닌 경우에만 toast 표시
      if (!error.message.includes("PetApplicationForm")) {
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
    
    if (!title.trim() || !content.trim() || (existingImages.length === 0 && newImages.length === 0)) {
      toast({
        title: "입력 오류",
        description: "모든 항목을 기재해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      const boardDTO = {
        boardTitle: title,
        boardContent: content,
        remainImageIds: existingImages.map(img => img.imageId)
      };
      
      const boardBlob = new Blob([JSON.stringify(boardDTO)], {
        type: 'application/json'
      });
      formDataToSend.append('boardDTO', boardBlob);
      
      if (newImages.length > 0) {
        newImages.forEach(file => {
          formDataToSend.append('newImages', file);
        });
      }

      console.log('수정 요청 데이터:', {
        boardDTO,
        newImagesCount: newImages.length,
        existingImagesCount: existingImages.length
      });

      const response = await fetch(`/api/v1/boards/review/${id}`, {
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
    return <div className="flex justify-center items-center min-h-screen">로딩 중...</div>;
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">데이터를 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">입양 후기 수정</h1>
          <p className="text-gray-600">입양한 반려동물의 소중한 후기를 수정해주세요.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>입양 후기 수정</CardTitle>
          </CardHeader>
          <CardContent>
            {formData.petApplicationDTO && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">입양 신청 정보</h3>
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
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">제목</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="제목을 입력하세요"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">내용</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="내용을 입력하세요"
                  rows={10}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">이미지 (최대 5개)</label>
                
                {/* 모든 이미지를 같은 줄에 표시 */}
                <div className="mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {/* 기존 이미지들 */}
                    {existingImages.map((image) => (
                      <div key={image.imageId} className="relative group">
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
                        <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                          기존
                        </div>
                      </div>
                    ))}
                    
                    {/* 새 이미지들 */}
                    {newImages.map((file, index) => (
                      <div key={`new-${index}`} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                          <img
                            src={URL.createObjectURL(file)}
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
                          새로추가
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 이미지 업로드 버튼 */}
                {existingImages.length + newImages.length < 5 && (
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">추가 이미지 선택하기</span>
                    <span className="text-xs text-gray-500 mt-1">
                      {existingImages.length + newImages.length}/5개 선택됨
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
                  disabled={existingImages.length + newImages.length >= 5}
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
                <Button type="submit" className="flex-1">
                  수정하기
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditAdoptionReviewPost;