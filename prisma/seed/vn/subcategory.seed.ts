import { SubCategory } from '@prisma/client';
import { ELang } from '../../../src/common/enum/base';

const items = [
  { name: 'Sản phẩm tươi', parentId: 'CATE_VN_1' }, // 1
  { name: 'Sản phẩm chế biến', parentId: 'CATE_VN_1' }, // 2
  { name: 'Nấm', parentId: 'CATE_VN_1' }, // 3
  { name: 'Trái cây', parentId: 'CATE_VN_1' }, // 4

  { name: 'Gà', parentId: 'CATE_VN_2' }, // 5
  { name: 'Heo', parentId: 'CATE_VN_2' }, // 6
  { name: 'Bò', parentId: 'CATE_VN_2' }, // 7
  { name: 'Trứng', parentId: 'CATE_VN_2' }, // 8
  { name: 'Xúc xích & Thịt nguội', parentId: 'CATE_VN_2' }, // 9

  { name: 'Nước Suối', parentId: 'CATE_VN_3' }, // 10
  { name: 'Nước Ngọt', parentId: 'CATE_VN_3' }, // 11
  { name: 'Nước Ép', parentId: 'CATE_VN_3' }, // 12
  { name: 'Cà Phê', parentId: 'CATE_VN_3' }, // 13
  { name: 'Trà', parentId: 'CATE_VN_3' }, // 14

  { name: 'Mì', parentId: 'CATE_VN_4' }, // 15
  { name: 'Bột', parentId: 'CATE_VN_4' }, // 16
  { name: 'Gạo', parentId: 'CATE_VN_4' }, // 17
  { name: 'Đồ Hộp', parentId: 'CATE_VN_4' }, // 18
  { name: 'Nông Sản Khô', parentId: 'CATE_VN_4' }, // 19

  { name: 'Gia Vị', parentId: 'CATE_VN_5' }, // 20
  { name: 'Xốt', parentId: 'CATE_VN_5' }, // 21
  { name: 'Dầu Ăn', parentId: 'CATE_VN_5' }, // 22
  { name: 'Giấm', parentId: 'CATE_VN_5' }, // 23
  { name: 'Bột Nấu Ăn', parentId: 'CATE_VN_5' }, // 24
  { name: 'Mật Ong', parentId: 'CATE_VN_5' }, // 25
  { name: 'Siro', parentId: 'CATE_VN_5' }, // 26

  { name: 'Cá', parentId: 'CATE_VN_6' }, // 27
  { name: 'Tôm', parentId: 'CATE_VN_6' }, // 28
  { name: 'Mực', parentId: 'CATE_VN_6' }, // 29
  { name: 'Nghêu & Ốc', parentId: 'CATE_VN_6' }, // 30
  { name: 'Hải sản chế biến', parentId: 'CATE_VN_6' }, // 31

  { name: 'Sữa', parentId: 'CATE_VN_7' }, // 32
  { name: 'Kem Tươi', parentId: 'CATE_VN_7' }, // 33
  { name: 'Bơ', parentId: 'CATE_VN_7' }, // 34
  { name: 'Phô Mai', parentId: 'CATE_VN_7' }, // 35
  { name: 'Sữa chua', parentId: 'CATE_VN_7' }, // 36

  { name: 'Bia lon & Chai', parentId: 'CATE_VN_8' }, // 37
  { name: 'Sake & Shochu Nhật', parentId: 'CATE_VN_8' }, // 38
];

const subcategories_vn = [...items].map((item, idx) => ({
  id: `SUBCATE_VN_${idx + 1}`,
  name: item.name,
  langCode: ELang.VN,
  categoryId: item.parentId,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export default subcategories_vn;
