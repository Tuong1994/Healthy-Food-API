import { Prisma } from '@prisma/client';

export type ProductWithPayload = Prisma.ProductGetPayload<{
  select: { id: true; image: true; comments: true; rates: true; likes: true };
}>;
