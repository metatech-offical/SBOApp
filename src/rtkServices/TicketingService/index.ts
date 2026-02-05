import {ENDPOINTS} from '@rtkServices/endpoints';
import {api} from '../index';

export const ticketingService = api.injectEndpoints({
  endpoints: builder => ({
    getEvents: builder.query<
      GetEventsRes,
      {
        page?: number;
        limit?: number;
        timeFilter?: string;
        search?: string;
        city?: string;
        date?: any;
      }
    >({
      query: params => ({
        url: ENDPOINTS.ticketing.getEvents(params),
        method: 'GET',
      }),
    }),
    getEventDetail: builder.query<
      GetEventDetailRes,
      {
        id?: string;
      }
    >({
      query: params => ({
        url: ENDPOINTS.ticketing.getEventDetail(params),
        method: 'GET',
      }),
    }),
    getEventsOfCreator: builder.query<
    GetCreatorEventsResponse,
      {
        creatorid: string;
        page?: number;
        limit?: number;
        search?: string;
        date?: any;
        city?: string;
      }
    >({
      query: params => ({
        url: ENDPOINTS.ticketing.getEventsOfCreator(params),
        method: 'GET',
      }),
    }),

    createUserTicket: builder.mutation<CreateTicketRes, CreateTicketPayload>({
      query: body => ({
        url: ENDPOINTS.ticketing.createTicket,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventDetailQuery,
  useCreateUserTicketMutation,
  useGetEventsOfCreatorQuery
} = ticketingService;
