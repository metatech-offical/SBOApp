import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {fonts} from '@constant/fontfamily';
import useWishlist from '@hooks/useWishlist';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';
import {isDummyProductId} from '@utils/dummyMerchandise';

const MerchandiseProductItem = ({
  item,
  onPress,
  userType,
}: {
  item: Product;
  onPress: () => void;
  userType: string;
}) => {
  const {handAddToWishlist, handRemoveFromWishlist} = useWishlist();
  const [isLiked, setIsLiked] = useState(item?.isAddedToWishlist || false);

  const price =
    item?.variants && item?.variants?.length > 0
      ? Math.min(...item.variants.map(variant => variant.price))
      : item?.price;

  const handleWishlist = async () => {
    if (isDummyProductId(item?._id)) {
      setIsLiked(prev => !prev);
      return;
    }
    if (isLiked) {
      await handRemoveFromWishlist({productId: item?._id});
      setIsLiked(false);
    } else {
      await handAddToWishlist({productId: item?._id});
      setIsLiked(true);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}>
      <View style={styles.imageWrapper}>
        <FastImage
          source={
            item?.media && item?.media?.length > 0
              ? typeof item?.media[0] === 'string'
                ? {uri: item?.media[0]}
                : item?.media[0]
              : require('@assets/images/dummyImage.png')
          }
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.pricePill}>
          <Text style={styles.price}>£{price}</Text>
        </View>
        {userType === 'user' && (
          <TouchableOpacity
            style={styles.whishlistIconView}
            onPress={handleWishlist}
            hitSlop={8}>
            <FastImage
              source={
                isLiked
                  ? require('@assets/images/heartLiked.png')
                  : require('@assets/images/heartUnliked.png')
              }
              style={styles.whishlistIcon}
            />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.title} numberOfLines={1}>
        {item.productName}
      </Text>
      {item?.category ? (
        <View style={styles.tag}>
          <Text style={styles.tagText}>{item.category}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 16,
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  image: {
    width: '100%',
    height: 215,
    borderRadius: 12,
  },
  pricePill: {
    position: 'absolute',
    left: 7,
    bottom: 10,
    minHeight: 20,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  price: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    includeFontPadding: false,
  },
  tag: {
    alignSelf: 'flex-start',
    height: 23,
    paddingHorizontal: 10,
    borderRadius: 11.5,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  tagText: {
    color: '#EEEEEE',
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Medium'],
    includeFontPadding: false,
  },
  title: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#B0AFB6',
  },
  whishlistIconView: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    backgroundColor: Colors.white,
    borderRadius: 12.5,
    width: 25,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  whishlistIcon: {
    width: 14,
    height: 14,
  },
});

export default MerchandiseProductItem;
