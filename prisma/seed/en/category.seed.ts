import { Category } from '@prisma/client';
import { ELang } from 'src/common/enum/base';

const items = [
  'Vegetables',
  'Meat',
  'Beverages',
  'Dried food',
  'Spices',
  'Seafood',
  'Dairy',
  'Beer and alcohol',
];

const categories_en: Category[] = [...items].map((item, idx) => ({
  id: `CATE_${idx + 1}`,
  name: item,
  langCode: ELang.EN,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export default categories_en;
