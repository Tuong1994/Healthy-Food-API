import { Category } from '@prisma/client';
import { ELang } from 'src/common/enum/base';

const items = ['Rau củ', 'Thịt', 'Đồ uống', 'Đồ khô', 'Gia vị', 'Hải sản', 'Bơ sữa', 'Bia rượu'];

const categories_vn: Category[] = [...items].map((item, idx) => ({
  id: `CATE_${idx + 1}`,
  name: item,
  langCode: ELang.VN,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export default categories_vn;
