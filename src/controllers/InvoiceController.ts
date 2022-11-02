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
import { IDiscountFetchRequest, IInvoiceFetchRequest } from "../types/models";
import { InvoiceService } from "../services/InvoiceService";
import {
  CreateInvoiceSchema,
  FetchInvoiceSchema,
} from "../validations/invoiceSchema";

@controller("/v1/invoice")
export class InvoiceController extends BaseController {
  constructor(
    @inject(TYPES.InvoiceService)
    private readonly invoiceService: InvoiceService
  ) {
    super();
  }
  @httpGet("/")
  async getAllCustomers(
    @queryParam("def__Get_All_Invoice") def: string,
    @queryParam("page") page: number,
    @queryParam("limit") limit: number,
    @queryParam("all") all: boolean,
    @queryParam("name") name: string,
    @queryParam("type") type: string,
    @queryParam("order_by") order_by: "asc" | "desc",
    req: Request,
    res: Response
  ) {
    try {
      const query: IDiscountFetchRequest = {
        name,
        order_by,
        type,
      };

      const value = await this.joiSchemaValidate<IInvoiceFetchRequest>({
        dataInput: query,
        schemaDef: FetchInvoiceSchema,
        stripUnknown: true,
      });

      const invoices = await this.invoiceService.getInvoices({
        ...value,
        page: this.getNumberValue(page),
        size: this.getNumberValue(limit),
        all: this.getBooleanValue(all),
      });

      return this.resSuccess({
        res,
        data: invoices,
        message: "Successfully fetched invoices",
      });
    } catch (error) {
      return this.resError({ res, error });
    }
  }

  @httpPost("/")
  async createDiscount(
    @queryParam("def__Create_Invoice") def: string,
    req: Request,
    res: Response
  ) {
    try {
      const errorsMsg = await this.validateRequest(
        req.body,
        CreateInvoiceSchema
      );
      if (errorsMsg) {
        return this.resError({
          res,
          code: "VALIDATION_ERRORS",
          message: errorsMsg,
        });
      }
      const invoice = await this.invoiceService.generateInvoice(req.body);
      if (!invoice?.id) {
        const message = "Could not generate invoice";
        return this.resError({
          res,
          code: "UNABLE_TO_PROCESS_REQUEST",
          message,
          httpStatus: 500,
        });
      }
      return this.resSuccess({
        res,
        data: invoice,
        message: "Invoice successfully generated!",
      });
    } catch (error) {
      return this.resError({ res, error });
    }
  }
  @httpGet("/:id")
  async getInvoiceById(
    @queryParam("def__Get_Discount_by_id") def: string,
    req: Request,
    res: Response
  ) {
    try {
      const invoice = await this.invoiceService.getInvoiceById(req.params.id);
      if (!invoice) {
        return this.resError({
          res,
          httpStatus: 404,
          message: "Invoice not found",
        });
      }
      return this.resSuccess({
        res,
        data: invoice,
        message: "Successfully fetched invoice",
      });
    } catch (error) {
      return this.resError({ res, error });
    }
  }
}
