import { Shipment } from '@prisma/client';

const shipments: Shipment[] = [
  {
    id: 'SH_1',
    shipmentNumber: `S_${Date.now()}`,
    fullName: 'Jack Williams',
    phone: '0793229970',
    email: 'jack@example.com',
    address: '79/24/13 Au Co Str, Ward 14, District 11 HCMC',
    orderId: 'O_2',
    isDelete: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'SH_2',
    shipmentNumber: `S_${Date.now()}`,
    fullName: 'Kevin Kowalski',
    phone: '0793886681',
    email: 'kevin@example.com',
    address: '79 Lanh Binh Thang Str, Ward 14, District 11 HCMC',
    orderId: 'O_1',
    isDelete: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'SH_3',
    shipmentNumber: `S_${Date.now()}`,
    fullName: 'Claire Redfield',
    phone: '0593114491',
    email: 'claire@example.com',
    address: '79/24/13 Au Co Str, Ward 14, District 11 HCMC',
    orderId: 'O_3',
    isDelete: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default shipments