import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {fonts} from '@constant/fontfamily';

type GlowVariant = 'follow' | 'subscribe';

const BUTTON_HEIGHT = 34;
const BUTTON_RADIUS = 17;
const GLOW_SIZE = 9;
const FOLLOW_GLOW = '#1AD655';
const SUBSCRIBE_GLOW = 'rgba(255, 195, 0, 0.73)';

export default function GlowActionButton({
  variant,
  title,
  onPress,
  width,
  disabled,
}: {
  variant: GlowVariant;
  title: string;
  onPress: () => void;
  width?: number;
  disabled?: boolean;
}) {
  const isFollow = variant === 'follow';
  const buttonWidth = width ?? (isFollow ? 100 : 126);
  const glowColor = isFollow ? FOLLOW_GLOW : SUBSCRIBE_GLOW;

  const content = (
    <View style={[styles.inner, !isFollow && styles.subscribeFill]}>
      <LinearGradient
        colors={[glowColor, 'transparent']}
        style={styles.glowTop}
      />
      <LinearGradient
        colors={[glowColor, 'transparent']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.glowLeft}
      />
      <LinearGradient
        colors={['transparent', glowColor]}
        style={styles.glowBottom}
      />
      <LinearGradient
        colors={['transparent', glowColor]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.glowRight}
      />
      <Text allowFontScaling={false} style={styles.label}>
        {title}
      </Text>
    </View>
  );

  if (isFollow) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.followShell,
          {width: buttonWidth},
          disabled && styles.disabled,
        ]}>
        {content}
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <LinearGradient
        colors={['#F7CA39', '#CD9D02', '#F7CA3A']}
        locations={[0.169792, 0.716667, 0.982292]}
        start={{x: 0.85, y: -0.24}}
        end={{x: 0.58, y: 1}}
        style={[
          styles.subscribeShell,
          {width: buttonWidth},
          disabled && styles.disabled,
        ]}>
        {content}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  followShell: {
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_RADIUS,
    borderWidth: 1,
    borderColor: '#1AD655',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    overflow: 'hidden',
  },
  subscribeShell: {
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_RADIUS,
    padding: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
  inner: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: BUTTON_RADIUS - 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeFill: {
    backgroundColor: '#100E12',
  },
  glowTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: GLOW_SIZE,
  },
  glowLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: GLOW_SIZE,
  },
  glowBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: GLOW_SIZE,
  },
  glowRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: GLOW_SIZE,
  },
  label: {
    fontSize: 16,
    lineHeight: 16,
    fontFamily: fonts['Poppins-Medium'],
    color: '#FFFFFF',
    letterSpacing: -0.48,
    zIndex: 2,
  },
  disabled: {
    opacity: 0.5,
  },
});
