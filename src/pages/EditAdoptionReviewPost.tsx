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
      }
    } catch (error) {
      console.error('수정 폼 데이터 로딩 실패:', error);
      toast({
        title: "오류",
        description: "수정 폼 데이터를 불러오는데 실패했습니다.",
        variant: "destructive",
      });
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
    
    if (!title.trim() || !content.trim()) {
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
    return <div className="flex justify-center items-center min-h-screen">데이터를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">입양 후기 수정</h1>
      
      {formData.petApplicationDTO && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>입양 신청 정보</CardTitle>
          </CardHeader>
          <CardContent>
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
          <label className="block text-sm font-medium mb-2">이미지</label>
          
          {/* 기존 이미지 */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">기존 이미지</h3>
              <div className="flex flex-wrap gap-2">
                {existingImages.map((image) => (
                  <div key={image.imageId} className="relative">
                    <img
                      src={image.imageUrl}
                      alt="기존 이미지"
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(image.imageId)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 새 이미지 업로드 */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <div className="text-center">
              <Camera className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="image-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    새 이미지 업로드
                  </span>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* 새 이미지 미리보기 */}
            {newImages.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {newImages.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`새 이미지 ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <Button type="submit" className="flex-1">
            수정하기
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(`/adoption-review/${id}`)}
            className="flex-1"
          >
            취소
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditAdoptionReviewPost;