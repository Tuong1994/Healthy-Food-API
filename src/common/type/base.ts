export type Paging<M> = {
  totalItems: number;
  page: number;
  limit: number;
  items: M[];
};

export type List<M> = Omit<Paging<M>, 'page' | 'limit'>;
