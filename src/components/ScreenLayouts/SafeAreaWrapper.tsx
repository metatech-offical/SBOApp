import AnimationBackground from '@components/AnimationComponent/AnimationBackground';
import {useKeyboardVisibility} from '@utils/keyboardUtils';
import React from 'react';
import {View, StyleSheet, StatusBar, Platform} from 'react-native';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
interface SafeAreaWrapperProps {
  children: React.ReactNode;
}

const SafeAreaWrapper = ({children}: SafeAreaWrapperProps) => {
  const keyboardStatus = useKeyboardVisibility();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {paddingBottom: Platform.OS === 'android' ? insets.bottom : 0},
      ]}>
      <StatusBar translucent backgroundColor="transparent" />

      <AnimationBackground
        zIndex={0}
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor={'#160C33'}
        blurAmount={50}
      />

      <View style={styles.contentOverlay}>
        <View style={styles.logoContainer}>
          <FastImage
            source={require('@assets/images/appLogo2.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.formContainer]}>
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              {
                top:
                  Platform.OS === 'android'
                    ? keyboardStatus
                      ? 50
                      : 200
                    : keyboardStatus
                    ? 150
                    : 230,
              },
              styles.contentContainer,
            ]}>
            <LinearGradient
              colors={['#00000057', 'transparent']}
              style={styles.LinearGradientContainer}></LinearGradient>
            {children}
          </KeyboardAwareScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: 0,
    backgroundColor: '#1a1538',
  },
  contentOverlay: {
    flex: 1,
    zIndex: 2,
    position: 'relative',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  logo: {
    width: 100,
    height: 100,
  },
  formContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    // backgroundColor: 'rgba(27, 27, 27, 0)',

    borderWidth: 0.5,
    borderBottomWidth: 0,
    borderTopWidth: 1,
    borderColor: 'rgba(94, 94, 94, 0.5)',

    paddingHorizontal: 20,
    paddingTop: 20,
    overflow: 'hidden',
  },

  LinearGradientContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default SafeAreaWrapper;
