import {ENDPOINTS} from '@rtkServices/endpoints';
import {api} from '../index';

export const profileApi = api.injectEndpoints({
  endpoints: builder => ({
    getUserProfileById: builder.query<UserProfileResponse, {id: string}>({
      query: data => ({
        url: ENDPOINTS.user.getUserProfileById(data.id),
        method: 'GET',
      }),
      providesTags: [
        'UserProfile',
        'BlockedUser',
        'Follower_Following',
        'Subscription',
      ],
    }),

    getUserProfileContent: builder.query<any, {id: string}>({
      query: data => ({
        url: ENDPOINTS.user.getUserProfileContentById(data.id),
        method: 'GET',
      }),
      providesTags: ['UserProfile', 'BlockedUser'],
    }),

    markAccountViewed: builder.mutation<any, {id: string}>({
      query: data => ({
        url: ENDPOINTS.contentAcction.viewCount(data.id),
        method: 'POST',
        body: {
          contentType: 'users',
        },
      }),
    }),

    getUserContentById: builder.query<
      UserContentResponse,
      {
        id: string;
        types: 'home' | 'videos' | 'shorts' | 'posts' | 'playlists';
        page?: number;
        limit?: number;
        search?: string;
      }
    >({
      query: ({id, types, page, limit, search}) => {
        const queryParams = new URLSearchParams();
        if (types) queryParams.append('type', types);
        if (page) queryParams.append('page', page.toString());
        if (limit) queryParams.append('limit', limit.toString());
        queryParams.append('search', '');

        return {
          url: `${ENDPOINTS.user.getUserProfileContentById(
            id,
          )}?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: [
        'UserProfile',
        'BlockedUser',
        'Subscription',
        'Follower_Following',
        'ContentUpload',
      ],
    }),

    blockUnblockUser: builder.mutation<
      any,
      {id: string; action: 'block' | 'unblock'}
    >({
      query: data => ({
        url: ENDPOINTS.user.blockUnblockUser,
        method: 'POST',
        body: {
          blockedId: data.id,
          action: data.action,
        },
      }),
      invalidatesTags: ['BlockedUser', 'Follower_Following'],
    }),

    getFollowersById: builder.query<
      FollowersResponse,
      {page?: number; limit?: number; userId: string}
    >({
      query: data => ({
        url: ENDPOINTS.user.userFollowers,
        params: {
          page: data.page,
          limit: data.limit,
          userId: data.userId,
        },
        method: 'GET',
      }),
      providesTags: ['Follower_Following'],
    }),

    getFollowingById: builder.query<
      FollowingResponse,
      {page?: number; limit?: number; userId: string}
    >({
      query: data => ({
        url: ENDPOINTS.user.userFollowings,
        params: {
          page: data.page,
          limit: data.limit,
          userId: data.userId,
        },
        method: 'GET',
      }),
      providesTags: ['Follower_Following'],
    }),
    reportProblem: builder.mutation<ReportProblemResponse, ReportProblemBody>({
      query: body => ({
        url: ENDPOINTS.user.reportProblem,
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    }),
    updateProfile: builder.mutation<UpdateProfileResponse, UpdateProfileBody>({
      query: body => ({
        url: ENDPOINTS.user.updateProfile,
        method: 'PUT',
        body,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: ['UserProfile', 'BlockedUser', 'Follower_Following'],
    }),

    updateMembershipPlan: builder.mutation<
      UpdatePlanResponse,
      {membership: 'standard' | 'creator' | string}
    >({
      query: data => ({
        url: ENDPOINTS.user.updatePlan,
        method: 'PATCH',
        body: {
          membership: data.membership,
        },
      }),
    }),
  }),
});
export const {
  useGetUserProfileByIdQuery,
  useGetUserProfileContentQuery,
  useMarkAccountViewedMutation,
  useGetUserContentByIdQuery,
  useBlockUnblockUserMutation,
  useGetFollowersByIdQuery,
  useGetFollowingByIdQuery,
  useReportProblemMutation,
  useUpdateProfileMutation,
  useUpdateMembershipPlanMutation,
} = profileApi;
