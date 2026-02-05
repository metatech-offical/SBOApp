import {ENDPOINTS} from '@rtkServices/endpoints';
import {api} from '../index';

export const userMerchandiesApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllStores: builder.query<GetAllStoresRes, void>({
      query: () => ({
        url: ENDPOINTS.store.getAllStores,
        method: 'GET',
      }),
    }),
    getAllStoresCollections: builder.query<
      GetAllStoresCollectionsRes,
      {page?: number; limit?: number; search?: string}
    >({
      query: params => ({
        url:
          ENDPOINTS.store.storeCollections +
          `?page=${params.page}&limit=${params.limit}&search=${params.search}`,
        method: 'GET',
      }),
    }),

    getAllProducts: builder.query<
      any,
      {
        search?: string | null;
        category?: string;
        status?: 'live' | 'draft' | 'coming_soon';
        collectionId?: string;
        page?: number;
        limit?: number;
      }
    >({
      query: params => ({
        url: ENDPOINTS.store.storeAllProduct,
        method: 'GET',
        params: {
          search: params.search,
          category: params.category,
          status: params.status,
          collectionId: params.collectionId,
          page: params.page,
          limit: params.limit,
        },
      }),
    }),

    getAllCollectionsOfStore: builder.query<
      any,
      {storeId: string; page?: number; limit?: number; search?: string}
    >({
      query: params => {
        const url =
          ENDPOINTS.store.getAllCollectionOfStore +
          `/${params.storeId}?page=${params.page}&limit=${params.limit}&search=${params.search}`;
        return {
          url,
          method: 'GET',
        };
      },
    }),

    getAllProductsByCollection: builder.query<
      GetAllProductsRes,
      {
        collectionId: string;
        page?: number;
        limit?: number;
        priceMin?: number;
        priceMax?: number;
        sortBy?: string;
        category?: string;
        search?: string;
        status?: string;
      }
    >({
      query: params => {
        const queryParams = new URLSearchParams();
        if (params.collectionId) {
          queryParams.append('collectionId', params.collectionId);
        }
        if (params.page) {
          queryParams.append('page', params.page.toString());
        }
        if (params.limit) {
          queryParams.append('limit', params.limit.toString());
        }
        if (params.priceMin) {
          queryParams.append('priceMin', params.priceMin.toString());
        }
        if (params.priceMax) {
          queryParams.append('priceMax', params.priceMax.toString());
        }
        if (params.sortBy) {
          queryParams.append('sortBy', params.sortBy);
        }
        if (params.category) {
          queryParams.append('category', params.category);
        }
        if (params.search) {
          queryParams.append('search', params.search);
        }
        if (params.status) {
          queryParams.append('status', params.status);
        }
        const url = `${
          ENDPOINTS.store.getAllProdctByCollection
        }?${queryParams.toString()}`;

        return {
          url,
          method: 'GET',
        };
      },
      providesTags: ['Wishlist', 'Product'],
    }),

    // Cart Module APIs
    getCartItems: builder.query<
      GetCartItemsRes | null,
      {page?: number; limit?: number}
    >({
      query: params => ({
        url: ENDPOINTS.cart.getCartItem(params),
        method: 'GET',
      }),
      providesTags: ['Cart', 'Checkout'],
    }),
    addToCart: builder.mutation<AddToCartRes, AddToCartPayload>({
      query: body => ({
        url: ENDPOINTS.cart.addToCart,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation<RemovePayloadRes, RemovePayload>({
      query: body => ({
        url: ENDPOINTS.cart.removeFromCart,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation<ClearCartRes, void>({
      query: () => ({
        url: ENDPOINTS.cart.clearCart,
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation<any, UpdateCartItemPayload>({
      query: body => ({
        url: ENDPOINTS.cart.updateCartItem,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetAllStoresQuery,
  useGetAllStoresCollectionsQuery,
  useGetAllProductsQuery,
  useGetAllCollectionsOfStoreQuery,
  useGetAllProductsByCollectionQuery,
  useGetCartItemsQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useUpdateCartItemMutation,
} = userMerchandiesApi;
