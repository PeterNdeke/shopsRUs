import "reflect-metadata";
import { Container } from "inversify";
import { HealthController } from "../controllers/HealthController";

import { TYPES } from "./types";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { CustomerService } from "../services/CustomerServices";
import { CustomerController } from "../controllers/CustomerController";
import { DiscountRepository } from "../repositories/DiscountRepository";
import { DiscountService } from "../services/DiscountService";
import { DiscountController } from "../controllers/DiscountController";
import { InvoiceRepository } from "../repositories/InvoiceRepository";
import { InvoiceItemRepository } from "../repositories/InvoiceItemRepository";
import { InvoiceService } from "../services/InvoiceService";
import { InvoiceController } from "../controllers/InvoiceController";

const container = new Container();

// controllers
container
  .bind<HealthController>(TYPES.HealthController)
  .to(HealthController)
  .inSingletonScope();

container
  .bind<CustomerController>(TYPES.CustomerController)
  .to(CustomerController)
  .inSingletonScope();

container
  .bind<DiscountController>(TYPES.DiscountController)
  .to(DiscountController)
  .inSingletonScope();

container
  .bind<InvoiceController>(TYPES.InvoiceController)
  .to(InvoiceController)
  .inSingletonScope();

// services
container
  .bind<CustomerService>(TYPES.CustomerService)
  .to(CustomerService)
  .inSingletonScope();

container
  .bind<DiscountService>(TYPES.DiscountService)
  .to(DiscountService)
  .inSingletonScope();

container
  .bind<InvoiceService>(TYPES.InvoiceService)
  .to(InvoiceService)
  .inSingletonScope();

// repositories
container
  .bind<CustomerRepository>(TYPES.CustomerRepository)
  .to(CustomerRepository)
  .inSingletonScope();

container
  .bind<DiscountRepository>(TYPES.DiscountRepository)
  .to(DiscountRepository)
  .inSingletonScope();

container
  .bind<InvoiceRepository>(TYPES.InvoiceRepository)
  .to(InvoiceRepository)
  .inSingletonScope();

container
  .bind<InvoiceItemRepository>(TYPES.InvoiceItemRepository)
  .to(InvoiceItemRepository)
  .inSingletonScope();
export default container;
