import { City } from '@prisma/client';
import { ELang } from 'src/common/enum/base';

const items = [
  {
    name: 'Hanoi City',
    code: 1,
    division_type: 'Central City',
    codename: 'thanh_pho_ha_noi',
    phone_code: 24,
  },
  {
    name: 'Ha Giang Province',
    code: 2,
    division_type: 'Province',
    codename: 'tinh_ha_giang',
    phone_code: 219,
  },
  {
    name: 'Cao Bang Province',
    code: 4,
    division_type: 'Province',
    codename: 'tinh_cao_bang',
    phone_code: 206,
  },
  {
    name: 'Bac Kan Province',
    code: 6,
    division_type: 'Province',
    codename: 'tinh_bac_kan',
    phone_code: 209,
  },
  {
    name: 'Tuyen Quang Province',
    code: 8,
    division_type: 'Province',
    codename: 'tinh_tuyen_quang',
    phone_code: 207,
  },
  {
    name: 'Lao Cai Province',
    code: 10,
    division_type: 'Province',
    codename: 'tinh_lao_cai',
    phone_code: 214,
  },
  {
    name: 'Dien Bien Province',
    code: 11,
    division_type: 'Province',
    codename: 'tinh_dien_bien',
    phone_code: 215,
  },
  {
    name: 'Lai Chau Province',
    code: 12,
    division_type: 'Province',
    codename: 'tinh_lai_chau',
    phone_code: 213,
  },
  {
    name: 'Son La Province',
    code: 14,
    division_type: 'Province',
    codename: 'tinh_son_la',
    phone_code: 212,
  },
  {
    name: 'Yen Bai Province',
    code: 15,
    division_type: 'Province',
    codename: 'tinh_yen_bai',
    phone_code: 216,
  },
  {
    name: 'Hoa Binh Province',
    code: 17,
    division_type: 'Province',
    codename: 'tinh_hoa_binh',
    phone_code: 218,
  },
  {
    name: 'Thai Nguyen Province',
    code: 19,
    division_type: 'Province',
    codename: 'tinh_thai_nguyen',
    phone_code: 208,
  },
  {
    name: 'Lang Son Province',
    code: 20,
    division_type: 'Province',
    codename: 'tinh_lang_son',
    phone_code: 205,
  },
  {
    name: 'Quang Ninh Province',
    code: 22,
    division_type: 'Province',
    codename: 'tinh_quang_ninh',
    phone_code: 203,
  },
  {
    name: 'Bac Giang Province',
    code: 24,
    division_type: 'Province',
    codename: 'tinh_bac_giang',
    phone_code: 204,
  },
  {
    name: 'Phu Tho Province',
    code: 25,
    division_type: 'Province',
    codename: 'tinh_phu_tho',
    phone_code: 210,
  },
  {
    name: 'Vinh Phuc Province',
    code: 26,
    division_type: 'Province',
    codename: 'tinh_vinh_phuc',
    phone_code: 211,
  },
  {
    name: 'Bac Ninh Province',
    code: 27,
    division_type: 'Province',
    codename: 'tinh_bac_ninh',
    phone_code: 222,
  },
  {
    name: 'Hai Duong Province',
    code: 30,
    division_type: 'Province',
    codename: 'tinh_hai_duong',
    phone_code: 220,
  },
  {
    name: 'Hai Phong City',
    code: 31,
    division_type: 'Central City',
    codename: 'thanh_pho_hai_phong',
    phone_code: 225,
  },
  {
    name: 'Hung Yen Province',
    code: 33,
    division_type: 'Province',
    codename: 'tinh_hung_yen',
    phone_code: 221,
  },
  {
    name: 'Thai Binh Province',
    code: 34,
    division_type: 'Province',
    codename: 'tinh_thai_binh',
    phone_code: 227,
  },
  {
    name: 'Ha Nam Province',
    code: 35,
    division_type: 'Province',
    codename: 'tinh_ha_nam',
    phone_code: 226,
  },
  {
    name: 'Nam Dinh Province',
    code: 36,
    division_type: 'Province',
    codename: 'tinh_nam_dinh',
    phone_code: 228,
  },
  {
    name: 'Ninh Binh Province',
    code: 37,
    division_type: 'Province',
    codename: 'tinh_ninh_binh',
    phone_code: 229,
  },
  {
    name: 'Thanh Hoa Province',
    code: 38,
    division_type: 'Province',
    codename: 'tinh_thanh_hoa',
    phone_code: 237,
  },
  {
    name: 'Nghe An Province',
    code: 40,
    division_type: 'Province',
    codename: 'tinh_nghe_an',
    phone_code: 238,
  },
  {
    name: 'Ha Tinh Province',
    code: 42,
    division_type: 'Province',
    codename: 'tinh_ha_tinh',
    phone_code: 239,
  },
  {
    name: 'Quang Binh Province',
    code: 44,
    division_type: 'Province',
    codename: 'tinh_quang_binh',
    phone_code: 232,
  },
  {
    name: 'Quang Tri Province',
    code: 45,
    division_type: 'Province',
    codename: 'tinh_quang_tri',
    phone_code: 233,
  },
  {
    name: 'Thua Thien Hue Province',
    code: 46,
    division_type: 'Province',
    codename: 'tinh_thua_thien_hue',
    phone_code: 234,
  },
  {
    name: 'Da Nang City',
    code: 48,
    division_type: 'Central City',
    codename: 'thanh_pho_da_nang',
    phone_code: 236,
  },
  {
    name: 'Quang Nam Province',
    code: 49,
    division_type: 'Province',
    codename: 'tinh_quang_nam',
    phone_code: 235,
  },
  {
    name: 'Quang Ngai Province',
    code: 51,
    division_type: 'Province',
    codename: 'tinh_quang_ngai',
    phone_code: 255,
  },
  {
    name: 'Binh Dinh Province',
    code: 52,
    division_type: 'Province',
    codename: 'tinh_binh_dinh',
    phone_code: 256,
  },
  {
    name: 'Phu Yen Province',
    code: 54,
    division_type: 'Province',
    codename: 'tinh_phu_yen',
    phone_code: 257,
  },
  {
    name: 'Khanh Hoa Province',
    code: 56,
    division_type: 'Province',
    codename: 'tinh_khanh_hoa',
    phone_code: 258,
  },
  {
    name: 'Ninh Thuan Province',
    code: 58,
    division_type: 'Province',
    codename: 'tinh_ninh_thuan',
    phone_code: 259,
  },
  {
    name: 'Binh Thuan Province',
    code: 60,
    division_type: 'Province',
    codename: 'tinh_binh_thuan',
    phone_code: 252,
  },
  {
    name: 'Kon Tum Province',
    code: 62,
    division_type: 'Province',
    codename: 'tinh_kon_tum',
    phone_code: 260,
  },
  {
    name: 'Gia Lai Province',
    code: 64,
    division_type: 'Province',
    codename: 'tinh_gia_lai',
    phone_code: 269,
  },
  {
    name: 'Dak Lak Province',
    code: 66,
    division_type: 'Province',
    codename: 'tinh_dak_lak',
    phone_code: 262,
  },
  {
    name: 'Dak Nong Province',
    code: 67,
    division_type: 'Province',
    codename: 'tinh_dak_nong',
    phone_code: 261,
  },
  {
    name: 'Lam Dong Province',
    code: 68,
    division_type: 'Province',
    codename: 'tinh_lam_dong',
    phone_code: 263,
  },

  {
    name: 'Binh Phuoc Province',
    code: 70,
    division_type: 'Province',
    codename: 'tinh_binh_phuoc',
    phone_code: 271,
  },
  {
    name: 'Tay Ninh Province',
    code: 72,
    division_type: 'Province',
    codename: 'tinh_tay_ninh',
    phone_code: 276,
  },
  {
    name: 'Binh Duong Province',
    code: 74,
    division_type: 'Province',
    codename: 'tinh_binh_duong',
    phone_code: 274,
  },
  {
    name: 'Dong Nai Province',
    code: 75,
    division_type: 'Province',
    codename: 'tinh_dong_nai',
    phone_code: 251,
  },
  {
    name: 'Ba Ria - Vung Tau Province',
    code: 77,
    division_type: 'Province',
    codename: 'tinh_ba_ria_vung_tau',
    phone_code: 254,
  },
  {
    name: 'Ho Chi Minh City',
    code: 79,
    division_type: 'Central City',
    codename: 'thanh_pho_ho_chi_minh',
    phone_code: 28,
  },
  {
    name: 'Long An Province',
    code: 80,
    division_type: 'Province',
    codename: 'tinh_long_an',
    phone_code: 272,
  },
  {
    name: 'Tien Giang Province',
    code: 82,
    division_type: 'Province',
    codename: 'tinh_tien_giang',
    phone_code: 273,
  },
  {
    name: 'Ben Tre Province',
    code: 83,
    division_type: 'Province',
    codename: 'tinh_ben_tre',
    phone_code: 275,
  },
  {
    name: 'Tra Vinh Province',
    code: 84,
    division_type: 'Province',
    codename: 'tinh_tra_vinh',
    phone_code: 294,
  },
  {
    name: 'Vinh Long Province',
    code: 86,
    division_type: 'Province',
    codename: 'tinh_vinh_long',
    phone_code: 270,
  },
  {
    name: 'Dong Thap Province',
    code: 87,
    division_type: 'Province',
    codename: 'tinh_dong_thap',
    phone_code: 277,
  },
  {
    name: 'An Giang Province',
    code: 89,
    division_type: 'Province',
    codename: 'tinh_an_giang',
    phone_code: 296,
  },
  {
    name: 'Kien Giang Province',
    code: 91,
    division_type: 'Province',
    codename: 'tinh_kien_giang',
    phone_code: 297,
  },
  {
    name: 'Can Tho City',
    code: 92,
    division_type: 'Central City',
    codename: 'thanh_pho_can_tho',
    phone_code: 292,
  },
  {
    name: 'Hau Giang Province',
    code: 93,
    division_type: 'Province',
    codename: 'tinh_hau_giang',
    phone_code: 293,
  },
  {
    name: 'Soc Trang Province',
    code: 94,
    division_type: 'Province',
    codename: 'tinh_soc_trang',
    phone_code: 299,
  },
  {
    name: 'Bac Lieu Province',
    code: 95,
    division_type: 'Province',
    codename: 'tinh_bac_lieu',
    phone_code: 291,
  },
  {
    name: 'Ca Mau Province',
    code: 96,
    division_type: 'Province',
    codename: 'tinh_ca_mau',
    phone_code: 290,
  },
];

const covertItems = [...items].map(({ name, code }) => ({ name, code }));

const city_en: City[] = [...covertItems].map((item, idx) => ({
  id: `CITY_${idx}`,
  name: item.name,
  code: item.code,
  langCode: ELang.EN,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export default city_en;