import { SubCategory } from '@prisma/client';
import { ERecordStatus } from '../../src/common/enum/base';

const items = [
  {
    nameEn: 'Fresh products',
    nameVn: 'Sản phẩm tươi',
    categoryId: 'CATE_1',
  },
  {
    nameEn: 'Processed products',
    nameVn: 'Sản phẩm chế biến',
    categoryId: 'CATE_1',
  },
  {
    nameEn: 'Mushroom',
    nameVn: 'Nấm',
    categoryId: 'CATE_1',
  },
  {
    nameEn: 'Fruit',
    nameVn: 'Trái cây',
    categoryId: 'CATE_1',
  },
  {
    nameEn: 'Chicken',
    nameVn: 'Gà',
    categoryId: 'CATE_2',
  },
  {
    nameEn: 'Pig',
    nameVn: 'Heo',
    categoryId: 'CATE_2',
  },
  {
    nameEn: 'Cow',
    nameVn: 'Bò',
    categoryId: 'CATE_2',
  },
  {
    nameEn: 'Egg',
    nameVn: 'Trứng',
    categoryId: 'CATE_2',
  },
  {
    nameEn: 'Sausage & Ham',
    nameVn: 'Xúc xích & Thịt nguội',
    categoryId: 'CATE_2',
  },
  {
    nameEn: 'Spring Water',
    nameVn: 'Nước Suối',
    categoryId: 'CATE_3',
  },
  {
    nameEn: 'Fresh Drink',
    nameVn: 'Nước Ngọt',
    categoryId: 'CATE_3',
  },
  {
    nameEn: 'Juice',
    nameVn: 'Nước Ép',
    categoryId: 'CATE_3',
  },
  {
    nameEn: 'Coffee',
    nameVn: 'Cà Phê',
    categoryId: 'CATE_3',
  },
  {
    nameEn: 'Tea',
    nameVn: 'Trà',
    categoryId: 'CATE_3',
  },
  {
    nameEn: 'Noodles',
    nameVn: 'Mì',
    categoryId: 'CATE_4',
  },
  {
    nameEn: 'Powder',
    nameVn: 'Bột',
    categoryId: 'CATE_4',
  },
  {
    nameEn: 'Rice',
    nameVn: 'Gạo',
    categoryId: 'CATE_4',
  },
  {
    nameEn: 'Canned Food',
    nameVn: 'Đồ Hộp',
    categoryId: 'CATE_4',
  },
  {
    nameEn: 'Dried Agricultural Products',
    nameVn: 'Nông Sản Khô',
    categoryId: 'CATE_4',
  },
  {
    nameEn: 'Spice',
    nameVn: 'Gia Vị',
    categoryId: 'CATE_5',
  },
  {
    nameEn: 'Sauce',
    nameVn: 'Xốt',
    categoryId: 'CATE_5',
  },
  {
    nameEn: 'Cooking Oil',
    nameVn: 'Dầu Ăn',
    categoryId: 'CATE_5',
  },
  {
    nameEn: 'Vinegar',
    nameVn: 'Giấm',
    categoryId: 'CATE_5',
  },
  {
    nameEn: 'Cooking Powder',
    nameVn: 'Bột Nấu Ăn',
    categoryId: 'CATE_5',
  },
  {
    nameEn: 'Honey',
    nameVn: 'Mật Ong',
    categoryId: 'CATE_5',
  },
  {
    nameEn: 'Siro',
    nameVn: 'Siro',
    categoryId: 'CATE_5',
  },
  {
    nameEn: 'Fish',
    nameVn: 'Cá',
    categoryId: 'CATE_6',
  },
  {
    nameEn: 'Shrimp',
    nameVn: 'Tôm',
    categoryId: 'CATE_6',
  },
  {
    nameEn: 'Squid',
    nameVn: 'Mực',
    categoryId: 'CATE_6',
  },
  {
    nameEn: 'Clams & Snails',
    nameVn: 'Nghêu & Ốc',
    categoryId: 'CATE_6',
  },
  {
    nameEn: 'Processed seafood',
    nameVn: 'Hải sản chế biến',
    categoryId: 'CATE_6',
  },
  {
    nameEn: 'Milk',
    nameVn: 'Sữa',
    categoryId: 'CATE_7',
  },
  {
    nameEn: 'Fresh Ice Cream',
    nameVn: 'Kem Tươi',
    categoryId: 'CATE_7',
  },
  {
    nameEn: 'Avocado',
    nameVn: 'Bơ',
    categoryId: 'CATE_7',
  },
  {
    nameEn: 'Cheese',
    nameVn: 'Phô Mai',
    categoryId: 'CATE_7',
  },
  {
    nameEn: 'Yogurt',
    nameVn: 'Sữa chua',
    categoryId: 'CATE_7',
  },
  {
    nameEn: 'Beer Cans & Bottles',
    nameVn: 'Bia lon & Chai',
    categoryId: 'CATE_8',
  },
  {
    nameEn: 'Japanese Sake & Shochu',
    nameVn: 'Sake & Shochu Nhật',
    categoryId: 'CATE_8',
  },
];

const subcategories: SubCategory[] = [...items].map((item, idx) => ({
  id: `SUBCATE_${idx + 1}`,
  nameEn: item.nameEn,
  nameVn: item.nameVn,
  categoryId: item.categoryId,
  status: ERecordStatus.ACTIVE,
  isDelete: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export default subcategories;
