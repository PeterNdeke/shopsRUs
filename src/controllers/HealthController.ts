import { Response, Request } from "express";
import {
  controller,
  httpGet,
  queryParam,
  getRouteInfo,
} from "inversify-express-utils";
import { HTTPStatus } from "../utils/constants";
import { BaseController } from "./BaseController";
import container from "../config/di";
import {
  getRouteDefinitions,
  convertRouteDefinitionToHtml,
  getPostmanCollection,
} from "inversify-postman-collection";
import { getRouteDefinitionData } from "../route_def/index";

@controller("/v1/health")
export class HealthController extends BaseController {
  constructor() {
    super();
  }

  @httpGet("/")
  public basicCheck(
    @queryParam("def__Health_check_route") def: string,
    _: Request,
    res: Response
  ) {
    this.resSuccess({
      res,
      data: [],
      message: "Basic Health Check Route Working.",
      httpStatus: HTTPStatus.OK,
    });
  }

  @httpGet("/routes")
  allRoute(
    @queryParam("def__View_all_available_route") def: string,
    req: Request,
    res: Response
  ) {
    const routeInfo = getRouteInfo(container);
    const result = getRouteDefinitions({
      routesDefs: routeInfo,
      title: "ShopsRUs Api",
      baseUrl: `{{shopsRUs-api-base-url}}`,
      routeDefData: getRouteDefinitionData(),
    });
    return this.successPlain({
      res,
      data: result,
    });
  }

  @httpGet("/routes/html")
  allRouteHtml(
    @queryParam("def__View_all_available_route_html") def: string,
    req: Request,
    res: Response
  ) {
    const routeInfo = getRouteInfo(container);
    const result = getRouteDefinitions({
      routesDefs: routeInfo,
      title: "Wivoucher Service Api",
      baseUrl: `{{collection-service-api-base-url}}`,
      routeDefData: getRouteDefinitionData(),
    });
    const html = convertRouteDefinitionToHtml({
      routeDefs: result,
      apiTitle: "Collection Service Api",
    });
    return this.successHtml({
      res,
      html,
    });
  }

  @httpGet("/postman")
  allRouteDownload(
    @queryParam("def__Download_postman_collection") def: string,
    req: Request,
    res: Response
  ) {
    const routeInfo = getRouteInfo(container);
    const headerEnvVariables = [["user", "{{user}}"]];
    const result = getPostmanCollection({
      headerEnvVariables,
      routesDefs: routeInfo,
      title: "Collection Service Api",
      baseUrl: `{{collection-service-api-base-url}}`,
      routeDefData: getRouteDefinitionData(),
    });
    return this.successDownload({
      res,
      data: result,
      downloadTitle: "collection-service-api-postman-collection",
    });
  }
}
