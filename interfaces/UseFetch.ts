import { AxiosError } from "axios";

type ResponseType<T> = {
  next: string | null;
  previous: string | null;
  results: T[];
  count?: number;
  items?: any;
  totalItems?: any;
  sum_transaction_amount?: any;
};

type ResponseErrorType<T = any> = AxiosError<T>;

export type { ResponseType, ResponseErrorType };
