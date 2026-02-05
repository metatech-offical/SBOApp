import {ENDPOINTS} from '@rtkServices/endpoints';
import {api} from '../index';

export const newStreamService = api.injectEndpoints({
  endpoints: builder => ({
    newCreateStream: builder.mutation<CreateStream, any>({
      query: body => ({
        url: ENDPOINTS.stream.creatStream,
        method: 'POST',
        body,
      }),
    }),
    newInitiateVideoUpload: builder.mutation<any | null, any>({
      query: body => ({
        url: ENDPOINTS.stream.initiateVideoUpload,
        method: 'POST',
        body,
      }),
    }),
    newGetMultiUrls: builder.mutation<any | null, any>({
      query: body => ({
        url: ENDPOINTS.stream.getMultiUrls,
        method: 'POST',
        body,
      }),
    }),
    deleteStream: builder.mutation<any | null, DeleteStreamReq>({
      query: body => ({
        url: ENDPOINTS.stream.deleteStream(body.streamId),
        method: 'DELETE',
      }),
      invalidatesTags: ['LiveStream', 'ContentUpload', 'UserProfile'],
    }),
  }),
});

export const {
  useNewCreateStreamMutation,
  useNewInitiateVideoUploadMutation,
  useNewGetMultiUrlsMutation,
  useDeleteStreamMutation,
} = newStreamService;
