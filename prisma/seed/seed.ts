import { PrismaClient } from '@prisma/client';
import categories_vn from './vn/category.seed';
import categories_en from './en/category.seed';
import subcategories_en from './en/subcategory.seed';
import subcategories_vn from './vn/subcategory.seed';

const prisma = new PrismaClient();

const main = async () => {
  await prisma.category.createMany({ data: categories_en });
  await prisma.category.createMany({ data: categories_vn });
  await prisma.subCategory.createMany({ data: subcategories_en });
  await prisma.subCategory.createMany({ data: subcategories_vn });
};

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.log(error);
    prisma.$disconnect();
  })
  .finally(() => prisma.$disconnect());
