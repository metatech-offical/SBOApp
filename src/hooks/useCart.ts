import {
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useUpdateCartItemMutation,
} from '@rtkServices/UserMerchandiesService';
import {
  decrementCartCount,
  incrementCartCount,
  resetCartCount,
  setCartCount,
} from '@store/Cart';
import {useDispatch} from 'react-redux';
import {useToastMessage} from '@hooks/useToastMessage';

const useCart = () => {
  const dispatch = useDispatch();
  const {showError, showSuccess} = useToastMessage();
  const [addToCart] = useAddToCartMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();

  const handAddToCart = async (payload: AddToCartPayload) => {
    await addToCart(payload).then(res => {
      if (res?.data?.success) {
        dispatch(incrementCartCount(payload?.quantity));
        showSuccess(res?.data?.message || '');
        return res?.data?.success;
      }
      if (res?.error) {
        showError(res?.error?.data?.message || 'Something went wrong');
      }
    });
  };

  const handRemoveFromCart = async ({
    productId,
    variant,
    quantity,
  }: RemovePayload) => {
    await removeFromCart({productId, variant}).then(res => {
      if (res?.data?.success) {
        dispatch(decrementCartCount(quantity));
        showSuccess(res?.data?.message || '');
        return res?.data?.success;
      }
      if (res?.error) {
        showError(res?.error?.data?.message || 'Something went wrong');
      }
    });
  };

  const handClearCart = async () => {
    await clearCart().then(res => {
      if (res?.data?.success) {
        dispatch(resetCartCount());
        showSuccess(res?.data?.message || '');
        return res?.data?.success;
      }
      if (res?.error) {
        showError(res?.error?.data?.message || 'Something went wrong');
      }
    });
  };

  const handUpdateCartItem = async ({
    productId,
    variant,
    quantity,
  }: UpdateCartItemPayload) => {
    await updateCartItem({productId, variant, quantity}).then(res => {
      if (res?.data?.success) {
        dispatch(setCartCount(res?.data?.data));
        showSuccess(res?.data?.message || '');
        return res?.data?.success;
      }
      if (res?.error) {
        showError(res?.error?.data?.message || 'Something went wrong');
      }
    });
  };

  return {handAddToCart, handRemoveFromCart, handClearCart, handUpdateCartItem};
};

export default useCart;
