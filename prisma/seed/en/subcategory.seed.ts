import { SubCategory } from '@prisma/client';
import { ELang } from '../../../src/common/enum/base';

const items = [
  { name: 'Fresh products', parentId: 'CATE_EN_1' }, // 1
  { name: 'Processed products', parentId: 'CATE_EN_1' }, // 2
  { name: 'Mushroom', parentId: 'CATE_EN_1' }, // 3
  { name: 'Fruit', parentId: 'CATE_EN_1' }, // 4

  { name: 'Chicken', parentId: 'CATE_EN_2' }, // 5
  { name: 'Pig', parentId: 'CATE_EN_2' }, // 6
  { name: 'Cow', parentId: 'CATE_EN_2' }, // 7
  { name: 'Egg', parentId: 'CATE_EN_2' }, // 8
  { name: 'Sausage & Ham', parentId: 'CATE_EN_2' }, // 9

  { name: 'Spring Water', parentId: 'CATE_EN_3' }, // 10
  { name: 'Fresh Drink', parentId: 'CATE_EN_3' }, // 11
  { name: 'Juice', parentId: 'CATE_EN_3' }, // 12
  { name: 'Coffee', parentId: 'CATE_EN_3' }, // 13
  { name: 'Tea', parentId: 'CATE_EN_3' }, // 14

  { name: 'Noodles', parentId: 'CATE_EN_4' }, // 15
  { name: 'Powder', parentId: 'CATE_EN_4' }, // 16
  { name: 'Rice', parentId: 'CATE_EN_4' }, // 17
  { name: 'Canned Food', parentId: 'CATE_EN_4' }, // 18
  { name: 'Dried Agricultural Products', parentId: 'CATE_EN_4' }, // 19

  { name: 'Spice', parentId: 'CATE_EN_5' }, // 20
  { name: 'Sauce', parentId: 'CATE_EN_5' }, // 21
  { name: 'Cooking Oil', parentId: 'CATE_EN_5' }, // 22
  { name: 'Vinegar', parentId: 'CATE_EN_5' }, // 23
  { name: 'Cooking Powder', parentId: 'CATE_EN_5' }, // 24
  { name: 'Honey', parentId: 'CATE_EN_5' }, // 25
  { name: 'Siro', parentId: 'CATE_EN_5' }, // 26

  { name: 'Fish', parentId: 'CATE_EN_6' }, // 27
  { name: 'Shrimp', parentId: 'CATE_EN_6' }, // 28
  { name: 'Squid', parentId: 'CATE_EN_6' }, // 29
  { name: 'Clams & Snails', parentId: 'CATE_EN_6' }, // 30
  { name: 'Processed seafood', parentId: 'CATE_EN_6' }, // 31

  { name: 'Milk', parentId: 'CATE_EN_7' }, // 32
  { name: 'Fresh Ice Cream', parentId: 'CATE_EN_7' }, // 33
  { name: 'Avocado', parentId: 'CATE_EN_7' }, // 34
  { name: 'Cheese', parentId: 'CATE_EN_7' }, // 35
  { name: 'Yogurt', parentId: 'CATE_EN_7' }, // 36

  { name: 'Beer Cans & Bottles', parentId: 'CATE_EN_8' }, // 37
  { name: 'Japanese Sake & Shochu', parentId: 'CATE_EN_8' }, // 38
];

const subcategories_en = [...items].map((item, idx) => ({
  id: `SUBCATE_EN_${idx + 1}`,
  name: item.name,
  langCode: ELang.EN,
  categoryId: item.parentId,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export default subcategories_en;
