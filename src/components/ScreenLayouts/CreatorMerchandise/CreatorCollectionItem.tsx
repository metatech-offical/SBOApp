import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {memo} from 'react';
import FastImage from 'react-native-fast-image';
import {fontSize, height, width} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import LinearGradient from 'react-native-linear-gradient';

interface StoreListItemProps {
  item: any;
  onPress: () => void;
}

const CreatorCollectionItem = ({item, onPress}: StoreListItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <FastImage source={{uri: item?.coverImage}} style={styles.image}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
          style={styles.gradientOverlay}>
          <View style={styles.textContainer}>
            <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
              {item?.name}
            </Text>
          </View>
        </LinearGradient>
      </FastImage>
    </TouchableOpacity>
  );
};

export default memo(CreatorCollectionItem);

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    alignSelf: 'center',
    borderRadius: 12,
    marginTop: 15,
  },
  image: {
    width: width - 30,
    height: height / 4,
    borderRadius: 12,
  },
  text: {
    fontSize: fontSize.f24,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
    justifyContent: 'flex-end',
  },
  textContainer: {
    paddingHorizontal: 7,
  },
});
