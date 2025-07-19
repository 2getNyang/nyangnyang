import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO } from 'date-fns';
import { z } from 'zod';
import { CalendarIcon, Upload, X } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const missingPostSchema = z.object({
  lostType: z.string().optional(),
  missingDate: z.date().optional(),
  upKindCd: z.string().optional(),
  kindCd: z.string().optional(),
  regionCode: z.string().optional(),
  subRegionCode: z.string().optional(),
  missingLocation: z.string().optional(),
  phone: z.string().optional(),
  gender: z.string().optional(),
  age: z.string().optional(),
  furColor: z.string().optional(),
  distinctFeatures: z.string().optional(),
  content: z.string().optional(),
  images: z.array(z.any()).optional(),
});

type MissingPostForm = z.infer<typeof missingPostSchema>;

interface FormData {
  upKinds: Array<{ upKindCd: string; upKindName: string }>;
  regions: Array<{ regionCode: string; regionName: string }>;
  genders: string[];
  lostTypes: string[];
  ages: number[];
}

interface Breed {
  kindCd: string;
  kindName: string;
}

interface SubRegion {
  subRegionCode: string;
  subRegionName: string;
}

interface ExistingImage {
  imageId: number;
  imageUrl: string;
  thumbnail: boolean;
}

interface PostDetail {
  categoryId: number;
  boardId: number;
  userId: number;
  lostType: string;
  missingDate: string;
  missingLocation: string;
  regionName: string;
  regionCode: string;
  subRegionName: string;
  subRegionCode: string;
  phone: string;
  upKindName: string;
  upKindCd: string;
  kindName: string;
  kindCd: string;
  gender: string;
  age: number;
  furColor: string;
  content: string;
  distinctFeatures: string;
  images: ExistingImage[];
}

const EditMissingPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [subRegions, setSubRegions] = useState<SubRegion[]>([]);
  const [loading, setLoading] = useState(true);
  const [postDetail, setPostDetail] = useState<PostDetail | null>(null);

  const form = useForm<MissingPostForm>({
    resolver: zodResolver(missingPostSchema),
    defaultValues: {
      lostType: '',
      gender: '',
      images: [],
    }
  });

  const selectedUpKindCd = form.watch('upKindCd');
  const selectedRegionCode = form.watch('regionCode');

  // 수정 폼 데이터 가져오기
  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "로그인 필요",
        description: "게시글 수정을 위해 로그인이 필요합니다.",
        variant: "destructive",
      });
      navigate('/board');
      return;
    }

    const fetchEditData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`http://localhost:8080/api/v1/boards/lost/${id}/form`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          const postData = result.data;
          setPostDetail(postData);
          setExistingImages(postData.images || []);

          // 폼 데이터 설정
          form.setValue('lostType', postData.lostType);
          form.setValue('missingDate', parseISO(postData.missingDate));
          form.setValue('upKindCd', postData.upKindCd);
          form.setValue('kindCd', postData.kindCd);
          form.setValue('regionCode', postData.regionCode);
          form.setValue('subRegionCode', postData.subRegionCode);
          form.setValue('missingLocation', postData.missingLocation);
          form.setValue('phone', postData.phone);
          form.setValue('gender', postData.gender);
          form.setValue('age', postData.age.toString());
          form.setValue('furColor', postData.furColor);
          form.setValue('distinctFeatures', postData.distinctFeatures);
          form.setValue('content', postData.content);

          // 초기 폼 데이터도 함께 가져오기
          const formInfoResponse = await fetch('http://localhost:8080/api/v1/boards/lost/form-info');
          if (formInfoResponse.ok) {
            const formInfoResult = await formInfoResponse.json();
            setFormData(formInfoResult.data);
          }
        } else {
          toast({
            title: "데이터 로딩 실패",
            description: "게시글 정보를 불러오는데 실패했습니다.",
            variant: "destructive",
          });
          navigate('/board');
        }
      } catch (error) {
        console.error('Edit data fetch error:', error);
        toast({
          title: "네트워크 오류",
          description: "데이터를 불러오는 중 오류가 발생했습니다.",
          variant: "destructive",
        });
        navigate('/board');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEditData();
    }
  }, [isLoggedIn, navigate, id, form]);

  // 축종 변경 시 품종 목록 가져오기
  useEffect(() => {
    if (selectedUpKindCd) {
      const fetchBreeds = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/v1/boards/lost/upkind/${selectedUpKindCd}/kinds`);
          if (response.ok) {
            const breeds = await response.json();
            setBreeds(breeds);
          }
        } catch (error) {
          console.error('Breeds fetch error:', error);
        }
      };

      fetchBreeds();
    }
  }, [selectedUpKindCd]);

  // 시도 변경 시 구군 목록 가져오기
  useEffect(() => {
    if (selectedRegionCode) {
      const fetchSubRegions = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/v1/boards/lost/regions/${selectedRegionCode}/sub-regions`);
          if (response.ok) {
            const subRegions = await response.json();
            setSubRegions(subRegions);
          }
        } catch (error) {
          console.error('Sub regions fetch error:', error);
        }
      };

      fetchSubRegions();
    }
  }, [selectedRegionCode]);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const totalImages = existingImages.length + newImages.length + files.length;
    
    if (totalImages > 5) {
      toast({
        title: "이미지 업로드 제한",
        description: "최대 5개의 이미지만 업로드할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }
    
    const updatedNewImages = [...newImages, ...files];
    setNewImages(updatedNewImages);
    form.setValue('images', updatedNewImages);
  };

  const removeNewImage = (index: number) => {
    const updatedNewImages = newImages.filter((_, i) => i !== index);
    setNewImages(updatedNewImages);
    form.setValue('images', updatedNewImages);
  };

  const removeExistingImage = (imageId: number) => {
    const updatedExistingImages = existingImages.filter(img => img.imageId !== imageId);
    setExistingImages(updatedExistingImages);
  };

  // 성별 표시 변환
  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'M': return '수컷';
      case 'F': return '암컷';
      case 'Q': return '모름';
      default: return gender;
    }
  };

  // 실종유형 표시 변환
  const getLostTypeLabel = (lostType: string) => {
    switch (lostType) {
      case 'WS': return '실종';
      case 'WT': return '목격';
      default: return lostType;
    }
  };

  const onSubmit = async (data: MissingPostForm) => {
    if (!user) {
      toast({
        title: "인증 오류",
        description: "로그인 정보를 확인할 수 없습니다.",
        variant: "destructive",
      });
      return;
    }

    // 모든 필수 항목 검증
    if (!data.lostType || !data.missingDate || !data.upKindCd || !data.kindCd || 
        !data.regionCode || !data.missingLocation?.trim() || !data.phone?.trim() || 
        !data.gender || !data.age || !data.furColor?.trim() || 
        !data.distinctFeatures?.trim() || !data.content?.trim() || 
        (existingImages.length === 0 && newImages.length === 0)) {
      
      toast({
        title: "입력 오류",
        description: "모든 항목을 기재해주세요.",
        variant: "destructive",
      });
      return;
    }

    // 세종특별자치시가 아닌 경우 시/군/구 검증
    if (data.regionCode !== '50' && !data.subRegionCode) {
      toast({
        title: "입력 오류",
        description: "시/군/구를 선택해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      const formData = new FormData();
      
      // DTO 데이터 준비
      const dto = {
        categoryId: 4,
        userId: user.id,
        lostType: data.lostType,
        missingDate: format(data.missingDate, 'yyyy-MM-dd'),
        upKindCd: data.upKindCd,
        kindCd: data.kindCd,
        regionCode: data.regionCode,
        subRegionCode: data.subRegionCode,
        missingLocation: data.missingLocation,
        phone: data.phone,
        gender: data.gender,
        age: parseInt(data.age),
        furColor: data.furColor,
        distinctFeatures: data.distinctFeatures,
        content: data.content,
        existingImageIds: existingImages.map(img => img.imageId),
      };

      // DTO를 JSON Blob으로 변환하여 FormData에 추가
      const dtoBlob = new Blob([JSON.stringify(dto)], { type: 'application/json' });
      formData.append('dto', dtoBlob);

      // 새 이미지 파일들 추가
      newImages.forEach((image) => {
        formData.append('images', image);
      });

      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8080/api/v1/boards/lost/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "게시글 수정 완료",
          description: "실종/목격 제보가 성공적으로 수정되었습니다.",
        });
        navigate(`/missing-post/${id}`);
      } else {
        const errorData = await response.json();
        toast({
          title: "수정 실패",
          description: errorData.message || "게시글 수정에 실패했습니다.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "네트워크 오류",
        description: "게시글 수정 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onLoginClick={handleLoginClick} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">실종/목격 제보 수정</h1>
          <p className="text-gray-600">실종된 반려동물이나 목격 정보를 수정해주세요.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>제보 수정</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* 실종유형 */}
                <FormField
                  control={form.control}
                  name="lostType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>구분</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="구분을 선택해주세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {formData?.lostTypes.map((lostType) => (
                            <SelectItem key={lostType} value={lostType}>
                              {getLostTypeLabel(lostType)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 날짜 선택 */}
                <FormField
                  control={form.control}
                  name="missingDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>날짜</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "yyyy년 MM월 dd일")
                              ) : (
                                <span>날짜를 선택해주세요</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 지역 선택 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="regionCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>시/도</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="시/도 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {formData?.regions.map((region) => (
                              <SelectItem key={region.regionCode} value={region.regionCode}>
                                {region.regionName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subRegionCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>시/군/구</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedRegionCode}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="시/군/구 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {subRegions.map((subRegion) => (
                              <SelectItem key={subRegion.subRegionCode} value={subRegion.subRegionCode}>
                                {subRegion.subRegionName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 구체적인 장소 */}
                <FormField
                  control={form.control}
                  name="missingLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>구체적인 장소</FormLabel>
                      <FormControl>
                        <Input placeholder="예: 한강공원 반포지구 산책로" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 연락처 */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>연락처</FormLabel>
                      <FormControl>
                        <Input placeholder="연락 가능한 전화번호를 입력해주세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 동물 정보 */}
                <div className="space-y-4">
                  {/* 축종과 품종 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="upKindCd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>축종</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="축종 선택" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {formData?.upKinds.map((upKind) => (
                                <SelectItem key={upKind.upKindCd} value={upKind.upKindCd}>
                                  {upKind.upKindName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="kindCd"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>품종</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={!selectedUpKindCd}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="품종 선택" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {breeds.map((breed) => (
                                <SelectItem key={breed.kindCd} value={breed.kindCd}>
                                  {breed.kindName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 성별과 나이 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>성별</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="성별 선택" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {formData?.genders.map((gender) => (
                                <SelectItem key={gender} value={gender}>
                                  {getGenderLabel(gender)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>나이</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="나이 선택" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {formData?.ages.map((age) => (
                                <SelectItem key={age} value={age.toString()}>
                                  {age}세
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 털색과 특징 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="furColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>털색</FormLabel>
                          <FormControl>
                            <Input placeholder="예: 갈색, 흰색 등" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="distinctFeatures"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>특징</FormLabel>
                          <FormControl>
                            <Input placeholder="예: 목걸이 착용, 특이한 무늬 등" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* 상세 내용 */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>상세 내용</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="실종 상황이나 목격 정보를 자세히 설명해주세요"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 이미지 업로드 */}
                <div className="space-y-4">
                  <Label>사진 (최대 5장)</Label>
                  
                  {/* 기존 이미지 미리보기 */}
                  {existingImages.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">기존 이미지</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {existingImages.map((image) => (
                          <div key={image.imageId} className="relative">
                            <img
                              src={image.imageUrl}
                              alt="기존 이미지"
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(image.imageId)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 새 이미지 미리보기 */}
                  {newImages.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">새 이미지</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {newImages.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(image)}
                              alt={`새 이미지 ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 이미지 업로드 버튼 */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <span className="mt-2 block text-sm font-medium text-gray-900">
                            사진을 업로드하세요
                          </span>
                          <span className="block text-xs text-gray-500">
                            PNG, JPG, GIF 최대 10MB
                          </span>
                        </label>
                        <input
                          id="image-upload"
                          name="image-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={existingImages.length + newImages.length >= 5}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    현재 {existingImages.length + newImages.length}/5개 이미지
                  </p>
                </div>

                {/* 버튼 */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(`/missing-post/${id}`)}
                  >
                    취소
                  </Button>
                  <Button type="submit">
                    수정하기
                  </Button>
                </div>
              </form>
            </Form>
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

export default EditMissingPost;