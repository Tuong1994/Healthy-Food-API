import { PrismaClient } from '@prisma/client';
import categories_vn from './vn/category.seed';
import categories_en from './en/category.seed';
import subcategories_en from './en/subcategory.seed';
import subcategories_vn from './vn/subcategory.seed';
import products_en from './en/product.seed';
import products_vn from './vn/product.seed';
import city_en from './en/city.seed';
import city_vn from './vn/city.seed';
import districts_en from './en/district.seed';
import districts_vn from './vn/district.seed';
import wards_en from './en/ward.seed';
import wards_vn from './vn/ward.seed';

const prisma = new PrismaClient();

const main = async () => {
  await prisma.category.createMany({ data: categories_en });
  await prisma.category.createMany({ data: categories_vn });
  await prisma.subCategory.createMany({ data: subcategories_en });
  await prisma.subCategory.createMany({ data: subcategories_vn });
  await prisma.product.createMany({ data: products_en });
  await prisma.product.createMany({ data: products_vn });
  await prisma.city.createMany({ data: city_en });
  await prisma.city.createMany({ data: city_vn });
  await prisma.district.createMany({ data: districts_en });
  await prisma.district.createMany({ data: districts_vn });
  await prisma.ward.createMany({ data: wards_en });
  await prisma.ward.createMany({ data: wards_vn });
};

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.log(error);
    prisma.$disconnect();
  })
  .finally(() => prisma.$disconnect());
