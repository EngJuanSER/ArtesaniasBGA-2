export type FilterTypes = {
  result: ResultFilterTypes | null;
  loading: boolean;
  error: string;
};

export type FilterOptions = {
  origin: string;
  searchText: string;
  priceRange: {
    min: number;
    max: number;
  };
  sortBy: "price-asc" | "price-desc" | "name-asc" | "name-desc";
};

export type ResultFilterTypes = {
  schema: {
    attributes: {
      origin: {
        enum: string[];
      };
      price: number
    };
  };
};