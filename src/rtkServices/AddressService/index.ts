import {ENDPOINTS} from '@rtkServices/endpoints';
import {api} from '../index';

export const addressService = api.injectEndpoints({
  endpoints: builder => ({
    createAddress: builder.mutation<CreateAddressRes | null, CreateAddressReq>({
      query: body => ({
        url: ENDPOINTS.address.creatAddress,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Address'],
    }),
    getAddresses: builder.query<GetAllAddressesRes | null, void>({
      query: () => ({
        url: ENDPOINTS.address.getAddress,
        method: 'GET',
      }),
      providesTags: ['Address'],
    }),
    getAddressById: builder.query<GetAddressByIdRes | null, string>({
      query: addressId => ({
        url: ENDPOINTS.address.getAddressId(addressId),
        method: 'GET',
      }),
      providesTags: ['Address'],
    }),
    updateAddress: builder.mutation<URs | null, {addressId: string; body: any}>(
      {
        query: ({addressId, body}) => ({
          url: ENDPOINTS.address.updateAddress(addressId),
          method: 'PUT',
          body,
        }),
        invalidatesTags: ['Address'],
      },
    ),
    deleteAddress: builder.mutation<any | null, string>({
      query: addressId => ({
        url: ENDPOINTS.address.deleteAddress(addressId),
        method: 'DELETE',
      }),
      invalidatesTags: ['Address'],
    }),
    createOrder: builder.mutation<any | null, CheckoutRequest>({
      query: body => ({
        url: ENDPOINTS.store.orderCheckout,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart', 'Checkout'],
    }),
  }),
});

export const {
  useCreateAddressMutation,
  useGetAddressesQuery,
  useGetAddressByIdQuery,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useCreateOrderMutation,
} = addressService;
