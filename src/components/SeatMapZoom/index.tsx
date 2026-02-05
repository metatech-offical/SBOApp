import {useWindowDimensions, StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  clamp,
} from 'react-native-reanimated';

const MAX_ZOOM = 3;
const MIN_ZOOM = 1;

const SeatMapZoom = ({imageUri}) => {
  const {width: SCREEN_WIDTH} = useWindowDimensions();
  const WRAPPER_HEIGHT = 201;
  const WRAPPER_WIDTH = SCREEN_WIDTH - 20;

  const scale = useSharedValue(1);
  const startScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  /** PINCH */
  const pinch = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
    })
    .onUpdate(e => {
      let newScale = startScale.value * e.scale;
      newScale = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newScale));
      scale.value = newScale;

      // After scale, clamp pan
      const boundX = ((newScale - 1) * WRAPPER_WIDTH) / 2;
      const boundY = ((newScale - 1) * WRAPPER_HEIGHT) / 2;

      translateX.value = clamp(translateX.value, -boundX, boundX);
      translateY.value = clamp(translateY.value, -boundY, boundY);
    });

  /** PAN */
  const pan = Gesture.Pan()
    .onStart(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate(e => {
      if (scale.value <= 1) return; // ⛔ No pan when not zoomed

      const boundX = ((scale.value - 1) * WRAPPER_WIDTH) / 2;
      const boundY = ((scale.value - 1) * WRAPPER_HEIGHT) / 2;

      translateX.value = clamp(startX.value + e.translationX, -boundX, boundX);
      translateY.value = clamp(startY.value + e.translationY, -boundY, boundY);
    });

  /** DOUBLE TAP */
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > 1) {
        scale.value = withTiming(1);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
      } else {
        scale.value = withTiming(2);
      }
    });

  const composed = Gesture.Simultaneous(pinch, pan, doubleTap);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {scale: scale.value},
      {translateX: translateX.value},
      {translateY: translateY.value},
    ],
  }));

  return (
    <View style={styles.wrapper}>
      <GestureDetector gesture={composed}>
        <Animated.View style={[animatedStyle, styles.full]}>
          <FastImage
            source={{uri: imageUri}}
            style={styles.full}
            resizeMode={FastImage.resizeMode.contain}
          />
        </Animated.View>
      </GestureDetector>

      {/* Zoom buttons */}
      <View style={styles.zoomContainer}>
        <TouchableOpacity
          style={styles.zoomBtn}
          onPress={() => (scale.value = withTiming(Math.min(MAX_ZOOM, scale.value + 0.4)))}>
          <Text style={styles.zoomText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.zoomBtn}
          onPress={() => (scale.value = withTiming(Math.max(MIN_ZOOM, scale.value - 0.4)))}>
          <Text style={styles.zoomText}>-</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SeatMapZoom;

const styles = StyleSheet.create({
  wrapper: {
    height: 201,
    borderRadius: 14,
    overflow: 'hidden',
    marginHorizontal: 10,
    marginVertical: 24,
    backgroundColor: '#131315',
  },
  full: {width: '100%', height: '100%'},
  zoomContainer: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    alignItems: 'center',
  },
  zoomBtn: {
    width: 38,
    height: 38,
    borderRadius: 100,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    elevation: 5,
  },
  zoomText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
    marginTop: -3,
  },
});
