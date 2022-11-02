import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";
import { CUSTOMER_STATUS, CUSTOMER_TYPE } from "../utils/constants";
import { GenericFriendlyError } from "../utils/errors";
import { CustomerRepository } from "../repositories/CustomerRepository";
import { ICustomer } from "../types/models";
import parsePhoneNumber from "../utils/helpers";

@injectable()
export class CustomerService {
  constructor(
    @inject(TYPES.CustomerRepository)
    private readonly customerRepository: CustomerRepository
  ) {}

  async getUserByEmailOrPhone({ emailOrPhone }) {
    if (!(emailOrPhone && typeof emailOrPhone === "string")) {
      throw new GenericFriendlyError("Invalid email or phone");
    }
    return await this.customerRepository.getCustomerByEmailOrPhone(
      emailOrPhone
    );
  }

  async createCustomer(createCustomerdata: ICustomer) {
    if (createCustomerdata?.customer_email) {
      const customerdata01 = await this.getUserByEmailOrPhone({
        emailOrPhone: createCustomerdata.customer_email,
      });
      if (customerdata01?.id) {
        throw GenericFriendlyError.createValidationError(
          `Customer with email: '${customerdata01.customer_email}', already exists`
        );
      }
    }

    if (createCustomerdata?.customer_phone) {
      const customerdata01 = await this.getUserByEmailOrPhone({
        emailOrPhone: createCustomerdata.customer_phone,
      });
      if (customerdata01?.id) {
        throw GenericFriendlyError.createValidationError(
          `Customer with phone: '${createCustomerdata.customer_phone}', already exists`
        );
      }
    }
    createCustomerdata.customer_phone.replace("+2340", "+234");
    if (createCustomerdata.customer_type === "customer") {
      createCustomerdata.customer_type = CUSTOMER_TYPE.CUSTOMER;
    } else if (createCustomerdata.customer_type === "affiliate") {
      createCustomerdata.customer_type = CUSTOMER_TYPE.AFFILIATE;
    } else if (createCustomerdata.customer_type === "employee") {
      createCustomerdata.customer_type = CUSTOMER_TYPE.EMPLOYEE;
    } else {
      throw GenericFriendlyError.createValidationError(
        `customer type of: '${createCustomerdata.customer_type}' is an invalid type`
      );
    }
    const dataTodb = {
      ...createCustomerdata,
      status: CUSTOMER_STATUS.ACTIVE,
      phone: parsePhoneNumber(createCustomerdata.customer_phone),
    } as ICustomer;

    return await this.customerRepository.save(dataTodb);
  }
  async getCustomerById(id: string) {
    return await this.customerRepository.getById(id);
  }
}
