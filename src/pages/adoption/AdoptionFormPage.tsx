import React, { useState } from 'react';
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

const AdoptionFormPage: React.FC = () => {
  const { desertionNo } = useParams<{ desertionNo: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleLoginClick = () => {
    console.log('Login clicked');
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
        userName,
        userBirth: userBirth ? format(userBirth, 'yyyyMMdd') : '',
        userGender,
        userPhone,
        familyPhone,
        family,
        address,
        detailAddress,
        housingType,
        job,
        experience: experience === 'Y',
        hasOtherPets: hasOtherPets === 'Y',
        adultCount,
        childrenCount,
        allConsent: allConsent === 'Y',
        hasAllergy: hasAllergy === 'Y',
        consentForCheck: consentForCheck === 'Y',
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
              <CardTitle className="text-2xl font-bold text-center">입양 신청서</CardTitle>
              <p className="text-muted-foreground text-center">
                공고번호: {desertionNo}
              </p>
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
                  <RadioGroup value={userGender} onValueChange={setUserGender}>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="M" id="male" />
                        <Label htmlFor="male">남성</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="F" id="female" />
                        <Label htmlFor="female">여성</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="userPhone">휴대폰 번호 *</Label>
                    <Input
                      id="userPhone"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="010-0000-0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="familyPhone">보호자 연락처 *</Label>
                    <Input
                      id="familyPhone"
                      value={familyPhone}
                      onChange={(e) => setFamilyPhone(e.target.value)}
                      placeholder="010-0000-0000"
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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="detailAddress">상세주소 *</Label>
                  <Input
                    id="detailAddress"
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                    placeholder="상세 주소를 입력하세요"
                  />
                </div>

                <div className="space-y-2">
                  <Label>거주 형태 *</Label>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job">직업 *</Label>
                  <Input
                    id="job"
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                    placeholder="직업을 입력하세요"
                  />
                </div>
              </div>

              {/* 반려동물 경험 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">반려동물 관련 정보</h3>
                
                <div className="space-y-2">
                  <Label>이전 동물 양육 경험 *</Label>
                  <RadioGroup value={experience} onValueChange={setExperience}>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Y" id="exp-yes" />
                        <Label htmlFor="exp-yes">예</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="N" id="exp-no" />
                        <Label htmlFor="exp-no">아니오</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>현재 다른 반려동물 존재 여부 *</Label>
                  <RadioGroup value={hasOtherPets} onValueChange={setHasOtherPets}>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Y" id="pets-yes" />
                        <Label htmlFor="pets-yes">예</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="N" id="pets-no" />
                        <Label htmlFor="pets-no">아니오</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* 동거인 정보 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">동거인 정보</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adultCount">동거인 성인 수 *</Label>
                    <Input
                      id="adultCount"
                      type="number"
                      min="0"
                      value={adultCount}
                      onChange={(e) => setAdultCount(parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="childrenCount">동거인 자녀 수 *</Label>
                    <Input
                      id="childrenCount"
                      type="number"
                      min="0"
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>동거인 모두 동의 여부 *</Label>
                  <RadioGroup value={allConsent} onValueChange={setAllConsent}>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Y" id="consent-yes" />
                        <Label htmlFor="consent-yes">예</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="N" id="consent-no" />
                        <Label htmlFor="consent-no">아니오</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>알러지 보유 여부 *</Label>
                  <RadioGroup value={hasAllergy} onValueChange={setHasAllergy}>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Y" id="allergy-yes" />
                        <Label htmlFor="allergy-yes">예</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="N" id="allergy-no" />
                        <Label htmlFor="allergy-no">아니오</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>입양 후 상태 확인 동의 *</Label>
                  <RadioGroup value={consentForCheck} onValueChange={setConsentForCheck}>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Y" id="check-yes" />
                        <Label htmlFor="check-yes">예</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="N" id="check-no" />
                        <Label htmlFor="check-no">아니오</Label>
                      </div>
                    </div>
                  </RadioGroup>
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
                  />
                </div>
              </div>

              {/* 제출 버튼 */}
              <div className="pt-6">
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid() || isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? "신청 중..." : "입양 신청서 제출"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdoptionFormPage;