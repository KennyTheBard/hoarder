

export type Pagination = {
   size: number;
   index: number;
}

export type DatabasePage = {
   offset: number;
   limit: number;
}

export function paginationToDatabasePage(page: Pagination): DatabasePage {
   return {
      offset: page.index * page.size,
      limit: page.size
   };
}

export function databasePageToPagination(page: DatabasePage): Pagination {
   return {
      size: page.limit,
      index: Math.floor(page.offset / page.limit)
   };
}