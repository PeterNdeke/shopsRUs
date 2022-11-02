import { inject, injectable } from "inversify";
import { TYPES } from "../config/types";
import { IDiscount } from "../types/models";
import { DiscountRepository } from "../repositories/DiscountRepository";
import { GenericFriendlyError } from "../utils/errors";

@injectable()
export class DiscountService {
  constructor(
    @inject(TYPES.DiscountRepository)
    private readonly discountRepository: DiscountRepository
  ) {}

  async createDiscount(createDiscountData: IDiscount) {
    if (createDiscountData?.type) {
      const discountdata01 = await this.discountRepository.getDiscountByType(
        createDiscountData.type
      );
      if (discountdata01?.id) {
        throw GenericFriendlyError.createValidationError(
          `Discount type of: '${discountdata01.type}', already exists`
        );
      }
    }
    const dataTodb = {
      name: createDiscountData.name,
      type: createDiscountData.type,
      discount_percent: createDiscountData.discount_percent,
      description: createDiscountData.description,
      discount_amount: createDiscountData.discount_amount,
    } as IDiscount;

    return await this.discountRepository.save(dataTodb);
  }
  async getDiscountById(id: string) {
    return await this.discountRepository.getById(id);
  }
}
