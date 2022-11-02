import Joi from "joi";

export const CreateDiscountSchema = Joi.object({
  name: Joi.string().required(),
  type: Joi.string().required(),
  discount_percent: Joi.number().required(),
  description: Joi.string().optional(),
  discount_amount: Joi.number().optional(),
});

export const FetchDiscountSchema = {
  order_by: Joi.string()
    .pattern(/^[a-z_]+:(asc|desc)$/)
    .optional(),
  all: Joi.boolean().default(false),
  page: Joi.number().default(1),
  limit: Joi.number().default(20),
  name: Joi.string().optional(),
  type: Joi.string().optional(),
};
