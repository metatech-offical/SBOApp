import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import useCart from '@hooks/useCart';
import CustomDropDown from '@components/DropDown/CustomDropDown';
import {ProductQuantityData} from '@utils/data';
import {DeleteIcon} from '@assets/svg/ShortsIcon';
import {isDummyProductId} from '@utils/dummyMerchandise';

interface CartListItemProps {
  item: CartItem;
  onPress: () => void;
}

const CartListItem = ({item, onPress}: CartListItemProps) => {
  const {handRemoveFromCart, handUpdateCartItem} = useCart();

  const handleRemoveFromCart = async () => {
    if (isDummyProductId(item?.productId?._id)) {
      return;
    }
    const payload = {
      productId: item?.productId?._id,
      variant: item?.variant,
      quantity: item?.quantity,
    };
    await handRemoveFromCart(payload);
  };

  const handleUpdateCartItem = async (quantity: number) => {
    if (isDummyProductId(item?.productId?._id)) {
      return;
    }
    const payload = {
      productId: item?.productId?._id,
      variant: item?.variant,
      quantity: quantity,
    };
    await handUpdateCartItem(payload);
  };

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.container}
        activeOpacity={0.7}>
        <View style={styles.imageWrapper}>
          <FastImage
            source={{uri: item?.productId.media[0]}}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {item?.productId.productName}
            </Text>
            <TouchableOpacity
              onPress={handleRemoveFromCart}
              style={styles.removeButton}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <DeleteIcon stroke={Colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price:</Text>
            <Text style={styles.priceValue}>${item?.variant.price}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Size:</Text>
              <View style={styles.sizeChip}>
                <Text style={styles.detailValue}>
                  {item?.variant?.size || 'N/A'}
                </Text>
              </View>
            </View>
            <View style={styles.dropdownContainer}>
              <Text style={styles.quantityLabel}>Qty:</Text>
              <CustomDropDown
                defaultValue={item?.quantity}
                data={ProductQuantityData}
                containerStyle={styles.dropdown}
                placeHolder="Qty"
                onSelect={value => {
                  handleUpdateCartItem(value?.id);
                }}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CartListItem;

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
    height: 140,
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
  removeButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 87, 87, 0.15)',
    marginLeft: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 87, 87, 0.2)',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  priceLabel: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.grey,
    marginRight: 4,
  },
  priceValue: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: Colors.grey,
    marginRight: 4,
  },
  sizeChip: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  detailValue: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  quantityBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  quantityText: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
  },
});
