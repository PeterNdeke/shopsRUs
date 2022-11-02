import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";
import { IInvoice, IInvoiceItem, IInvoiceWithRelation } from "../types/models";
import { DiscountRepository } from "../repositories/DiscountRepository";
import { GenericFriendlyError } from "../utils/errors";
import { InvoiceRepository } from "../repositories/InvoiceRepository";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { CUSTOMER_TYPE, INVOICE_STATUS } from "../utils/constants";
import { InvoiceItemRepository } from "../repositories/InvoiceItemRepository";
import { DateService } from "../utils/date-service";

@injectable()
export class InvoiceService {
  constructor(
    @inject(TYPES.InvoiceRepository)
    private readonly invoiceRepository: InvoiceRepository,
    @inject(TYPES.DiscountRepository)
    private readonly discountRepository: DiscountRepository,
    @inject(TYPES.CustomerRepository)
    private readonly customerRepository: CustomerRepository,
    @inject(TYPES.InvoiceItemRepository)
    private readonly invoiceItemRepository: InvoiceItemRepository
  ) {}

  async generateInvoice(createData: IInvoiceWithRelation) {
    const customer = await this.customerRepository.getById(
      createData.customer_id
    );
    if (!customer?.id) {
      throw new GenericFriendlyError("customer details not found");
    }

    const dataTodb = {
      customer_id: customer.id,
      invoice_number: this.generateInvoiceCode(),
      description: createData.description,
      due_date: createData.due_date,
      status: INVOICE_STATUS.UNPAID,
    } as IInvoice;

    const createdInvoice = await this.invoiceRepository.save(dataTodb);
    createData.invoice_items?.forEach(async (f) => {
      const amount = f.quantity * f.price_per_unit;
      const invoiceItemData = {
        invoice_id: createdInvoice?.id,
        item_name: f.item_name,
        item_description: f.item_description,
        quantity: f.quantity,
        price_per_unit: f.price_per_unit,
        amount,
      } as IInvoiceItem;

      await this.invoiceItemRepository.save(invoiceItemData);
    });
    await DateService.waitUntilMilliseconds(100);
    const totalInvoiceAmount =
      await this.invoiceItemRepository.getTotalInvoiceAmountByInvoiceId(
        createdInvoice?.id
      );

    let totalDiscountAmount: number = 0;
    let totalAmountPaid: number = 0;
    let discountPercent: number = 0;

    switch (customer?.customer_type) {
      case CUSTOMER_TYPE.AFFILIATE:
        const affiliateDiscount01 =
          await this.discountRepository.getDiscountByType(
            CUSTOMER_TYPE.AFFILIATE
          );
        discountPercent = affiliateDiscount01?.discount_percent
          ? affiliateDiscount01?.discount_percent
          : 0;
        totalDiscountAmount = (totalInvoiceAmount * discountPercent) / 100;
        totalAmountPaid = totalInvoiceAmount - totalDiscountAmount;
        if (totalInvoiceAmount >= 100) {
          // for every 100 dollars bill, a user get 5 dollar discount
          const discountType = "100_dollars_bill_discount";
          const discount = await this.discountRepository.getDiscountByType(
            discountType
          );
          const disCountAmount = discount?.discount_amount
            ? discount?.discount_amount
            : 0;
          const multipleOf100s: number = Number(
            (totalInvoiceAmount / 100).toFixed()
          );

          const discountAmountApplied = multipleOf100s * disCountAmount;
          totalDiscountAmount += discountAmountApplied;
          totalAmountPaid = totalInvoiceAmount - totalDiscountAmount;
        }
        //update invoice with this details
        const updateData = {
          id: createdInvoice.id,
          total_discount_amount: totalDiscountAmount,
          total_amount_paid_after_discount: totalAmountPaid,
          total_original_amount: totalInvoiceAmount,
          discount_id: affiliateDiscount01?.id,
        } as IInvoice;
        return await this.invoiceRepository.update(updateData);

      case CUSTOMER_TYPE.EMPLOYEE:
        const employeeDiscount01 =
          await this.discountRepository.getDiscountByType(
            CUSTOMER_TYPE.EMPLOYEE
          );
        discountPercent = employeeDiscount01?.discount_percent
          ? employeeDiscount01?.discount_percent
          : 0;
        totalDiscountAmount = (totalInvoiceAmount * discountPercent) / 100;
        totalAmountPaid = totalInvoiceAmount - totalDiscountAmount;
        if (totalInvoiceAmount >= 100) {
          // for every 100 bill, a user get 5 dollar discount
          const discountType = "100_dollars_bill_discount";
          const discount = await this.discountRepository.getDiscountByType(
            discountType
          );
          const disCountAmount = discount?.discount_amount
            ? discount?.discount_amount
            : 0;
          const multipleOf100s: number = Number(
            (totalInvoiceAmount / 100).toFixed()
          );

          const discountAmountApplied = multipleOf100s * disCountAmount;
          totalDiscountAmount += discountAmountApplied;
          totalAmountPaid = totalInvoiceAmount - totalDiscountAmount;
        }
        //update invoice with this details
        const updateData01 = {
          id: createdInvoice.id,
          total_discount_amount: totalDiscountAmount,
          total_amount_paid_after_discount: totalAmountPaid,
          total_original_amount: totalInvoiceAmount,
          discount_id: employeeDiscount01?.id,
        } as IInvoice;
        return await this.invoiceRepository.update(updateData01);

      case CUSTOMER_TYPE.CUSTOMER:
        const customerDiscount01 =
          await this.discountRepository.getDiscountByType(
            CUSTOMER_TYPE.CUSTOMER
          );
        if (
          DateService.getDateDiffDays(
            new Date(customer?.createdAt).toISOString(),
            new Date().toISOString()
          ) > 730
        ) {
          discountPercent = customerDiscount01?.discount_percent
            ? customerDiscount01?.discount_percent
            : 0;
          totalDiscountAmount = (totalInvoiceAmount * discountPercent) / 100;
          totalAmountPaid = totalInvoiceAmount - totalDiscountAmount;
        }
        if (totalInvoiceAmount >= 100) {
          // for every 100 bill, a user get 5 dollar discount
          const discountType = "100_dollars_bill_discount";
          const discount = await this.discountRepository.getDiscountByType(
            discountType
          );
          const disCountAmount = discount?.discount_amount
            ? discount?.discount_amount
            : 0;
          const multipleOf100s: number = Number(
            (totalInvoiceAmount / 100).toFixed()
          );

          const discountAmountApplied = multipleOf100s * disCountAmount;
          totalDiscountAmount += discountAmountApplied;
          totalAmountPaid = totalInvoiceAmount - totalDiscountAmount;
        }
        //update invoice with this details
        const updateData02 = {
          id: createdInvoice.id,
          total_discount_amount: totalDiscountAmount,
          total_amount_paid_after_discount: totalAmountPaid,
          total_original_amount: totalInvoiceAmount,
          discount_id: customerDiscount01?.id,
        } as IInvoice;
        return await this.invoiceRepository.update(updateData02);

      default:
        break;
    }
  }

  async getInvoiceById(id: string) {
    return await this.invoiceRepository.getById(id);
  }
  private generateInvoiceCode(min = 0, max = 500000): string {
    min = Math.ceil(min);
    max = Math.floor(max);
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num.toString().padStart(6, "0");
  }

  async getInvoices({
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
    const invoices = await this.invoiceRepository.getAll({
      page,
      size,
      all,
      order_by,
      status,
      invoice_number,
    });
    const invoiceItems: any[] = [];

    if (invoices.invoices.length) {
      for (const invoice of invoices.invoices) {
        invoice.invoice_item =
          await this.invoiceItemRepository.getInvoiceItemsByInvoiceId(
            invoice.id
          );
        invoiceItems.push(invoice);
      }
    }

    invoices.invoices = invoiceItems;

    return invoices;
  }
}
