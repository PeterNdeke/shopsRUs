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
import { IDiscountFetchRequest } from "../types/models";
import { DiscountRepository } from "../repositories/DiscountRepository";
import {
  CreateDiscountSchema,
  FetchDiscountSchema,
} from "../validations/discountSchema";
import { DiscountService } from "../services/DiscountService";

@controller("/v1/discount")
export class DiscountController extends BaseController {
  constructor(
    @inject(TYPES.DiscountRepository)
    private readonly discountRepository: DiscountRepository,
    @inject(TYPES.DiscountService)
    private readonly discountService: DiscountService
  ) {
    super();
  }
  @httpGet("/")
  async getAllDiscount(
    @queryParam("def__Get_All_Discount") def: string,
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

      const value = await this.joiSchemaValidate<IDiscountFetchRequest>({
        dataInput: query,
        schemaDef: FetchDiscountSchema,
        stripUnknown: true,
      });

      const customers = await this.discountRepository.getAll({
        ...value,
        page: this.getNumberValue(page),
        size: this.getNumberValue(limit),
        all: this.getBooleanValue(all),
      });

      return this.resSuccess({
        res,
        data: customers,
        message: "Successfully fetched discounts",
      });
    } catch (error) {
      return this.resError({ res, error });
    }
  }

  @httpPost("/")
  async createDiscount(
    @queryParam("def__Create_Discount") def: string,
    req: Request,
    res: Response
  ) {
    try {
      const errorsMsg = await this.validateRequest(
        req.body,
        CreateDiscountSchema
      );
      if (errorsMsg) {
        return this.resError({
          res,
          code: "VALIDATION_ERRORS",
          message: errorsMsg,
        });
      }
      const discount = await this.discountService.createDiscount(req.body);
      if (!discount?.id) {
        const message = "Could not save discount information";
        return this.resError({
          res,
          code: "UNABLE_TO_PROCESS_REQUEST",
          message,
          httpStatus: 500,
        });
      }
      return this.resSuccess({
        res,
        data: discount,
        message: "Discount successfully created!",
      });
    } catch (error) {
      return this.resError({ res, error });
    }
  }
  @httpGet("/:id")
  async getCustomerById(
    @queryParam("def__Get_Discount_by_id") def: string,
    req: Request,
    res: Response
  ) {
    try {
      const discount = await this.discountService.getDiscountById(
        req.params.id
      );
      if (!discount) {
        return this.resError({
          res,
          httpStatus: 404,
          message: "Discount not found",
        });
      }
      return this.resSuccess({
        res,
        data: discount,
        message: "Successfully fetched discount",
      });
    } catch (error) {
      return this.resError({ res, error });
    }
  }
}
