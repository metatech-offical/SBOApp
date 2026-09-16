import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {BlurView as RNBlurView} from '@react-native-community/blur';

interface BlurViewProps extends ViewProps {
  blurType?: 'dark' | 'light' | 'xlight';
  blurAmount?: number;
  reducedTransparencyFallbackColor?: string;
}

const BlurView: React.FC<BlurViewProps> = ({
  children,
  style,
  blurType = 'dark',
  blurAmount = 10,
  reducedTransparencyFallbackColor = 'rgba(0, 0, 0, 0.6)',
  ...rest
}) => {
  return (
    <View style={[styles.container, style]} {...rest}>
      <RNBlurView
        style={StyleSheet.absoluteFill}
        blurType={blurType}
        blurAmount={blurAmount}
        reducedTransparencyFallbackColor={reducedTransparencyFallbackColor}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default BlurView;
