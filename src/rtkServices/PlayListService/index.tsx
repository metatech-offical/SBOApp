import {ENDPOINTS, GET_SEARCH_PLAYLIST} from '@rtkServices/endpoints';
import {api} from '../index';

export const playListApi = api.injectEndpoints({
  endpoints: builder => ({
    createPlaylist: builder.mutation<CreatePlayRes, CreatePlayReq>({
      query: body => ({
        url: ENDPOINTS.contentAcction.createPlayList,
        method: 'POST',
        body: body,
      }),
    }),
    addItemsToPlaylist: builder.mutation<
      any | null,
      {
        playlistId: string;
        items: Array<{contentId: string; contentType: 'shorts' | 'streams'}>;
      }
    >({
      query: ({playlistId, items}) => ({
        url: ENDPOINTS.contentAcction.addItemToPlaylist(playlistId),
        method: 'POST',
        body: {items},
      }),
    }),
    removeItemsFromPlaylist: builder.mutation<
      any | null,
      {
        playlistId: string;
        contentId: string;
        contentType: 'shorts' | 'streams';
      }
    >({
      query: ({playlistId, contentId, contentType}) => ({
        url: ENDPOINTS.contentAcction.removeItemToPlaylist(playlistId),
        method: 'DELETE',
        body: {contentId, contentType},
      }),
    }),
    updatePlaylist: builder.mutation<
      any | null,
      {
        playlistId: string;
        title: string;
        description: string;
      }
    >({
      query: ({playlistId, title, description}) => ({
        url: ENDPOINTS.contentAcction.updatePlaylist(playlistId),
        method: 'PUT',
        body: {title, description},
      }),
    }),
    deletePlaylist: builder.mutation<
      any | null,
      {
        playlistId: string;
      }
    >({
      query: ({playlistId}) => ({
        url: ENDPOINTS.contentAcction.deletePlaylist(playlistId),
        method: 'DELETE',
      }),
    }),
    getOrSearchPlaylist: builder.query<
      Playlist | null,
      {
        creatorId: string;
        pageNumber: number;
        pageLimit: number;
        keyword?: string;
      }
    >({
      query: ({creatorId, pageNumber, pageLimit, keyword = ''}) => ({
        url: GET_SEARCH_PLAYLIST(creatorId, pageNumber, pageLimit, keyword),
        method: 'GET',
      }),
    }),
    getPlaylistById: builder.query<any | null, {playlistId: string}>({
      query: params => ({
        url: ENDPOINTS.contentAcction.getPlaylistById(params.playlistId),
        method: 'GET',
      }),
    }),
  }),
});
export const {
  useCreatePlaylistMutation,
  useAddItemsToPlaylistMutation,
  useRemoveItemsFromPlaylistMutation,
  useUpdatePlaylistMutation,
  useDeletePlaylistMutation,
  useGetOrSearchPlaylistQuery,
  useGetPlaylistByIdQuery,
} = playListApi;
