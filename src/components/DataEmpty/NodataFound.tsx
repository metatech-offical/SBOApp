import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';

const NodataFound = ({style}: {style?: StyleProp<ViewStyle>}) => {
  return (
    <View style={[styles.container, style]}>
      <FastImage
        source={require('@assets/images/NoDataFound.png')}
        style={styles.image}></FastImage>
    </View>
  );
};

export default NodataFound;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    marginTop: 100,
  },
});
