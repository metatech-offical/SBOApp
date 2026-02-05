import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ProductDetailProps} from '@navigation/screens';
import MerchandiseHeader from '@components/CustomHeaders/MerchandiseHeader';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import FastImage from 'react-native-fast-image';
import {fontSize, height, hp, width, wp} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import {ProductQuantityData} from '@utils/data';
import CustomDropDown from '@components/DropDown/CustomDropDown';
import Devider from '@components/Devider/Devider';
import CustomButton from '@components/CustomButtons/CustomButton';
import {useGetProductDetailQuery} from '@rtkServices/CreatorStoreService';
import PostCarousel from '@components/CustomCarosal/PostCarousel';
import Loader from '@components/CustomLoader/Loader';
import useWishlist from '@hooks/useWishlist';
import useCart from '@hooks/useCart';
import useAddress from '@hooks/useAddress';
import AddressDetail from '@components/ScreenLayouts/UserMerchandise/AddressDetail';

const ProductDetail = ({navigation, route}: ProductDetailProps) => {
  const {_id} = route?.params || {};
  const {data: productDetail, isLoading} = useGetProductDetailQuery(_id);
  const {handAddToWishlist, handRemoveFromWishlist} = useWishlist();
  const {handAddToCart} = useCart();
  const {selectedAddress} = useAddress();
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  const [isLiked, setIsLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const productData = productDetail?.data;

  const isOutOfStock = () => {
    if (productData?.hasVariants || productData?.variants?.length > 0) {
      return selectedVariant?.stock === 0;
    } else {
      return productData?.stock === 0;
    }
  };
  const isVariantOutOfStock = (variant: any) => {
    return variant?.stock === 0;
  };

  useEffect(() => {
    setIsLiked(productData?.isAddedToWishlist);
    if (productData?.variants?.length > 0) {
      if (productData?.variants && productData?.variants?.length > 0) {
        const lowestPriceVariant = productData.variants.reduce(
          (minVariant: any, current: any) => {
            return current.price < minVariant.price ? current : minVariant;
          },
          productData.variants[0],
        );
        setSelectedVariant(lowestPriceVariant);
      } else {
        setSelectedVariant(null);
      }
    }
  }, [productDetail]);

  const handleWishlist = async () => {
    if (isLiked) {
      await handRemoveFromWishlist({productId: _id});
      setIsLiked(false);
    } else {
      await handAddToWishlist({productId: _id});
      setIsLiked(true);
    }
  };

  const handleAddAddress = () => {
    navigation.navigate('GetAllAddress');
  };

  const handleAddToCart = () => {
    const payload: AddToCartPayload = {
      productId: _id,
      storeId: productData?.storeId,
      variant: {
        size: selectedVariant?.size || '',
        color: selectedVariant?.color || '',
        sku: selectedVariant?.sku || productData?.sku || '',
        price: selectedVariant?.price || productData?.price || 0,
      },
      quantity: Number(quantity) || 1,
    };
    handAddToCart(payload);
  };

  const handleBuyNow = () => {
    const cartItem = {
      productId: {
        _id: productData._id,
        productName: productData.productName,
        media: productData.media,
        storeId: {
          _id: productData.storeId,
          name: productData.storeName || '',
          logo: productData.storeLogo || '',
        },
        status: productData.status,
      },
      storeId: productData.storeId,
      variant: {
        size: selectedVariant?.size || '',
        color: selectedVariant?.color || '',
        sku: selectedVariant?.sku || productData.sku || '',
        price: selectedVariant?.price || productData.price || 0,
      },
      quantity: 1,
      addedAt: new Date().toISOString(), // optional
    };
    navigation.navigate('CheckoutScreen', {
      cartData: [cartItem],
      screenType: 'buy_now',
    });
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
          onCartPress={() => navigation.navigate('CartListScreen')}
        />
        {isLoading ? (
          <Loader visible={isLoading} />
        ) : (
          <>
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Product Image */}
              {productData?.media && productDetail?.data?.media?.length > 0 && (
                <View style={styles.imageContainer}>
                  {productData?.media?.length === 1 ? (
                    <FastImage
                      source={{uri: productData?.media[0]}}
                      style={styles.image}
                    />
                  ) : (
                    <PostCarousel
                      images={productData?.media}
                      height={wp('100%')}
                      autoPlay={true}
                      borderRadius={12}
                    />
                  )}
                </View>
              )}

              {/* Product Info */}
              <View style={styles.productInfoContainer}>
                <View style={styles.productInfo}>
                  <Text style={styles.productPrice}>
                    £{selectedVariant?.price || productData?.price}
                  </Text>
                  <Text style={styles.subText}>inclusive all taxes</Text>
                </View>
                <TouchableOpacity
                  style={styles.productImageContainer}
                  onPress={handleWishlist}>
                  <FastImage
                    source={
                      isLiked
                        ? require('@assets/images/heartLiked.png')
                        : require('@assets/images/heartUnliked.png')
                    }
                    style={styles.heartIcon}
                  />
                </TouchableOpacity>
              </View>

              {/* Product Name */}
              <Text style={styles.productName}>{productData?.productName}</Text>

              {/* Product Detail */}
              {productData?.variants?.length > 0 && (
                <View style={styles.productDetail}>
                  <View style={styles.sizeContainer}>
                    <Text style={styles.sectionTitle}>Select Size</Text>
                    <FlatList
                      style={styles.sizeList}
                      data={productData?.variants}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          onPress={() => setSelectedVariant(item)}
                          disabled={isVariantOutOfStock(item)}
                          style={[
                            styles.sizeItem,
                            {
                              backgroundColor:
                                selectedVariant?.size === item?.size
                                  ? Colors.white
                                  : '#FFFFFF1A',
                              opacity: isVariantOutOfStock(item) ? 0.5 : 1,
                            },
                          ]}>
                          <Text
                            style={[
                              styles.sizeItemText,
                              {
                                color:
                                  selectedVariant?.size === item?.size
                                    ? Colors.black
                                    : Colors.white,
                              },
                            ]}>
                            {item.size}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                  <View style={styles.quantityContainer}>
                    <Text style={styles.sectionTitle}>Quantity</Text>
                    <CustomDropDown
                      defaultValue={quantity}
                      data={ProductQuantityData}
                      placeHolder="Qty"
                      onSelect={value => {
                        setQuantity(value?.id);
                      }}
                    />
                  </View>
                </View>
              )}

              {/* Product Address */}
              {selectedAddress ? (
                <AddressDetail
                  selectedAddress={selectedAddress}
                  addressOnPress={handleAddAddress}
                  editAddressOnPress={() =>
                    navigation.navigate('AddAddressScreen', {
                      addressId: selectedAddress?._id,
                    })
                  }
                  isEditable={false}
                />
              ) : (
                <TouchableOpacity
                  onPress={handleAddAddress}
                  style={styles.addressContainer}>
                  <Text style={styles.addressText}>Delivery Address</Text>
                  <TouchableOpacity
                    onPress={handleAddAddress}
                    style={styles.addAddressContainer}>
                    <Text style={styles.addAddressText}>Add</Text>
                    <FastImage
                      source={require('@assets/images/editAddressIcon.png')}
                      style={styles.addressIcon}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}

              <Devider />
              <View style={{marginTop: 10, marginBottom: 10}}>
                <Text style={styles.productDescription}>Product Detail</Text>
                <Text style={styles.productDescriptionText}>
                  {productDetail?.data?.description}
                </Text>
              </View>
              {productDetail?.data?.returnPolicy && (
                <>
                  <Devider />
                  <View style={{marginTop: 10, marginBottom: 10}}>
                    <Text style={styles.returnPolicy}>Return Policy</Text>
                    <Text style={styles.returnPolicyText}>
                      {productDetail?.data?.returnPolicy}
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>
            {/* Out of Stock Message */}
            {isOutOfStock() && (
              <View style={styles.outOfStockContainer}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            )}
            <View style={styles.bottomContainer}>
              <CustomButton
                text="Add to Cart"
                onPress={handleAddToCart}
                btnStyle={[
                  styles.addCartBtn,
                  isOutOfStock() && styles.disabledButton,
                ]}
                disabled={isOutOfStock()}
              />
              <CustomButton
                text="Buy Now"
                onPress={handleBuyNow}
                btnStyle={[
                  styles.buyNowBtn,
                  isOutOfStock() && styles.disabledButton,
                ]}
                textStyle={{
                  color: isOutOfStock() ? Colors.grey : Colors.black,
                }}
                disabled={isOutOfStock()}
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

export default ProductDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
    flex: 1,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    columnGap: 7,
  },
  productName: {
    fontSize: fontSize.f20,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    paddingHorizontal: 15,
  },
  productPrice: {
    fontSize: fontSize.f30,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  subText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.grey,
    marginTop: 10,
  },
  productDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sizeContainer: {
    flex: 1,
    marginRight: 15,
  },
  quantityContainer: {
    width: width * 0.2,
  },
  sectionTitle: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    marginBottom: 10,
  },
  sizeList: {
    marginTop: 5,
  },
  sizeItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.grey,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeItemText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
  },
  productInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  productImageContainer: {
    backgroundColor: Colors.white,
    borderRadius: 40,
    minHeight: 25,
    minWidth: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    width: 15,
    height: 15,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    marginTop: 30,
    backgroundColor: '#FFFFFF1A',
    borderRadius: 10,
    padding: 10,
    minHeight: 55,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    width: '94%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  addAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 5,
  },
  addressIcon: {
    width: 20,
    height: 20,
  },
  addressText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
  },
  addAddressText: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  bottomContainer: {
    paddingHorizontal: 10,
    minHeight: 60,
    backgroundColor: '#120C20BF',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    flexDirection: 'row',
    columnGap: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addCartBtn: {
    width: '35%',
  },
  buyNowBtn: {
    backgroundColor: Colors.white,
    width: '60%',
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    alignSelf: 'center',
  },
  image: {
    width: width - 30,
    height: height * 0.5,
    borderRadius: 10,
    alignSelf: 'center',
  },
  returnPolicy: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.grey,
    paddingHorizontal: 15,
  },
  returnPolicyText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#CAC9CE',
    paddingHorizontal: 15,
    marginTop: 10,
  },
  productDescriptionText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#CAC9CE',
    paddingHorizontal: 15,
  },
  productDescription: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.grey,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  outOfStockContainer: {
    backgroundColor: '#FF4444',
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  outOfStockText: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
