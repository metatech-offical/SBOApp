import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import {CreatorProductDetailProps} from '@navigation/screens';
import {
  useDeleteProductMutation,
  useGetProductDetailQuery,
  useUpdateProductMutation,
} from '@rtkServices/CreatorStoreService';
import FastImage from 'react-native-fast-image';
import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import {fontSize, height, width, wp} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import MerchandiseHeader from '@components/CustomHeaders/MerchandiseHeader';
import Loader from '@components/CustomLoader/Loader';
import CustomButton from '@components/CustomButtons/CustomButton';
import PostCarousel from '@components/CustomCarosal/PostCarousel';
import Devider from '@components/Devider/Devider';
import {useToastMessage} from '@hooks/useToastMessage';

const CreatorProductDetail = ({
  navigation,
  route,
}: CreatorProductDetailProps) => {
  const {showError, showSuccess} = useToastMessage();
  const {_id}: any = route?.params || {};
  const {data: productDetail, isLoading} = useGetProductDetailQuery(_id);
  const [updateProduct, {isLoading: isUpdateProductLoading}] =
    useUpdateProductMutation();

  const [deleteProductReq, deleteProductRes] = useDeleteProductMutation();

  const shouldShowEditButton = () => {
    const data = productDetail?.data;
    if (!data) return false;

    const {variants, stock, status, hasVariants} = data;

    if (status === 'coming_soon') return true;

    if (Array.isArray(variants) && variants.length > 0) {
      return variants.some((variant: any) => Number(variant?.stock) === 0);
    }
    if (!hasVariants && stock === 0) {
      return true;
    }

    // No variants: show when overall stock is 0
    return Number(stock) === 0;
  };

  const handlePublish = async () => {
    const payload = {
      productName: productDetail?.data?.productName,
      description: productDetail?.data?.description,
      price: Number(productDetail?.data?.price),
      stock: Number(productDetail?.data?.stock) || 0,
      media: productDetail?.data?.media,
      sku: productDetail?.data?.sku,
      category: productDetail?.data?.category,
      returnPolicy: productDetail?.data?.returnPolicy,
      tags: productDetail?.data?.tags,
      collectionId: productDetail?.data?.collectionId?._id,
      variants: productDetail?.data?.variants,
      status: 'live',
      hasVariants: productDetail?.data?.variants?.length > 0 ? true : false,
    };
    const result = await updateProduct({
      id: _id || '',
      data: payload,
    });
    if (result?.data?.success) {
      showSuccess(result?.data?.message || 'Product published successfully');
      navigation.goBack();
    }
  };

  const handleDeleteProduct = async () => {
    await deleteProductReq({productId: productDetail?.data?._id}).then(
      (res: any) => {
        if (res?.data) {
          showSuccess(res?.data?.message || '');
          navigation.goBack();
          return res?.data;
        }
        if (res?.error) {
          showError(res?.error?.data?.message || 'Something went wrong');
        }
      },
    );
  };

  return (
    <View style={styles.container}>
      <AnimationBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#1a1538'}
      />
      <View style={styles.contentOverlay}>
        <MerchandiseHeader
          onBackPress={() => navigation.goBack()}
          isCartVisible={false}
        />
        {isLoading ? (
          <Loader visible={isLoading} />
        ) : (
          <ScrollView
            style={{marginTop: 10}}
            showsVerticalScrollIndicator={false}>
            {/* <FastImage
              source={{uri: productDetail?.data?.media[0]}}
              style={styles.image}
            /> */}
            {productDetail?.data?.media &&
              productDetail?.data?.media?.length > 0 && (
                <View style={styles.imageContainer}>
                  {productDetail?.data?.media?.length === 1 ? (
                    <FastImage
                      source={{uri: productDetail?.data?.media[0]}}
                      style={styles.image}
                    />
                  ) : (
                    <PostCarousel
                      images={productDetail?.data?.media}
                      height={wp('100%')}
                      borderRadius={12}
                      autoPlay={true}
                      autoPlayInterval={3000}
                    />
                  )}
                </View>
              )}

            <View style={styles.productInfo}>
              <Text style={styles.productPrice}>
                £
                {productDetail?.data?.variants &&
                productDetail?.data?.variants.length > 0
                  ? productDetail?.data?.variants[0]?.price
                  : productDetail?.data?.price}
              </Text>
              <Text style={styles.subText}>inclusive all taxes</Text>
            </View>
            <Text style={styles.productName}>
              {productDetail?.data?.productName}
            </Text>
            <Devider />
            {productDetail?.data?.variants &&
              productDetail?.data?.variants?.length > 0 && (
                <View style={styles.variantsContainer}>
                  <Text style={styles.variantsTitle}>Available Variants</Text>

                  {/* Table Header */}
                  <View style={styles.tableHeader}>
                    <View style={styles.headerCell}>
                      <Text style={styles.headerText}>Size</Text>
                    </View>
                    <View style={styles.headerCell}>
                      <Text style={styles.headerText}>Color</Text>
                    </View>
                    <View style={styles.headerCell}>
                      <Text style={styles.headerText}>Stock</Text>
                    </View>
                    <View style={styles.headerCell}>
                      <Text style={styles.headerText}>Price</Text>
                    </View>
                  </View>

                  {/* Table Rows */}
                  {productDetail?.data?.variants?.map(
                    (variant: any, index: number) => (
                      <View
                        key={index}
                        style={[
                          styles.tableRow,
                          index % 2 === 0 ? styles.evenRow : styles.oddRow,
                        ]}>
                        <View style={styles.cell}>
                          <Text style={styles.cellTextPrize}>
                            {variant?.size || 'N/A'}
                          </Text>
                        </View>
                        <View style={styles.cell}>
                          <View style={styles.colorContainer}>
                            {/* <View
                              style={[
                                styles.colorIndicator,
                                {
                                  backgroundColor:
                                    variant?.color?.toLowerCase() || '#ccc',
                                },
                              ]}
                            /> */}
                            <Text style={styles.cellText}>
                              {variant?.color || 'N/A'}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.cell}>
                          <Text
                            style={[
                              styles.cellText,
                              variant?.stock > 0
                                ? styles.inStock
                                : styles.outOfStock,
                            ]}>
                            {variant?.stock || 0}
                          </Text>
                        </View>
                        <View style={styles.cell}>
                          <Text style={styles.priceText}>
                            £{variant?.price || 0}
                          </Text>
                        </View>
                      </View>
                    ),
                  )}
                </View>
              )}

            <Text style={styles.productDescription}>Product Detail</Text>
            <Text style={styles.productDescriptionText}>
              {productDetail?.data?.description}
            </Text>
            {productDetail?.data?.returnPolicy && (
              <View>
                <Devider />
                <Text style={styles.returnPolicy}>Return Policy</Text>
                <Text style={styles.returnPolicyText}>
                  {productDetail?.data?.returnPolicy}
                </Text>
              </View>
            )}
            <CustomButton
              text="Delete"
              onPress={handleDeleteProduct}
              btnStyle={{
                width: '90%',
                backgroundColor: Colors.white,
                alignSelf: 'center',
              }}
              textStyle={{color: Colors.black}}
              isLoading={deleteProductRes?.isLoading}
            />
          </ScrollView>
        )}

        {!isLoading && shouldShowEditButton() && (
          <View style={styles.buttonContainer}>
            <CustomButton
              text="Edit"
              onPress={() => {
                navigation.navigate('CreateProduct', {
                  itemId: productDetail?.data?._id,
                  isEdit: true,
                });
              }}
              btnStyle={{width: '30%'}}
            />
            {!isLoading && productDetail?.data?.status === 'coming_soon' && (
              <CustomButton
                text="Publish"
                onPress={handlePublish}
                btnStyle={{width: '65%', backgroundColor: Colors.white}}
                textStyle={{color: Colors.black}}
                isLoading={isUpdateProductLoading}
                disabled={isUpdateProductLoading}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default CreatorProductDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOverlay: {
    zIndex: 2,
    position: 'relative',
    flex: 1,
  },
  image: {
    width: width - 30,
    height: height * 0.5,
    borderRadius: 10,
    alignSelf: 'center',
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    columnGap: 7,
    paddingHorizontal: 15,
  },
  productName: {
    fontSize: fontSize.f24,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  productPrice: {
    fontSize: fontSize.f34,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  subText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.grey,
    marginTop: 10,
  },
  productDescription: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.grey,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grey,
    marginVertical: 10,
  },
  returnPolicy: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.grey,
    paddingHorizontal: 15,
    marginTop: 10,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    alignSelf: 'center',
    // height: 300,
  },
  variantsContainer: {
    marginTop: 15,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 10,
  },
  variantsTitle: {
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    marginBottom: 15,
    textAlign: 'center',
  },
  variantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  variantInfo: {
    flex: 1,
  },
  variantSize: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    textTransform: 'capitalize',
  },
  variantColor: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    marginTop: 2,
  },
  variantStock: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.white,
    marginTop: 2,
  },
  variantPrice: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 8,
  },
  headerCell: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    textTransform: 'uppercase',
    textDecorationLine: 'underline',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 6,
    marginBottom: 2,
  },
  evenRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  oddRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cellText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    textAlign: 'center',
  },
  cellTextPrize: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
  },
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  inStock: {
    color: '#4CAF50',
  },
  outOfStock: {
    color: '#F44336',
  },
  priceText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    textAlign: 'center',
  },
});
