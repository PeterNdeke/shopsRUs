import { injectable } from "inversify";
import { FindOptions, Op } from "sequelize";
import { ICustomer } from "../types/models";
import { Customer } from "../models/customer";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class CustomerRepository extends BaseRepository {
  constructor() {
    super();
  }
  async getAll({
    page,
    size,
    all,
    search,
    order_by,
    status,
    customer_name,
    phone,
    country,
    include_relations,
  }: {
    page?: number;
    size?: number;
    all?: boolean;
    search?: string;
    order_by?: string;
    status?: string;
    customer_name?: string;
    phone?: string;
    country?: string;
    include_relations?: boolean;
  }) {
    const findOptions: FindOptions<ICustomer> = {
      raw: true,
      nest: true,
      where: {},
      include: [],
    };

    if (include_relations) {
      findOptions.include = [{ all: true }];
    }

    if (customer_name) {
      findOptions.where = {
        ...findOptions.where,
        customer_name: customer_name,
      };
    }
    if (phone) {
      findOptions.where = {
        ...findOptions.where,
        customer_phone: phone,
      };
    }

    if (status) {
      findOptions.where = {
        ...findOptions.where,
        status: status,
      };
    }
    if (country) {
      findOptions.where = {
        ...findOptions.where,
        country,
      };
    }
    if (order_by) {
      const [column, order] = order_by.split(":");
      const fields01 = Customer.base_getAttributeKeys(Customer);
      if (
        column &&
        order &&
        fields01?.includes(column) &&
        ["desc", "asc"].includes(order.toLowerCase())
      ) {
        findOptions.order = [[column, order.toUpperCase()]];
      }
    } else {
      findOptions.order = [["updatedAt", "DESC"]];
    }
    const paginationData = this.getPreparePaginationOptions<ICustomer>({
      findOptions,
      pageSize: all ? 1000 : size,
      nextPage: all ? 1 : page,
    });

    const resultData = await Customer.findAndCountAll(
      paginationData.paginationFindOptions
    );
    const { results, ...otherAttributes } = this.getPostPaginationResult({
      rows: resultData.rows,
      count: resultData.count,
      size: paginationData.size,
      page: paginationData.page,
    });

    return {
      customers: results,
      ...otherAttributes,
    };
  }

  async save(data: ICustomer) {
    return await Customer.create(data);
  }

  async getCustomerByEmailOrPhone(emailOrPhone: string) {
    const options: FindOptions<ICustomer> = {
      raw: true,
      nest: true,
      where: {
        [Op.or]: [
          { customer_email: emailOrPhone },
          { customer_phone: emailOrPhone },
        ],
      },
    };
    return Customer.findOne(options);
  }
  async getById(id: string) {
    const options: FindOptions<ICustomer> = {
      raw: true,
      nest: true,
      where: {
        id,
      },
    };
    return Customer.findOne(options);
  }
}
