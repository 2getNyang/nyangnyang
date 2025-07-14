
import { Shelter, Province, City } from '@/types/shelter';

export const provinces: Province[] = [
  { code: 'seoul', name: '서울특별시' },
  { code: 'busan', name: '부산광역시' },
  { code: 'daegu', name: '대구광역시' },
  { code: 'incheon', name: '인천광역시' },
  { code: 'gwangju', name: '광주광역시' },
  { code: 'daejeon', name: '대전광역시' },
  { code: 'ulsan', name: '울산광역시' },
  { code: 'sejong', name: '세종특별자치시' },
  { code: 'gyeonggi', name: '경기도' },
  { code: 'gangwon', name: '강원도' },
  { code: 'chungbuk', name: '충청북도' },
  { code: 'chungnam', name: '충청남도' },
  { code: 'jeonbuk', name: '전라북도' },
  { code: 'jeonnam', name: '전라남도' },
  { code: 'gyeongbuk', name: '경상북도' },
  { code: 'gyeongnam', name: '경상남도' },
  { code: 'jeju', name: '제주특별자치도' },
];

export const cities: City[] = [
  // 서울
  { code: 'gangnam', name: '강남구', provinceCode: 'seoul' },
  { code: 'gangdong', name: '강동구', provinceCode: 'seoul' },
  { code: 'gangbuk', name: '강북구', provinceCode: 'seoul' },
  { code: 'gangseo', name: '강서구', provinceCode: 'seoul' },
  { code: 'gwanak', name: '관악구', provinceCode: 'seoul' },
  { code: 'gwangjin', name: '광진구', provinceCode: 'seoul' },
  
  // 부산
  { code: 'haeundae', name: '해운대구', provinceCode: 'busan' },
  { code: 'busanjin', name: '부산진구', provinceCode: 'busan' },
  { code: 'dongnae', name: '동래구', provinceCode: 'busan' },
  
  // 경기도
  { code: 'suwon', name: '수원시', provinceCode: 'gyeonggi' },
  { code: 'seongnam', name: '성남시', provinceCode: 'gyeonggi' },
  { code: 'goyang', name: '고양시', provinceCode: 'gyeonggi' },
  { code: 'yongin', name: '용인시', provinceCode: 'gyeonggi' },
  { code: 'bucheon', name: '부천시', provinceCode: 'gyeonggi' },
];

export const shelters: Shelter[] = [
  {
    id: '1',
    name: '서울동물사랑센터',
    introduction: '유기동물들에게 따뜻한 보금자리를 제공하며, 입양을 통해 새로운 가족을 만나도록 돕고 있습니다. 전문 수의사와 함께 건강한 동물들의 입양을 진행합니다.',
    province: 'seoul',
    city: 'gangnam',
    address: '서울특별시 강남구 테헤란로 123',
    phone: '02-1234-5678',
    latitude: 37.5665,
    longitude: 126.9780
  },
  {
    id: '2',
    name: '부산해안동물보호센터',
    introduction: '바다가 보이는 쾌적한 환경에서 유기동물들을 보호하고 있습니다. 매주 토요일마다 입양 상담을 진행하며, 반려동물 교육도 함께 제공합니다.',
    province: 'busan',
    city: 'haeundae',
    address: '부산광역시 해운대구 해운대해변로 456',
    phone: '051-9876-5432',
    latitude: 35.1796,
    longitude: 129.0756
  },
  {
    id: '3',
    name: '수원시동물보호소',
    introduction: '경기도 수원시에서 운영하는 공립 동물보호소입니다. 체계적인 관리 시스템을 통해 유기동물들의 건강과 복지를 책임지고 있습니다.',
    province: 'gyeonggi',
    city: 'suwon',
    address: '경기도 수원시 영통구 월드컵로 789',
    phone: '031-5555-1234',
    latitude: 37.2636,
    longitude: 127.0286
  },
  {
    id: '4',
    name: '성남사랑동물의집',
    introduction: '개와 고양이는 물론 토끼, 햄스터 등 다양한 동물들을 보호하고 있습니다. 입양 전 충분한 상담과 교육을 통해 책임감 있는 입양을 지원합니다.',
    province: 'gyeonggi',
    city: 'seongnam',
    address: '경기도 성남시 분당구 판교로 321',
    phone: '031-7777-8888',
    latitude: 37.3595,
    longitude: 127.1052
  },
  {
    id: '5',
    name: '강서구동물복지센터',
    introduction: '서울 강서구 지역의 유기동물 보호와 입양을 전담하는 센터입니다. 24시간 응급의료 시스템을 갖추고 있어 언제든지 안전한 보호가 가능합니다.',
    province: 'seoul',
    city: 'gangseo',
    address: '서울특별시 강서구 공항대로 987',
    phone: '02-3333-4444',
    latitude: 37.5509,
    longitude: 126.8495
  },
  {
    id: '6',
    name: '고양시반려동물센터',
    introduction: '고양시에서 운영하는 현대적인 시설을 갖춘 동물보호센터입니다. 입양뿐만 아니라 반려동물 교육 프로그램도 운영하고 있습니다.',
    province: 'gyeonggi',
    city: 'goyang',
    address: '경기도 고양시 일산동구 중앙로 654',
    phone: '031-9999-0000',
    latitude: 37.6588,
    longitude: 126.7708
  },
  {
    id: '7',
    name: '강동구애견보호소',
    introduction: '강동구 지역의 유기견들을 전문적으로 보호하는 시설입니다. 넓은 운동장과 쾌적한 환경을 제공합니다.',
    province: 'seoul',
    city: 'gangdong',
    address: '서울특별시 강동구 천호대로 111',
    phone: '02-2222-3333',
    latitude: 37.5301,
    longitude: 127.1237
  },
  {
    id: '8',
    name: '관악구동물의집',
    introduction: '관악구청에서 운영하는 동물보호시설로, 지역사회와 함께하는 입양 프로그램을 진행합니다.',
    province: 'seoul',
    city: 'gwanak',
    address: '서울특별시 관악구 관악로 222',
    phone: '02-4444-5555',
    latitude: 37.4782,
    longitude: 126.9514
  },
  {
    id: '9',
    name: '광진구반려동물센터',
    introduction: '광진구 지역의 유기동물 보호와 시민 교육을 담당하는 센터입니다.',
    province: 'seoul',
    city: 'gwangjin',
    address: '서울특별시 광진구 아차산로 333',
    phone: '02-6666-7777',
    latitude: 37.5384,
    longitude: 127.0822
  },
  {
    id: '10',
    name: '부산진구동물보호소',
    introduction: '부산진구에서 운영하는 동물보호소로, 전문 의료진이 상주하여 동물들의 건강을 관리합니다.',
    province: 'busan',
    city: 'busanjin',
    address: '부산광역시 부산진구 중앙대로 444',
    phone: '051-1111-2222',
    latitude: 35.1641,
    longitude: 129.0606
  },
  {
    id: '11',
    name: '동래구애견센터',
    introduction: '동래구 지역의 유기견들을 위한 전문 보호시설입니다.',
    province: 'busan',
    city: 'dongnae',
    address: '부산광역시 동래구 온천천로 555',
    phone: '051-3333-4444',
    latitude: 35.2048,
    longitude: 129.0772
  },
  {
    id: '12',
    name: '용인시동물보호센터',
    introduction: '용인시에서 운영하는 대형 동물보호센터로, 다양한 종류의 동물들을 보호합니다.',
    province: 'gyeonggi',
    city: 'yongin',
    address: '경기도 용인시 기흥구 용구대로 666',
    phone: '031-7777-8888',
    latitude: 37.2410,
    longitude: 127.1776
  },
  {
    id: '13',
    name: '부천시반려동물의집',
    introduction: '부천시민들을 위한 동물보호시설로, 입양상담과 교육을 함께 제공합니다.',
    province: 'gyeonggi',
    city: 'bucheon',
    address: '경기도 부천시 원미구 중동로 777',
    phone: '032-8888-9999',
    latitude: 37.5035,
    longitude: 126.7660
  },
  {
    id: '14',
    name: '강북구동물복지센터',
    introduction: '강북구 지역의 동물 복지 향상을 위해 설립된 전문 센터입니다.',
    province: 'seoul',
    city: 'gangbuk',
    address: '서울특별시 강북구 도봉로 888',
    phone: '02-5555-6666',
    latitude: 37.6396,
    longitude: 127.0257
  },
  {
    id: '15',
    name: '서울중앙동물보호소',
    introduction: '서울시에서 운영하는 대표적인 동물보호소로, 최신 시설과 의료장비를 갖추고 있습니다.',
    province: 'seoul',
    city: 'gangnam',
    address: '서울특별시 강남구 선릉로 999',
    phone: '02-7777-8888',
    latitude: 37.5172,
    longitude: 127.0473
  },
  {
    id: '16',
    name: '성남시분당동물센터',
    introduction: '분당 신도시 지역의 현대적인 동물보호센터로, 쾌적한 환경을 자랑합니다.',
    province: 'gyeonggi',
    city: 'seongnam',
    address: '경기도 성남시 분당구 성남대로 1010',
    phone: '031-1010-2020',
    latitude: 37.3516,
    longitude: 127.1059
  },
  {
    id: '17',
    name: '고양시일산동물의집',
    introduction: '일산 지역의 유기동물들을 위한 따뜻한 보금자리를 제공하는 센터입니다.',
    province: 'gyeonggi',
    city: 'goyang',
    address: '경기도 고양시 일산서구 킨텍스로 1111',
    phone: '031-2020-3030',
    latitude: 37.6698,
    longitude: 126.7506
  },
  {
    id: '18',
    name: '수원영통동물보호소',
    introduction: '수원시 영통구에 위치한 동물보호소로, 지역사회와 연계한 입양 프로그램을 운영합니다.',
    province: 'gyeonggi',
    city: 'suwon',
    address: '경기도 수원시 영통구 광교로 1212',
    phone: '031-3030-4040',
    latitude: 37.2974,
    longitude: 127.0371
  },
  {
    id: '19',
    name: '부산남구동물센터',
    introduction: '부산 남구 지역의 동물보호를 담당하는 센터로, 바다 근처의 쾌적한 환경을 제공합니다.',
    province: 'busan',
    city: 'haeundae',
    address: '부산광역시 해운대구 좌동로 1313',
    phone: '051-4040-5050',
    latitude: 35.1633,
    longitude: 129.1635
  },
  {
    id: '20',
    name: '서울동부동물보호센터',
    introduction: '서울 동부 지역을 담당하는 종합 동물보호센터로, 24시간 응급실을 운영합니다.',
    province: 'seoul',
    city: 'gangdong',
    address: '서울특별시 강동구 올림픽로 1414',
    phone: '02-5050-6060',
    latitude: 37.5219,
    longitude: 127.1259
  },
  {
    id: '21',
    name: '경기북부동물의집',
    introduction: '경기 북부 지역의 대표적인 동물보호시설로, 넓은 부지와 자연친화적 환경을 자랑합니다.',
    province: 'gyeonggi',
    city: 'goyang',
    address: '경기도 고양시 덕양구 행신로 1515',
    phone: '031-6060-7070',
    latitude: 37.6138,
    longitude: 126.8321
  },
  {
    id: '22',
    name: '부천중앙동물보호소',
    introduction: '부천시 중앙에 위치한 동물보호소로, 교통이 편리하여 입양 상담이 활발합니다.',
    province: 'gyeonggi',
    city: 'bucheon',
    address: '경기도 부천시 소사구 경인로 1616',
    phone: '032-7070-8080',
    latitude: 37.4894,
    longitude: 126.7942
  },
  {
    id: '23',
    name: '용인수지동물센터',
    introduction: '용인시 수지구의 주택가에 위치한 동물센터로, 가정적인 분위기를 제공합니다.',
    province: 'gyeonggi',
    city: 'yongin',
    address: '경기도 용인시 수지구 성복로 1717',
    phone: '031-8080-9090',
    latitude: 37.3247,
    longitude: 127.0986
  },
  {
    id: '24',
    name: '서울서부동물복지센터',
    introduction: '서울 서부 지역의 동물 복지를 위해 설립된 전문 센터로, 다양한 봉사 프로그램을 운영합니다.',
    province: 'seoul',
    city: 'gangseo',
    address: '서울특별시 강서구 화곡로 1818',
    phone: '02-9090-0101',
    latitude: 37.5419,
    longitude: 126.8378
  },
  {
    id: '25',
    name: '성남중원동물의집',
    introduction: '성남시 중원구에 위치한 동물의집으로, 소규모이지만 정성스러운 관리로 유명합니다.',
    province: 'gyeonggi',
    city: 'seongnam',
    address: '경기도 성남시 중원구 성남대로 1919',
    phone: '031-0101-1212',
    latitude: 37.4206,
    longitude: 127.1267
  }
];
