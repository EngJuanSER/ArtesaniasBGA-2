export type ResponseType<T> = {
  result: T[] | null;
  loading: boolean;
  error: string;
};