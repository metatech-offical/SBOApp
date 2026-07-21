import {
  GET_ALL_SHORTS_FEED,
  RECOMMENDED_SHORTS,
  TRENDING_SHORTS,
  GET_ALL_VIDEOS,
  GET_ALL_STREAM_BY_CATEGORY,
  ENDPOINTS,
} from '@rtkServices/endpoints';
import {api} from '../index';

export const shortsApi = api.injectEndpoints({
  endpoints: builder => ({
    createShort: builder.mutation<any, any>({
      query: body => ({
        url: ENDPOINTS.contentAcction.createShorts,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['UserProfile', 'BlockedUser', 'Shorts'],
    }),
    getShortPresignedUrl: builder.query<any, any>({
      query: ({type}) => ({
        url: `${
          ENDPOINTS.contentAcction.getShortsPreSignedUrl
        }?type=${encodeURIComponent(type)}`,
        method: 'GET',
      }),
      providesTags: ['Shorts'],
    }),
    getShortsById: builder.query<UserShorts | null, {id: string}>({
      query: params => ({
        url: ENDPOINTS.contentAcction.getShortsById(params.id),
        method: 'GET',
      }),
      providesTags: ['Shorts', 'ContentUpload', 'Follower_Following'],
    }),
    getCategoryData: builder.query<any, any>({
      query: () => ({
        url: ENDPOINTS.stream.getCategoryData,
        method: 'GET',
      }),
    }),
    getAllShortsFeed: builder.query<any, any>({
      query: params => ({
        url: GET_ALL_SHORTS_FEED(params),
        method: 'GET',
      }),
      providesTags: ['Shorts', 'ContentUpload', 'Follower_Following'],
    }),
    getRecommendedShorts: builder.query<any, any>({
      query: params => ({
        url: RECOMMENDED_SHORTS(params),
        method: 'GET',
      }),
      providesTags: ['Shorts', 'Subscription'],
    }),
    uploadCoverImage: builder.mutation<any, any>({
      query: data => {
        const formData = new FormData();
        formData.append('file', {
          uri: data?.path || data?.sourceURL,
          type: data?.mime || 'image/jpeg',
          name: 'profile.jpg',
        });
        return {
          url: ENDPOINTS.contentAcction.uploadCoverImage,
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: any) => {
        return response;
      },
    }),
    getTrendingShorts: builder.query<any, any>({
      query: params => ({
        url: TRENDING_SHORTS(params),
        method: 'GET',
      }),
      providesTags: ['Shorts', 'Subscription'],
    }),
    getStreamById: builder.query<any, {id: string}>({
      query: params => ({
        url: ENDPOINTS.stream.getStreamById(params.id),
        method: 'GET',
      }),
      providesTags: ['ContentUpload', 'Follower_Following'],
    }),
    getAllStreams: builder.query<any, any>({
      query: params => ({
        url: GET_ALL_VIDEOS(params),
        method: 'GET',
      }),
      providesTags: ['LiveStream', 'Subscription', 'ContentUpload'],
    }),
    getSubscriptions: builder.query<any, any>({
      query: () => ({
        url: ENDPOINTS.stream.subscriptionStreamList,
        method: 'GET',
      }),
      providesTags: ['Subscription', 'LiveStream', 'ContentUpload'],
    }),
    getStreamByCategory: builder.query<any, any>({
      query: params => ({
        url: GET_ALL_STREAM_BY_CATEGORY(params),
        method: 'GET',
      }),
      providesTags: ['LiveStream', 'Subscription'],
    }),
    whatsHot: builder.query<any, {page?: number; limit?: number}>({
      query: params => {
        return {
          url: `${ENDPOINTS.stream.whatsHot}?page=${params.page || 1}&limit=${
            params.limit || 10
          }`,
          method: 'GET',
        };
      },
      providesTags: ['LiveStream', 'ContentUpload'],
    }),
    createPost: builder.mutation<any, any>({
      query: data => ({
        url: ENDPOINTS.contentAcction.createPost,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['UserProfile', 'BlockedUser', 'ContentUpload'],
    }),
    uploadCroppCoverImage: builder.mutation<any, any>({
      query: data => {
        const mime = data?.mime || 'image/jpeg';
        const ext =
          mime.includes('png')
            ? 'png'
            : mime.includes('webp')
              ? 'webp'
              : mime.includes('gif')
                ? 'gif'
                : 'jpg';
        const formData = new FormData();
        formData.append('file', {
          uri: data?.sourceURL || data?.path,
          type: mime,
          name: data?.filename || `upload-${Date.now()}.${ext}`,
        } as any);
        return {
          url: ENDPOINTS.contentAcction.uploadCoverImage,
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: any) => {
        return response;
      },
    }),
    deleteShorts: builder.mutation<any, {id: string}>({
      query: params => ({
        url: ENDPOINTS.contentAcction.deleteShorts(params.id),
        method: 'DELETE',
      }),
      invalidatesTags: ['Shorts', 'UserProfile', 'ContentUpload'],
    }),
  }),
});
export const {
  useCreateShortMutation,
  useGetShortPresignedUrlQuery,
  useGetShortsByIdQuery,
  useGetCategoryDataQuery,
  useGetAllShortsFeedQuery,
  useUploadCoverImageMutation,
  useGetRecommendedShortsQuery,
  useGetTrendingShortsQuery,
  useGetStreamByIdQuery,
  useGetAllStreamsQuery,
  useGetSubscriptionsQuery,
  useGetStreamByCategoryQuery,
  useWhatsHotQuery,
  useCreatePostMutation,
  useUploadCroppCoverImageMutation,
  useDeleteShortsMutation,
} = shortsApi;
