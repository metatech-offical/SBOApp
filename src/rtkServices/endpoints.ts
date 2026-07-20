import {
  BASE_URL_LOCAL,
  SOCKET_URL_LOCAL,
  BASE_URL_STAGING,
  SOCKET_URL_STAGING,
  POST_UPLOAD_URL_LOCAL,
  POST_UPLOAD_URL_STAGING,
} from '@env';

// true = Railway production; false = local SboServer
export const isStaging = true;

export const BASE_URL = isStaging
  ? BASE_URL_STAGING ||
    'https://sboserver-production.up.railway.app/v1/api/'
  : BASE_URL_LOCAL || 'http://localhost:8080/v1/api/';
export const SOCKET_URL = isStaging
  ? SOCKET_URL_STAGING || 'https://sboserver-production.up.railway.app'
  : SOCKET_URL_LOCAL || 'http://localhost:8080';
export const POST_UPLOAD_URL = isStaging
  ? POST_UPLOAD_URL_STAGING ||
    'https://sboserver-production.up.railway.app/v1/api/stream/videos/upload'
  : POST_UPLOAD_URL_LOCAL ||
    'http://localhost:8080/v1/api/stream/videos/upload';

export const ZEGO_NEW_APP_ID = '1496870460';
export const ZEGO_APP_NEW_SIGNIN_ID =
  '8dff763d9a2dbde98ecf7abe124473524674937f7331838fea32ce4a5c5e40e0';

// export const ZEGO_APP_ID = '1321638506';
// export const ZEGO_APP_SIGNIN_ID =
//   '9b0ac4aa6cd74c2d3e1978998d3ec6f441097b3792595c5d4d2ea518abb1b6e1';

export const ENDPOINTS = {
  auth: {
    signup: 'auth/signup/email',
    verifyOtp: 'auth/verify-signup-otp',
    login: 'auth/login',
    saveUserPass: 'auth/save/username-password',
    forgotPassword: 'auth/forgot-password/send-otp',
    verifyForgotOtp: 'auth/forgot-password/verify-otp',
    resetPassword: 'auth/reset-password',
    checkMemberShip: 'user/membership',
    mobileSignup: 'auth/signup/phone',
    completeProfile: 'auth/login/complete-profile',
    checkUserValid: 'auth/check-username',
    logout: 'auth/logout',
    resendOtp: 'auth/signup/resend-otp',
  },
  user: {
    deleteAccount: 'user/',
    privacyPolicy: 'about/privacy-policy',
    termsOfService: 'about/terms-of-service',
    reportProblem: 'report-problem',
    notificationSetting: 'user/notification-settings',
    updateProfile: 'user/creator-settings',
    getBlockedUser: 'user/blocked-users',
    userFollowers: 'user/followers',
    userFollowings: 'user/following',
    blockUnblockUser: 'user/block',
    suggestedAccount: 'user/suggested-accounts',
    followUnfollowUser: 'user/follow',
    homeStatistics: 'user/statistics',
    readNotification: 'notification/read',
    getUserProfileById: (id: string) => `user/data/${id}`,
    getUserProfileContentById: (id: string) => `user/profile-content/${id}`,
    updatePlan: 'user/membership',
  },
  store: {
    storeAnalytics: 'store/store-analytics',
    createCollection: 'store/create-collection',
    getAllCollection: 'store/all-collections',
    addProduct: 'store/add-product',
    orderCheckout: 'order/checkout',
    getAllStores: 'store/all-stores',
    storeCollections: 'store/get-collections-from-all-stores',
    storeAllProduct: 'store/all-products',
    getAllProdctByCollection: 'store/all-products-by-collection',
    getAllCollectionOfStore: 'store/get-collections-of-store',
    getWishList: 'store/get-wishlist',
    acceptRejectOrder: 'order/status',
    getStoreCollectionDetail: (id: string) => `store/collection/${id}`,
    updateCollection: (id: string) => `store/update-collection/${id}`,
    getProductDetail: (id: string) => `store/product/${id}`,
    addItemToWishlist: (id: string) => `store/add-item-wishlist/${id}`,
    removeItemToWishlist: (id: string) => `store/remove-item-wishlist/${id}`,
    updateProduct: (id: string) => `store/update-product/${id}`,
    deleteProduct: (id: string) => `store/product/remove/${id}`,
    orderDetailById: (orderId: string) => `order/data/${orderId}`,
    globalReturnPolicy: 'store/global-return-policy',
  },
  creatorTicketing: {
    createEvent: 'events/create',
    liveEventsByCreatorId: (creatorId: string) =>
      `events/creator/${creatorId}?timeFilter=live`,
    comingSoonEventsByCreatorId: (creatorId: string) =>
      `events/creator/${creatorId}?timeFilter=upcoming`,
    pastEventsByCreatorId: (creatorId: string) =>
      `events/creator/${creatorId}?timeFilter=past`,
    eventGetDetailById: (eventId: string) => `events/${eventId}`,
    eventUpdateById: (eventId: string) => `events/${eventId}`,
    eventCancelById: (eventId: string) => `events/${eventId}/cancel`,
  },
  stream: {
    creatStream: 'stream/create',
    initiateVideoUpload: 'stream/videos/initiate',
    getMultiUrls: 'get-multi-urls',
    whatsHot: 'stream/trending',
    subscriptionStreamList: 'stream/my-subscribed-streams',
    getCategoryData: 'category/list',
    streamCarouselApi: 'stream/carousel',
    createLiveStream: 'stream/create-livestream',
    getAllStream: 'stream/live-streams',
    getLiveStreamByUser: 'stream/live-streams/',
    getStreamById: (id: string) => `stream/data/${id}`,
    deleteStream: (id: string) => `stream/${id}`,
    toggleSaveVod: (streamId: string) => `streams/${streamId}/save-vod`,
    getMyVods: 'streams/my-vods',
    getVodsByCreator: (creatorId: string) => `streams/vods/${creatorId}`,
  },
  address: {
    creatAddress: 'user/addresses',
    getAddress: 'user/addresses',
    getAddressId: (addressId: string) => `user/addresses/${addressId}`,
    updateAddress: (addressId: string) => `user/addresses/${addressId}`,
    deleteAddress: (addressId: string) => `user/addresses/${addressId}`,
  },
  cart: {
    addToCart: 'cart/add',
    removeFromCart: 'cart/remove',
    clearCart: 'cart/clear',
    updateCartItem: 'cart/quantity',
    getCartItem: (params: {page?: number; limit?: number}) => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      return `cart?${queryParams.toString()}`;
    },
  },
  search: {
    getSearchResult: 'search',
    getTrendingSearchResult: 'search/trending',
  },
  subscription: {
    addSubscription: 'subscription/add-plan',
    subscribePlan: 'subscription/subscribe',
    unSubscribePlan: 'subscription/unsubscribe',
    getMySubscriberCreators: 'subscription/my-subscribed-creators',
    subscribedList: 'subscription/subscribers-list',
    getCreatorPlans: (creatorId: string) => `subscription/plans/${creatorId}`,
    updatePlan: (planId: string) => `subscription/update-plan/${planId}`,
    deletePlan: (planId: string) => `subscription/delete-plan/${planId}`,
  },
  contentAcction: {
    createPlayList: 'playlist/create',
    createPost: 'post/create-post',
    createShorts: 'shorts/create',
    getShortsPreSignedUrl: 'content-action/presigned-url',
    addContentComment: 'content-action/comment/create',
    uploadCoverImage: 'content-action/upload-cover',
    getContentCommentById: (id: string) => `content-action/comment/${id}`,
    getContentReplies: (id: string) => `content-action/comment/${id}/replies`,
    deleteComment: (id: string) => `content-action/comment/${id}`,
    likeContent: (id: string) => `content-action/like/${id}`,
    saveUnsaveContent: (type: string) => `content-action/save/${type}`,
    getSaveContent: (type: string) => `content-action/saved-items/${type}`,
    viewCount: (id: string) => `content-action/view/${id}`,
    getShortsById: (id: string) => `shorts/data/${id}`,
    deleteShorts: (id: string) => `shorts/data/${id}`,
    addItemToPlaylist: (id: string) => `playlist/${id}/add`,
    removeItemToPlaylist: (id: string) => `playlist/${id}/remove`,
    updatePlaylist: (id: string) => `playlist/${id}`,
    deletePlaylist: (id: string) => `playlist/${id}`,
    getPlaylistById: (id: string) => `playlist/${id}`,
    reportAction: 'content-action/report',
    notInterested: 'content-action/not-interested/add',
    deletePost: (id: string) => `post/delete-post/${id}`,
  },
  ticketing: {
    getEvents: (params: {
      page?: number;
      limit?: number;
      timeFilter?: string;
      search?: string;
      date?: any;
      city?: string;
    }) => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.timeFilter)
        queryParams.append('timeFilter', params.timeFilter);
      if (params.search) queryParams.append('search', params.search);
      if (params.date) queryParams.append('date', params.date);
      if (params.city) queryParams.append('city', params.city);

      return `events?${queryParams.toString()}`;
    },
    getEventDetail: (params: {id?: string}) => `events/${params?.id}`,
    createTicket: `ticket-orders/create`,
    getEventsOfCreator: (params: {
      creatorid: string;
      page?: number;
      limit?: number;
      search?: string;
      date?: any;
      city?: string;
    }) => {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.date) queryParams.append('date', params.date);
      if (params.city) queryParams.append('city', params.city);

      return `events/creator/${params.creatorid}?${queryParams.toString()}`;
    },
  },
};

export const GET_PRODUCTS = (params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.search) queryParams.append('search', params.search);
  if (params.status) queryParams.append('status', params.status);
  return `store/all-products?${queryParams.toString()}`;
};
export const GET_ALL_SHORTS_FEED = (params: {
  creatorId?: string;
  categoryName?: string;
  page?: number;
  limit?: number;
}) => {
  const queryParams = new URLSearchParams();
  if (params.creatorId) queryParams.append('creatorId', params.creatorId);
  if (params.categoryName)
    queryParams.append('categoryName', params.categoryName);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  return `shorts/filtered-data?${queryParams.toString()}`;
};
export const RECOMMENDED_SHORTS = (params: {page?: number; limit?: number}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  return `shorts/recommended?${queryParams.toString()}`;
};
export const TRENDING_SHORTS = (params: {page?: number; limit?: number}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  return `shorts/trending?${queryParams.toString()}`;
};
export const GET_FAVORITE_CREATORS = (page: number, limit: number) => {
  return `user/favorite-creators?page=${page}&limit=${limit}`;
};
export const GET_ORDERS_MANAGEMENT = (
  page: number,
  limit: number,
  status?: string,
) => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (status && status !== 'all') {
    params.append('status', status);
  }
  return `order/list?${params.toString()}`;
};
export const GET_ORDER_HISTORY = (page: number, limit: number) => {
  return `order/history?page=${page}&limit=${limit}`;
};
export const GET_ALL_NOTIFICATION = (params: {
  page: number;
  limit: number;
  fromDate?: string | null;
  toDate?: string | null;
  search?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params?.page.toString());
  if (params.limit) queryParams.append('limit', params?.limit.toString());
  if (params.fromDate) queryParams.append('fromDate', params?.fromDate);
  if (params.toDate) queryParams.append('toDate', params?.toDate);
  if (params.search) queryParams.append('search', params?.search);
  return `notification?${queryParams.toString()}`;
};
export const GET_SEARCH_PLAYLIST = (
  creatorId: string,
  pageNumber: number,
  pageLimit: number,
  keyword: string,
) => {
  return `playlist?createdBy=${creatorId}&search=${keyword}&page=${pageNumber}&limit=${pageLimit}`;
};
export const GET_ALL_VIDEOS = (params: {
  creatorId?: string;
  categoryName?: string;
  page?: number;
  limit?: number;
  type?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params.creatorId) queryParams.append('creatorId', params.creatorId);
  if (params.categoryName)
    queryParams.append('categoryName', params.categoryName);
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.type) queryParams.append('type', params.type);
  return `stream/filtered-data?${queryParams.toString()}`;
};
export const GET_ALL_STREAM_BY_CATEGORY = (params: {
  creatorId?: string;
  categoryName?: string;
  page?: any;
  limit?: number;
  type?: string;
}) => {
  const queryParams = new URLSearchParams();
  if (params.creatorId) queryParams.append('creatorId', params.creatorId);
  if (params.type) queryParams.append('type', params.type);
  if (params.categoryName)
    queryParams.append('categoryName', params.categoryName);
  if (params.page) queryParams.append('page', params.page?.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());
  return `stream/filtered-data?${queryParams.toString()}`;
};
