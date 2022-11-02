import { injectable } from "inversify";
import { FindOptions } from "sequelize";
import { IInvoice, IInvoiceWithRelation } from "../types/models";
import { BaseRepository } from "./BaseRepository";
import { Invoice } from "../models/invoice";
import { InvoiceItem } from "../models/invoiceItem";

@injectable()
export class InvoiceRepository extends BaseRepository {
  constructor() {
    super();
  }
  async getAll({
    page,
    size,
    all,
    order_by,
    status,
    invoice_number,
  }: {
    page?: number;
    size?: number;
    all?: boolean;
    search?: string;
    order_by?: string;
    status?: string;
    invoice_number?: string;
  }) {
    const findOptions: FindOptions<IInvoice> = {
      raw: true,
      nest: true,
      //   include: {
      //     model: InvoiceItem,
      //     as: "invoice_items",
      //   },
      where: {},
    };

    if (invoice_number) {
      findOptions.where = {
        ...findOptions.where,
        invoice_number,
      };
    }

    if (status) {
      findOptions.where = {
        ...findOptions.where,
        status,
      };
    }
    if (order_by) {
      const [column, order] = order_by.split(":");
      const fields01 = Invoice.base_getAttributeKeys(Invoice);
      if (
        column &&
        order &&
        fields01?.includes(column) &&
        ["desc", "asc"].includes(order.toLowerCase())
      ) {
        findOptions.order = [[column, order.toUpperCase()]];
      }
    } else {
      findOptions.order = [["updatedAt", "DESC"]];
    }
    const paginationData = this.getPreparePaginationOptions<IInvoice>({
      findOptions,
      pageSize: all ? 1000 : size,
      nextPage: all ? 1 : page,
    });

    const resultData = await Invoice.findAndCountAll(
      paginationData.paginationFindOptions
    );
    const { results, ...otherAttributes } = this.getPostPaginationResult({
      rows: resultData.rows,
      count: resultData.count,
      size: paginationData.size,
      page: paginationData.page,
    });

    return {
      invoices: results,
      ...otherAttributes,
    };
  }

  async save(data: IInvoice) {
    return await Invoice.create(data);
  }

  async getById(id: string) {
    const options: FindOptions<IInvoiceWithRelation> = {
      raw: false,
      nest: true,
      include: [
        {
          model: InvoiceItem,
          as: "invoice_items",
        },
      ],
    };
    return Invoice.findByPk(id, options);
  }
  async getInvoiceByCustomerId(customer_id: string) {
    const options: FindOptions<IInvoice> = {
      raw: true,
      nest: true,
      where: {
        customer_id,
      },
    };
    return Invoice.findOne(options);
  }
  async update(data: IInvoice) {
    const [_, [invoice]] = await Invoice.update(data, {
      where: { id: data.id },
      returning: true,
      validate: true,
    });
    return invoice;
  }
}
