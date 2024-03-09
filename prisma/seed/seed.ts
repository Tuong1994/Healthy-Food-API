import { PrismaClient } from '@prisma/client';
import users from './user.seed';
import userAddresses from './user-address.seed';
import userPermissions from './user-permission';
import products from './product.seed';
import subcategories from './subcategory.seed';
import categories from './category.seed';
import orders from './order.seed';
import orderItems from './order-item.seed';
import shipments from './shipment.seed';
import cities from './city.seed';
import districts from './district.seed';
import wards from './ward.seed';
import comments from './comment.seed';

const prisma = new PrismaClient();

const main = async () => {
  await prisma.user.createMany({ data: users });
  await prisma.userAddress.createMany({ data: userAddresses });
  await prisma.userPermission.createMany({ data: userPermissions });
  await prisma.category.createMany({ data: categories });
  await prisma.subCategory.createMany({ data: subcategories });
  await prisma.product.createMany({ data: products });
  await prisma.order.createMany({ data: orders });
  await prisma.orderItem.createMany({ data: orderItems });
  await prisma.shipment.createMany({ data: shipments });
  await prisma.city.createMany({ data: cities });
  await prisma.district.createMany({ data: districts });
  await prisma.ward.createMany({ data: wards });
  await prisma.comment.createMany({ data: comments });
};

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    console.log(error);
    prisma.$disconnect();
  })
  .finally(() => prisma.$disconnect());
