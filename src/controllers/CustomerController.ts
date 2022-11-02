import { Response, Request } from "express";
import {
  controller,
  httpGet,
  httpPost,
  queryParam,
} from "inversify-express-utils";
import { BaseController } from "./BaseController";
import { inject } from "inversify";
import { TYPES } from "../config/types";
import { CustomerService } from "../services/CustomerServices";
import {
  CreateCustomerSchema,
  FetchCustomersSchema,
} from "../validations/customerSchema";
import { ICustomerFetchRequest } from "../types/models";
import { CustomerRepository } from "../repositories/CustomerRepository";

@controller("/v1/customer")
export class CustomerController extends BaseController {
  constructor(
    @inject(TYPES.CustomerService)
    private readonly customertService: CustomerService,
    @inject(TYPES.CustomerRepository)
    private readonly customerRepository: CustomerRepository
  ) {
    super();
  }
  @httpGet("/")
  async getAllCustomers(
    @queryParam("def__Get_All_Customers") def: string,
    @queryParam("page") page: number,
    @queryParam("limit") limit: number,
    @queryParam("all") all: boolean,
    @queryParam("status") status: string,
    @queryParam("customer_name") customer_name: string,
    @queryParam("search") search: string,
    @queryParam("country") country: string,
    @queryParam("phone") phone: string,
    @queryParam("order_by") order_by: "asc" | "desc",
    @queryParam("include_relations") include_relations: string,
    req: Request,
    res: Response
  ) {
    try {
      const query: ICustomerFetchRequest = {
        search,
        customer_name,
        order_by,
        status,
        phone,
        country,
      };

      const value = await this.joiSchemaValidate<ICustomerFetchRequest>({
        dataInput: query,
        schemaDef: FetchCustomersSchema,
        stripUnknown: true,
      });

      const customers = await this.customerRepository.getAll({
        ...value,
        page: this.getNumberValue(page),
        size: this.getNumberValue(limit),
        all: this.getBooleanValue(all),
        include_relations: this.getBooleanValue(include_relations),
      });

      return this.resSuccess({
        res,
        data: customers,
        message: "Successfully fetched customers",
      });
    } catch (error) {
      return this.resError({ res, error });
    }
  }

  @httpPost("/")
  async createCustomer(
    @queryParam("def__Create_Customer") def: string,
    req: Request,
    res: Response
  ) {
    try {
      const errorsMsg = await this.validateRequest(
        req.body,
        CreateCustomerSchema
      );
      if (errorsMsg) {
        return this.resError({
          res,
          code: "VALIDATION_ERRORS",
          message: errorsMsg,
        });
      }
      const customer = await this.customertService.createCustomer(req.body);
      if (!customer?.id) {
        const message = "Could not save customer information";
        return this.resError({
          res,
          code: "UNABLE_TO_PROCESS_REQUEST",
          message,
          httpStatus: 500,
        });
      }
      return this.resSuccess({
        res,
        data: customer,
        message: "Customer successfully created!",
      });
    } catch (error) {
      return this.resError({ res, error });
    }
  }
  @httpGet("/:id")
  async getCustomerById(
    @queryParam("def__Get_Customer_by_id") def: string,
    req: Request,
    res: Response
  ) {
    try {
      const customer = await this.customertService.getCustomerById(
        req.params.id
      );
      if (!customer) {
        return this.resError({
          res,
          httpStatus: 404,
          message: "Customer not found",
        });
      }
      return this.resSuccess({
        res,
        data: customer,
        message: "Successfully fetched customer",
      });
    } catch (error) {
      return this.resError({ res, error });
    }
  }
}
