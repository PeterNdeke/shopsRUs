import Joi from "joi";

export const CreateInvoiceSchema = Joi.object({
  customer_id: Joi.string().required(),
  description: Joi.string().optional(),
  due_date: Joi.string().required(),
  invoice_items: Joi.array().required(),
});

export const FetchInvoiceSchema = {
  order_by: Joi.string()
    .pattern(/^[a-z_]+:(asc|desc)$/)
    .optional(),
  all: Joi.boolean().default(false),
  page: Joi.number().default(1),
  limit: Joi.number().default(20),
  invoice_number: Joi.string().optional(),
  status: Joi.string().optional(),
};
