export const provinces = [
  {
    "name": "Cần Thơ",
    "type": "thành phố",
    "code": "can-tho"
  },
  {
    "name": "Huế",
    "type": "thành phố",
    "code": "hue"
  },
  {
    "name": "Hà Nội",
    "type": "thành phố",
    "code": "ha-noi"
  },
  {
    "name": "Hải Phòng",
    "type": "thành phố",
    "code": "hai-phong"
  },
  {
    "name": "Thành phố Hồ Chí Minh",
    "type": "thành phố",
    "code": "thanh-pho-ho-chi-minh"
  },
  {
    "name": "Đà Nẵng",
    "type": "thành phố",
    "code": "a-nang"
  },
  {
    "name": "An Giang",
    "type": "tỉnh",
    "code": "an-giang"
  },
  {
    "name": "Bắc Ninh",
    "type": "tỉnh",
    "code": "bac-ninh"
  },
  {
    "name": "Cao Bằng",
    "type": "tỉnh",
    "code": "cao-bang"
  },
  {
    "name": "Cà Mau",
    "type": "tỉnh",
    "code": "ca-mau"
  },
  {
    "name": "Gia Lai",
    "type": "tỉnh",
    "code": "gia-lai"
  },
  {
    "name": "Hà Tĩnh",
    "type": "tỉnh",
    "code": "ha-tinh"
  },
  {
    "name": "Hưng Yên",
    "type": "tỉnh",
    "code": "hung-yen"
  },
  {
    "name": "Khánh Hòa",
    "type": "tỉnh",
    "code": "khanh-hoa"
  },
  {
    "name": "Lai Châu",
    "type": "tỉnh",
    "code": "lai-chau"
  },
  {
    "name": "Lào Cai",
    "type": "tỉnh",
    "code": "lao-cai"
  },
  {
    "name": "Lâm Đồng",
    "type": "tỉnh",
    "code": "lam-ong"
  },
  {
    "name": "Lạng Sơn",
    "type": "tỉnh",
    "code": "lang-son"
  },
  {
    "name": "Nghệ An",
    "type": "tỉnh",
    "code": "nghe-an"
  },
  {
    "name": "Ninh Bình",
    "type": "tỉnh",
    "code": "ninh-binh"
  },
  {
    "name": "Phú Thọ",
    "type": "tỉnh",
    "code": "phu-tho"
  },
  {
    "name": "Quảng Ngãi",
    "type": "tỉnh",
    "code": "quang-ngai"
  },
  {
    "name": "Quảng Ninh",
    "type": "tỉnh",
    "code": "quang-ninh"
  },
  {
    "name": "Quảng Trị",
    "type": "tỉnh",
    "code": "quang-tri"
  },
  {
    "name": "Sơn La",
    "type": "tỉnh",
    "code": "son-la"
  },
  {
    "name": "Thanh Hóa",
    "type": "tỉnh",
    "code": "thanh-hoa"
  },
  {
    "name": "Thái Nguyên",
    "type": "tỉnh",
    "code": "thai-nguyen"
  },
  {
    "name": "Tuyên Quang",
    "type": "tỉnh",
    "code": "tuyen-quang"
  },
  {
    "name": "Tây Ninh",
    "type": "tỉnh",
    "code": "tay-ninh"
  },
  {
    "name": "Vĩnh Long",
    "type": "tỉnh",
    "code": "vinh-long"
  },
  {
    "name": "Điện Biên",
    "type": "tỉnh",
    "code": "ien-bien"
  },
  {
    "name": "Đắk Lắk",
    "type": "tỉnh",
    "code": "ak-lak"
  },
  {
    "name": "Đồng Nai",
    "type": "tỉnh",
    "code": "ong-nai"
  },
  {
    "name": "Đồng Tháp",
    "type": "tỉnh",
    "code": "ong-thap"
  }
]
export function getNameByCode(code: string): string | null {
  const province = provinces.find(p => p.code === code);
  return province ? province.name : null;
}