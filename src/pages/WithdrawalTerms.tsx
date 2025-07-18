import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AppHeader from '@/components/AppHeader';
import Footer from '@/components/Footer';
import path from "path";

const WithdrawalTerms = () => {
  const navigate = useNavigate();
  const [inputNickname, setInputNickname] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [currentNickname, setCurrentNickname] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) throw new Error('저장된 유저 정보 없음');

      const parsed = JSON.parse(storedUser);
      setCurrentNickname(parsed.nickname); // ← 여기서 닉네임 추출
    } catch (err) {
      console.error('닉네임 조회 실패', err);
      alert('로그인 정보를 확인할 수 없습니다.');
    }
  }, []);


  const handleWithdrawal = async () => {
    if (inputNickname !== currentNickname) {
      alert('사용자 닉네임이 일치하지 않습니다.');
      return;
    }

    if (confirmText !== '탈퇴합니다') {
      alert('"탈퇴합니다"를 정확히 입력해주세요.');
      return;
    }

    const confirmed = confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('accessToken');

      const res = await fetch('http://localhost:8080/api/auth/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키설정
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || '회원 탈퇴 실패');
      }

      alert('회원탈퇴가 완료되었습니다.');
      localStorage.clear(); // 로컬스토리지 정리
      // 쿠키전부삭제
      document.cookie.split(";").forEach(cookie => {
        const name = cookie.split("=")[0].trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      });

      navigate('/');
    } catch (err) {
      console.error('회원탈퇴 실패', err);
      alert('회원탈퇴에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const isFormValid =
      inputNickname === currentNickname && confirmText === '탈퇴합니다';

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader onLoginClick={() => {}} />
      
      <div className="container mx-auto px-4 py-8">
        {/* 뒤로가기 버튼 */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          뒤로가기
        </button>

        {/* 페이지 헤더 */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">회원탈퇴 약관 안내</h1>
          <p className="text-gray-600">탈퇴 전 아래 내용을 반드시 확인해 주세요</p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* 탈퇴 안내문 */}
          <Card className="border-0 shadow-md mb-8">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">회원탈퇴 유의사항</h2>
              <p className="text-gray-700 mb-6">
                회원 탈퇴를 신청하기 전에 아래 사항을 반드시 확인해 주세요.
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    1. 탈퇴한 계정은 복구되지 않으며, 기존 데이터 접근 권한도 사라집니다.
                  </h3>
                  <ul className="text-gray-600 space-y-1 ml-4">
                    <li>• 탈퇴 시 현재 사용 중인 계정은 즉시 비활성화되며, 계정에 저장된 활동 내역, 프로필 정보, 설정 등 모든 개인 정보는 삭제됩니다.</li>
                    <li>• 삭제된 정보는 복구가 불가능하므로, 필요 시 탈퇴 전에 백업하시기 바랍니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    2. 탈퇴 후에도 작성한 게시물은 삭제되지 않으며, 더 이상 수정/삭제할 수 없습니다.
                  </h3>
                  <ul className="text-gray-600 space-y-1 ml-4">
                    <li>• 탈퇴하더라도 커뮤니티, 게시판, 댓글 등의 형태로 남긴 게시물은 자동으로 삭제되지 않습니다.</li>
                    <li>• 또한, 탈퇴 이후에는 해당 게시물에 대한 소유권 및 접근 권한이 사라지기 때문에 직접 삭제 또는 편집할 수 없습니다.</li>
                    <li>• 게시물 삭제를 원하실 경우, 반드시 탈퇴 전에 직접 삭제해 주세요.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    3. 동일한 소셜 계정으로 재가입은 가능하나, 이전 데이터는 이관되지 않습니다.
                  </h3>
                  <ul className="text-gray-600 space-y-1 ml-4">
                    <li>• 탈퇴 후 동일한 Kakao / Google / Naver 계정으로 재가입은 가능하지만, 이전 활동 이력 및 설정은 모두 초기화됩니다.</li>
                    <li>• 또한, 탈퇴 전 사용하던 아이디와 연결된 정보는 새 계정으로 이전되지 않으며, 기존 계정에 작성된 게시물에 접근하거나 소유권을 주장할 수 없습니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    4. 소셜 로그인 연동은 탈퇴 시 자동으로 해제됩니다.
                  </h3>
                  <ul className="text-gray-600 space-y-1 ml-4">
                    <li>• 본 서비스는 소셜 로그인(Kakao, Google, Naver)만 지원합니다.</li>
                    <li>• 회원 탈퇴 시, 연동된 소셜 로그인 정보도 함께 해제되며, 관련 인증 정보는 삭제됩니다.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    5. 아래 입력 조건을 모두 만족해야 회원 탈퇴가 완료됩니다.
                  </h3>
                  <ul className="text-gray-600 space-y-1 ml-4">
                    <li>• 사용자 아이디를 정확히 입력해 주세요.</li>
                    <li>• 아래 입력란에 '탈퇴합니다'라는 문구를 정확히 입력해야만 탈퇴 절차가 진행됩니다.</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">
                  ※ 위 내용을 충분히 숙지하신 후, 탈퇴를 진행해 주시기 바랍니다.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 탈퇴 입력 폼 */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">회원탈퇴 확인</h2>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="nickname" className="text-gray-700">
                    사용자 닉네임 입력
                  </Label>
                  <Input
                      id="nickname"
                      type="text"
                      value={inputNickname}
                      onChange={(e) => setInputNickname(e.target.value)}
                      placeholder="현재 사용 중인 닉네임을 입력하세요"
                      className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    현재 닉네임: {currentNickname ?? '로딩 중...'}
                  </p>

                </div>

                <div>
                  <Label htmlFor="confirmText" className="text-gray-700">
                    탈퇴 확인 문구 입력
                  </Label>
                  <Input
                    id="confirmText"
                    type="text"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    placeholder="'탈퇴합니다'를 정확히 입력하세요"
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    '탈퇴합니다'를 정확히 입력해야 합니다.
                  </p>
                </div>

                <Button
                  onClick={handleWithdrawal}
                  disabled={!isFormValid}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  탈퇴하기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default WithdrawalTerms;