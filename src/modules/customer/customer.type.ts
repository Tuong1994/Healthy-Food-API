import { Customer } from "@prisma/client";

export type CustomerResponse = Omit<Customer, 'password' | 'isDelete'>