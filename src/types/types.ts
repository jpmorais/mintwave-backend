export interface RequestQuery {
  sort?: string;
  filter?: string;
  page?: number;
  limit?: number;
  isFull?: boolean;
}

export interface Consulta {
  where?: any;
  skip?: number;
  take?: number;
  orderBy?: any;
  select?: any;
}

export interface payloadReadAll<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}
