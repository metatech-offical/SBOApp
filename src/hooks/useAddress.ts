import {
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useCreateOrderMutation,
} from '@rtkServices/AddressService';
import {setSelectedAddress} from '@store/AddressManager';
import {useAppDispatch, useAppSelector} from '@store/index';
import {useToastMessage} from '@hooks/useToastMessage';

const useAddress = () => {
  const {showError, showSuccess} = useToastMessage();
  const dispatch = useAppDispatch();
  const {selectedAddress} = useAppSelector(state => state.address);

  const selectAddress = (address: GetAllAddressData | null) => {
    dispatch(setSelectedAddress(address));
  };

  const getSelectedAddress = () => {
    return selectedAddress;
  };

  const [createAddress, {isLoading: isCreatingAddress}] =
    useCreateAddressMutation();
  const [updateAddress, {isLoading: isUpdatingAddress}] =
    useUpdateAddressMutation();
  const [deleteAddress, {isLoading: isDeletingAddress}] =
    useDeleteAddressMutation();
  const [createOrder, {isLoading: isCreatingOrder}] = useCreateOrderMutation();

  // Create new address
  const handleCreateAddress = async (addressData: CreateAddressReq) => {
    try {
      const result = await createAddress(addressData).unwrap();
      if (result?.success) {
        showSuccess(result?.message || 'Address created successfully');
        return result;
      } else {
        showError(result?.message || 'Failed to create address');
        return null;
      }
    } catch (error: any) {
      showError(error?.data?.message || 'Something went wrong');
      return null;
    }
  };

  // Update address
  const handleUpdateAddress = async (addressId: string, addressData: any) => {
    try {
      const result = await updateAddress({
        addressId,
        body: addressData,
      }).unwrap();
      if (result?.success) {
        showSuccess(result?.message || 'Address updated successfully');
        return result;
      } else {
        showError(result?.message || 'Failed to update address');
        return null;
      }
    } catch (error: any) {
      showError(error?.data?.message || 'Something went wrong');
      return null;
    }
  };

  // Delete address
  const handleDeleteAddress = async (addressId: string) => {
    try {
      const result = await deleteAddress(addressId).unwrap();
      if (result?.success) {
        showSuccess(result?.message || 'Address deleted successfully');
        return result;
      } else {
        showError(result?.message || 'Failed to delete address');
        return null;
      }
    } catch (error: any) {
      showError(error?.data?.message || 'Something went wrong');
      return null;
    }
  };

  const handleCreateOrder = async (payload: CheckoutRequest) => {
    try {
      const result = await createOrder(payload).unwrap();
      if (result?.success) {
        // Success toast is shown after Stripe Payment Sheet completes
        return result;
      } else {
        showError(result?.message || 'Failed to create order');
        return null;
      }
    } catch (error: any) {
      showError(error?.data?.message || 'Something went wrong');
      return null;
    }
  };

  return {
    selectedAddress,
    selectAddress,
    getSelectedAddress,

    // Actions
    handleCreateAddress,
    handleUpdateAddress,
    handleDeleteAddress,
    handleCreateOrder,

    // Loading states
    isCreatingAddress,
    isUpdatingAddress,
    isDeletingAddress,
    isCreatingOrder,
  };
};

export default useAddress;
