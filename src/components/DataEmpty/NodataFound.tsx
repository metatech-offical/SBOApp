import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';

const NodataFound = ({
  style,
  compact,
}: {
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}) => {
  return (
    <View style={[styles.container, compact && styles.compact, style]}>
      <FastImage
        source={require('@assets/images/NoDataFound.png')}
        style={[styles.image, compact && styles.compactImage]}
      />
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
  compact: {
    flex: 0,
    paddingVertical: 24,
  },
  image: {
    width: 150,
    height: 150,
    marginTop: 100,
  },
  compactImage: {
    marginTop: 0,
    width: 110,
    height: 110,
  },
});
