import { FindOptions } from "sequelize";
import { injectable } from "inversify";
import { FriendlyErrorUtil } from "../utils/error-util";

@injectable()
export class BaseRepository extends FriendlyErrorUtil {
  private readonly DEFAULT_PAGING_SIZE = 10;
  private readonly DEFAULT_PAGING_PAGE = 1;

  constructor() {
    super();
  }

  protected _baseUtil_GetPagingParamsOnly({
    pageSize,
    currentPage,
    totalCount,
    pageCount,
  }: {
    pageSize?: number | null;
    currentPage?: number | null;
    totalCount?: number | null;
    pageCount?: number | null;
  } = {}) {
    const size = Number(pageSize) || this.DEFAULT_PAGING_SIZE;
    const page = Number(currentPage) || this.DEFAULT_PAGING_PAGE;

    const total = Number(totalCount) || 0;
    const page_count = Number(pageCount) || 0;
    return {
      results: [],
      pagination: {
        previous_page: page < 2 ? page : page - 1,
        current_page: page,
        next_page: size * page < total ? page + 1 : page,
        limit: size,
        pageCount: page_count,
        totalRows: total,
      },
    };
  }

  protected getPreparePaginationOptions<T = any>({
    pageSize,
    nextPage,
    findOptions,
  }: {
    findOptions: FindOptions<T>;
    nextPage?: number | null;
    pageSize?: number | null;
  }) {
    const size = Number(pageSize) || this.DEFAULT_PAGING_SIZE;
    const page = Number(nextPage) || this.DEFAULT_PAGING_PAGE;

    return {
      paginationFindOptions: {
        ...findOptions,
        limit: size,
        offset: (page - 1) * size,
      },
      size,
      page,
    };
  }

  protected getPostPaginationResult<T = any>({
    page,
    size,
    rows,
    count,
  }: {
    size: number;
    page: number;
    rows: T[];
    count: number;
  }) {
    const total = Number(count) || 0;
    const page_count = Math.ceil(total / size);

    if (!rows?.length) {
      return {
        results: [],
        pagination: {
          previous_page: page < 2 ? page : page - 1,
          current_page: page,
          next_page: size * page < total ? page + 1 : page,
          limit: size,
          pageCount: 0,
          totalRows: 0,
        },
      };
    }

    return {
      results: [...rows],
      pagination: {
        previous_page: page < 2 ? page : page - 1,
        current_page: page,
        next_page: size * page < total ? page + 1 : page,
        limit: size,
        pageCount: page_count,
        totalRows: total,
      },
    };
  }
}
