import { SubCategory } from '@prisma/client';
import { ELang } from 'src/common/enum/base';

const items = [
  { name: 'Fresh products', parentId: 'CATE_1' },
  { name: 'Processed products', parentId: 'CATE_1' },
  { name: 'Mushroom', parentId: 'CATE_1' },
  { name: 'Fruit', parentId: 'CATE_1' },
  { name: 'Chicken', parentId: 'CATE_2' },
  { name: 'Pig', parentId: 'CATE_2' },
  { name: 'Cow', parentId: 'CATE_2' },
  { name: 'Egg', parentId: 'CATE_2' },
  { name: 'Sausage & Ham', parentId: 'CATE_2' },
  { name: 'Spring Water', parentId: 'CATE_3' },
  { name: 'Fresh Drink', parentId: 'CATE_3' },
  { name: 'Juice', parentId: 'CATE_3' },
  { name: 'Coffee', parentId: 'CATE_3' },
  { name: 'Noodles', parentId: 'CATE_4' },
  { name: 'Powder', parentId: 'CATE_4' },
  { name: 'Rice', parentId: 'CATE_4' },
  { name: 'Canned Food', parentId: 'CATE_4' },
  { name: 'Dried Agricultural Products', parentId: 'CATE_4' },
  { name: 'Spice', parentId: 'CATE_5' },
  { name: 'Sauce', parentId: 'CATE_5' },
  { name: 'Cooking Oil', parentId: 'CATE_5' },
  { name: 'Vinegar', parentId: 'CATE_5' },
  { name: 'Cooking Powder', parentId: 'CATE_5' },
  { name: 'Honey', parentId: 'CATE_5' },
  { name: 'Siro', parentId: 'CATE_5' },
  { name: 'Fish', parentId: 'CATE_6' },
  { name: 'Shrimp', parentId: 'CATE_6' },
  { name: 'Squid', parentId: 'CATE_6' },
  { name: 'Clams & Snails', parentId: 'CATE_6' },
  { name: 'Processed seafood', parentId: 'CATE_6' },
  { name: 'Milk', parentId: 'CATE_7' },
  { name: 'Fresh Ice Cream', parentId: 'CATE_7' },
  { name: 'Avocado', parentId: 'CATE_7' },
  { name: 'Cheese', parentId: 'CATE_7' },
  { name: 'Yogurt', parentId: 'CATE_7' },
  { name: 'Beer Cans & Bottles', parentId: 'CATE_8' },
  { name: 'Japanese Sake & Shochu', parentId: 'CATE_8' },
];

const subcategories_en: SubCategory[] = [...items].map((item, idx) => ({
  id: `SUBCATE_${idx + 1}`,
  name: item.name,
  langCode: ELang.EN,
  categoryId: item.parentId,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export default subcategories_en;
