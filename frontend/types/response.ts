import { ProductType } from "./product";

export type ResponseType = {
  result: ProductType[] | null;
  loading: boolean;
  error: string;
};