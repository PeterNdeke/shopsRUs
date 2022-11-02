import Joi from "joi";

export const CreateCustomerSchema = Joi.object({
  customer_name: Joi.string().required(),
  customer_email: Joi.string().required(),
  customer_phone: Joi.string().required(),
  customer_type: Joi.string().required(),
  country: Joi.string().optional(),
});

export const FetchCustomersSchema = {
  search: Joi.string().trim().optional(),
  order_by: Joi.string()
    .pattern(/^[a-z_]+:(asc|desc)$/)
    .optional(),
  all: Joi.boolean().default(false),
  page: Joi.number().default(1),
  limit: Joi.number().default(20),
  customer_name: Joi.string().optional(),
  phone: Joi.string().optional(),
  country: Joi.string().optional(),
  status: Joi.string().optional(),
};
