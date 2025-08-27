import { CartItem } from "@prisma/client";

export type CartItems = Array<Omit<CartItem, 'createdAt' | 'updatedAt'>>;