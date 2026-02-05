import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import {fontSize} from '@constant/fontSize';
import {formatPrice, getSizeText} from '@utils/general';
import FastImage from 'react-native-fast-image';

interface OrderHistoryItemProps {
  item: {
    variant?: {
      size: string;
      color: string;
      price: number;
    };
    productId: string;
    productName: string;
    sku: string;
    media: string[];
    quantity: number;
    itemPrice: number;
    lineTotal: number;
  };
  onPress?: () => void;
  showCount?: boolean;
  count?: number;
}

const OrderHistoryItem: React.FC<OrderHistoryItemProps> = ({
  item,
  onPress,
  showCount,
  count,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        {item?.media?.[0] ? (
          <FastImage
            source={{uri: item?.media[0] || ''}}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : null}
        {showCount && count && count > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>+{count} more</Text>
          </View>
        )}
      </View>

      <View style={styles.detailsContainer}>
        {item?.productName && (
          <Text style={styles.productName} numberOfLines={2}>
            {item?.productName}
          </Text>
        )}
        {item?.itemPrice && (
          <Text style={styles.priceText}>
            Price: {formatPrice(item?.itemPrice)}
          </Text>
        )}
        {item?.variant?.size && (
          <View style={styles.sizeContainer}>
            <Text style={styles.sizeText}>Size: {getSizeText(item)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    marginBottom: 4,
    lineHeight: 18,
  },
  priceText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    marginBottom: 6,
  },
  sizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  sizeText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    marginRight: 4,
  },
  countBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF6B6B',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  countText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Bold'],
    textAlign: 'center',
  },
});

export default OrderHistoryItem;
