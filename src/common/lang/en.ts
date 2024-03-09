const en = {
  excel: {
    header: {
      name: 'Name',
      userName: 'Full name',
      phone: 'Phone',
      email: 'Email',
      gender: 'Gender',
      birthday: 'Birthday',
      address: 'Address',
      role: 'Role',
      image: 'Image',
      productName: 'Name',
      quantity: 'Quantity',
      costPrice: 'Cost',
      profit: 'Profit',
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
      shipmentFee: 'Shipment Fee',
      shipmentNumber: 'Shipment number',
      totalPayment: 'Total payment',
      products: 'Products',
      category: 'Category',
      subCategory: 'Sub category',
      createdAt: 'Created date',
      updatedAt: 'Updated date',
    },
    gender: {
      male: 'Male',
      female: 'Female',
    },
    role: {
      manager: 'Manager',
      leader: 'Leader',
      staff: 'Staff',
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
    others: {
      none: 'None',
    },
  },
  email: {
    label: {
      customerName: 'Full name',
      productName: 'Name',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      price: 'Price',
      quantity: 'Quantity',
      paymentMethods: 'Payment methods',
      totalProducts: 'Total products',
      shipmentFee: 'Shipment fee',
      tax: 'VAT(10%)',
      totalPrice: 'Total products price',
      totalPricePreTax: 'Total pre-tax price',
      totalPayment: 'Total payment',
      received: 'Receive goods',
      note: 'Note',
    },
    common: {
      greeting: 'Dear',
      content:
        'In the meanwhile, please confirm the information below. If there any problems please contact us via this email or call the hotline: 028 3975 3186 for the best support. Thank you and have a great day.',
    },
    contact: {
      appreciate:
        'Thank you for contacted us, we have received your infomation. Our sale team will contact to you soon.',
    },
    order: {
      appreciate: 'Thank you for purchasing our products. After preparing the goods, we will contact you.',
      shipment: 'Shipment information',
      general: 'General information',
    },
    resetPassword: {
      message: 'We have received password reset request, please click the link below to reset your password',
      note: 'This link only valid only for 10 minutes',
    },
  },
};

export type EN = typeof en;

export default en;
