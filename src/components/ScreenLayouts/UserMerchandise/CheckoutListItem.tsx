import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';

interface CartListItemProps {
  item: CartItem;
  onPress: () => void;
}

const CheckoutListItem = ({item, onPress}: CartListItemProps) => {
  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.container}
        activeOpacity={0.7}>
        <View style={styles.imageWrapper}>
          <FastImage
            source={{uri: item?.productId?.media[0]}}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {item?.productId.productName}
            </Text>
          </View>
          {item?.productId?.storeId?.name && (
            <Text style={styles.storeName}>{item?.productId.storeId.name}</Text>
          )}
          <View style={styles.priceContainer}>
            <Text style={styles.priceValue}>${item?.variant.price}</Text>
            <View style={styles.sizeContainer}>
              <View style={styles.sizeChip}>
                <Text style={styles.detailLabel}>Size:</Text>
                <Text style={styles.detailValue}>
                  {item?.variant?.size || 'N/A'}
                </Text>
              </View>
              <View style={styles.sizeChip}>
                <Text style={styles.quantityLabel}>Qty:</Text>
                <Text style={styles.detailValue}>{item?.quantity}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CheckoutListItem;

const styles = StyleSheet.create({
  outerContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  container: {
    flexDirection: 'row',
    borderRadius: 20,
    height: 130,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  imageWrapper: {
    width: 110,
    height: '100%',
    overflow: 'hidden',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.05)',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    flex: 1,
    letterSpacing: 0.2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'space-between',
  },
  priceValue: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  detailLabel: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.grey,
    marginRight: 4,
  },
  sizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  sizeChip: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailValue: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  quantityLabel: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.grey,
    marginRight: 6,
  },
  dropdown: {
    width: 70,
    height: 10,
    marginLeft: 0,
    marginTop: -60,
  },
  storeName: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#A7A8B4',
    marginBottom: 6,
  },
});
