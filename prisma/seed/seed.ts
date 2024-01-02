import { PrismaClient } from '@prisma/client';
import products from './product.seed';
import subcategories from './subcategory.seed';
import categories from './category.seed';
import cities from './city.seed';
import districts from './district.seed';
import wards from './ward.seed';
import customers from './customer.seed';
import customerAddresses from './customer-address.seed';

const prisma = new PrismaClient();

const main = async () => {
  await prisma.customer.createMany({ data: customers });
  await prisma.customerAddress.createMany({ data: customerAddresses });
  await prisma.category.createMany({ data: categories });
  await prisma.subCategory.createMany({ data: subcategories });
  await prisma.product.createMany({ data: products });
  await prisma.city.createMany({ data: cities });
  await prisma.district.createMany({ data: districts });
  await prisma.ward.createMany({ data: wards });
};

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.log(error);
    prisma.$disconnect();
  })
  .finally(() => prisma.$disconnect());
