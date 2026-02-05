import {ENDPOINTS} from '@rtkServices/endpoints';
import {api} from '../index';

export const creatorStoreApi = api.injectEndpoints({
  endpoints: builder => ({
    getSearchResults: builder.query<
      SearchResultResponse | null,
      {search: string}
    >({
      query: ({search}) => ({
        url: ENDPOINTS.search.getSearchResult,
        params: {keyword: search},
        method: 'GET',
      }),
      providesTags: ['Search'],
    }),

    deleteSearchHistory: builder.mutation<any, {search: string}>({
      query: ({search}) => ({
        url: ENDPOINTS.search.getSearchResult,
        params: {keyword: search},
        method: 'DELETE',
      }),
      invalidatesTags: ['Search'],
    }),

    getTrendingSearchResults: builder.query<
      TrendingSearchResultResponse | null,
      void
    >({
      query: () => ({
        url: ENDPOINTS.search.getTrendingSearchResult,
        method: 'GET',
      }),
      providesTags: ['Search', 'ContentUpload', 'UserProfile'],
    }),
  }),
});

export const {
  useGetSearchResultsQuery,
  useGetTrendingSearchResultsQuery,
  useDeleteSearchHistoryMutation,
} = creatorStoreApi;
