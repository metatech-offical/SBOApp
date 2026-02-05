import {ENDPOINTS, GET_PRODUCTS} from '@rtkServices/endpoints';
import {api} from '../index';

export const creatorStoreApi = api.injectEndpoints({
  endpoints: builder => ({
    getStoreAnalytics: builder.query<GetStoreAnalyticsRes | null, void>({
      query: () => ({
        url: ENDPOINTS.store.storeAnalytics,
        method: 'GET',
      }),
      providesTags: ['Collection', 'Product'],
    }),
    createCollection: builder.mutation<CreCollectionRes, CreCollectionReq>({
      query: data => ({
        url: ENDPOINTS.store.createCollection,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Collection'],
    }),
    getCollections: builder.query<GetCollectionsRes, void>({
      query: () => ({
        url: ENDPOINTS.store.getAllCollection,
        method: 'GET',
      }),
      providesTags: ['Collection'],
    }),
    getGlobalReturnPolicy: builder.query<GetGlobalReturnPolicyRes, void>({
      query: () => ({
        url: ENDPOINTS.store.globalReturnPolicy,
        method: 'GET',
      }),
      providesTags: ['Product'],
    }),
    getCollectionDetail: builder.query<GetCollectionDetailRes, string>({
      query: id => ({
        url: ENDPOINTS.store.getStoreCollectionDetail(id),
        method: 'GET',
      }),
      providesTags: ['Collection'],
    }),

    updateCollection: builder.mutation<
      any,
      {collectionId: string; data: CreCollectionReq}
    >({
      query: ({collectionId, data}) => ({
        url: ENDPOINTS.store.updateCollection(collectionId),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Collection'],
    }),

    createProduct: builder.mutation<CreateProductRes, CreateProductReq>({
      query: body => ({
        url: ENDPOINTS.store.addProduct,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
    }),
    getProducts: builder.query<
      GetProductsRes,
      {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
      }
    >({
      query: params => ({
        url: GET_PRODUCTS(params),
        method: 'GET',
      }),
      providesTags: ['Product'],
    }),
    getProductDetail: builder.query<GetProductDetailRes, string>({
      query: id => ({
        url: ENDPOINTS.store.getProductDetail(id),
        method: 'GET',
      }),
      providesTags: ['CreatorStore', 'Wishlist'],
    }),

    addItemToWishlist: builder.mutation<IAddlistRes, IAddlistReq>({
      query: body => ({
        url: ENDPOINTS.store.addItemToWishlist(body.productId),
        method: 'POST',
      }),
      invalidatesTags: ['Wishlist'],
    }),
    removeItemFromWishlist: builder.mutation<IRemovelistRes, IRemovelistReq>({
      query: body => ({
        url: ENDPOINTS.store.removeItemToWishlist(body.productId),
        method: 'DELETE',
      }),
      invalidatesTags: ['Wishlist'],
    }),
    getWishlist: builder.query<IGetWishlistRes, null, void>({
      query: () => ({
        url: ENDPOINTS.store.getWishList,
        method: 'GET',
      }),
      providesTags: ['Wishlist'],
    }),
    updateProduct: builder.mutation<
      IUpdateProductRes,
      {id: string; data: IUpdateProductReq}
    >({
      query: ({id, data}) => ({
        url: ENDPOINTS.store.updateProduct(id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['CreatorStore', 'Product'],
    }),
    deleteProduct: builder.mutation<DeleteProductRes | null, DeleteProductReq>({
      query: body => ({
        url: ENDPOINTS.store.deleteProduct(body.productId),
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),
  }),
});

export const {
  useGetStoreAnalyticsQuery,
  useCreateCollectionMutation,
  useGetCollectionsQuery,
  useGetCollectionDetailQuery,
  useUpdateCollectionMutation,
  useCreateProductMutation,
  useGetProductsQuery,
  useAddItemToWishlistMutation,
  useRemoveItemFromWishlistMutation,
  useGetWishlistQuery,
  useGetProductDetailQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetGlobalReturnPolicyQuery,
} = creatorStoreApi;
