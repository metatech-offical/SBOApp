import {
  useAddItemToWishlistMutation,
  useRemoveItemFromWishlistMutation,
} from '@rtkServices/CreatorStoreService';
import {useToastMessage} from '@hooks/useToastMessage';

const useWishlist = () => {
  const {showError, showSuccess} = useToastMessage();
  const [addToWishlist] = useAddItemToWishlistMutation();
  const [removeFromWishlist] = useRemoveItemFromWishlistMutation();

  const handAddToWishlist = async ({productId}: IAddlistReq) => {
    await addToWishlist({productId}).then(res => {
      if (res?.data?.success) {
        showSuccess(res?.data?.message || '');
        return res?.data?.success;
      }
      if (res?.error) {
        showError(res?.error?.data?.message || 'Something went wrong');
      }
    });
  };

  const handRemoveFromWishlist = async ({productId}: IRemovelistReq) => {
    await removeFromWishlist({productId}).then(res => {
      if (res?.data?.success) {
        showSuccess(res?.data?.message || '');
        return res?.data?.success;
      }
      if (res?.error) {
        showError(res?.error?.data?.message || 'Something went wrong');
      }
    });
  };

  return {handAddToWishlist, handRemoveFromWishlist};
};

export default useWishlist;
