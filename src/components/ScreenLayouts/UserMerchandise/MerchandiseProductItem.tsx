import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import FastImage from 'react-native-fast-image';
import {fonts} from '@constant/fontfamily';
import useWishlist from '@hooks/useWishlist';
import {Colors} from '@constant/colors';
import {fontSize} from '@constant/fontSize';

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

  const handleWishlist = async () => {
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
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            # {item?.category || 'Outerwear'}
          </Text>
        </View>
        {userType === 'user' && (
          <TouchableOpacity
            style={styles.whishlistIconView}
            onPress={handleWishlist}>
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
      <Text style={styles.price}>
        £
        {item?.variants && item?.variants?.length > 0
          ? Math.min(...item.variants.map(variant => variant.price))
          : item?.price}
      </Text>
      <Text style={styles.title} numberOfLines={1}>
        {item.productName}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: 'transparent',
    marginBottom: 10,
    alignSelf: 'center',
    marginHorizontal: 10,
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 16,
  },
  badge: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    backgroundColor: 'rgba(80,80,80,0.7)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    color: Colors.white,
    fontSize: fontSize.f10,
    fontFamily: fonts['Poppins-Medium'],
  },
  price: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Bold'],
    color: Colors.white,
  },
  title: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: '#CCCCCC',
    marginTop: 2,
  },
  whishlistIconView: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  whishlistIcon: {
    width: 20,
    height: 20,
  },
});

export default MerchandiseProductItem;
