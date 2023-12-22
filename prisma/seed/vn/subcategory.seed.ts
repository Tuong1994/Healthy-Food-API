import { SubCategory } from '@prisma/client';
import { ELang } from '../../../src/common/enum/base';

const items = [
  { name: 'Sản phẩm tươi', parentId: 'CATE_VN_1' },
  { name: 'Sản phẩm chế biến', parentId: 'CATE_VN_1' },
  { name: 'Nấm', parentId: 'CATE_VN_1' },
  { name: 'Trái cây', parentId: 'CATE_VN_1' },
  { name: 'Gà', parentId: 'CATE_VN_2' },
  { name: 'Heo', parentId: 'CATE_VN_2' },
  { name: 'Bò', parentId: 'CATE_VN_2' },
  { name: 'Trứng', parentId: 'CATE_VN_2' },
  { name: 'Xúc xích & Thịt nguội', parentId: 'CATE_VN_2' },
  { name: 'Nước Suối', parentId: 'CATE_VN_3' },
  { name: 'Nước Ngọt', parentId: 'CATE_VN_3' },
  { name: 'Nước Ép', parentId: 'CATE_VN_3' },
  { name: 'Cà Phê', parentId: 'CATE_VN_3' },
  { name: 'Trà', parentId: 'CATE_VN_3' },
  { name: 'Mì', parentId: 'CATE_VN_4' },
  { name: 'Bột', parentId: 'CATE_VN_4' },
  { name: 'Gạo', parentId: 'CATE_VN_4' },
  { name: 'Đồ Hộp', parentId: 'CATE_VN_4' },
  { name: 'Nông Sản Khô', parentId: 'CATE_VN_4' },
  { name: 'Gia Vị', parentId: 'CATE_VN_5' },
  { name: 'Xốt', parentId: 'CATE_VN_5' },
  { name: 'Dầu Ăn', parentId: 'CATE_VN_5' },
  { name: 'Giấm', parentId: 'CATE_VN_5' },
  { name: 'Bột Nấu Ăn', parentId: 'CATE_VN_5' },
  { name: 'Mật Ong', parentId: 'CATE_VN_5' },
  { name: 'Siro', parentId: 'CATE_VN_5' },
  { name: 'Cá', parentId: 'CATE_VN_6' },
  { name: 'Tôm', parentId: 'CATE_VN_6' },
  { name: 'Mực', parentId: 'CATE_VN_6' },
  { name: 'Nghêu & Ốc', parentId: 'CATE_VN_6' },
  { name: 'Hải sản chế biến', parentId: 'CATE_VN_6' },
  { name: 'Sữa', parentId: 'CATE_VN_7' },
  { name: 'Kem Tươi', parentId: 'CATE_VN_7' },
  { name: 'Bơ', parentId: 'CATE_VN_7' },
  { name: 'Phô Mai', parentId: 'CATE_VN_7' },
  { name: 'Sữa chua', parentId: 'CATE_VN_7' },
  { name: 'Bia lon & Chai', parentId: 'CATE_VN_8' },
  { name: 'Sake & Shochu Nhật', parentId: 'CATE_VN_8' },
];

const subcategories_vn: SubCategory[] = [...items].map((item, idx) => ({
  id: `SUBCATE_VN_${idx + 1}`,
  name: item.name,
  langCode: ELang.VN,
  categoryId: item.parentId,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export default subcategories_vn;
