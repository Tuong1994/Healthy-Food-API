export type Paging<M> = {
  totalItems: number;
  page: number;
  limit: number;
  items: M[];
};

export type List<M> = Omit<Paging<M>, 'page' | 'limit'>;

export type SelectFieldsOptions = {
  hasCate?: boolean;
  hasLike?: boolean;
  hasSub?: boolean;
  convertLang?: boolean;
};
