import {ENDPOINTS} from '@rtkServices/endpoints';
import {api} from '../index';

export const contentActionApi = api.injectEndpoints({
  endpoints: builder => ({
    getContentCommentsById: builder.query<
      IGetAllCommentRes | null,
      {id: string; page?: number; limit?: number}
    >({
      query: params => ({
        url: ENDPOINTS.contentAcction.getContentCommentById(params.id),
        method: 'GET',
        params: {
          page: params.page,
          limit: params.limit,
        },
      }),
    }),
    addContentComment: builder.mutation<any, ICommentRequest>({
      query: body => ({
        url: ENDPOINTS.contentAcction.addContentComment,
        method: 'POST',
        body,
      }),
    }),
    getContentCommentsReplies: builder.query<any, {comment_id: string}>({
      query: ({comment_id}) => ({
        url: ENDPOINTS.contentAcction.getContentReplies(comment_id),
        method: 'GET',
      }),
    }),
    deleteContentComment: builder.mutation<any, {comment_id: string}>({
      query: ({comment_id}) => ({
        url: ENDPOINTS.contentAcction.deleteComment(comment_id),
        method: 'DELETE',
      }),
    }),
    likeContent: builder.mutation<
      any,
      {content_id: string; contentType: string; action?: string}
    >({
      query: ({content_id, contentType, action}) => ({
        url: ENDPOINTS.contentAcction.likeContent(content_id),
        method: 'POST',
        body: {
          contentType,
          action,
        },
      }),
      invalidatesTags: ['ContentUpload'],
    }),
    followUnfollowUser: builder.mutation<any, {targetUserId: string}>({
      query: body => ({
        url: ENDPOINTS.user.followUnfollowUser,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Follower_Following'],
    }),
    saveUnsaveContent: builder.mutation<
      any,
      {content_id: string; contentType: string; action: 'save' | 'unsave'}
    >({
      query: ({content_id, contentType, action}) => ({
        url: ENDPOINTS.contentAcction.saveUnsaveContent(content_id),
        method: 'POST',
        body: {
          contentType,
          action,
        },
      }),
      invalidatesTags: ['SaveContent'],
    }),
    viewContent: builder.mutation<
      any,
      {contentId: string; contentType: string}
    >({
      query: ({contentId, contentType}) => ({
        url: ENDPOINTS.contentAcction.viewCount(contentId),
        method: 'POST',
        body: {
          contentType,
        },
      }),
    }),
    reportContent: builder.mutation<any | null, any>({
      query: body => ({
        url: ENDPOINTS.contentAcction.reportAction,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['report_not_intrested'],
    }),
    notInterested: builder.mutation<any | null, any>({
      query: body => ({
        url: ENDPOINTS.contentAcction.notInterested,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['report_not_intrested'],
    }),
    deletePost: builder.mutation<any | null, DeletePostReq>({
      query: params => ({
        url: ENDPOINTS.contentAcction.deletePost(params.postId),
        method: 'DELETE',
      }),
      invalidatesTags: ['ContentUpload'],
    }),
  }),
});
export const {
  useGetContentCommentsByIdQuery,
  useAddContentCommentMutation,
  useGetContentCommentsRepliesQuery,
  useDeleteContentCommentMutation,
  useLikeContentMutation,
  useFollowUnfollowUserMutation,
  useSaveUnsaveContentMutation,
  useViewContentMutation,
  useReportContentMutation,
  useNotInterestedMutation,
  useDeletePostMutation,
} = contentActionApi;
