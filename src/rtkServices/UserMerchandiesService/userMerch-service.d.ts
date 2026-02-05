interface GetAllStoresRes {
  status: boolean;
  message: string;
  data: any;
}

interface StoreCollection {
  _id: string;
  name: string;
  description: string;
  tags: string[];
  coverImage: string;
  store: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface GetAllStoresCollectionsRes {
  success: boolean;
  message: string;
  data: {
    collections: StoreCollection[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

interface ProductVariant {
  color: string;
  price: number;
  size: string;
  sku: string;
  stock: number;
}

interface Product {
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
  status: 'live' | 'draft' | 'coming_soon';
  isAddedToWishlist: boolean;
  returnPolicy: string;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  hasVariants: boolean;
  stock: number;
}

interface GetAllProductsRes {
  success: boolean;
  message: string;
  data: {
    pagination: {
      page: number;
      limit: number;
      total: number;
    };
    totalProductList: Product[];
  };
}

interface AddToCartPayload {
  productId: string;
  storeId: string;
  variant: {
    size: string;
    color?: string;
    sku: string;
    price: number;
  };
  quantity?: number;
}

interface RemovePayload {
  productId: string;
  variant: {
    size: string;
    color?: string;
    sku: string;
    price: number;
  };
  quantity?: number;
}

interface UpdateCartItemPayload {
  productId: string;
  variant: {
    size: string;
    color?: string;
    sku: string;
    price: number;
  };
  quantity: number;
}

interface RemovePayloadRes {
  success: boolean;
  message: string;
  data: {
    _id: string;
    userId: string;
    items: []; // Will be empty after removal
    lastUpdated: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

interface GetCartItemsRes {
  success: boolean;
  message: string;
  data: {
    cart: {
      _id: string;
      userId: string;
      items: CartItem[];
      lastUpdated: string; // ISO date string
      createdAt: string; // ISO date string
      updatedAt: string; // ISO date string
      __v: number;
    };
    totalPrice: number;
    totalCartItems: number;
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  };
}
interface CartItem {
  productId: {
    _id: string;
    productName: string;
    media: string[];
    storeId: {
      _id: string;
      logo: string;
      name: string;
    };
    status: string;
  };
  storeId: string;
  variant: {
    size: string;
    color?: string;
    sku: string;
    price: number;
  };
  quantity: number;
  addedAt: string; // ISO date string
}

interface AddToCartRes {
  success: boolean;
  message: string;
  data: {
    _id: string;
    userId: string;
    items: AddToCartItem[];
    lastUpdated: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

interface AddToCartItem {
  productId: string;
  storeId: string;
  variant: {
    size: string;
    color?: string;
    sku: string;
    price: number;
  };
  quantity: number;
  addedAt: string;
}

interface ClearCartRes {
  success: boolean;
  message: string;
  data: {
    _id: string;
    userId: string;
    items: []; // Cart is empty after clearing
    lastUpdated: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}
