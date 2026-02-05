import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {fontSize, height, width} from '@constant/fontSize';
import {fonts} from '@constant/fontfamily';
import {Colors} from '@constant/colors';
import LinearGradient from 'react-native-linear-gradient';

interface StoreListItemProps {
  item: StoreCollection;
  onPress: () => void;
}

const StoreListItem = ({item, onPress}: StoreListItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <FastImage source={{uri: item.coverImage}} style={styles.image}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
          style={styles.gradientOverlay}>
          <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
            {item.name}
          </Text>
        </LinearGradient>
      </FastImage>
    </TouchableOpacity>
  );
};

export default StoreListItem;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    width: width - 30,
    height: height / 4,
    resizeMode: 'contain',
  },
  text: {
    fontSize: fontSize.f24,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    paddingHorizontal: 20,
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
    height: '40%',
    justifyContent: 'flex-end',
  },
});
