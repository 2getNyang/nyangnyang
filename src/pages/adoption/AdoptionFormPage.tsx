import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

const AdoptionFormPage: React.FC = () => {
  const { desertionNo, formId } = useParams<{ desertionNo: string; formId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  // Form state
  const [userName, setUserName] = useState('');
  const [userBirth, setUserBirth] = useState<Date>();
  const [userGender, setUserGender] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [familyPhone, setFamilyPhone] = useState('');
  const [family, setFamily] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [housingType, setHousingType] = useState('');
  const [job, setJob] = useState('');
  const [experience, setExperience] = useState('');
  const [hasOtherPets, setHasOtherPets] = useState('');
  const [adultCount, setAdultCount] = useState<number>(0);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [allConsent, setAllConsent] = useState('');
  const [hasAllergy, setHasAllergy] = useState('');
  const [consentForCheck, setConsentForCheck] = useState('');
  const [applicationReason, setApplicationReason] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleLoginClick = () => {
    console.log('Login clicked');
  };

  useEffect(() => {
    if (formId) {
      setIsReadOnly(true);
      fetchApplicationData();
    }
  }, [formId]);

  const fetchApplicationData = async () => {
    setLoading(true);
    try {
      // API 호출 (실제 구현 시)
      // const response = await fetch(`/api/v1/adoption-applications/${formId}`);
      // const data = await response.json();
      
      // Mock 데이터
      const mockData = {
        noticeNo: desertionNo,
        userName: "홍길동",
        userBirth: "1990-05-15",
        userGender: "MALE",
        userPhone: "010-1234-5678",
        familyPhone: "010-9876-5432",
        family: "어머니",
        address: "서울특별시 강남구 강남대로 123",
        detailAddress: "101동 202호",
        housingType: "APARTMENT",
        job: "디자이너",
        experience: "YES",
        hasOtherPets: "NO",
        adultCount: 2,
        childrenCount: 1,
        allConsent: "YES",
        hasAllergy: "NO",
        consentForCheck: "YES",
        formCreatedAt: "2024-07-01T15:00:00",
        applicationReason: "아이와 함께 반려동물을 키우며 책임감을 가르치고 싶어요.",
        resentAt: null
      };

      setApplicationData(mockData);
      
      // 폼 데이터 설정
      setUserName(mockData.userName);
      setUserBirth(new Date(mockData.userBirth));
      setUserGender(mockData.userGender);
      setUserPhone(mockData.userPhone);
      setFamilyPhone(mockData.familyPhone);
      setFamily(mockData.family);
      setAddress(mockData.address);
      setDetailAddress(mockData.detailAddress);
      setHousingType(mockData.housingType);
      setJob(mockData.job);
      setExperience(mockData.experience);
      setHasOtherPets(mockData.hasOtherPets);
      setAdultCount(mockData.adultCount);
      setChildrenCount(mockData.childrenCount);
      setAllConsent(mockData.allConsent);
      setHasAllergy(mockData.hasAllergy);
      setConsentForCheck(mockData.consentForCheck);
      setApplicationReason(mockData.applicationReason);
    } catch (error) {
      console.error('Failed to fetch application data:', error);
      toast({
        title: "오류",
        description: "신청서 데이터를 불러오는 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const canResend = () => {
    if (!applicationData) return false;
    const createdAt = new Date(applicationData.formCreatedAt);
    const now = new Date();
    const diffInDays = (now.getTime() - createdAt.getTime()) / (1000 * 3600 * 24);
    return diffInDays >= 2 && applicationData.resentAt === null;
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      // API 호출 (실제 구현 시)
      // await fetch(`/api/v1/adoption-applications/${formId}/resend`, { method: 'POST' });
      
      toast({
        title: "재전송 완료",
        description: "입양 신청서가 재전송되었습니다."
      });
    } catch (error) {
      toast({
        title: "오류",
        description: "재전송 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  const getHousingTypeText = (value: string) => {
    const housingTypes: { [key: string]: string } = {
      'DAGA_GU_JUTAUK': '다가구주택',
      'DANDOK_JUTAUK': '단독주택',
      'APARTMENT': '아파트',
      'ONE_ROOM': '원룸',
      'ETC': '기타'
    };
    return housingTypes[value] || value;
  };

  const getGenderText = (value: string) => {
    return value === 'MALE' ? '남성' : value === 'FEMALE' ? '여성' : value;
  };

  const getYesNoText = (value: string) => {
    return value === 'YES' ? '예' : value === 'NO' ? '아니오' : value;
  };

  // Validation check
  const isFormValid = () => {
    return userName && userBirth && userGender && userPhone && familyPhone && 
           family && address && detailAddress && housingType && job && 
           experience && hasOtherPets && allConsent && hasAllergy && 
           consentForCheck && applicationReason;
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast({
        title: "입력 오류",
        description: "모든 필수 항목을 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const adoptionData = {
        userId: user?.id,
        userName,
        userBirth: userBirth ? format(userBirth, 'yyyy-MM-dd') : '',
        userGender,
        userPhone,
        familyPhone,
        family,
        address,
        detailAddress,
        housingType,
        job,
        experience: experience === 'YES' ? 'YES' : 'NO',
        hasOtherPets: hasOtherPets === 'YES' ? 'YES' : 'NO',
        adultCount,
        childrenCount,
        allConsent: allConsent === 'YES' ? 'YES' : 'NO',
        hasAllergy: hasAllergy === 'YES' ? 'YES' : 'NO',
        consentForCheck: consentForCheck === 'YES' ? 'YES' : 'NO',
        applicationReason
      };

      const response = await fetch(`/api/v1/adoptions/${desertionNo}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adoptionData),
      });

      if (response.status === 409) {
        toast({
          title: "중복 신청",
          description: "이미 해당 공고에 입양 신청하셨습니다.",
          variant: "destructive"
        });
        return;
      }

      if (response.ok) {
        toast({
          title: "신청 완료",
          description: "입양 신청이 접수되었습니다."
        });
        navigate('/mypage/applications');
      } else {
        throw new Error('신청 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      toast({
        title: "오류",
        description: "신청 처리 중 오류가 발생했습니다.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onLoginClick={handleLoginClick} />
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <CardTitle className="text-2xl font-bold text-center">
                    {isReadOnly ? '입양 신청서 조회' : '입양 신청서'}
                  </CardTitle>
                  <p className="text-muted-foreground text-center">
                    공고번호: {desertionNo}
                  </p>
                </div>
                {isReadOnly && (
                  <Button
                    onClick={handleResend}
                    disabled={!canResend() || isResending}
                    variant="outline"
                    size="sm"
                  >
                    {isResending ? '재전송 중...' : '재전송'}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 기본 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">기본 정보</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="userName">신청자 이름 *</Label>
                    <Input
                      id="userName"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="이름을 입력하세요"
                      readOnly={isReadOnly}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>생년월일 *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !userBirth && "text-muted-foreground"
                          )}
                          disabled={isReadOnly}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {userBirth ? format(userBirth, "yyyy년 MM월 dd일") : "생년월일 선택"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={userBirth}
                          onSelect={setUserBirth}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>성별 *</Label>
                   {isReadOnly ? (
                     <div className="p-3 bg-gray-50 rounded-md">
                       <span className="text-sm">{getGenderText(userGender)}</span>
                     </div>
                   ) : (
                     <RadioGroup value={userGender} onValueChange={setUserGender}>
                       <div className="flex items-center space-x-6">
                         <div className="flex items-center space-x-2">
                           <RadioGroupItem value="MALE" id="male" />
                           <Label htmlFor="male">남성</Label>
                         </div>
                         <div className="flex items-center space-x-2">
                           <RadioGroupItem value="FEMALE" id="female" />
                           <Label htmlFor="female">여성</Label>
                         </div>
                       </div>
                     </RadioGroup>
                   )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="userPhone">휴대폰 번호 *</Label>
                    <Input
                      id="userPhone"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="010-0000-0000"
                      readOnly={isReadOnly}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="familyPhone">보호자 연락처 *</Label>
                    <Input
                      id="familyPhone"
                      value={familyPhone}
                      onChange={(e) => setFamilyPhone(e.target.value)}
                      placeholder="010-0000-0000"
                      readOnly={isReadOnly}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="family">보호자와의 관계 *</Label>
                  <Input
                    id="family"
                    value={family}
                    onChange={(e) => setFamily(e.target.value)}
                    placeholder="예: 부모님, 배우자 등"
                    readOnly={isReadOnly}
                  />
                </div>
              </div>

              {/* 거주 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">거주 정보</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="address">주소 *</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="기본 주소를 입력하세요"
                    readOnly={isReadOnly}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detailAddress">상세주소 *</Label>
                  <Input
                    id="detailAddress"
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                    placeholder="상세 주소를 입력하세요"
                    readOnly={isReadOnly}
                  />
                </div>

                <div className="space-y-2">
                  <Label>거주 형태 *</Label>
                  {isReadOnly ? (
                    <div className="p-3 bg-gray-50 rounded-md">
                      <span className="text-sm">{getHousingTypeText(housingType)}</span>
                    </div>
                  ) : (
                    <Select value={housingType} onValueChange={setHousingType}>
                      <SelectTrigger>
                        <SelectValue placeholder="거주 형태를 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DAGA_GU_JUTAUK">다가구주택</SelectItem>
                        <SelectItem value="DANDOK_JUTAUK">단독주택</SelectItem>
                        <SelectItem value="APARTMENT">아파트</SelectItem>
                        <SelectItem value="ONE_ROOM">원룸</SelectItem>
                        <SelectItem value="ETC">기타</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job">직업 *</Label>
                  <Input
                    id="job"
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                    placeholder="직업을 입력하세요"
                    readOnly={isReadOnly}
                  />
                </div>
              </div>

              {/* 반려동물 경험 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">반려동물 관련 정보</h3>
                
                 <div className="space-y-2">
                  <Label>이전에 반려동물을 키워보신 적이 있나요? *</Label>
                  {isReadOnly ? (
                    <div className="p-3 bg-gray-50 rounded-md">
                      <span className="text-sm">{getYesNoText(experience)}</span>
                    </div>
                  ) : (
                    <RadioGroup value={experience} onValueChange={setExperience}>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="YES" id="exp-yes" />
                          <Label htmlFor="exp-yes">있습니다</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="NO" id="exp-no" />
                          <Label htmlFor="exp-no">없습니다</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>현재 함께 지내는 반려동물이 있으신가요? *</Label>
                  {isReadOnly ? (
                    <div className="p-3 bg-gray-50 rounded-md">
                      <span className="text-sm">{getYesNoText(hasOtherPets)}</span>
                    </div>
                  ) : (
                    <RadioGroup value={hasOtherPets} onValueChange={setHasOtherPets}>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="YES" id="pets-yes" />
                          <Label htmlFor="pets-yes">있습니다</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="NO" id="pets-no" />
                          <Label htmlFor="pets-no">없습니다</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  )}
                </div>
              </div>

              {/* 동거인 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">동거인 정보</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adultCount">함께 거주 중인 성인은 몇 분이신가요? *</Label>
                    <Input
                      id="adultCount"
                      type="number"
                      min="0"
                      value={adultCount}
                      onChange={(e) => setAdultCount(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      readOnly={isReadOnly}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="childrenCount">함께 거주 중인 자녀는 몇 분이신가요? *</Label>
                    <Input
                      id="childrenCount"
                      type="number"
                      min="0"
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(parseInt(e.target.value) || 0)}
                      placeholder="0"
                      readOnly={isReadOnly}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>동거인 모두 입양에 동의하셨나요? *</Label>
                  {isReadOnly ? (
                    <div className="p-3 bg-gray-50 rounded-md">
                      <span className="text-sm">{getYesNoText(allConsent)}</span>
                    </div>
                  ) : (
                    <RadioGroup value={allConsent} onValueChange={setAllConsent}>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="YES" id="consent-yes" />
                          <Label htmlFor="consent-yes">동의합니다</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="NO" id="consent-no" />
                          <Label htmlFor="consent-no">동의하지 않습니다</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>알러지를 가지고 계신가요? *</Label>
                  {isReadOnly ? (
                    <div className="p-3 bg-gray-50 rounded-md">
                      <span className="text-sm">{getYesNoText(hasAllergy)}</span>
                    </div>
                  ) : (
                    <RadioGroup value={hasAllergy} onValueChange={setHasAllergy}>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="YES" id="allergy-yes" />
                          <Label htmlFor="allergy-yes">있습니다</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="NO" id="allergy-no" />
                          <Label htmlFor="allergy-no">없습니다</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>입양 후 상태 확인 요청에 동의하시나요? *</Label>
                  {isReadOnly ? (
                    <div className="p-3 bg-gray-50 rounded-md">
                      <span className="text-sm">{getYesNoText(consentForCheck)}</span>
                    </div>
                  ) : (
                    <RadioGroup value={consentForCheck} onValueChange={setConsentForCheck}>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="YES" id="check-yes" />
                          <Label htmlFor="check-yes">동의합니다</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="NO" id="check-no" />
                          <Label htmlFor="check-no">동의하지 않습니다</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  )}
                </div>
              </div>

              {/* 입양 사유 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">입양 사유</h3>
                <div className="space-y-2">
                  <Label htmlFor="applicationReason">입양 사유 *</Label>
                  <Textarea
                    id="applicationReason"
                    value={applicationReason}
                    onChange={(e) => setApplicationReason(e.target.value)}
                    placeholder="입양을 신청하시는 이유를 자세히 작성해주세요"
                    rows={4}
                    readOnly={isReadOnly}
                  />
                </div>
              </div>

              {/* 입양 계약서 - read-only 모드에서는 숨김 */}
              {!isReadOnly && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">입양 계약서</h3>
                  <div className="bg-gray-50 p-6 rounded-lg border space-y-4">
                    <div className="space-y-3 text-sm">
                      <p>• 본인은 입양한 반려동물이 무지개다리를 건너는 순간까지 양질의 사료와 신선한 물을 공급하며, 쾌적하고 안전한 환경에서 반려동물을 보살필 것입니다.</p>
                      <p>• 본인은 연락처 변경, 이사 등의 정보 변동 시 반드시 보호단체에 이를 전달할 것입니다.</p>
                      <p>• 본인은 보호단체와 약속된 방식으로 입양한 반려동물의 소식을 정기적으로 전달할 것입니다.</p>
                      <p>• 본인은 입양 후 보호단체의 모니터링 및 연락에 협조할 것입니다.</p>
                      <p>• 본인은 개인 사정으로 입양 받은 반려동물을 파양할 경우 반드시 보호단체에 반환할 것입니다.</p>
                      <p>• 본인은 반려동물이 실종되거나 사망한 경우 즉시 보호단체에 이를 알릴 것입니다.</p>
                      <p>• 본인은 보호단체가 반려 상황을 모니터링하여 적합하지 않다고 판단할 경우, 요구 시 반려동물을 반환할 것입니다.</p>
                      <p>• 본인은 중성화 수술이 되지 않은 반려동물을 입양한 경우, 수술 가능 시 반드시 중성화할 것입니다.</p>
                      <p>• 본인은 정기 예방접종 및 건강검진 등 건강 관리를 성실히 이행할 것입니다.</p>
                      <p>• 본인은 어떠한 경우에도 책임 후원비 반환을 요구하지 않을 것입니다.</p>
                      <p className="mt-6 pt-4 border-t border-gray-200">
                        위의 모든 입양 조건에 동의하며, 이를 위반할 경우 반려동물의 소유권이 보호단체에 귀속됨을 약속합니다.
                      </p>
                    </div>
                    <div className="mt-8 space-y-2 text-sm">
                      <p>년     월     일</p>
                      <p>원 보호자: ___________________ (인)</p>
                      <p>입양 신청자: {userName || '___________________'} (인)</p>
                    </div>
                    <div className="mt-6 text-center font-bold">
                      함께하게냥
                    </div>
                  </div>
                </div>
              )}

              {/* 제출 버튼 - read-only 모드에서는 숨김 */}
              {!isReadOnly && (
                <div className="pt-6">
                  <Button
                    onClick={handleSubmit}
                    disabled={!isFormValid() || isSubmitting}
                    className="w-48 mx-auto block"
                    size="lg"
                  >
                    {isSubmitting ? "신청 중..." : "입양 신청서 제출"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdoptionFormPage;