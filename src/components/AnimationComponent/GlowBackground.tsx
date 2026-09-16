import React from 'react';
import {Image, StyleSheet, useWindowDimensions, View} from 'react-native';

const ARTBOARD_WIDTH = 393;
const ARTBOARD_HEIGHT = 1441;

export default function GlowBackground() {
  const {width} = useWindowDimensions();
  const imageHeight = (width * ARTBOARD_HEIGHT) / ARTBOARD_WIDTH;

  return (
    <View pointerEvents="none" style={styles.container}>
      <Image
        source={require('@assets/images/HomeGlowBackground.png')}
        style={[styles.backgroundImage, {width, height: imageHeight}]}
        resizeMode="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#100E12',
    overflow: 'hidden',
    zIndex: 0,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
