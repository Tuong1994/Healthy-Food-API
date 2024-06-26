import { EInventoryStatus, EProductOrigin, EProductUnit } from 'src/modules/product/product.enum';
import { ELang, ERecordStatus, ERole } from '../enum/base';
import { EGender } from 'src/modules/user/user.enum';
import {
  EOrderPaymentStatus,
  EOrderPaymentMethod,
  EOrderStatus,
  EReceivedType,
} from 'src/modules/order/order.enum';

export class QueryDto {
  page?: string;
  limit?: string;
  keywords?: string;
  sortBy?: number;

  ids?: string;
  userId?: string;
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
  cityCode?: number;
  districtCode?: number;

  hasSub?: boolean;
  hasCate?: boolean;
  hasLike?: boolean;
  staffOnly?: boolean
  convertLang?: boolean;
  admin?: boolean;

  role?: ERole;
  gender?: EGender;
  langCode?: ELang;
  cateStatus?: ERecordStatus;
  subCateStatus?: ERecordStatus;
  productStatus?: ERecordStatus;
  productUnit?: EProductUnit;
  inventoryStatus?: EInventoryStatus;
  origin?: EProductOrigin;
  orderStatus?: EOrderStatus;
  paymentMethod?: EOrderPaymentMethod;
  paymentStatus?: EOrderPaymentStatus;
  receivedType?: EReceivedType;
}
