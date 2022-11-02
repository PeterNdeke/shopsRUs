import { injectable } from "inversify";
import { FindOptions } from "sequelize";
import { IDiscount } from "../types/models";
import { BaseRepository } from "./BaseRepository";
import { Discount } from "../models/discount";

@injectable()
export class DiscountRepository extends BaseRepository {
  constructor() {
    super();
  }
  async getAll({
    page,
    size,
    all,
    order_by,
    name,
    type,
  }: {
    page?: number;
    size?: number;
    all?: boolean;
    search?: string;
    order_by?: string;
    name?: string;
    type?: string;
  }) {
    const findOptions: FindOptions<IDiscount> = {
      raw: true,
      nest: true,
      where: {},
    };

    if (name) {
      findOptions.where = {
        ...findOptions.where,
        name: name,
      };
    }

    if (type) {
      findOptions.where = {
        ...findOptions.where,
        type,
      };
    }
    if (order_by) {
      const [column, order] = order_by.split(":");
      const fields01 = Discount.base_getAttributeKeys(Discount);
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
    const paginationData = this.getPreparePaginationOptions<IDiscount>({
      findOptions,
      pageSize: all ? 1000 : size,
      nextPage: all ? 1 : page,
    });

    const resultData = await Discount.findAndCountAll(
      paginationData.paginationFindOptions
    );
    const { results, ...otherAttributes } = this.getPostPaginationResult({
      rows: resultData.rows,
      count: resultData.count,
      size: paginationData.size,
      page: paginationData.page,
    });

    return {
      discounts: results,
      ...otherAttributes,
    };
  }

  async save(data: IDiscount) {
    return await Discount.create(data);
  }

  async getById(id: string) {
    const options: FindOptions<IDiscount> = {
      raw: true,
      nest: true,
      where: {
        id,
      },
    };
    return Discount.findOne(options);
  }
  async getDiscountByType(type: string) {
    const options: FindOptions<IDiscount> = {
      raw: true,
      nest: true,
      where: {
        type,
      },
    };
    return Discount.findOne(options);
  }
}
