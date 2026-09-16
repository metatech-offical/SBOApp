import {
  ENDPOINTS,
  GET_ALL_NOTIFICATION,
  GET_FAVORITE_CREATORS,
  GET_ORDER_HISTORY,
  GET_ORDERS_MANAGEMENT,
} from '@rtkServices/endpoints';
import {api} from '../index';

export const homeApi = api.injectEndpoints({
  endpoints: builder => ({
    getFavoriteCreators: builder.query<
      FavoriteCreatorsResponse,
      {page: number; limit: number}
    >({
      query: data => ({
        url: GET_FAVORITE_CREATORS(data.page, data.limit),
        method: 'GET',
      }),
      providesTags: ['FavoriteCreators'],
    }),
    addFavoriteCreator: builder.mutation<any, {creatorId: string}>({
      query: body => ({
        url: ENDPOINTS.user.addFavoriteCreator,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['FavoriteCreators'],
    }),
    removeFavoriteCreator: builder.mutation<any, {creatorId: string}>({
      query: ({creatorId}) => ({
        url: ENDPOINTS.user.removeFavoriteCreator(creatorId),
        method: 'DELETE',
      }),
      invalidatesTags: ['FavoriteCreators'],
    }),
    getOrdersManagement: builder.query<
      OrderResponse,
      {page: number; limit: number; status?: string}
    >({
      query: data => {
        const url = GET_ORDERS_MANAGEMENT(data.page, data.limit, data.status);
        return {
          url,
          method: 'GET',
        };
      },
      providesTags: ['OrderManagement'],
    }),
    getOrderDetail: builder.query<OrderDetailResponse, {orderId: string}>({
      query: data => ({
        url: ENDPOINTS.store.orderDetailById(data.orderId),
        method: 'GET',
      }),
      providesTags: ['OrderManagement'],
    }),
    rejectOrder: builder.mutation<RejectOrderRes, RejectOrderReq>({
      query: body => ({
        url: ENDPOINTS.store.acceptRejectOrder,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['OrderManagement'],
    }),
    acceptOrder: builder.mutation<AcceptOrderRes, AcceptOrderReq>({
      query: body => ({
        url: ENDPOINTS.store.acceptRejectOrder,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['OrderManagement'],
    }),
    getOrderHistory: builder.query<
      OrderHistoryResponse,
      {page: number; limit: number}
    >({
      query: data => ({
        url: GET_ORDER_HISTORY(data.page, data.limit),
        method: 'GET',
      }),
      providesTags: ['Checkout'],
    }),
    getAllNotification: builder.query<
      NotificationResponse,
      {
        page: number;
        limit: number;
        fromDate?: string | null;
        toDate?: string | null;
        search?: string;
      }
    >({
      query: data => ({
        url: GET_ALL_NOTIFICATION(data),
        method: 'GET',
      }),
      providesTags: [
        'Shorts',
        'Post',
        'Follower_Following',
        'Subscription',
        'Checkout',
      ],
    }),
    homeStatistics: builder.query<HomeStatisticsResponse, void>({
      query: () => ({
        url: ENDPOINTS.user.homeStatistics,
        method: 'GET',
      }),
    }),
    userSuggestedAccount: builder.query<
      SuggestedAccountsResponse,
      {page?: number; limit?: number}
    >({
      query: params => ({
        url: ENDPOINTS.user.suggestedAccount,
        method: 'GET',
        params,
      }),
      providesTags: ['Subscription', 'BlockedUser', 'Follower_Following'],
    }),
    notificationRead: builder.mutation<any | null, any>({
      query: body => ({
        url: ENDPOINTS.user.readNotification,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetFavoriteCreatorsQuery,
  useAddFavoriteCreatorMutation,
  useRemoveFavoriteCreatorMutation,
  useGetOrdersManagementQuery,
  useGetOrderDetailQuery,
  useRejectOrderMutation,
  useAcceptOrderMutation,
  useGetOrderHistoryQuery,
  useGetAllNotificationQuery,
  useHomeStatisticsQuery,
  useUserSuggestedAccountQuery,
  useNotificationReadMutation,
} = homeApi;
