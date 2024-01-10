import { EInventoryStatus, EProductOrigin, EProductStatus } from 'src/modules/product/product.enum';
import { ELang, ERole } from '../enum/base';
import { EGender } from 'src/modules/customer/customer.enum';
import { EOrderPaymentStatus, EOrderPaymentMethod, EOrderStatus } from 'src/modules/order/order.enum';

export class QueryDto {
  page?: string;
  limit?: string;
  keywords?: string;
  sortBy?: number;

  ids?: string;
  customerId?: string;
  categoryId?: string;
  subCategoryId?: string;
  productId?: string;
  cartId?: string;
  cartItemId?: string;
  orderId?: string;
  orderItemId?: string;
  shipmentId?: string;
  commentId?: string;
  rateId?: string;
  likeId?: string;
  imageId?: string;
  cityId?: string;
  districtId?: string;
  wardId?: string;

  gender?: EGender;
  cityCode?: number;
  districtCode?: number;
  hasSub?: boolean;

  role?: ERole;
  langCode?: ELang;
  productStatus?: EProductStatus;
  inventoryStatus?: EInventoryStatus;
  origin?: EProductOrigin;
  orderStatus?: EOrderStatus;
  paymentMethod?: EOrderPaymentMethod;
  paymentStatus?: EOrderPaymentStatus;
}
