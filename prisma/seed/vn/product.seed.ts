import { Product } from '@prisma/client';
import { ELang } from 'src/common/enum/base';
import { EInventoryStatus, EProductStatus, EProductUnit } from 'src/modules/product/product.enum';

const items = [
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_1' },

  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_2' },

  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_3' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_4' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_5' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_6' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_7' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_8' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_9' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_10' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_11' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_12' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_13' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_14' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_15' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_16' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_17' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_18' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_19' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_20' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_21' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_22' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_23' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_24' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_25' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_26' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_27' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_28' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_29' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_30' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_31' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_32' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_33' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_34' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_35' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_36' },
  
  { name: 'Bí Ngòi Vàng', totalPrice: 0, subCategoryId: 'SUBCATE_37' },
  
];

const products_vn: Product[] = [...items].map((item, idx) => ({
  id: `P_${idx + 1}`,
  name: item.name,
  inventory: 10000,
  costPrice: 0,
  profit: 0,
  totalPrice: item.totalPrice,
  subCategoryId: item.subCategoryId,
  unit: EProductUnit.KG,
  status: EProductStatus.ACTIVE,
  inventoryStatus: EInventoryStatus.IN_STOCK,
  langCode: ELang.VN,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

export default products_vn;
