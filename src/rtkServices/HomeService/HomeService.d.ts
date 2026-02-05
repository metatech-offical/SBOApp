interface FavoriteCreator {
  _id: string;
  contentId: string;
  contentType: string;
  creatorId: string;
  userId: string;
  creator: {
    _id: string;
    username: string;
    verified: boolean;
    displayName?: string;
    bio?: string;
    profilePicture?: string;
  };
}

interface FavoriteCreatorsPagination {
  limit: number;
  page: number;
}

interface FavoriteCreatorsResponse {
  success: boolean;
  message: string;
  data: {
    creators: FavoriteCreator[];
    pagination: FavoriteCreatorsPagination;
  };
}

interface WishlistProductVariant {
  size: string;
  stock: number;
  sku: string;
}

interface WishlistProduct {
  _id: string;
  category: string;
  collectionId: string;
  createdAt: string;
  description: string;
  media: string[];
  price: number;
  productName: string;
  returnPolicy: string;
  sku: string;
  status: string;
  storeId: string;
  tags: string[];
  updatedAt: string;
  variants: WishlistProductVariant[];
  __v: number;
}

interface WishlistPagination {
  page: number;
  limit: number;
  total: number;
}

interface WishlistResponse {
  success: boolean;
  message: string;
  data: {
    products: WishlistProduct[];
    pagination: WishlistPagination;
  };
}
interface OrderResponse {
  success: boolean;
  message: string;
  data: {
    orders: GetOrdersManagementResponse[];
    pagination: {
      totalRecords: number;
      currentPage: number;
      limit: number;
      totalPages: number;
    };
  };
}

interface GetOrdersManagementResponse {
  orderId: string;
  orderStatus: string;
  user: {
    username: string;
    profilePicture: string;
  };
  orderedAt: string; // ISO 8601 format
}

interface OrderDetailResponse {
  success: boolean;
  message: string;
  data: {
    order: OrderDetail;
  };
}
interface OrderDetail {
  _id: string;
  id: string;
  userId: string;
  storeId: string;
  creatorId: string;
  address: AddressOrderById;
  items: OrderDetailByOrderIdItem[];
  totalAmount: number;
  status: string;
  payment: PaymentOrderByIdDetail;
  createdAt: string; // ISO date string
  updatedAt: string;
  __v: number;
  creator: OrderByIdCreator;
}

interface AddressOrderById {
  location: {
    lat: number;
    lng: number;
  };
  fullName: string;
  mobileNumber: string;
  countryCode: string;
  streetNo: string;
  buildingName: string;
  city: string;
  areaDistrict: string;
  landmark: string;
  addressType: string;
}

interface OrderDetailByOrderIdItem {
  variant: {
    size: string;
    color: string;
    price: number;
  };
  productId: string;
  productName: string;
  sku: string;
  media: string[];
  quantity: number;
  itemPrice: number;
  lineTotal: number;
}

interface PaymentOrderByIdDetail {
  paymentId: string;
  provider: string;
  status: string;
}

interface OrderByIdCreator {
  _id: string;
  username: string;
  displayName: string;
  profilePicture: string;
}

interface RejectOrderReq {
  status: string;
  orderId: string;
}

interface AcceptOrderReq {
  status: string;
  orderId: string;
}
interface AcceptOrderRes {
  success: boolean;
  message: string;
  data: {
    orderId: string;
    status: string;
  };
}
interface RejectOrderRes {
  success: boolean;
  message: string;
  data: {
    orderId: string;
    status: string;
  };
}
interface OrderHistoryResponse {
  success: boolean;
  message: string;
  data: OrderHistoryResponseData;
}
interface OrderHistoryResponseData {
  orders: OrderHistoryData[];
  pagination: OrderHistoryPagination;
}

interface OrderHistoryData {
  _id: string;
  userId: string;
  storeId: string;
  creatorId: string;
  address: OrderHistoryDataAddress;
  items: OrderHistoryDataItems[];
  totalAmount: number;
  status: 'accepted' | 'rejected' | string;
  payment: OrderHistoryDataPayment;
  createdAt: string;
  updatedAt: string;
  __v: number;
  creator: OrderHistoryDataCreator;
  id: string;
}

interface OrderHistoryDataAddress {
  location: {
    lat: number;
    lng: number;
  };
  fullName: string;
  mobileNumber: string;
  countryCode: string;
  streetNo: string;
  buildingName: string;
  city: string;
  areaDistrict: string;
  landmark: string;
  addressType: string;
}

interface OrderHistoryDataItems {
  variant?: {
    size: string;
    color: string;
    price: number;
  };
  productId: string;
  productName: string;
  sku: string;
  media: string[];
  quantity: number;
  itemPrice: number;
  lineTotal: number;
}

interface OrderHistoryDataPayment {
  paymentId: string;
  provider: string;
  status: string;
}

interface OrderHistoryDataCreator {
  _id: string;
  username: string;
  displayName: string;
  profilePicture: string;
}

interface OrderHistoryPagination {
  totalRecords: number;
  currentPage: number;
  limit: number;
  totalPages: number;
}

interface HomeStatisticsResponse {
  success: boolean;
  message: string;
  data: HomeStatistics;
}

interface HomeStatistics {
  totalWatchedVideos: number;
  tickets: number;
  totalOrders: number;
}

interface SuggestedAccount {
  _id: string;
  username: string;
  verified: boolean;
  bio: string;
  displayName: string;
  profilePicture: string;
  engagementScore: number;
}

interface SUGPagination {
  totalPages: number;
  totalRecords: number;
  page: number;
  limit: number;
}

interface SuggestedAccountsData {
  data: SuggestedAccount[];
  pagination: SUGPagination;
}

interface SuggestedAccountsResponse {
  success: boolean;
  message: string;
  data: SuggestedAccountsData;
}

interface NotificationData {
  _id: string;
  type: string;
  isRead: boolean;
  senderId: string;
  userId: string;
  contentId: string | null;
  contentType: string | null;
  isActive: boolean;
  notificationText: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  sender: {
    _id: string;
    username: string;
  };
}

interface NotificationPagination {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

interface NotificationResponse {
  success: boolean;
  message: string;
  data: {
    data: NotificationData[];
    pagination: NotificationPagination;
  };
}
