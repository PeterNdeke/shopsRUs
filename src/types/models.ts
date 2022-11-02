import { ICore } from "./core";

export interface ICustomer extends ICore {
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  country: string;
  status: string;
  customer_type: string;
}

export interface IInvoice extends ICore {
  customer_id: string;
  invoice_number: string;
  description?: string;
  due_date: string | Date;
  discount_id?: string;
  total_discount_amount?: number;
  total_amount_paid_after_discount?: number;
  total_original_amount?: number;
  status: string;
  invoice_item?: IInvoiceItem[];
}

export interface IInvoiceItem extends ICore {
  invoice_id: string;
  item_name: string;
  item_description?: string;
  quantity: number;
  price_per_unit: number;
  amount?: number;
}

export interface IDiscount extends ICore {
  name: string;
  type: string;
  description?: string;
  discount_percent: number;
  discount_amount?: number;
}
export interface ICustomerFetchRequest {
  search?: string;
  customer_name?: string;
  country?: string;
  phone?: string;
  order_by?: string;
  status?: string;
}
export interface IDiscountFetchRequest {
  name?: string;
  type?: string;
  order_by?: string;
}

export interface IInvoiceFetchRequest {
  invoice_number?: string;
  status?: string;
  order_by?: string;
}

export interface IInvoiceWithRelation extends IInvoice {
  invoice_items?: IInvoiceItem[];
}
