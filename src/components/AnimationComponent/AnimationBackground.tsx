import React from 'react';
import {View, StyleSheet, Dimensions, Platform} from 'react-native';
import LottieView from 'lottie-react-native';
import {BlurView} from '@react-native-community/blur';

interface AnimatedBackgroundProps {
  animationSource: any;
  backgroundColor?: string;
  zIndex?: number;
  blurType?:
    | 'dark'
    | 'light'
    | 'xlight'
    | 'prominent'
    | 'regular'
    | 'extraDark';
  blurAmount?: number;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  animationSource,
  backgroundColor = '#1a1538',
  zIndex = 1,
  blurType = 'dark',
  blurAmount = 50,
}) => {
  const AnimationComponent = () => (
    <LottieView
      source={animationSource}
      autoPlay
      loop
      style={styles.animation}
      resizeMode="cover"
    />
  );

  return (
    <View style={[styles.animationContainer, {backgroundColor, zIndex}]}>
      {Platform.OS === 'ios' ? (
        <BlurView
          style={styles.blurContainer}
          blurType={blurType}
          blurAmount={blurAmount}
          reducedTransparencyFallbackColor={backgroundColor}>
          <AnimationComponent />
        </BlurView>
      ) : (
        <AnimationComponent />
      )}
    </View>
  );
};

export default React.memo(AnimatedBackground);

const styles = StyleSheet.create({
  animationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
  },
  blurContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
  },
  animation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
  },
});
