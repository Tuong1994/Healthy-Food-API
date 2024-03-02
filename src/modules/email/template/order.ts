import { ELang } from 'src/common/enum/base';
import { PrismaClient, Product } from '@prisma/client';
import { getPaymentMethod, getReceivedType } from 'src/modules/export/helpers/order';
import { EmailOrderDto } from '../email.dto';
import utils from 'src/utils';

const prisma = new PrismaClient();

export const getEmailOrderTemplate = async (langCode: ELang, data: EmailOrderDto) => {
  const lang = utils.getLang(langCode);
  const { order, items, shipment } = data;

  let products = [];
  await Promise.all(
    items.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { nameEn: true, nameVn: true, totalPrice: true },
      });
      const convertNameProduct = { ...utils.convertRecordsName<Product>(product as Product, langCode) };
      const orderProduct = {
        name: convertNameProduct.name,
        quantity: item.quantity,
        price: convertNameProduct.totalPrice,
      };
      products = [...products, orderProduct];
    }),
  );

  const totalQuantity = products.reduce((total, product) => {
    return (total += product.quantity) || 0;
  }, 0);

  const totalPrice = products.reduce((total, product) => {
    return (total += product.price * product.quantity) || 0;
  }, 0);

  const { paymentBeforeTax, taxFee, totalPayment } = utils.getTotalPayment(totalPrice, order.shipmentFee);

  const getOrderItems = () => {
    return products
      .map((product) => {
        return `<tr>
        <td>
          <div style="padding: 10px; display: flex; justify-content: center; text-align: center">
            ${product.name}
          </div>
        </td>
        <td>
          <div style="padding: 10px; display: flex; justify-content: center; text-align: center">
            ${product.quantity}
          </div>
        </td>
        <td>
          <div style="padding: 10px; display: flex; justify-content: center; text-align: center">
            ${utils.formatPrice(langCode, product.price)}
          </div>
        </td>
      </tr>`;
      })
      .join('');
  };

  const getOrderNote = () => {
    if (!order.note) return '';
    return `
    <div style="display: flex; margin-bottom: 10px; align-items: baseline">
      <span style="width: 150px; margin-right: 10px">${lang.email.label.note}:</span>
      <p style="width: 100%; margin: 0">${order.note}</p>
    </div>`;
  };

  const getShipment = () => {
    if (!shipment) return '';
    return ` <div
    style="
      margin-bottom: 10px;
      padding: 10px;
      border: 1px solid #d9d9d9;
      border-radius: 6px;
    "
  >
    <h3 style="margin: 0">${lang.email.order.shipment}</h3>
    <div style="display: flex; margin: 10px 0; align-items: center">
      <span style="width: 150px; margin-right: 10px">${lang.email.label.customerName}:</span>
      <strong>${shipment.fullName}</strong>
    </div>
    <div style="display: flex; margin: 10px 0; align-items: center">
      <span style="width: 150px; margin-right: 10px">${lang.email.label.phone}:</span>
      <strong>${utils.formatPhoneNumber(shipment.phone)}</strong>
    </div>
    <div style="display: flex; margin: 10px 0; align-items: center">
      <span style="width: 150px; margin-right: 10px">${lang.email.label.email}:</span>
      <strong>${shipment.email}</strong>
    </div>
    <div style="display: flex; margin: 10px 0; align-items: center">
      <span style="width: 150px; margin-right: 10px">${lang.email.label.address}:</span>
      <strong>${shipment.address}</strong>
    </div>
  </div>
`;
  };

  return `<div
  style="
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 14px;
  "
>
  <p>${lang.email.common.greeting}, <strong>Customer name</strong></p>
  <p>${lang.email.order.appreciate}</p>
  <p>${lang.email.common.content}</p>
  <div>
    <div
      style="
        max-width: 800px;
        padding: 10px;
        border: 1px solid #d9d9d9;
        border-radius: 6px;
      "
    >
      <div
        style="
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          overflow: hidden;
        "
      >
        <table style="border-collapse: collapse; width: 100%">
          <thead>
            <tr style="background: #10b981">
              <th>
                <div style="padding: 5px 10px; color: #fff">${lang.email.label.productName}</div>
              </th>
              <th>
                <div style="padding: 5px 10px; color: #fff">${lang.email.label.quantity}</div>
              </th>
              <th>
                <div style="padding: 5px 10px; color: #fff">${lang.email.label.price}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            ${getOrderItems()}
          </tbody>
        </table>
      </div>

      <div style="display: flex; margin: 10px 0; align-items: center">
        <span style="width: 150px; margin-right: 10px">${lang.email.label.received}:</span>
        <strong style="width: 100%;">${getReceivedType(order.receivedType, langCode)}</strong>
      </div>

        ${getOrderNote()}

        ${getShipment()}

      <div
        style="padding: 10px; border: 1px solid #d9d9d9; border-radius: 6px"
      >
        <h3 style="margin: 0">${lang.email.order.general}</h3>
        <div style="display: flex; margin: 10px 0; align-items: center">
          <span style="width: 150px; margin-right: 10px">${lang.email.label.paymentMethods}:</span>
          <strong>${getPaymentMethod(order.paymentMethod, langCode)}</strong>
        </div>
        <div style="display: flex; margin: 10px 0; align-items: center">
          <span style="width: 150px; margin-right: 10px">${lang.email.label.totalProducts}:</span>
          <strong>${totalQuantity}</strong>
        </div>
        <div style="display: flex; margin: 10px 0; align-items: center">
          <span style="width: 150px; margin-right: 10px">${lang.email.label.totalPrice}:</span>
          <strong>${utils.formatPrice(langCode, totalPrice)}</strong>
        </div>
        <div style="display: flex; margin: 10px 0; align-items: center">
          <span style="width: 150px; margin-right: 10px">${lang.email.label.shipmentFee}:</span>
          <strong>${utils.formatPrice(langCode, order.shipmentFee)}</strong>
        </div>
        <div style="display: flex; margin: 10px 0; align-items: center">
          <span style="width: 150px; margin-right: 10px">${lang.email.label.totalPricePreTax}:</span>
          <strong>${utils.formatPrice(langCode, paymentBeforeTax)}</strong>
        </div>
        <div style="display: flex; margin: 10px 0; align-items: center">
          <span style="width: 150px; margin-right: 10px">${lang.email.label.tax}:</span>
          <strong>${utils.formatPrice(langCode, taxFee)}</strong>
        </div>
        <div style="display: flex; margin: 10px 0; align-items: center">
          <span style="width: 150px; margin-right: 10px">${lang.email.label.totalPayment}:</span>
          <strong>${utils.formatPrice(langCode, totalPayment)}</strong>
        </div>
      </div>
    </div>
  </div>
</div>`;
};
