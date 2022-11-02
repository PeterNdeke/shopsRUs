export const TYPES = {
  Logger: Symbol("Logger"),

  // controllers
  HealthController: Symbol("HealthController"),
  CustomerController: Symbol("CustomerController"),
  DiscountController: Symbol("DiscountController"),
  InvoiceController: Symbol("InvoiceController"),
  // services
  CustomerService: Symbol("CustomerService"),
  DiscountService: Symbol("DiscountService"),
  InvoiceService: Symbol("InvoiceService"),
  // repositories
  CustomerRepository: Symbol("CustomerRepository"),
  DiscountRepository: Symbol("DiscountRepository"),
  InvoiceRepository: Symbol("InvoiceRepository"),
  InvoiceItemRepository: Symbol("InvoiceItemRepository"),
};
