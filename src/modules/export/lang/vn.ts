const vn = {
  excel: {
    header: {
      name: 'Tên',
      customerName: 'Họ và Tên',
      phone: 'Điện thoại',
      email: 'Email',
      gender: 'Giới tính',
      birthday: 'Ngày sinh',
      address: 'Địa chỉ',
      role: 'Vai trò',
      image: 'Hình ảnh',
      productName: 'Tên sản phẩm',
      quantity: 'Số lượng',
      costPrice: 'Giá gốc',
      profit: 'Lợi nhuận',
      price: 'Đơn giá',
      orderNumber: 'Mã đơn hàng',
      customer: 'Khách hàng',
      status: 'Trạng thái',
      paymentStatus: 'Tình trạng thanh toán',
      paymentMethod: 'Phương thức thanh toán',
      receivedType: 'Phương thức nhận hàng',
      unit: 'Đơn vị',
      origin: 'Xuất xứ',
      inventory: 'Hàng tồn kho',
      inventoryStatus: 'Tình trạng tồn kho',
      supplier: 'Nhà cung cấp',
      comment: 'Bình luận',
      rate: 'Đánh giá',
      shipmentFee: 'Phí vận chuyển',
      shipmentNumber: 'Mã vận chuyển',
      totalPayment: 'Tổng tiền thanh toán',
      products: 'Số lượng sản phẩm',
      category: 'Danh mục',
      subCategory: 'Danh mục phụ',
      createdAt: 'Ngày tạo',
      updatedAt: 'Ngày cập nhật',
    },
    gender: {
      male: 'Nam',
      female: 'Nữ',
    },
    role: {
      superAdmin: 'Quản trị cấp cao',
      admin: 'Quản trị',
      customer: 'Khách hàng',
    },
    recordStatus: {
      all: 'Tất cả',
      draft: 'Bản nháp',
      active: 'Kích hoạt',
    },
    inventoryStatus: {
      inStock: 'Còn hàng',
      outOfStock: 'Hết hàng',
    },
    productOrigin: {
      vn: 'Việt Nam',
    },
    productUnit: {
      kg: 'Kg',
      pack: 'Gói',
      box: 'Hộp',
      bin: 'Thùng',
      piece: 'Cái',
      bottle: 'Chai',
      can: 'Lon',
    },
    orderStatus: {
      waitting: 'Đang chờ',
      delivering: 'Đang giao',
      delivered: 'Đã giao',
    },
    paymentMethod: {
      transfer: 'Chuyển khoản',
      cash: 'Tiền mặt',
      cod: 'COD',
    },
    paymentStatus: {
      unPaid: 'Chưa thanh toán',
      paid: 'Đã thanh toán',
    },
    receivedType: {
      store: 'Nhận hàng tại cửa hàng',
      delivery: 'Giao nhận',
    },
    others: {
      none: 'Không có',
    },
  },
};

export type VN = typeof vn;

export default vn;
