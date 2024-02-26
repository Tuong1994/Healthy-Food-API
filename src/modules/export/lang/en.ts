const en = {
  excel: {
    header: {
      name: 'Name',
      customerName: 'Full name',
      phone: 'Phone',
      email: 'Email',
      gender: 'Gender',
      birthday: 'Birthday',
      address: 'Address',
      role: 'Role',
      image: 'Image',
      productName: 'Name',
      quantity: 'Quantity',
      price: 'Price',
      orderNumber: 'Order number',
      customer: 'Customer',
      status: 'Status',
      paymentStatus: 'Payment status',
      paymentMethod: 'Payment method',
      receivedType: 'Received method',
      origin: 'Origin',
      unit: 'Unit',
      inventory: 'Inventory',
      inventoryStatus: 'Inventory status',
      supplier: 'Supplier',
      comment: 'Comment',
      rate: 'Rate',
      shipmentNumber: 'Shipment number',
      totalPayment: 'Total payment',
      category: 'Category',
      createdAt: 'Created date',
      updatedAt: 'Updated date',
    },
    gender: {
      male: 'Male',
      female: 'Female',
    },
    role: {
      superAdmin: 'Super admin',
      admin: 'Admin',
      customer: 'Customer',
    },
    recordStatus: {
      all: 'All',
      draft: 'Draft',
      active: 'Active',
    },
    inventoryStatus: {
      inStock: 'In stock',
      outOfStock: 'Out of stock',
    },
    productOrigin: {
      vn: 'Vietnam',
    },
    productUnit: {
      kg: 'Kg',
      pack: 'Pack',
      box: 'Box',
      bin: 'Bin',
      piece: 'Piece',
      bottle: 'Bottle',
      can: 'Can',
    },
    orderStatus: {
      waitting: 'Waitting',
      delivering: 'Delivering',
      delivered: 'Delivered',
    },
    paymentMethod: {
      transfer: 'Transfer',
      cash: 'Cash',
      cod: 'COD',
    },
    paymentStatus: {
      unPaid: 'Unpaid',
      paid: 'Paid',
    },
    receivedType: {
      store: 'Pickup at store',
      delivery: 'Delivery',
    },
  },
};

export type EN = typeof en;

export default en;
