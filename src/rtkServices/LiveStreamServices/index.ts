import {ENDPOINTS} from '@rtkServices/endpoints';
import {api} from '../index';
import {GetLiveStreamListResponse, StreamResponse} from './LiveServices';
export const streamApi = api.injectEndpoints({
  endpoints: builder => ({
    createStream: builder.mutation<CreateStream, any>({
      query: body => ({
        url: ENDPOINTS.stream.creatStream,
        method: 'POST',
        body,
      }),
    }),
    createLiveStream: builder.mutation<
      any | null,
      {
        visibility?: 'everyone' | 'followers' | 'subscribers' | 'none';
        title: string;
        description?: string;
        category?: string;
        tags?: string[];
        thumbnailUrl?: string;
      }
    >({
      query: body => ({
        url: ENDPOINTS.stream.createLiveStream,
        method: 'POST',
        body,
      }),
    }),

    getAllLiveStreams: builder.query<
      any | GetLiveStreamListResponse,
      {page: number; limit: number}
    >({
      query: ({page, limit}) => ({
        url: ENDPOINTS.stream.getAllStream,
        method: 'GET',
        params: {
          page,
          limit,
        },
      }),
      providesTags: [
        'Follower_Following',
        'LiveStream',
        'report_not_intrested',
      ],
    }),
    getLiveByUserID: builder.query<any | null, {userID: string}>({
      query: ({userID}) => ({
        url: ENDPOINTS.stream.getLiveStreamByUser + userID,
        method: 'GET',
      }),
      providesTags: ['LiveStream'],
    }),

    getLiveById: builder.query<StreamResponse, {id: string}>({
      query: params => ({
        url: ENDPOINTS.stream.getStreamById(params.id),
        method: 'GET',
      }),
    }),

    toggleSaveVod: builder.mutation<
      any | null,
      {streamId: string; saveVod: boolean}
    >({
      query: ({streamId, saveVod}) => ({
        url: ENDPOINTS.stream.toggleSaveVod(streamId),
        method: 'PATCH',
        body: {saveVod},
      }),
    }),

    getMyVods: builder.query<
      any | GetLiveStreamListResponse,
      {page: number; limit: number}
    >({
      query: ({page, limit}) => ({
        url: ENDPOINTS.stream.getMyVods,
        method: 'GET',
        params: {
          page,
          limit,
        },
      }),
    }),

    getVodsByCreator: builder.query<
      any | GetLiveStreamListResponse,
      {creatorId: string; page: number; limit: number}
    >({
      query: ({creatorId, page, limit}) => ({
        url: ENDPOINTS.stream.getVodsByCreator(creatorId),
        method: 'GET',
        params: {
          page,
          limit,
        },
      }),
    }),
  }),
});
export const {
  useCreateStreamMutation,
  useCreateLiveStreamMutation,
  useGetAllLiveStreamsQuery,
  useGetLiveByUserIDQuery,
  useGetLiveByIdQuery,
  useToggleSaveVodMutation,
  useGetMyVodsQuery,
  useGetVodsByCreatorQuery,
} = streamApi;
