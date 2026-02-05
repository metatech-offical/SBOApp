import {ENDPOINTS} from '@rtkServices/endpoints';
import {api} from '../index';

export const creatorTicketingApi = api.injectEndpoints({
  endpoints: builder => ({
    createEvent: builder.mutation<any | null, CreateEventPayload>({
      query: body => ({
        url: ENDPOINTS.creatorTicketing.createEvent,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Event'],
    }),
    getLiveEvents: builder.query<
      LiveEventsResponse,
      {page?: number; limit?: number; creatorId: string; search?: string}
    >({
      query: ({creatorId, ...params}) => ({
        url: ENDPOINTS.creatorTicketing.liveEventsByCreatorId(creatorId),
        method: 'GET',
        params,
      }),
      providesTags: ['Event'],
    }),
    getComingSoonEvents: builder.query<
      any,
      {page?: number; limit?: number; creatorId: string; search?: string}
    >({
      query: ({creatorId, ...params}) => ({
        url: ENDPOINTS.creatorTicketing.comingSoonEventsByCreatorId(creatorId),
        method: 'GET',
        params,
      }),
      providesTags: ['Event'],
    }),
    getPastEvents: builder.query<
      any,
      {page?: number; limit?: number; creatorId: string; search?: string}
    >({
      query: ({creatorId, ...params}) => ({
        url: ENDPOINTS.creatorTicketing.pastEventsByCreatorId(creatorId),
        method: 'GET',
        params,
      }),
      providesTags: ['Event'],
    }),
    getEventDetailById: builder.query<any, {eventId: string}>({
      query: data => ({
        url: ENDPOINTS.creatorTicketing.eventGetDetailById(data.eventId),
        method: 'GET',
      }),
      providesTags: ['Event'],
    }),
    updateEventById: builder.mutation<any, {eventId: string; body: any}>({
      query: data => ({
        url: ENDPOINTS.creatorTicketing.eventUpdateById(data.eventId),
        method: 'PUT',
        body: data.body,
      }),
      invalidatesTags: ['Event'],
    }),
    cancelEventById: builder.mutation<any, {eventId: string; reason: string}>({
      query: data => ({
        url: ENDPOINTS.creatorTicketing.eventCancelById(data.eventId),
        method: 'POST',
        body: {reason: data.reason},
      }),
      invalidatesTags: ['Event'],
    }),
  }),
});
export const {
  useCreateEventMutation,
  useGetLiveEventsQuery,
  useGetComingSoonEventsQuery,
  useGetPastEventsQuery,
  useGetEventDetailByIdQuery,
  useUpdateEventByIdMutation,
  useCancelEventByIdMutation,
} = creatorTicketingApi;
