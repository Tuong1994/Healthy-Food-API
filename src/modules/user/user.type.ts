import { Prisma, User } from '@prisma/client';

export type UserResponse = Omit<User, 'password' | 'isDelete' | 'resetToken' | 'resetTokenExpires'>;

export type UserWithPayload = Prisma.UserGetPayload<{
  select: { id: true; image: true; address: true; comments: true; rates: true; likes: true };
}>;
