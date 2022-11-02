import { injectable } from "inversify";
import { FindOptions } from "sequelize";
import { IInvoiceItem } from "../types/models";
import { BaseRepository } from "./BaseRepository";
import { InvoiceItem } from "../models/invoiceItem";

@injectable()
export class InvoiceItemRepository extends BaseRepository {
  constructor() {
    super();
  }

  async save(data: IInvoiceItem) {
    return await InvoiceItem.create(data);
  }
  async getAll() {
    return await InvoiceItem.findAll();
  }

  async getInvoiceItemsByInvoiceId(invoice_id: string) {
    const options: FindOptions<IInvoiceItem> = {
      raw: true,
      nest: true,
      where: {
        invoice_id,
      },
    };
    return await InvoiceItem.findAll(options);
  }
  async getTotalInvoiceAmountByInvoiceId(invoice_id: string) {
    const result01 = await InvoiceItem.sum("amount", {
      where: {
        invoice_id,
      },
    });
    return result01;
  }
}
