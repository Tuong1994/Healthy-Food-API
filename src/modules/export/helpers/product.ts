import { ELang, ERecordStatus } from 'src/common/enum/base';
import { EInventoryStatus, EProductOrigin, EProductUnit } from 'src/modules/product/product.enum';
import utils from 'src/utils';

export const getInventoryStatus = (status: EInventoryStatus, langCode: ELang) => {
  const lang = utils.getLang(langCode);
  return status === EInventoryStatus.IN_STOCK
    ? lang.excel.inventoryStatus.inStock
    : lang.excel.inventoryStatus.outOfStock;
};

export const getProductUnit = (unit: EProductUnit, langCode: ELang) => {
  const lang = utils.getLang(langCode);
  const units: Record<number, string> = {
    [EProductUnit.BIN]: lang.excel.productUnit.bin,
    [EProductUnit.BOTTLE]: lang.excel.productUnit.bottle,
    [EProductUnit.BOX]: lang.excel.productUnit.box,
    [EProductUnit.CAN]: lang.excel.productUnit.can,
    [EProductUnit.KG]: lang.excel.productUnit.kg,
    [EProductUnit.PACK]: lang.excel.productUnit.pack,
    [EProductUnit.PIECE]: lang.excel.productUnit.piece,
  };
  return units[unit];
};

export const getProductOrigin = (origin: EProductOrigin, langCode: ELang) => {
  const lang = utils.getLang(langCode);
  const origins: Record<number, string> = {
    [EProductOrigin.VN]: lang.excel.productOrigin.vn,
  };
  return origins[origin];
};
