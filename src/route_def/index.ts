import { IRouteDefData } from "inversify-postman-collection";
import CustomerController from "./customer";
import Discount from "./discount";
import Invoice from "./invoice";

const routeDefinitionData: IRouteDefData = {
  CustomerController,
  Discount,
  Invoice,
};

export function getRouteDefinitionData() {
  return { ...routeDefinitionData };
}
