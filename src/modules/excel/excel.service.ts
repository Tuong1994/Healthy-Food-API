import { Injectable } from '@nestjs/common';
import * as ExcelJs from 'exceljs';
import * as fs from 'fs';

@Injectable()
export class ExcelService {
  generateExcel<M>(data: M[], columns: Partial<ExcelJs.Column>[], sheetName: string) {
    const workBook = new ExcelJs.Workbook();
    const workSheet = workBook.addWorksheet(sheetName);
    workSheet.columns = columns;
    workSheet.addRows(data);
    return workBook;
  }
}
