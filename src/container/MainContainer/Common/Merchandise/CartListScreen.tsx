import {
  View,
  StyleSheet,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import MerchandiseHeader from '@components/CustomHeaders/MerchandiseHeader';
import {CartListScreenProps} from '@navigation/screens';
import CartListItem from '@components/ScreenLayouts/UserMerchandise/CartListItem';
import {useGetCartItemsQuery} from '@rtkServices/UserMerchandiesService';
import Loader from '@components/CustomLoader/Loader';
import NodataFound from '@components/DataEmpty/NodataFound';
import {DeleteIcon} from '@assets/svg/ShortsIcon';
import {Colors} from '@constant/colors';
import useCart from '@hooks/useCart';
import CustomButton from '@components/CustomButtons/CustomButton';
import CustomRefreshControler from '@components/CustomLoader/CustomRefreshControler';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@store/index';
import {setCartCount} from '@store/Cart';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';

const CartListScreen = ({navigation}: CartListScreenProps) => {
  const dispatch = useDispatch();
  const cartCount = useSelector(
    (state: RootState) => state.cart?.cartItemsCount,
  );
  const {handClearCart} = useCart();

  const [cartList, setCartList] = useState<CartItem[] | null>(null);
  const [page, setPage] = useState(1);

  const {
    data: cartListData,
    isLoading,
    isFetching,
    refetch,
  } = useGetCartItemsQuery({page: page, limit: 10});

  useEffect(() => {
    if (cartListData) {
      setCartList(cartListData?.data?.cart?.items);
      if (cartCount !== cartListData?.data?.totalCartItems) {
        dispatch(setCartCount(cartListData?.data?.totalCartItems));
      }
    }
  }, [cartListData]);

  const handleLoadMore = () => {
    if (
      cartListData?.data?.pagination?.totalPages &&
      cartListData?.data?.pagination?.totalPages > page
    ) {
      setPage(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    refetch();
  };

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
      />
      <View style={styles.contentOverlay}>
        <MerchandiseHeader
          onBackPress={() => navigation.goBack()}
          onCartPress={
            cartList && cartList?.length > 0 ? handClearCart : undefined
          }
          icon={
            cartList && cartList?.length > 0 ? (
              <DeleteIcon stroke={Colors.white} height={20} width={20} />
            ) : null
          }
        />
        {isLoading ? (
          <Loader visible={isLoading} />
        ) : (
          <View>
            <FlatList
              data={cartList || []}
              keyExtractor={item => item?.productId?._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{flexGrow: 1, paddingBottom: 100}}
              onEndReached={handleLoadMore}
              refreshControl={
                <CustomRefreshControler
                  refreshing={isFetching}
                  onRefresh={handleRefresh}
                />
              }
              ListEmptyComponent={<NodataFound />}
              renderItem={({item}) => (
                <CartListItem
                  item={item}
                  onPress={() =>
                    navigation.navigate('ProductDetail', {
                      _id: item?.productId?._id,
                    })
                  }
                />
              )}
              ListFooterComponent={
                isFetching && cartList && cartList?.length > 0 && page !== 1 ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : null
              }
            />
          </View>
        )}
      </View>

      {cartList && cartList?.length > 0 && (
        <View style={styles.footerContainer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total Amount</Text>
            <Text style={styles.totalText}>
              ${cartListData?.data?.totalPrice}
            </Text>
          </View>

          <CustomButton
            text="Proceed to buy"
            onPress={() =>
              navigation.navigate('CheckoutScreen', {
                cartData: cartList || [],
                screenType: 'from_cart',
              })
            }
            btnStyle={styles.buyNowBtn}
            textStyle={{color: Colors.black}}
          />
        </View>
      )}
    </View>
  );
};

export default CartListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
    flex: 1,
  },
  headerContainer: {
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  footerContainer: {
    paddingHorizontal: 10,
    minHeight: 60,
    backgroundColor: '#120C20BF',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'row',
    columnGap: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  totalContainer: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  totalText: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
  },

  buyNowBtn: {
    backgroundColor: Colors.white,
    width: '60%',
  },
});
