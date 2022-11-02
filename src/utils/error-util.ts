import { injectable } from 'inversify';
import validator from 'validator';
import {
  DatabaseError,
  ValidationError,
  UniqueConstraintError,
  ConnectionError,
  ForeignKeyConstraintError,
} from 'sequelize';
import { LoggingService } from './logger';
import { DateService } from './date-service';
import { GenericFriendlyError } from './errors';

@injectable()
export class FriendlyErrorUtil {
  protected createFriendlyError(message: string, httpStatus = 400) {
    return new GenericFriendlyError(message, httpStatus);
  }

  protected getFriendlyErrorMessage(err: unknown) {
    return getErrorMessage(err);
  }

  protected validateRequiredString(keyValueValidates: { [key: string]: string }) {
    const errors: string[] = [];
    Object.entries(keyValueValidates).forEach(([key, value]) => {
      if (!(value && typeof value === 'string')) {
        errors.push(`${key} is required`);
      }
    });
    if (errors.length) {
      throw this.createFriendlyError(`${errors.join('; ')}.`);
    }
  }

  protected validateRequiredUUID(keyValueValidates: { [key: string]: string }) {
    const errors: string[] = [];
    Object.entries(keyValueValidates).forEach(([key, value]) => {
      if (!(value && validator.isUUID(value))) {
        errors.push(`${key} MUST be valid uuid`);
      }
    });
    if (errors.length) {
      throw this.createFriendlyError(`${errors.join('; ')}.`);
    }
  }

  protected validateRequiredNumber(keyValueValidates: { [key: string]: number }) {
    const errors: string[] = [];
    Object.entries(keyValueValidates || {}).forEach(([key, value]) => {
      if (!(!isNaN(Number(value)) && typeof value === 'number')) {
        errors.push(`${key} is required`);
      }
    });
    if (errors.length) {
      throw this.createFriendlyError(`${errors.join('; ')}.`);
    }
  }

  protected validateDayStamp_YYYY_MM_DD(keyValueValidates: { [key: string]: string }) {
    const errors: string[] = [];
    Object.entries(keyValueValidates || {}).forEach(([key, value]) => {
      if (!DateService.isValidFormat_YYYY_MM_DD(value)) {
        errors.push(`${key} must be valid date format: YYYY-MM-DD`);
      }
    });
    if (errors.length) {
      throw this.createFriendlyError(`${errors.join('; ')}.`);
    }
  }
}

export function getErrorMessage(errorMsg: unknown) {
  const msgOrError: string = 'Unknow Error';

  if (errorMsg instanceof GenericFriendlyError) {
    return {
      message: errorMsg.message,
      httpStatus: errorMsg.httpStatus,
      code: errorMsg.code,
    };
  }

  if (errorMsg instanceof UniqueConstraintError) {
    const messages: string[] = [];

    LoggingService.error({
      message: errorMsg.message,
      fields: errorMsg.fields,
      name: errorMsg.name,
      sql: errorMsg.sql,
    });

    Object.entries(errorMsg.fields).forEach(([key, value]) => {
      const [field] = key.split('.').slice(-1);
      const message = [field, 'must be unique.', value, 'already exists in the database'].join(' ');
      messages.push(message);
    });

    if (messages.length) {
      return {
        message: messages.join('; '),
        httpStatus: undefined,
        code: undefined,
      };
    }

    return {
      message: errorMsg.message,
      httpStatus: undefined,
      code: undefined,
    };
  }

  if (errorMsg instanceof ForeignKeyConstraintError) {
    LoggingService.error({
      message: errorMsg.message,
      fields: errorMsg.fields,
      name: errorMsg.name,
      sql: errorMsg.sql,
      table: errorMsg.table,
    });

    return {
      message: errorMsg.message,
      httpStatus: undefined,
      code: undefined,
    };
  }

  if (errorMsg instanceof ValidationError) {
    const messages: string[] = [];

    if (errorMsg?.errors?.length) {
      errorMsg.errors.forEach((error) => {
        messages.push(error.message);
      });

      if (messages.length) {
        return {
          message: messages.join('; '),
          httpStatus: undefined,
          code: undefined,
        };
      }
    }

    return {
      message: errorMsg.message,
      httpStatus: undefined,
      code: undefined,
    };
  }

  if (errorMsg instanceof ConnectionError) {
    return {
      message: errorMsg.message,
      httpStatus: undefined,
      code: undefined,
    };
  }

  if (errorMsg instanceof DatabaseError) {
    return {
      message: errorMsg.message,
      httpStatus: undefined,
      code: undefined,
    };
  }
  return {
    message: msgOrError,
    httpStatus: undefined,
    code: undefined,
  };
}
