import { Response } from "express";
import Joi from "joi";
import { injectable } from "inversify";
import { GenericFriendlyError } from "../utils/errors";
import { LoggingService } from "../utils/logger";
import { DateService } from "../utils/date-service";
import { FriendlyErrorUtil } from "../utils/error-util";
import { SchemaValidatorService } from "../utils/schema-validator-service";

@injectable()
export abstract class BaseController extends FriendlyErrorUtil {
  protected async joiSchemaValidate<T = any>({
    schemaDef,
    dataInput,
    allowUnknown,
    stripUnknown,
  }: {
    schemaDef: Joi.PartialSchemaMap<any>;
    dataInput: Record<string, any>;
    allowUnknown?: boolean;
    stripUnknown?: boolean;
  }) {
    const { validatedData } = await SchemaValidatorService.joiSchemaValidate({
      schemaDef,
      data: dataInput,
      canThrowTheError: true,
      allowUnknown,
      stripUnknown,
    });
    return validatedData as T;
  }

  protected getBooleanValue(val: unknown): boolean | undefined {
    if (val !== undefined && val !== null) {
      if (typeof val === "string" || typeof val === "boolean") {
        if (String(val).trim() === "true" || String(val).trim() === "false") {
          return String(val).trim() === "true";
        }
      }
    }
    return undefined;
  }

  protected getNumberValue(val: unknown): number | undefined {
    if (val !== undefined && val !== null) {
      if (typeof val === "string" || typeof val === "number") {
        if (!isNaN(Number(val))) {
          return Number(val);
        }
      }
    }
    return undefined;
  }

  protected validateRequiredString(keyValueValidates: {
    [key: string]: string;
  }) {
    const errors: string[] = [];
    Object.entries(keyValueValidates).forEach(([key, value]) => {
      if (!(value && typeof value === "string")) {
        errors.push(`${key} is required`);
      }
    });
    if (errors.length) {
      throw GenericFriendlyError.createBadRequestError(`${errors.join("; ")}.`);
    }
  }

  protected validateDayStamp_YYYY_MM_DD(keyValueValidates: {
    [key: string]: string;
  }) {
    const errors: string[] = [];
    Object.entries(keyValueValidates).forEach(([key, value]) => {
      if (!DateService.isValidFormat_YYYY_MM_DD(value)) {
        errors.push(`${key} must be valid date format: YYYY-MM-DD`);
      }
    });
    if (errors.length) {
      throw this.createFriendlyError(`${errors.join("; ")}.`);
    }
  }

  protected validateRequiredNumber(keyValueValidates: {
    [key: string]: number;
  }) {
    const errors: string[] = [];
    Object.entries(keyValueValidates).forEach(([key, value]) => {
      if (!(!isNaN(Number(value)) && typeof value === "number")) {
        errors.push(`${key} is required and must be a number`);
      }
    });
    if (errors.length) {
      throw GenericFriendlyError.createBadRequestError(`${errors.join("; ")}.`);
    }
  }

  protected async validateRequest(
    requestBody: any,
    validationSchema: Joi.Schema
  ) {
    const error = validationSchema.validate(requestBody);

    if (error?.error) {
      return Promise.resolve(
        error?.error?.details?.[0]?.message || "Validation error occured"
      );
    }
    return null;
  }

  protected resSuccess({
    res,
    data,
    message = "",
    httpStatus = 200,
  }: {
    res: Response;
    data: any;
    message?: string;
    httpStatus?: number;
  }) {
    return res.status(httpStatus).json({
      status: "success",
      message: message,
      data: data,
    });
  }

  protected resError({
    res,
    code,
    message,
    error,
    httpStatus = 400,
  }: {
    res: Response;
    code?: string;
    message?: string;
    error?: any;
    httpStatus?: number;
  }) {
    if (message) {
      LoggingService.error(message);
    }

    if (error) {
      LoggingService.error(error);
    }

    if (!error) {
      return res.status(httpStatus || 500).send({
        status: "error",
        code: httpStatus || code,
        message: message || "Error occured",
      });
    }

    const errorData = this.getFriendlyErrorMessage(error);

    const httpStatus01 = errorData.httpStatus || httpStatus || 500;
    const message01 = message || errorData.message || "Error occured";
    const code01 = errorData.code || code || 0;
    return res.status(httpStatus01).send({
      status: "error",
      code: httpStatus01 || code01,
      message: message01,
    });
  }

  protected successHtml({ res, html }: { res: Response; html: string }) {
    return res.contentType("html").send(html);
  }

  protected successDownload({
    res,
    data = null,
    httpStatus = 200,
    downloadTitle,
  }: {
    res: Response;
    data?: any;
    downloadTitle?: string;
    httpStatus?: number;
  }) {
    const dataRes = typeof data === "string" ? data : JSON.stringify(data);
    const myFileName = downloadTitle
      ? `${downloadTitle}-${Date.now()}`
      : `${Date.now()}`;
    res.setHeader(
      "Content-disposition",
      `attachment; filename=${myFileName}.json`
    );
    res.setHeader("Content-type", "application/json");
    return res.status(httpStatus).send(dataRes);
  }
  protected successPlain({
    res,
    data = null,
    httpStatus = 200,
  }: {
    res: Response;
    data?: any;
    httpStatus?: number;
  }) {
    return res.status(httpStatus).json(data);
  }
}
