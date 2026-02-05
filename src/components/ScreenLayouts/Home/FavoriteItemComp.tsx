import {View, Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {fontSize, hp, wp} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import FastImage from 'react-native-fast-image';
import {navigate} from '@navigation/utils';

const FavoriteItemComp = ({item}: {item: FavoriteCreator}) => {
  return (
    <Pressable
      onPress={() => {
        navigate('OtherUserProfile', {userId: item.creator._id});
      }}
      style={styles.itemContainer}>
      <View style={styles.rightContainer}>
        <View style={styles.imageContainer}>
          <FastImage
            source={
              item.creator.profilePicture
                ? {uri: item.creator.profilePicture}
                : require('@assets/images/DummyUserImage.png')
            }
            style={styles.image}
          />
        </View>
        <Text style={styles.title}>{item.creator.username}</Text>
      </View>
    </Pressable>
  );
};

export default FavoriteItemComp;
const styles = StyleSheet.create({
  itemContainer: {
    paddingHorizontal: wp('1'),
    paddingVertical: hp('1.2'),
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  imageContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    overflow: 'hidden',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 30,
  },
  title: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
});
