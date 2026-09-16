import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {ProductDetailProps} from '@navigation/screens';
import MerchandiseHeader from '@components/CustomHeaders/MerchandiseHeader';
import GlowBackground from '@components/AnimationComponent/GlowBackground';
import FastImage from 'react-native-fast-image';
import {fontSize, width} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import {ProductQuantityData} from '@utils/data';
import CustomButton from '@components/CustomButtons/CustomButton';
import {useGetProductDetailQuery} from '@rtkServices/CreatorStoreService';
import Loader from '@components/CustomLoader/Loader';
import useCart from '@hooks/useCart';
import useAddress from '@hooks/useAddress';
import SelectDropdown from 'react-native-select-dropdown';
import {ArrowDown, ArrowUP} from '@assets/svg/AuthFlowIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  DUMMY_DELIVERY_ADDRESS,
  getDummyProductById,
  isDummyProductId,
} from '@utils/dummyMerchandise';

const IMAGE_SIDE = 16;
const IMAGE_PEEK = 23;
const IMAGE_GAP = 4;
const IMAGE_WIDTH = width - IMAGE_SIDE - IMAGE_PEEK;
const IMAGE_HEIGHT = IMAGE_WIDTH * (431 / 354);
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const formatCategoryLabel = (category?: string) => {
  if (!category) {
    return '';
  }
  if (category === 'T-Shirts') {
    return 'T-shirt';
  }
  return category;
};

const getDetailItems = (product?: any) => {
  if (Array.isArray(product?.productDetails) && product.productDetails.length) {
    return product.productDetails;
  }
  const text = product?.description?.trim?.() || '';
  if (!text) {
    return [];
  }
  const lines = text
    .split(/\r?\n|•/)
    .map((line: string) => line.replace(/^[-–]\s*/, '').trim())
    .filter(Boolean);
  return lines.length ? lines : [text];
};

const getUniqueSizes = (variants: any[] = []) => {
  const seen = new Map<string, any>();
  variants.forEach(variant => {
    if (variant?.size && !seen.has(variant.size)) {
      seen.set(variant.size, variant);
    }
  });
  return [...seen.values()].sort((a, b) => {
    const aIndex = SIZE_ORDER.indexOf(a.size);
    const bIndex = SIZE_ORDER.indexOf(b.size);
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  });
};

const formatAddressLine = (address?: any) =>
  [
    address?.streetNo,
    address?.buildingName,
    address?.city,
    address?.areaDistrict,
    address?.landmark,
  ]
    .filter(Boolean)
    .join(', ');

const ProductDetail = ({navigation, route}: ProductDetailProps) => {
  const {_id} = route?.params || {};
  const {bottom} = useSafeAreaInsets();
  const isDummyProduct = isDummyProductId(_id);
  const dummyProduct = isDummyProduct ? getDummyProductById(_id) : undefined;
  const {data: productDetail, isLoading} = useGetProductDetailQuery(_id, {
    skip: isDummyProduct || !_id,
  });
  const {handAddToCart} = useCart();
  const {selectedAddress} = useAddress();
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  const productData = dummyProduct || productDetail?.data;
  const sizeOptions = useMemo(
    () => getUniqueSizes(productData?.variants),
    [productData],
  );
  const media = productData?.media?.length
    ? productData.media
    : [];
  const detailItems = useMemo(
    () => getDetailItems(productData),
    [productData],
  );
  const deliveryAddress = isDummyProduct
    ? DUMMY_DELIVERY_ADDRESS
    : selectedAddress;
  const storeName =
    productData?.storeName || productData?.store?.name || productData?.storeId?.name;

  const isOutOfStock = () => {
    if (productData?.hasVariants || productData?.variants?.length > 0) {
      return selectedVariant?.stock === 0;
    }
    return productData?.stock === 0;
  };

  const isVariantOutOfStock = (variant: any) => variant?.stock === 0;

  useEffect(() => {
    if (productData?.variants?.length > 0) {
      const inStock = productData.variants.filter(
        (variant: any) => variant?.stock > 0,
      );
      const medium = inStock.find((variant: any) => variant.size === 'M');
      const lowestPrice = [...inStock].sort(
        (a: any, b: any) => a.price - b.price,
      )[0];
      setSelectedVariant(medium || lowestPrice || productData.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [productData]);

  const handleAddAddress = () => {
    navigation.navigate('GetAllAddress');
  };

  const handleAddToCart = () => {
    if (isDummyProduct) {
      return;
    }
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
    if (!productData) {
      return;
    }
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
      quantity: Number(quantity) || 1,
      addedAt: new Date().toISOString(),
    };
    navigation.navigate('CheckoutScreen', {
      cartData: [cartItem],
      screenType: 'buy_now',
    });
  };

  const handleAboutStore = () => {
    if (!productData?.storeId || isDummyProduct) {
      return;
    }
    navigation.navigate('OtherUserStoreScreen', {
      storeId: productData.storeId,
      name: storeName || '',
      profilePicture: productData.storeLogo || '',
    });
  };

  const selectedQuantity =
    ProductQuantityData.find(item => item.id === quantity) ||
    ProductQuantityData[0];

  return (
    <View style={styles.container}>
      <GlowBackground />
      <View style={styles.contentOverlay}>
        <MerchandiseHeader
          onBackPress={() => navigation.goBack()}
          onCartPress={() => navigation.navigate('CartListScreen')}
        />
        {isLoading && !isDummyProduct ? (
          <Loader visible={isLoading} />
        ) : (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}>
              <ScrollView
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={IMAGE_WIDTH + IMAGE_GAP}
                decelerationRate="fast"
                contentContainerStyle={styles.imageList}>
                {(media.length ? media : [null]).map((item, index) => (
                  <FastImage
                    key={`${item || 'placeholder'}-${index}`}
                    source={
                      item
                        ? {uri: item}
                        : require('@assets/images/dummyImage.png')
                    }
                    style={[
                      styles.image,
                      index < (media.length || 1) - 1 && styles.imageSpacing,
                    ]}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                ))}
              </ScrollView>

              <View style={styles.priceRow}>
                <Text style={styles.productPrice}>
                  £{selectedVariant?.price || productData?.price}
                </Text>
                <Text style={styles.subText}>inclusive all taxes</Text>
              </View>

              <Text style={styles.productName}>
                {productData?.productName}
                {productData?.category
                  ? `\n${formatCategoryLabel(productData.category)}`
                  : ''}
              </Text>

              <View style={styles.productDetail}>
                {sizeOptions.length > 0 && (
                  <View style={styles.sizeContainer}>
                    <Text style={styles.sectionTitle}>Select size</Text>
                    <View style={styles.sizeList}>
                      {sizeOptions.map(item => {
                        const selected = selectedVariant?.size === item.size;
                        const disabled = isVariantOutOfStock(item);
                        return (
                          <TouchableOpacity
                            key={item.size}
                            onPress={() => setSelectedVariant(item)}
                            disabled={disabled}
                            style={[
                              styles.sizeItem,
                              selected && styles.sizeItemSelected,
                              disabled && styles.sizeItemDisabled,
                            ]}>
                            <Text
                              style={[
                                styles.sizeItemText,
                                selected && styles.sizeItemTextSelected,
                                disabled && styles.sizeItemTextDisabled,
                              ]}>
                              {item.size}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                )}
                <View style={styles.quantityContainer}>
                  <Text style={[styles.sectionTitle, styles.quantityLabel]}>
                    Quantity
                  </Text>
                  <SelectDropdown
                    data={ProductQuantityData}
                    defaultValue={selectedQuantity}
                    onSelect={value => setQuantity(value?.id)}
                    renderButton={(selectedItem, isOpened) => (
                      <View style={styles.qtyButton}>
                        <Text style={styles.qtyText}>
                          {selectedItem?.name || quantity}
                        </Text>
                        {isOpened ? (
                          <ArrowUP color="#87809F" width={12} height={12} />
                        ) : (
                          <ArrowDown color="#87809F" width={12} height={12} />
                        )}
                      </View>
                    )}
                    renderItem={(item, _index, isSelected) => (
                      <View
                        style={[
                          styles.qtyMenuItem,
                          isSelected && styles.qtyMenuItemSelected,
                        ]}>
                        <Text
                          style={[
                            styles.qtyText,
                            isSelected && styles.sizeItemTextSelected,
                          ]}>
                          {item.name}
                        </Text>
                      </View>
                    )}
                    dropdownStyle={styles.qtyMenu}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleAddAddress}
                style={styles.addressCard}>
                <View style={styles.addressHeader}>
                  <Text style={styles.addressLabel}>Delivery Address</Text>
                  <TouchableOpacity onPress={handleAddAddress} hitSlop={12}>
                    <FastImage
                      source={require('@assets/images/editAddressIcon.png')}
                      style={styles.addressIcon}
                    />
                  </TouchableOpacity>
                </View>
                {deliveryAddress ? (
                  <>
                    <View style={styles.addressNameRow}>
                      <Text style={styles.addressName}>
                        {deliveryAddress.fullName}
                      </Text>
                      {!!(
                        deliveryAddress.countryCode ||
                        deliveryAddress.mobileNumber
                      ) && (
                        <>
                          <View style={styles.addressDivider} />
                          <Text style={styles.addressPhone}>
                            {deliveryAddress.countryCode}{' '}
                            {deliveryAddress.mobileNumber}
                          </Text>
                        </>
                      )}
                    </View>
                    <Text style={styles.addressLine}>
                      {formatAddressLine(deliveryAddress)}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.addressLine}>Add a delivery address</Text>
                )}
              </TouchableOpacity>

              {detailItems.length > 0 && (
                <>
                  <View style={styles.sectionDivider} />
                  <View style={styles.sectionBlock}>
                    <Text style={styles.sectionHeading}>Product Details</Text>
                    {detailItems.length > 1 ? (
                      detailItems.map(item => (
                        <View key={item} style={styles.bulletRow}>
                          <Text style={styles.bullet}>•</Text>
                          <Text style={styles.bulletText}>{item}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.bodyText}>{detailItems[0]}</Text>
                    )}
                  </View>
                </>
              )}

              {(productData?.returnPolicy || isDummyProduct) && (
                <>
                  <View style={styles.sectionDivider} />
                  <View style={styles.sectionBlock}>
                    <Text style={styles.sectionHeading}>Return policy</Text>
                    <Text style={styles.bodyText}>
                      {productData?.returnPolicy ||
                        'Easy 14 days returns. Return policies may vary based on product.'}
                    </Text>
                  </View>
                </>
              )}

              <View style={styles.assuranceBlock}>
                <Text style={styles.assuranceText}>
                  Assured quality | Easy Returns
                </Text>
                {!!storeName && (
                  <TouchableOpacity onPress={handleAboutStore}>
                    <Text style={styles.aboutStore}>About {storeName}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>

            {isOutOfStock() && (
              <View style={styles.outOfStockContainer}>
                <Text style={styles.outOfStockText}>Out of Stock</Text>
              </View>
            )}
            <View style={[styles.bottomContainer, {paddingBottom: Math.max(bottom, 10)}]}>
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
  scrollContent: {
    paddingBottom: 24,
  },
  imageList: {
    paddingLeft: IMAGE_SIDE,
    paddingRight: 8,
  },
  imageSpacing: {
    marginRight: IMAGE_GAP,
  },
  image: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    columnGap: 8,
    paddingHorizontal: 16,
    marginTop: 18,
  },
  productPrice: {
    fontSize: fontSize.f30,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    includeFontPadding: false,
  },
  subText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 6,
  },
  productName: {
    fontSize: fontSize.f20,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    paddingHorizontal: 16,
    lineHeight: 28,
  },
  productDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 22,
    paddingHorizontal: 16,
  },
  sizeContainer: {
    flex: 1,
    marginRight: 12,
  },
  quantityContainer: {
    alignItems: 'flex-end',
  },
  quantityLabel: {
    textAlign: 'right',
    width: '100%',
  },
  sectionTitle: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    marginBottom: 10,
  },
  sizeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sizeItem: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizeItemSelected: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
  },
  sizeItemDisabled: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sizeItemText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: '#B0AFB6',
    includeFontPadding: false,
  },
  sizeItemTextSelected: {
    color: Colors.black,
  },
  sizeItemTextDisabled: {
    color: 'rgba(255,255,255,0.2)',
  },
  qtyButton: {
    width: 54,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    columnGap: 4,
  },
  qtyText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    includeFontPadding: false,
  },
  qtyMenu: {
    backgroundColor: 'rgba(24, 20, 38, 0.96)',
    borderRadius: 10,
    minWidth: 54,
  },
  qtyMenuItem: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyMenuItemSelected: {
    backgroundColor: Colors.white,
  },
  addressCard: {
    marginTop: 28,
    marginHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 126,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  addressLabel: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: 'rgba(255,255,255,0.5)',
  },
  addressIcon: {
    width: 20,
    height: 20,
  },
  addressNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  addressName: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#CAC9CE',
  },
  addressDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#CAC9CE',
    marginHorizontal: 8,
  },
  addressPhone: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#CAC9CE',
  },
  addressLine: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#CAC9CE',
    marginTop: 8,
    lineHeight: 20,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginTop: 20,
  },
  sectionBlock: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeading: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bullet: {
    width: 14,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#CAC9CE',
    lineHeight: 20,
  },
  bulletText: {
    flex: 1,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#CAC9CE',
    lineHeight: 20,
  },
  bodyText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#CAC9CE',
    lineHeight: 20,
  },
  assuranceBlock: {
    alignItems: 'center',
    paddingTop: 28,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  assuranceText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: '#CAC9CE',
    marginBottom: 8,
  },
  aboutStore: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#CAC9CE',
    textDecorationLine: 'underline',
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
  bottomContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
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
    marginTop: 0,
    marginBottom: 0,
    height: 48,
  },
  buyNowBtn: {
    backgroundColor: Colors.white,
    width: '60%',
    marginTop: 0,
    marginBottom: 0,
    height: 48,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
