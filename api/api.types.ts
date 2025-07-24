export interface IResponseError {
  message: string;
  error: string;
  statusCode: number;
}

export interface IBaseResponse<T> {
  data: T;
  meta?: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
