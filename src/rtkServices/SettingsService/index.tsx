import {ENDPOINTS} from '@rtkServices/endpoints';
import {api} from '../index';

export const settingService = api.injectEndpoints({
  endpoints: builder => ({
    deleteAccount: builder.mutation<DeleteRes | null, DeleteBody>({
      query: body => ({
        url: ENDPOINTS.user.deleteAccount,
        method: 'DELETE',
        body,
      }),
    }),
    aboutPrivacyPolicy: builder.query<PrivacyStatement, void>({
      query: () => ({
        url: ENDPOINTS.user.privacyPolicy,
        method: 'GET',
      }),
    }),
    aboutTermsOfService: builder.query<TermsOfService, void>({
      query: () => ({
        url: ENDPOINTS.user.termsOfService,
        method: 'GET',
      }),
    }),
    notificationSettings: builder.mutation<
      NotificationRes | null,
      NotificationBody
    >({
      query: body => ({
        url: ENDPOINTS.user.notificationSetting,
        method: 'PUT',
        body,
      }),
    }),
    getBlockedUsersList: builder.query<any, {page: number; limit: number}>({
      query: ({page, limit}) => ({
        url: `${ENDPOINTS.user.getBlockedUser}?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
      providesTags: ['BlockedUser'],
    }),

    getSaveContent: builder.query<
      any,
      {
        contentType:
          | 'shorts'
          | 'streams'
          | 'posts'
          | 'contentcomments'
          | 'users';
      }
    >({
      query: ({contentType}) => ({
        url: ENDPOINTS.contentAcction.getSaveContent(contentType),
        method: 'GET',
      }),
      providesTags: ['SaveContent', 'ContentUpload'],
    }),
  }),
});

export const {
  useDeleteAccountMutation,
  useAboutPrivacyPolicyQuery,
  useAboutTermsOfServiceQuery,
  useNotificationSettingsMutation,
  useGetBlockedUsersListQuery,
  useGetSaveContentQuery,
} = settingService;
