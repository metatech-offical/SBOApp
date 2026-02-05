import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import React from 'react';
import {Colors} from '@constant/colors';
import FastImage from 'react-native-fast-image';
import {fontSize} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import useWishlist from '@hooks/useWishlist';

const WishlistAndOrderCard = ({
  item,
  isInWishlist,
  onPress,
}: WishlistAndOrderCardProps) => {
  const {handRemoveFromWishlist} = useWishlist();
  const mainPrice =
    item?.variants && item?.variants?.length > 0
      ? item?.variants?.[0]?.price
      : item?.price || 0;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      {item?.media?.length > 0 && (
        <View style={styles.imageContainer}>
          <FastImage
            source={{uri: item?.media[0] || ''}}
            style={styles.image}
          />
        </View>
      )}

      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item?.productName}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          Description: {item?.description}
        </Text>
        <Text style={styles.price}>Price: {mainPrice}</Text>
        <Text style={styles.status}>Status: {item?.status}</Text>
      </View>

      {isInWishlist && (
        <TouchableOpacity
          onPress={() => handRemoveFromWishlist({productId: item?._id})}>
          <Image
            source={require('@assets/images/like2.png')}
            style={styles.heartIcon}
            tintColor={Colors.white}
          />
        </TouchableOpacity>
      )}
    </Pressable>
  );
};

export default WishlistAndOrderCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: 80,
    height: 100,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  title: {
    fontSize: fontSize.f16,
    color: Colors.white,
    marginBottom: 4,
    lineHeight: 20,
    width: '95%',
    fontFamily: fonts['Poppins-Medium'],
  },
  price: {
    fontSize: fontSize.f12,
    color: Colors.white,
    opacity: 0.8,
    marginBottom: 4,
    fontFamily: fonts['Poppins-Medium'],
  },
  status: {
    fontSize: fontSize.f12,
    color: Colors.green,
    opacity: 0.8,
    marginBottom: 4,
    fontFamily: fonts['Poppins-Regular'],
  },
  description: {
    fontSize: fontSize.f12,
    color: Colors.white,
    opacity: 0.8,
    marginBottom: 4,
    width: '90%',
    fontFamily: fonts['Poppins-Regular'],
  },
  heartIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});
