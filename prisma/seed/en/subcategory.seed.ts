import { SubCategory } from '@prisma/client';
import { ELang } from '../../../src/common/enum/base';

const items = [
  { name: 'Fresh products', parentId: 'CATE_EN_1' },
  { name: 'Processed products', parentId: 'CATE_EN_1' },
  { name: 'Mushroom', parentId: 'CATE_EN_1' },
  { name: 'Fruit', parentId: 'CATE_EN_1' },
  { name: 'Chicken', parentId: 'CATE_EN_2' },
  { name: 'Pig', parentId: 'CATE_EN_2' },
  { name: 'Cow', parentId: 'CATE_EN_2' },
  { name: 'Egg', parentId: 'CATE_EN_2' },
  { name: 'Sausage & Ham', parentId: 'CATE_EN_2' },
  { name: 'Spring Water', parentId: 'CATE_EN_3' },
  { name: 'Fresh Drink', parentId: 'CATE_EN_3' },
  { name: 'Juice', parentId: 'CATE_EN_3' },
  { name: 'Coffee', parentId: 'CATE_EN_3' },
  { name: 'Tea', parentId: 'CATE_EN_3' },
  { name: 'Noodles', parentId: 'CATE_EN_4' },
  { name: 'Powder', parentId: 'CATE_EN_4' },
  { name: 'Rice', parentId: 'CATE_EN_4' },
  { name: 'Canned Food', parentId: 'CATE_EN_4' },
  { name: 'Dried Agricultural Products', parentId: 'CATE_EN_4' },
  { name: 'Spice', parentId: 'CATE_EN_5' },
  { name: 'Sauce', parentId: 'CATE_EN_5' },
  { name: 'Cooking Oil', parentId: 'CATE_EN_5' },
  { name: 'Vinegar', parentId: 'CATE_EN_5' },
  { name: 'Cooking Powder', parentId: 'CATE_EN_5' },
  { name: 'Honey', parentId: 'CATE_EN_5' },
  { name: 'Siro', parentId: 'CATE_EN_5' },
  { name: 'Fish', parentId: 'CATE_EN_6' },
  { name: 'Shrimp', parentId: 'CATE_EN_6' },
  { name: 'Squid', parentId: 'CATE_EN_6' },
  { name: 'Clams & Snails', parentId: 'CATE_EN_6' },
  { name: 'Processed seafood', parentId: 'CATE_EN_6' },
  { name: 'Milk', parentId: 'CATE_EN_7' },
  { name: 'Fresh Ice Cream', parentId: 'CATE_EN_7' },
  { name: 'Avocado', parentId: 'CATE_EN_7' },
  { name: 'Cheese', parentId: 'CATE_EN_7' },
  { name: 'Yogurt', parentId: 'CATE_EN_7' },
  { name: 'Beer Cans & Bottles', parentId: 'CATE_EN_8' },
  { name: 'Japanese Sake & Shochu', parentId: 'CATE_EN_8' },
];

const subcategories_en: SubCategory[] = [...items].map((item, idx) => ({
  id: `SUBCATE_EN_${idx + 1}`,
  name: item.name,
  langCode: ELang.EN,
  categoryId: item.parentId,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export default subcategories_en;
