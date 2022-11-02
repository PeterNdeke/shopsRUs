export const DefinedSchemaNames = {
  SHOPS_RUs_SERVICE: "shops",
} as const;

export const DB_SCHEMA = DefinedSchemaNames.SHOPS_RUs_SERVICE;

export const DefinedTableNames = {
  CUSTOMERS: "customers",
  INVOICE: "invoices",
  INVOICE_ITEMS: "invoice_items",
  DISCOUNTS: "discounts",
} as const;

export enum HTTPStatus {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  OK = 200,
  CREATED = 201,
  INTERNAL_SERVER_ERROR = 500,
  VALIDATION_ERROR = 422,
  UNAUTHORIZED_ERROR = 401,
  PERMISSION_ERROR = 403,
}

export const CUSTOMER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

export const CUSTOMER_TYPE = {
  EMPLOYEE: "employee",
  AFFILIATE: "affiliate",
  CUSTOMER: "customer",
};

export const INVOICE_STATUS = {
  PAID: "paid",
  UNPAID: "unpaid",
};
