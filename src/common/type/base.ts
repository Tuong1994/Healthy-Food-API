export type Paging<M> = {
  totalItems: number;
  page: number;
  limit: number;
  data: M[];
};
