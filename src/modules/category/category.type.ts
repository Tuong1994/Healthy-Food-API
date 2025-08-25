import { Prisma } from '@prisma/client';

export type CategoryWithPayload = Prisma.CategoryGetPayload<{
  select: { id: true; nameEn: true; nameVn: true; subCategories: true };
}>;
