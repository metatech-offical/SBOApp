import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import {
  getDummyProductById,
  isDummyProductId,
} from '@utils/dummyMerchandise';

interface CartListItemProps {
  item: CartItem;
  onPress: () => void;
}

const formatCategoryLabel = (category?: string) => {
  if (!category) {
    return '';
  }
  if (category === 'T-Shirts') {
    return 'T-shirt';
  }
  return category;
};

const CheckoutListItem = ({item, onPress}: CartListItemProps) => {
  const dummyProduct = isDummyProductId(item?.productId?._id)
    ? getDummyProductById(item?.productId?._id)
    : undefined;
  const category = formatCategoryLabel(dummyProduct?.category);
  const storeName =
    dummyProduct?.storeName || item?.productId?.storeId?.name || '';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      activeOpacity={0.85}>
      <FastImage
        source={
          item?.productId?.media?.[0]
            ? {uri: item.productId.media[0]}
            : require('@assets/images/dummyImage.png')
        }
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item?.productId?.productName}
        </Text>
        {!!category && <Text style={styles.meta}>{category}</Text>}
        {!!storeName && <Text style={styles.brand}>{storeName}</Text>}
        <View style={styles.footerRow}>
          <Text style={styles.price}>£{item?.variant?.price}</Text>
          <View style={styles.chipRow}>
            <View style={styles.chip}>
              <Text style={styles.chipLabel}>Size: </Text>
              <Text style={styles.chipValue}>
                {item?.variant?.size || 'N/A'}
              </Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipLabel}>Qty: </Text>
              <Text style={styles.chipValue}>{item?.quantity}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CheckoutListItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    padding: 20,
    columnGap: 22,
  },
  image: {
    width: 100,
    height: 121,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  title: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    lineHeight: 22,
  },
  meta: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: '#A7A8B4',
    marginTop: 2,
  },
  brand: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: '#A7A8B4',
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  price: {
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    includeFontPadding: false,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(171,171,171,0.1)',
    borderRadius: 5,
    paddingHorizontal: 8,
    height: 22,
  },
  chipLabel: {
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Regular'],
    color: 'rgba(255,255,255,0.5)',
    includeFontPadding: false,
  },
  chipValue: {
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Medium'],
    color: 'rgba(255,255,255,0.9)',
    includeFontPadding: false,
  },
});
