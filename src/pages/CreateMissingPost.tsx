import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { z } from 'zod';
import { CalendarIcon, Upload, X } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import LoginModal from '@/components/LoginModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const missingPostSchema = z.object({
  type: z.enum(['missing', 'sighted'], { required_error: "구분을 선택해주세요" }),
  date: z.date({ required_error: "날짜를 선택해주세요" }),
  city: z.string().min(1, "시/도를 선택해주세요"),
  district: z.string().min(1, "시/군/구를 선택해주세요"),
  specificLocation: z.string().min(1, "구체적인 장소를 입력해주세요"),
  contact: z.string().min(1, "연락처를 입력해주세요"),
  species: z.string().min(1, "축종을 선택해주세요"),
  breed: z.string().min(1, "품종을 선택해주세요"),
  gender: z.enum(['unknown', 'male', 'female'], { required_error: "성별을 선택해주세요" }),
  age: z.string().min(1, "나이를 선택해주세요"),
  furColor: z.string().min(1, "털색을 입력해주세요"),
  characteristics: z.string().min(1, "특징을 입력해주세요"),
  title: z.string().min(1, "제목을 입력해주세요"),
  content: z.string().min(1, "본문을 입력해주세요"),
});

type MissingPostForm = z.infer<typeof missingPostSchema>;

const cities = [
  "서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", "대전광역시", "울산광역시", "세종특별자치시",
  "경기도", "강원도", "충청북도", "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주특별자치도"
];

const districts: Record<string, string[]> = {
  "서울특별시": ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
  "경기도": ["수원시", "성남시", "안양시", "안산시", "용인시", "광명시", "평택시", "과천시", "오산시", "시흥시", "군포시", "의왕시", "하남시", "이천시", "안성시", "김포시", "화성시", "광주시", "양주시", "포천시", "여주시", "연천군", "가평군", "양평군"],
  // 다른 지역들도 필요시 추가 가능
};

const breeds: Record<string, string[]> = {
  "dog": ["골든 리트리버", "리브라도 리트리버", "비숑 프리제", "푸들", "말티즈", "포메라니안", "치와와", "요크셔 테리어", "시바견", "진돗개", "삽살개", "닥스훈트", "비글", "보더 콜리", "허스키", "마라뮤트", "셰퍼드", "불독", "로트와일러", "그레이하운드", "잭 러셀 테리어", "코커 스패니얼", "기타"],
  "cat": ["코리안 숏헤어", "페르시안", "러시안 블루", "브리티시 숏헤어", "메인쿤", "아메리칸 숏헤어", "스코티시 폴드", "먼치킨", "벵갈", "샴", "래그돌", "노르웨이 숲", "터키시 앙고라", "아비시니안", "버미즈", "기타"],
  "other": ["토끼", "햄스터", "기니피그", "페럿", "앵무새", "카나리아", "거북이", "이구아나", "기타"]
};

const CreateMissingPost = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const form = useForm<MissingPostForm>({
    resolver: zodResolver(missingPostSchema),
    defaultValues: {
      type: 'missing',
      gender: 'unknown',
    }
  });

  const selectedCity = form.watch('city');
  const selectedSpecies = form.watch('species');

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

  const onSubmit = (data: MissingPostForm) => {
    // 게시글 저장 로직 (추후 백엔드 연동)
    console.log('Form data:', data);
    console.log('Images:', images);
    
    toast({
      title: "게시글 작성 완료",
      description: "실종/목격 제보가 성공적으로 작성되었습니다.",
    });
    
    navigate('/board');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onLoginClick={handleLoginClick} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">실종/목격 제보</h1>
          <p className="text-gray-600">실종된 반려동물이나 목격 정보를 제보해주세요.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>제보 작성</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* 구분 */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>구분</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="구분을 선택해주세요" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="missing">실종</SelectItem>
                          <SelectItem value="sighted">목격</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 날짜 선택 */}
                <FormField
                  control={form.control}
                  name="date"
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
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>시/도</FormLabel>
                        <Select onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue('district', ''); // 시/도 변경 시 시/군/구 초기화
                        }} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="시/도 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="district"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>시/군/구</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCity}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="시/군/구 선택" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {selectedCity && districts[selectedCity]?.map((district) => (
                              <SelectItem key={district} value={district}>{district}</SelectItem>
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
                  name="specificLocation"
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
                  name="contact"
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
                      name="species"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>축종</FormLabel>
                          <Select onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue('breed', ''); // 축종 변경 시 품종 초기화
                          }} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="축종 선택" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="dog">개</SelectItem>
                              <SelectItem value="cat">고양이</SelectItem>
                              <SelectItem value="other">기타</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="breed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>품종</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value} disabled={!selectedSpecies}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="품종 선택" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {selectedSpecies && breeds[selectedSpecies]?.map((breed) => (
                                <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* 성별과 나이 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>성별</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row space-x-6"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="unknown" id="unknown" />
                                <Label htmlFor="unknown">미확인</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="male" id="male" />
                                <Label htmlFor="male">수컷</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="female" id="female" />
                                <Label htmlFor="female">암컷</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
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
                              <SelectItem value="unknown">나이 모름</SelectItem>
                              {Array.from({length: 20}, (_, i) => i + 1).map((age) => (
                                <SelectItem key={age} value={age.toString()}>{age}살</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* 털색 */}
                <FormField
                  control={form.control}
                  name="furColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>털색</FormLabel>
                      <FormControl>
                        <Input placeholder="예: 갈색, 흰색과 갈색 섞임, 검은색" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 특징 */}
                <FormField
                  control={form.control}
                  name="characteristics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>특징</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="목줄 착용 여부, 특이한 무늬, 행동 특성 등을 자세히 적어주세요"
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 제목 */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>제목</FormLabel>
                      <FormControl>
                        <Input placeholder="제목을 입력해주세요" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 본문 */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>본문</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="상황을 자세히 설명해주세요"
                          className="min-h-[200px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* 이미지 업로드 - 개선된 디자인 */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">사진 첨부 (최대 5개)</Label>
                  
                  <div className="space-y-4">
                    {/* 업로드 버튼 */}
                    {images.length < 5 && (
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm font-medium text-gray-600">사진 선택하기</span>
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
                    제보하기
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

export default CreateMissingPost;