interface GetStoreAnalyticsRes {
  success: boolean;
  message: string;
  data: {
    totalProducts: number;
    liveProducts: number;
    outOfStockProducts: number;
    totalCollections: number;
  };
}

interface CreCollectionReq {
  name: string;
  description: string;
  coverImage: string;
  tags: string[];
}

interface CollectionData {
  name: string;
  description: string;
  tags: string[];
  coverImage: string;
  store: string;
  _id: string;
  createdAt: string; // or Date if you parse it
  updatedAt: string; // or Date if you parse it
  __v: number;
}

interface CreCollectionRes {
  success: boolean;
  message: string;
  data: CollectionData;
}

interface GetCollectionsRes {
  success: boolean;
  message: string;
  data: CollectionData[];
}

interface ProductVariant {
  size: string;
  stock: number;
  sku: string;
}

interface CreateProductReq {
  productName: string;
  description: string;
  price: number;
  media: string[];
  sku: string;
  category: string;
  returnPolicy: string;
  tags: string[];
  collectionId: string;
  variants: IProductVariant[];
}

interface ICreatedProduct {
  _id: string;
  productName: string;
  description: string;
  price: number;
  media: string[];
  storeId: string;
  collectionId: string;
  sku: string;
  tags: string[];
  category: string;
  returnPolicy: string;
  variants: IProductVariant[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface CreateProductRes {
  success: boolean;
  message: string;
  data: ICreatedProduct;
}

interface ProductVariant {
  size: string;
  stock: number;
  sku: string;
}

interface IProduct {
  _id: string;
  productName: string;
  description: string;
  price: number;
  media: string[];
  storeId: string;
  collectionId: string;
  sku: string;
  tags: string[];
  category: string;
  returnPolicy: string;
  variants: ProductVariant[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isAddedToWishlist: boolean;
}

interface IProductPagination {
  page: number;
  limit: number;
  total: number;
}

interface IProductData {
  totalProductList: IProduct[];
  pagination: IProductPagination;
}

interface GetProductsRes {
  success: boolean;
  message: string;
  data: IProductData;
}

interface IAddlistRes {
  success: boolean;
  message: string;
  data: any;
}

interface IAddlistReq {
  productId: string;
}

interface IRemovelistRes {
  success: boolean;
  message: string;
  data: any;
}

interface IRemovelistReq {
  productId: string;
}

interface IProductVariant {
  size: string;
  stock: number;
  sku: string;
}

interface IWishlistProduct {
  _id: string;
  productName: string;
  description: string;
  price: number;
  media: string[];
  storeId: string;
  collectionId: string;
  sku: string;
  tags: string[];
  category: string;
  returnPolicy: string;
  variants: IProductVariant[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface IWishlistPagination {
  page: number;
  limit: number;
  total: number;
}

interface IWishlistData {
  products: IWishlistProduct[];
  pagination: IWishlistPagination;
}
interface IGetWishlistRes {
  success: boolean;
  message: string;
  data: IWishlistData;
}

interface GetCollectionDetailRes {
  success: boolean;
  message: string;
  data: CollectionData;
}

interface GetProductDetailRes {
  success: boolean;
  message: string;
  data: any;
}

interface IUpdateProductRes {
  success: boolean;
  message: string;
  data: any;
}

interface IUpdateProductReq {
  productName: string;
  description: string;
  price: number;
  media: string[];
  sku: string;
  category: string;
  returnPolicy: string;
  tags: string[];
  collectionId: string;
  variants: IProductVariant[];
  status: string;
}

interface DeleteProductRes {}

interface DeleteProductReq {
  productId: string;
}

interface GetGlobalReturnPolicyRes {
  success: boolean;
  message: string;
  data: {
    returnPolicy: string | null;
  };
}
