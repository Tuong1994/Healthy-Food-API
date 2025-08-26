import { Prisma } from '@prisma/client';

export type SubCategoryWithPayload = Prisma.SubCategoryGetPayload<{
  select: { id: true; nameEn: true; nameVn: true; image: true; category: true };
}>;
