
export interface Shelter {
  id: string;
  name: string;
  introduction: string;
  province: string;
  city: string;
  address: string;
  phone: string;
  latitude?: number;
  longitude?: number;
}

export interface Province {
  code: string;
  name: string;
}

export interface City {
  code: string;
  name: string;
  provinceCode: string;
}
