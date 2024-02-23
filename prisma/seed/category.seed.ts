import { Category } from '@prisma/client';
import { ERecordStatus } from '../../src/common/enum/base';

const items = [
  {
    nameEn: 'Vegetables',
    nameVn: 'Rau củ',
  },
  {
    nameEn: 'Meat',
    nameVn: 'Thịt',
  },
  {
    nameEn: 'Beverages',
    nameVn: 'Đồ uống',
  },
  {
    nameEn: 'Dried food',
    nameVn: 'Đồ khô',
  },
  {
    nameEn: 'Spices',
    nameVn: 'Gia vị',
  },
  {
    nameEn: 'Seafood',
    nameVn: 'Hải sản',
  },
  {
    nameEn: 'Dairy',
    nameVn: 'Bơ sữa',
  },
  {
    nameEn: 'Beer and alcohol',
    nameVn: 'Bia rượu',
  },
];

const categories: Category[] = [...items].map((item, idx) => ({
  id: `CATE_${idx + 1}`,
  nameEn: item.nameEn,
  nameVn: item.nameVn,
  status: ERecordStatus.ACTIVE,
  isDelete: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export default categories;
