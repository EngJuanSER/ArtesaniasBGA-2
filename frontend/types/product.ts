export type ProductType = {
  id: number;
  documentId: string;
  productName: string;
  slug: string;
  description: string;
  active: boolean;
  isFeatured: boolean;
  origin: string;
  price: number;
  images: ImageType[];
  category: CategoryType | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  stock: bigint;
  comments: CommentType[];
  offer: boolean;
  priceOffer: number | null;
  actions?: any[]; // Added as per schema, type can be refined if needed
};

export type ImageType = {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: FormatType | null;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type FormatType = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
};

export type CategoryType = {
  id: number;
  slug: string;
  categoryName: string;
};

export type CommentType = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};