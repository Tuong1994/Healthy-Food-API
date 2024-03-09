const vn = {
  excel: {
    header: {
      name: 'Tên',
      userName: 'Họ và Tên',
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
      manager: 'Quản lý',
      leader: 'Trưởng bộ phận',
      staff: 'Staff',
      customer: 'Nhân viên',
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
  email: {
    label: {
      customerName: 'Họ và Tên',
      productName: 'Tên sản phẩm',
      phone: 'Điện thoại',
      email: 'Email',
      address: 'Địa chỉ',
      price: 'Đơn giá',
      quantity: 'Số lượng',
      paymentMethods: 'Hình thức thanh toán',
      totalProducts: 'Số lượng sản phẩm',
      shipmentFee: 'Phí vận chuyển',
      tax: 'VAT(10%)',
      totalPrice: 'Tổng giá sản phẩm',
      totalPricePreTax: 'Tổng tiền trước thuế',
      totalPayment: 'Tổng tiền thanh toán',
      received: 'Nhận hàng',
      note: 'Ghi chú',
    },
    common: {
      greeting: 'Gửi',
      content:
        'Trong lúc chờ đợi, vui lòng xác nhận thông tin bên dưới. Nếu có vấn đề gì xin vui lòng liên hệ với chúng tôi qua email này hoặc gọi tới số hotline: 028 3975 3186 để được hỗ trợ tốt nhất. Cảm ơn và chúc một ngày tốt lành.',
    },
    contact: {
      appreciate:
        'Cảm ơn bạn đã liên hệ với chúng tôi, chúng tôi đã nhận được thông tin của bạn. Đội bán hàng sẽ sớm liên hệ với bạn.',
    },
    order: {
      appreciate:
        'Cảm ơn bạn đã mua sản phẩm của chúng tôi, sau khi chuẩn bị hàng xong chúng tôi sẽ liên hệ với bạn.',
      shipment: 'Thông tin vận chuyển',
      general: 'Thông tin chung',
    },
    resetPassword: {
      message:
        'Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu, vui lòng nhấp vào liên kết bên dưới để đặt lại mật khẩu của bạn',
      note: 'Liên kết này chỉ có hiệu lực trong 10 phút',
    },
  },
};

export type VN = typeof vn;

export default vn;
