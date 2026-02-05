import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ViewStyle,
  TextStyle,
  StyleProp,
  DimensionValue,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Colors} from '@constant/colors';
import {fonts} from '@constant/fontfamily';
import { fontSize } from '@constant/fontSize';

interface TransparentInnerShadowButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  width?: DimensionValue;
  height?: DimensionValue;
  disabled?: boolean;
  shadowColor?: string;
  borderColor?: string;
}

const TransparentInnerShadowButton: React.FC<
  TransparentInnerShadowButtonProps
> = ({
  title,
  onPress,
  style,
  textStyle,
  width = 'auto',
  height = 40,
  disabled = false,
  shadowColor = 'rgba(0, 0, 0, 0.2)',
  borderColor = '#1AD655',
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, {width, height}, style]}>
      {/* Transparent background with border */}
      <View style={[styles.buttonOuter, {borderColor: borderColor}]}>
        {/* Inner shadow effect layers */}
        <View style={styles.innerShadowContainer}>
          {/* Top shadow (darker) */}
          <LinearGradient
            colors={[shadowColor, 'transparent']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 0.8}}
            style={styles.topShadow}
          />

          {/* Left shadow (darker) */}
          <LinearGradient
            colors={[shadowColor, 'transparent']}
            start={{x: 0, y: 0}}
            end={{x: 0.8, y: 0}}
            style={styles.leftShadow}
          />

          {/* Bottom highlight */}
          <LinearGradient
            colors={['transparent', shadowColor]}
            style={styles.bottomHighlight}
          />

          {/* Right highlight */}
          <LinearGradient
            colors={['transparent', shadowColor]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={styles.rightHighlight}
          />

          {/* Content container */}
          <View style={styles.contentContainer}>
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonOuter: {
    flex: 1,
    width: '100%',
    borderRadius: 28,
    // borderColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    overflow: 'hidden',
    padding: 1, // Space for the border
  },
  innerShadowContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    borderRadius: 27, // Slightly smaller than parent
    overflow: 'hidden',
  },
  topShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 8,
    zIndex: 1,
  },
  leftShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 8,
    zIndex: 1,
  },
  bottomHighlight: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
    zIndex: 1,
  },
  rightHighlight: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 8,
    zIndex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    zIndex: 2,
  },
  buttonText: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    textAlign: 'center',
  },
});

export default TransparentInnerShadowButton;
